import { pool } from '../../config/db.js';

function formatDateTime(dtString) {
    if (!dtString) return 'N/A';
    try {
        const dt = new Date(dtString);
        const optionsDate = { year: 'numeric', month: 'short', day: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
        const datePart = new Intl.DateTimeFormat('en-US', optionsDate).format(dt);
        const timePart = new Intl.DateTimeFormat('en-US', optionsTime).format(dt);
        return `${datePart} – ${timePart}`;
    } catch (e) {
        console.error('Error formatting date:', e);
        return 'Invalid Date';
    }
}

export async function getAnnouncementsPaginated(page = 1, limit = 10, searchTerm = '', filters = {}) {
    const offset = (page - 1) * limit;

    let baseQuery = `
        FROM im_system.im_cec_announcements AS ann
        LEFT JOIN im_system.im_admin_users AS admin ON ann.AdminID = admin.ID
        WHERE 1=1
    `;
    const params = [];

    if (searchTerm) {
        baseQuery += ' AND (ann.Title LIKE ? OR ann.Description LIKE ?)';
        const searchQuery = `%${searchTerm}%`;
        params.push(searchQuery, searchQuery);
    }


    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);

    const [announcements] = await pool.query(
        `
        SELECT 
            ann.ID,
            ann.Title,
            admin.Username AS CreatedBy,
            ann.CreatedAt,
            ann.UpdatedAt AS LastModified,
            ann.AttachmentPath
        ${baseQuery} 
        ORDER BY ann.CreatedAt DESC 
        LIMIT ? OFFSET ?
    `,
        [...params, limit, offset]
    );

    const formattedAnnouncements = announcements.map((ann) => ({
        ...ann,
        CreatedAt: formatDateTime(ann.CreatedAt),
        LastModified: formatDateTime(ann.LastModified),
        UpdatedBy: ann.CreatedBy || 'System',
    }));

    return { announcements: formattedAnnouncements, total };
}

export async function createAnnouncement(data, adminId) {
    const {
        title,
        description,
        targetAudience,
        startDate,
        endDate,
    } = data;

    const [result] = await pool.query(
        `
        INSERT INTO im_system.im_cec_announcements
        (AdminID, Title, Description, TargetAudience, StartDate, EndDate, IsActive)
        VALUES (?, ?, ?, ?, ?, ?, 1)
    `,
        [adminId, title, description, targetAudience, startDate, endDate]
    );

    return { id: result.insertId, ...data };
}
