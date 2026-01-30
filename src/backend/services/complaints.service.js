import { pool } from '../../config/db.js';

function formatDateIntl(dt) {
    if (!dt) return 'N/A';
    try {
        const dateObj = new Date(dt);
        if (isNaN(dateObj.getTime())) {
            throw new Error('Invalid date value');
        }
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(dateObj);
    } catch (e) {
        console.error(`Error formatting date:`, e);
        return 'Invalid Date';
    }
}

export async function getComplaintsPaginated(page = 1, limit = 10, searchTerm = '', filters = {}) {
    const offset = (page - 1) * limit;
    let baseQuery = `
        FROM im_system.im_cec_complaints AS comp
        LEFT JOIN im_system.im_cec_students AS std ON comp.StudentID = std.StudentID
        WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
        baseQuery +=
            ' AND (comp.Title LIKE ? OR comp.Description LIKE ? OR std.StudentName LIKE ? OR comp.StudentID LIKE ?)';
        const searchQuery = `%${searchTerm}%`;
        params.push(searchQuery, searchQuery, searchQuery, searchQuery);
    }

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);

    const [complaints] = await pool.query(
        `
        SELECT
            comp.ID,
            comp.Title,
            comp.Description, 
            comp.Date,
            comp.Status,
            std.StudentName AS StudentName,
            std.Section AS Section,
            std.CompanyName AS CompanyName
        ${baseQuery}
        ORDER BY comp.Date DESC, comp.CreatedAt DESC
        LIMIT ? OFFSET ?
    `,
        [...params, limit, offset]
    );

    const formattedComplaints = complaints.map((comp) => ({
        ID: comp.ID,
        StudentName: comp.StudentName || 'Unknown Student',
        Section: comp.Section || 'N/A',
        Company: comp.CompanyName || 'N/A',
        Concern: comp.Title,
        Description: comp.Description,
        Date: formatDateIntl(comp.Date),
        Status: comp.Status,
    }));

    return { complaints: formattedComplaints, total };
}

export async function updateComplaintStatus(complaintId, newStatus) {
    const validStatuses = ['Resolved', 'Pending', 'Investigating'];
    if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid status value.');
    }

    const [result] = await pool.query(
        `
        UPDATE im_system.im_cec_complaints
        SET Status = ?
        WHERE ID = ?
    `,
        [newStatus, complaintId]
    );

    if (result.affectedRows === 0) {
        throw new Error('Complaint not found or status unchanged.');
    }

    return { id: complaintId, status: newStatus };
}

export async function getStudentComplaintsPaginated(studentId, page = 1, limit = 10, searchTerm = '') {
    const offset = (page - 1) * limit;

    let baseQuery = `
        FROM im_cec_complaints
        WHERE StudentID = ? AND IsArchived = 0
    `;
    const params = [studentId];

    if (searchTerm) {
        baseQuery += ' AND (Title LIKE ? OR Description LIKE ?)';
        const searchQuery = `%${searchTerm}%`;
        params.push(searchQuery, searchQuery);
    }

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);

    const [complaints] = await pool.query(
        `SELECT ID, Title as Concern, Description, Date, Status
        ${baseQuery}
        ORDER BY Date DESC
        LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    return {
        complaints,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
    };
}

export async function createComplaint(complaintData) {
    const { studentId, title, description, date } = complaintData;

    const [student] = await pool.query(
        'SELECT SchoolID, DepartmentID FROM im_cec_students WHERE StudentID = ?',
        [studentId]
    );

    if (student.length === 0) {
        throw new Error('Student profile not found.');
    }

    const { SchoolID, DepartmentID } = student[0];

    const [result] = await pool.query(
        `INSERT INTO im_cec_complaints 
        (StudentID, SchoolID, DepartmentID, Title, Description, Date, Status) 
        VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [studentId, SchoolID, DepartmentID, title, description, date]
    );

    return { id: result.insertId, status: 'pending' };
}

export async function updateComplaintDetails(id, data) {
    const { title, description, date } = data;
    const [result] = await pool.query(
        `UPDATE im_cec_complaints 
         SET Title = ?, Description = ?, Date = ?
         WHERE ID = ? AND Status = 'pending'`,
        [title, description, date, id]
    );
    return result.affectedRows > 0;
}

export async function getArchivedComplaints(studentId, page = 1, search = '') {
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereClause = `WHERE c.StudentID = ? AND c.IsArchived = 1 AND (c.Title LIKE ? OR c.Description LIKE ?)`;
    const queryParams = [studentId, `%${search}%`, `%${search}%`];

    const [rows] = await pool.query(
        `SELECT c.*, s.StudentName 
         FROM im_cec_complaints c
         JOIN im_cec_students s ON c.StudentID = s.StudentID
         ${whereClause}
         ORDER BY c.Date DESC
         LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
    );

    const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM im_cec_complaints c ${whereClause}`,
        queryParams
    );

    const formattedRows = rows.map(row => ({
        ...row,
        Concern: row.Title,
        StudentName: row.StudentName
    }));

    return {
        complaints: formattedRows,
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit),
        currentPage: page
    };
}

export async function archiveComplaint(id) {
    const [result] = await pool.query(
        `UPDATE im_cec_complaints SET IsArchived = 1 WHERE ID = ?`,
        [id]
    );
    return result.affectedRows > 0;
}

export async function unarchiveComplaint(id) {
    const [result] = await pool.query(
        `UPDATE im_cec_complaints SET IsArchived = 0 WHERE ID = ?`,
        [id]
    );
    return result.affectedRows > 0;
}