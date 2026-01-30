import { pool } from '../../config/db.js';

export async function getUserNotifications(userId) {
    const [rows] = await pool.query(
        `SELECT * FROM im_cec_notifications 
         WHERE UserID = ? 
         ORDER BY CreatedAt DESC 
         LIMIT 50`,
        [userId]
    );

    return rows.map(row => ({
        id: row.ID,
        title: row.Title,
        message: row.Message,
        type: row.Type,
        targetUrl: row.TargetURL,
        read: !!row.IsRead,
        time: formatTimeAgo(row.CreatedAt)
    }));
}

export async function markNotificationAsRead(id) {
    const [result] = await pool.query(
        `UPDATE im_cec_notifications SET IsRead = 1 WHERE ID = ?`,
        [id]
    );
    return result.affectedRows > 0;
}

export async function markAllNotificationsAsRead(userId) {
    const [result] = await pool.query(
        `UPDATE im_cec_notifications SET IsRead = 1 WHERE UserID = ?`,
        [userId]
    );
    return result.affectedRows > 0;
}

function formatTimeAgo(dateInput) {
    const date = new Date(dateInput);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return "Just now";
}