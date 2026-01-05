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
    const validStatuses = ['resolved', 'pending', 'urgent'];
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