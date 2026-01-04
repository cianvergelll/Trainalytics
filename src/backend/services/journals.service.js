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

function formatDateTimeIntl(dtString) {
    if (!dtString) return 'N/A';
    try {
        const dt = new Date(dtString);
        if (isNaN(dt.getTime())) {
            throw new Error('Invalid date value');
        }
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(dt);
    } catch (e) {
        console.error(`Error formatting datetime '${dtString}':`, e);
        return 'Invalid Date';
    }
}

export async function getJournalsPaginated(page = 1, limit = 10, searchTerm = '', filters = {}) {
    const offset = (page - 1) * limit;
    let baseQuery = `
        FROM im_system.im_cec_journal AS journal
        LEFT JOIN im_system.im_cec_students AS student ON journal.StudentID = student.StudentID
        WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
        baseQuery +=
            ' AND (journal.Title LIKE ? OR student.StudentName LIKE ? OR student.Section LIKE ? OR student.CompanyName LIKE ?)';
        const searchQuery = `%${searchTerm}%`;
        params.push(searchQuery, searchQuery, searchQuery, searchQuery);
    }

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const [journals] = await pool.query(
        `
        SELECT
            journal.ID,
            journal.Date,
            journal.Status,
            journal.DateApproved,
            student.StudentName AS StudentName,
            student.Section AS Section,
            student.CompanyName AS CompanyName
        ${baseQuery}
        ORDER BY journal.Date DESC
        LIMIT ? OFFSET ?
    `,
        [...params, limit, offset]
    );

    const formattedJournals = journals.map((journal) => ({
        ID: journal.ID,
        StudentName: journal.StudentName || 'Unknown Student',
        Section: journal.Section || 'N/A',
        Company: journal.CompanyName || 'N/A',
        Date: formatDateIntl(journal.Date),
        Status: journal.Status,
        DateApproved: formatDateIntl(journal.DateApproved),
    }));
    return { journals: formattedJournals, total };
}

export async function createJournal(data, adminId) {
    const { studentId, title, description, date } = data;
    if (!adminId) throw new Error('Admin privileges required.');

    const [result] = await pool.query(
        `
        INSERT INTO im_system.im_cec_journal
        (StudentID, SchoolID, DepartmentID, Date, Title, Description, Status)
        VALUES (?, 'CEC', 'IT', ?, ?, ?, 'approved') 
    `,
        [studentId, date, title, description]
    );
    return { id: result.insertId, ...data };
}

// NEW FUNCTION ADDED BELOW
export async function addJournalFeedback(journalId, adminId, message) {
    const [result] = await pool.query(
        `INSERT INTO im_system.im_cec_journal_feedback 
        (JournalID, AdminID, Message) 
        VALUES (?, ?, ?)`,
        [journalId, adminId, message]
    );
    return result.insertId;
}

export async function getJournalById(journalId) {
    try {
        const [rows] = await pool.query(
            `SELECT 
                j.ID,
                j.Date,
                j.Title,
                j.Description,
                j.Status,
                j.Reflection1,
                j.Reflection2,
                j.Reflection3,
                s.StudentName, 
                s.CompanyName,
                s.SupervisorName  -- <--- Selecting this now
             FROM im_system.im_cec_journal j
             LEFT JOIN im_system.im_cec_students s ON j.StudentID = s.StudentID
             WHERE j.ID = ?`,
            [journalId]
        );

        if (rows.length === 0) return null;

        const journal = rows[0];

        const formatDate = (d) => {
            if (!d) return 'N/A';
            return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        };

        return {
            ID: journal.ID,
            studentName: journal.StudentName || 'Unknown',
            company: journal.CompanyName || 'N/A',
            supervisor: journal.SupervisorName || 'N/A',
            taskName: journal.Title,
            taskDescription: journal.Description,
            date: formatDate(journal.Date),
            status: journal.Status,
            q1: journal.Reflection1 || '',
            q2: journal.Reflection2 || '',
            q3: journal.Reflection3 || '',
            filename: 'Journal Entry #' + journal.ID
        };
    } catch (error) {
        console.error("SQL Error in getJournalById:", error);
        throw error;
    }
}

export async function getStudentJournalLogs(studentId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [studentRows] = await pool.query(
        `SELECT StudentName, StudentID, CompanyName, SupervisorName, TargetHours, IsActive 
         FROM im_cec_students 
         WHERE StudentID = ?`,
        [studentId]
    );

    if (studentRows.length === 0) return null;
    const student = studentRows[0];

    const [[{ totalRendered }]] = await pool.query(
        `SELECT SUM(HoursRendered) as totalRendered FROM im_cec_attendance WHERE StudentID = ?`,
        [studentId]
    );
    const rendered = parseFloat(totalRendered || 0);
    const remaining = Math.max(0, parseFloat(student.TargetHours) - rendered);

    const [[{ totalRecords }]] = await pool.query(
        `SELECT COUNT(*) as totalRecords FROM im_cec_journal WHERE StudentID = ?`,
        [studentId]
    );

    const [journals] = await pool.query(
        `SELECT ID, Date, Status, DateApproved 
         FROM im_cec_journal 
         WHERE StudentID = ? 
         ORDER BY Date DESC 
         LIMIT ? OFFSET ?`,
        [studentId, limit, offset]
    );

    const formattedJournals = journals.map((j) => ({
        ID: j.ID,
        Date: formatDateIntl(j.Date),
        Status: j.Status,
        DateApproved: formatDateIntl(j.DateApproved)
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
        logs: formattedJournals,
        total: totalRecords
    };
}