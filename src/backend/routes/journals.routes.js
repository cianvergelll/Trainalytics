import { Router } from 'express';
import { getJournals, addJournal, submitFeedback, getJournalDetails, getStudentJournals } from '../controllers/journals.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, isAdmin, getJournals);
router.post('/', protect, addJournal);

router.get('/student/:id', protect, getStudentJournals);

router.get('/:id', protect, getJournalDetails);
router.post('/:id/feedback', protect, submitFeedback);

export default router;