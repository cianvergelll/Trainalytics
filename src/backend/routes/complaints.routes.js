import { Router } from 'express';
import { getComplaints, updateStatus, getMyComplaints, fileComplaint } from '../controllers/complaints.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, isAdmin, getComplaints);

router.patch('/:id/status', protect, isAdmin, updateStatus);

router.get('/my-complaints', protect, getMyComplaints);

router.post('/file', protect, fileComplaint);

export default router;
