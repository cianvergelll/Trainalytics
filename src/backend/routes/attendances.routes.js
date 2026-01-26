import { Router } from 'express';
import * as attendancesController from '../controllers/attendances.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Admin Routes
router.get('/', protect, isAdmin, attendancesController.getAttendances);
router.post('/', protect, isAdmin, attendancesController.addAttendance);

// Shared/Student Routes
router.get('/student/:id', protect, attendancesController.getStudentAttendance); // Used by both Student & Admin
router.post('/clock-in', protect, attendancesController.clockIn);
router.put('/clock-out', protect, attendancesController.clockOut);
router.get('/status/:studentId', protect, attendancesController.getStatus);

export default router;