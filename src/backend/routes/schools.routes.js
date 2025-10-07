import { Router } from 'express';
import { getSchools, addSchool, deleteSchool } from '../controllers/schools.controller.js';

const router = Router();

router.get('/', getSchools);
router.post('/', addSchool);
router.delete('/:id', deleteSchool);

export default router;