import { pool } from '../../config/db.js';

export const sendNotification = async (req, { userId, title, message, type, targetUrl }) => {
    try {
        const [result] = await pool.query(
            `INSERT INTO im_cec_notifications (UserID, Title, Message, Type, TargetURL) VALUES (?, ?, ?, ?, ?)`,
            [userId, title, message, type, targetUrl]
        );

        const notificationData = {
            id: result.insertId,
            userId,
            title,
            message,
            type,
            targetUrl,
            time: 'Just now',
            read: 0
        };

        const io = req.app.get('io');

        const room = userId === 'ADMIN' ? 'admin_room' : `student_${userId}`;

        io.to(room).emit('receive_notification', notificationData);

        return true;
    } catch (error) {
        console.error('Notification Error:', error);
        return false;
    }
};