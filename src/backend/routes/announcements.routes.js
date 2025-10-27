import { Router } from 'express';
import { getAnnouncements, setAnnouncement } from '../controllers/announcements.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, isAdmin, getAnnouncements);

router.post('/', protect, isAdmin, setAnnouncement);

export default router;
