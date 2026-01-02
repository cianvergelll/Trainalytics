import { Router } from 'express';
import { getStudents, addStudent, toggleArchiveStudent } from '../controllers/students.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, getStudents);
router.post('/', protect, isAdmin, addStudent);

router.patch('/:id/archive', protect, isAdmin, toggleArchiveStudent);

export default router;