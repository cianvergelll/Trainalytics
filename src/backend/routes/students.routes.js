import { Router } from 'express';
import { getStudents } from '../controllers/students.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, getStudents);

export default router;