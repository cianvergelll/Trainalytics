import * as notificationService from '../services/notifications.service.js';
import { pool } from '../../config/db.js';

async function getNotificationUserId(req) {
    const user = req.user;

    if (['SuperAdmin', 'Coordinator', 'Staff'].includes(user.role)) {
        return 'ADMIN';
    }

    if (user.role === 'student') {
        if (user.studentId) return user.studentId;

        const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [user.id]);
        if (rows.length > 0) return rows[0].Extra1;
    }

    return null;
}

export async function getNotifications(req, res) {
    try {
        const userId = await getNotificationUserId(req);

        if (!userId) {
            return res.status(400).json({ error: 'Unable to identify user for notifications' });
        }

        const notifications = await notificationService.getUserNotifications(userId);
        res.json(notifications);
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}

export async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        await notificationService.markNotificationAsRead(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Mark Read Error:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
}

export async function markAllAsRead(req, res) {
    try {
        const userId = await getNotificationUserId(req);
        if (!userId) return res.status(400).json({ error: 'User not found' });

        await notificationService.markAllNotificationsAsRead(userId);
        res.json({ success: true });
    } catch (error) {
        console.error('Mark All Read Error:', error);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
}