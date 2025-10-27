import { Router } from 'express';
import { getJournals, addJournal } from '../controllers/journals.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, isAdmin, getJournals);

router.post('/', protect, isAdmin, addJournal);

export default router;
