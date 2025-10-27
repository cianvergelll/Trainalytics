import { Router } from 'express';
import { fetchFilterOptions } from '../controllers/filters.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, fetchFilterOptions);

export default router;