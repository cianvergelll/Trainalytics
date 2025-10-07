import { Router } from 'express';
import { handleLogin, handleLogout } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', handleLogin);
router.post('/logout', handleLogout);

export default router;