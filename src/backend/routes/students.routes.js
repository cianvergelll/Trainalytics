import { Router } from 'express';
import { getStudents, addStudent, toggleArchiveStudent, getStudentProfile, updateStudentDetails } from '../controllers/students.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', protect, getStudents);
router.post('/', protect, isAdmin, addStudent);
router.patch('/:id/archive', protect, isAdmin, toggleArchiveStudent);
router.get('/:id', protect, getStudentProfile);
router.put('/:id', protect, isAdmin, updateStudentDetails);

export default router;