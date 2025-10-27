import { Router } from 'express';
import { getAttendances, addAttendance } from '../controllers/attendances.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, isAdmin, getAttendances);

router.post('/', protect, isAdmin, addAttendance);

export default router;
