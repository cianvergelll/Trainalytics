import { Router } from 'express';
import { getSchools, addSchool, deleteSchool } from '../controllers/schools.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, getSchools);
router.post('/', protect, addSchool);
router.delete('/:id', protect, deleteSchool);

export default router;