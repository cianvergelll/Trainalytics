import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import * as notificationsController from '../controllers/notifications.controller.js';

const router = express.Router();

router.use(protect);

router.get('/', notificationsController.getNotifications);

router.put('/:id/read', notificationsController.markAsRead);

router.put('/read-all', notificationsController.markAllAsRead);

export default router;