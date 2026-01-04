import { Router } from 'express';
import { getAnnouncements, setAnnouncement, editAnnouncement, archiveAnnouncement } from '../controllers/announcements.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, isAdmin, getAnnouncements);
router.post('/', protect, isAdmin, setAnnouncement);

router.put('/:id', protect, isAdmin, editAnnouncement);
router.patch('/:id/archive', protect, isAdmin, archiveAnnouncement);

export default router;