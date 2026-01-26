import { pool } from '../../config/db.js';

// --- HELPERS ---
function formatDateIntl(dt) {
    if (!dt) return 'N/A';
    try {
        const dateObj = new Date(dt);
        if (isNaN(dateObj.getTime())) return 'N/A';
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(dateObj);
    } catch (e) { return 'Invalid Date'; }
}

function formatTimeIntl(dt) {
    if (!dt) return 'N/A';
    try {
        const dateObj = new Date(dt);
        if (isNaN(dateObj.getTime())) return 'N/A';
        return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(dateObj);
    } catch (e) { return 'Invalid Date'; }
}

// --- 1. ADMIN LIST (Paginated) ---
export async function getAttendancesPaginated(page = 1, limit = 10, searchTerm = '') {
    const offset = (page - 1) * limit;
    let baseQuery = `
        FROM im_cec_attendance AS att
        LEFT JOIN im_cec_students AS std ON att.StudentID = std.StudentID
        WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
        baseQuery += ' AND (std.StudentName LIKE ? OR att.StudentID LIKE ?)';
        const searchQuery = `%${searchTerm}%`;
        params.push(searchQuery, searchQuery);
    }

    const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const total = countResult[0]?.total || 0;

    const [attendances] = await pool.query(
        `SELECT att.ID, att.StudentID, att.TimeIn, att.TimeOut, att.HoursRendered,
            std.StudentName, std.Section, std.CompanyName
        ${baseQuery}
        ORDER BY att.TimeIn DESC
        LIMIT ? OFFSET ?`,
        [...params, parseInt(limit), parseInt(offset)]
    );

    const formattedAttendances = attendances.map((att) => ({
        ID: att.ID,
        StudentID: att.StudentID,
        StudentName: att.StudentName || 'Unknown',
        Section: att.Section || 'N/A',
        Company: att.CompanyName || 'N/A',
        Date: formatDateIntl(att.TimeIn),
        TimeIn: formatTimeIntl(att.TimeIn),
        TimeOut: formatTimeIntl(att.TimeOut),
        TotalWorkingHours: att.HoursRendered ? `${parseFloat(att.HoursRendered).toFixed(2)} Hours` : 'N/A',
    }));

    return { attendances: formattedAttendances, total };
}

// --- 2. GET INDIVIDUAL STUDENT HISTORY (DEBUG MODE) ---
export async function getStudentAttendancePaginated(studentId, page, limit) {

    const offset = (page - 1) * limit;

    // STEP A: Fetch Student Profile
    const queryStudent = `SELECT StudentName, CompanyName, Section, TargetHours, TotalHours, RemainingHours, SupervisorName FROM im_cec_students WHERE StudentID = ?`;

    const [studentRows] = await pool.query(queryStudent, [studentId]);

    // STEP B: Calculate Totals
    const querySum = `SELECT SUM(HoursRendered) as totalRendered FROM im_cec_attendance WHERE StudentID = ?`;
    const [sumResult] = await pool.query(querySum, [studentId]);
    const dbSum = parseFloat(sumResult[0]?.totalRendered || 0);

    let studentObj = null;

    if (studentRows.length > 0) {
        const s = studentRows[0];

        const currentTotal = parseFloat(s.TotalHours) > 0 ? parseFloat(s.TotalHours) : dbSum;
        const target = parseFloat(s.TargetHours || 0);

        studentObj = {
            // PascalCase
            StudentName: s.StudentName,
            CompanyName: s.CompanyName,
            Section: s.Section,
            TargetHours: target.toFixed(2),
            TotalHours: currentTotal.toFixed(2),
            RemainingHours: (target - currentTotal).toFixed(2),
            SupervisorName: s.SupervisorName,

            // camelCase aliases
            name: s.StudentName,
            company: s.CompanyName,
            section: s.Section,
            targetHours: target.toFixed(2),
            totalHours: currentTotal.toFixed(2),
            remainingHours: (target - currentTotal).toFixed(2),
            supervisorName: s.SupervisorName
        };
    } else {
        studentObj = {
            StudentName: 'Unknown Student', name: 'Unknown Student',
            CompanyName: 'N/A', company: 'N/A',
            Section: 'N/A', section: 'N/A',
            TargetHours: "0.00", totalHours: "0.00", remainingHours: "0.00"
        };
    }

    const [records] = await pool.query(
        `SELECT ID, TimeIn, TimeOut, HoursRendered, Status 
         FROM im_cec_attendance 
         WHERE StudentID = ? 
         ORDER BY TimeIn DESC
         LIMIT ? OFFSET ?`,
        [studentId, parseInt(limit), parseInt(offset)]
    );

    // STEP D: Count Total Logs
    const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM im_cec_attendance WHERE StudentID = ?`,
        [studentId]
    );
    const total = countResult[0]?.total || 0;

    // STEP E: Format Logs
    const formattedRecords = records.map(r => ({
        ID: r.ID,
        Date: formatDateIntl(r.TimeIn),
        TimeIn: formatTimeIntl(r.TimeIn),
        TimeOut: formatTimeIntl(r.TimeOut),
        HoursRendered: r.HoursRendered,
        TotalWorkingHours: r.HoursRendered ? `${parseFloat(r.HoursRendered).toFixed(2)} Hours` : 'N/A',
        Status: r.Status
    }));

    return {
        student: studentObj,
        records: formattedRecords,
        total
    };
}

// --- 3. CLOCK IN ---
export async function studentClockIn(studentId) {
    const [existing] = await pool.query(
        `SELECT ID FROM im_cec_attendance 
         WHERE StudentID = ? AND DATE(TimeIn) = CURDATE() AND TimeOut IS NULL`,
        [studentId]
    );
    if (existing.length > 0) throw new Error('You are already clocked in.');

    const [studentInfo] = await pool.query(
        `SELECT SchoolID, DepartmentID FROM im_cec_students WHERE StudentID = ?`,
        [studentId]
    );
    if (studentInfo.length === 0) throw new Error('Student profile not found.');
    const { SchoolID, DepartmentID } = studentInfo[0];

    const [result] = await pool.query(
        `INSERT INTO im_cec_attendance (SchoolID, StudentID, DepartmentID, TimeIn, Status) 
         VALUES (?, ?, ?, NOW(), 'Pending')`,
        [SchoolID, studentId, DepartmentID]
    );
    return result.insertId;
}

// --- 4. CLOCK OUT ---
export async function studentClockOut(studentId) {
    const [rows] = await pool.query(
        `SELECT ID, TimeIn FROM im_cec_attendance 
         WHERE StudentID = ? AND TimeOut IS NULL 
         ORDER BY TimeIn DESC LIMIT 1`,
        [studentId]
    );
    if (rows.length === 0) throw new Error('No active clock-in record found.');
    const record = rows[0];

    await pool.query(
        `UPDATE im_cec_attendance 
         SET TimeOut = NOW(), 
             HoursRendered = GREATEST(0.01, ROUND(TIMESTAMPDIFF(SECOND, TimeIn, NOW()) / 3600, 2)),
             Status = 'Pending' 
         WHERE ID = ?`,
        [record.ID]
    );

    await pool.query(
        `UPDATE im_cec_students 
         SET TotalHours = (SELECT SUM(HoursRendered) FROM im_cec_attendance WHERE StudentID = ?),
             RemainingHours = GREATEST(0, TargetHours - (SELECT SUM(HoursRendered) FROM im_cec_attendance WHERE StudentID = ?))
         WHERE StudentID = ?`,
        [studentId, studentId, studentId]
    );

    return { success: true };
}

// --- 5. DASHBOARD STATUS ---
export async function getLatestAttendanceStatus(studentId) {
    const [rows] = await pool.query(
        `SELECT ID, TimeIn, TimeOut 
         FROM im_cec_attendance 
         WHERE StudentID = ? AND DATE(TimeIn) = CURDATE() 
         ORDER BY ID DESC LIMIT 1`,
        [studentId]
    );

    if (rows.length === 0) return { status: 'not_started' };
    const record = rows[0];

    if (record.TimeIn && !record.TimeOut) return { status: 'clocked_in', timeIn: record.TimeIn };
    if (record.TimeIn && record.TimeOut) return { status: 'not_started', lastShiftEnd: record.TimeOut };

    return { status: 'error' };
}

// --- 6. MANUAL ADD ---
export async function addAttendanceRecord(data, adminId) {
    const { studentId, timeIn, timeOut } = data;
    let diffMs = Math.abs(new Date(timeOut) - new Date(timeIn));
    let hours = diffMs / (1000 * 60 * 60);
    const hoursRendered = parseFloat(hours.toFixed(2));

    const [result] = await pool.query(
        `INSERT INTO im_cec_attendance (SchoolID, StudentID, DepartmentID, TimeIn, TimeOut, HoursRendered, Status)
        VALUES ('CEC', ?, 'IT', ?, ?, ?, 'Approved')`,
        [studentId, timeIn, timeOut, hoursRendered]
    );
    return { id: result.insertId };
}