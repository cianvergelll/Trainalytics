import { pool } from '../../config/db.js';

function formatDateIntl(dtString) {
    if (!dtString) return 'N/A';
    try {
        const dt = new Date(dtString);
        if (isNaN(dt.getTime())) {
            throw new Error('Invalid date value');
        }
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(dt);
    } catch (e) {
        console.error(`Error formatting date '${dtString}':`, e);
        return 'Invalid Date';
    }
}

function formatTimeIntl(dtString) {
    if (!dtString) return 'N/A';
    try {
        const dt = new Date(dtString);
        if (isNaN(dt.getTime())) {
            throw new Error('Invalid date value');
        }
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return new Intl.DateTimeFormat('en-US', options).format(dt);
    } catch (e) {
        console.error(`Error formatting time '${dtString}':`, e);
        return 'Invalid Date';
    }
}

export async function getAttendancesPaginated(page = 1, limit = 10, searchTerm = '', filters = {}) {
    const offset = (page - 1) * limit;
    let baseQuery = `
        FROM im_system.im_cec_attendance AS att
        LEFT JOIN im_system.im_cec_students AS std ON att.StudentID = std.StudentID
        WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
        baseQuery += ' AND (std.StudentName LIKE ? OR att.StudentID LIKE ?)';
        const searchQuery = `%${searchTerm}%`;
        params.push(searchQuery, searchQuery);
    }

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const [attendances] = await pool.query(
        `
        SELECT
            att.ID,
            att.StudentID,
            att.TimeIn,       -- DATETIME
            att.TimeOut,      -- DATETIME
            att.HoursRendered,
            std.StudentName,
            std.Section,
            std.CompanyName
        ${baseQuery}
        ORDER BY att.TimeIn DESC
        LIMIT ? OFFSET ?
    `,
        [...params, limit, offset]
    );

    const formattedAttendances = attendances.map((att) => ({
        ID: att.ID,
        StudentID: att.StudentID,
        StudentName: att.StudentName || 'Unknown Student',
        Section: att.Section || 'N/A',
        Company: att.CompanyName || 'N/A',
        Date: formatDateIntl(att.TimeIn),
        TimeIn: formatTimeIntl(att.TimeIn),
        TimeOut: formatTimeIntl(att.TimeOut),
        TotalWorkingHours: att.HoursRendered ? `${parseFloat(att.HoursRendered).toFixed(2)} Hours` : 'N/A',
    }));
    return { attendances: formattedAttendances, total };
}

export async function addAttendanceRecord(data, adminId) {
    const { studentId, timeIn, timeOut } = data;
    if (!adminId) throw new Error('Admin privileges required.');
    if (!studentId || !timeIn || !timeOut) {
        throw new Error('StudentID, TimeIn, and TimeOut are required.');
    }

    const hours = (new Date(timeOut) - new Date(timeIn)) / (1000 * 60 * 60);
    const hoursRendered = parseFloat(hours.toFixed(2));

    const [result] = await pool.query(
        `
        INSERT INTO im_system.im_cec_attendance
        (SchoolID, StudentID, DepartmentID, TimeIn, TimeOut, HoursRendered)
        VALUES ('CEC', ?, 'IT', ?, ?, ?) 
    `,
        [studentId, timeIn, timeOut, hoursRendered]
    );
    return { id: result.insertId, ...data, hoursRendered };
}

export async function getStudentAttendancePaginated(studentId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [studentRows] = await pool.query(
        `SELECT StudentName, StudentID, CompanyName, SupervisorName, TargetHours, IsActive 
         FROM im_cec_students 
         WHERE StudentID = ?`,
        [studentId]
    );

    if (studentRows.length === 0) {
        return null;
    }
    const student = studentRows[0];

    const [[{ totalRendered }]] = await pool.query(
        `SELECT SUM(HoursRendered) as totalRendered FROM im_cec_attendance WHERE StudentID = ?`,
        [studentId]
    );
    const rendered = parseFloat(totalRendered || 0);
    const remaining = Math.max(0, parseFloat(student.TargetHours) - rendered);

    const [[{ totalRecords }]] = await pool.query(
        `SELECT COUNT(*) as totalRecords FROM im_cec_attendance WHERE StudentID = ?`,
        [studentId]
    );

    const [records] = await pool.query(
        `SELECT ID, TimeIn, TimeOut, HoursRendered, Status 
         FROM im_cec_attendance 
         WHERE StudentID = ? 
         ORDER BY TimeIn DESC 
         LIMIT ? OFFSET ?`,
        [studentId, limit, offset]
    );

    const formattedRecords = records.map(rec => ({
        id: rec.ID,
        date: formatDateIntl(rec.TimeIn),
        timeIn: formatTimeIntl(rec.TimeIn),
        timeOut: formatTimeIntl(rec.TimeOut),
        totalHours: rec.HoursRendered ? parseFloat(rec.HoursRendered).toFixed(2) : '0.00',
        status: rec.Status || 'Approved'
    }));

    return {
        student: {
            name: student.StudentName,
            studentId: student.StudentID,
            company: student.CompanyName || 'N/A',
            supervisor: student.SupervisorName || 'N/A',
            targetHours: student.TargetHours,
            totalRendered: rendered.toFixed(2),
            remainingHours: remaining.toFixed(2),
            isActive: student.IsActive
        },
        records: formattedRecords,
        total: totalRecords
    };
}