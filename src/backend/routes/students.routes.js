import { Router } from 'express';
import { getStudents, addStudent } from '../controllers/students.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, getStudents);
router.post('/', protect, addStudent);

export default router;
