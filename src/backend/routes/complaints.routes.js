import { Router } from 'express';
import { getComplaints, updateStatus, getMyComplaints, fileComplaint, editComplaint } from '../controllers/complaints.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, isAdmin, getComplaints);

router.patch('/:id/status', protect, isAdmin, updateStatus);

router.get('/my-complaints', protect, getMyComplaints);

router.post('/file', protect, fileComplaint);

router.put('/:id', protect, editComplaint);

export default router;
