import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import * as notificationsController from '../controllers/notifications.controller.js';

const router = express.Router();

// All routes require login
router.use(protect);

// GET /api/notifications
router.get('/', notificationsController.getNotifications);

// PUT /api/notifications/:id/read
router.put('/:id/read', notificationsController.markAsRead);

// PUT /api/notifications/read-all
router.put('/read-all', notificationsController.markAllAsRead);

export default router;