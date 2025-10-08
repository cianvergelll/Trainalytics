import { Router } from 'express';
import { handleLogin, handleLogout, handleVerifySession } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', handleLogin);
router.post('/logout', handleLogout);

router.get('/verify', protect, handleVerifySession);

export default router;  