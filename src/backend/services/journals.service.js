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
            journal.Date, -- This is a DATE type
            journal.Status,
            journal.DateApproved, -- This is a DATETIME type
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
        VALUES (?, 'CEC', 'IT', ?, ?, ?, 'approved') -- Ensure DepartmentID matches VARCHAR type
    `,
        [studentId, date, title, description]
    );

    return { id: result.insertId, ...data };
}

