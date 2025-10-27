import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/stats', protect, isAdmin, getStats);

export default router;
