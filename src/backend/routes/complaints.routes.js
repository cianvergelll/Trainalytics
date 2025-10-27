import { Router } from 'express';
import { getComplaints, updateStatus } from '../controllers/complaints.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, isAdmin, getComplaints);

router.patch('/:id/status', protect, isAdmin, updateStatus);


export default router;
