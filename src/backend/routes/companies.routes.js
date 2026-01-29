import express from 'express';
import { getCompanies, addCompany, archiveCompany, restoreCompany, editCompany } from '../controllers/companies.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getCompanies);
router.post('/', protect, addCompany);
router.put('/:id/archive', protect, archiveCompany);
router.put('/:id/restore', protect, restoreCompany);
router.put('/:id', protect, editCompany);

export default router;