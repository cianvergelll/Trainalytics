import { pool } from '../../config/db.js';

export const sendNotification = async (req, { userId, title, message, type, targetUrl }) => {
    try {
        const query = `
            INSERT INTO im_cec_notifications (UserID, Title, Message, Type, TargetUrl, IsRead)
            VALUES (?, ?, ?, ?, ?, 0)
        `;
        const [result] = await pool.query(query, [userId, title, message, type, targetUrl]);
        const newNotification = {
            id: result.insertId,
            userId,
            title,
            message,
            type,
            targetUrl,
            read: 0,
            time: 'Just now'
        };

        if (req && req.io) {
            let room;
            if (userId === 'ADMIN' || userId === 'SuperAdmin') {
                room = 'admin_room';
            } else if (userId === 'ALL') {
                room = 'student_ALL';
            } else {
                room = `student_${userId}`;
            }
            req.io.to(room).emit('receive_notification', newNotification);

        } else {
            console.error("❌ req.io is MISSING. Socket event NOT sent.");
        }

    } catch (error) {
        console.error('Failed to send notification:', error);
    }
};