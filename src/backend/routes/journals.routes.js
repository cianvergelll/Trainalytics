import { Router } from 'express';
import { getJournals, addJournal, submitFeedback, getJournalDetails } from '../controllers/journals.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, isAdmin, getJournals);
router.post('/', protect, isAdmin, addJournal);

router.get('/:id', protect, isAdmin, getJournalDetails);
router.post('/:id/feedback', protect, isAdmin, submitFeedback);

export default router;