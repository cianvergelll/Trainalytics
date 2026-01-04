import { Router } from 'express';
import { getStudents, addStudent, toggleArchiveStudent, getStudentProfile } from '../controllers/students.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', protect, getStudents);
router.post('/', protect, isAdmin, addStudent);
router.patch('/:id/archive', protect, isAdmin, toggleArchiveStudent);
router.get('/:id', protect, getStudentProfile);

export default router;