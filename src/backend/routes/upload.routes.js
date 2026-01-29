import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/upload.controller.js';
// import { protect } from '../middleware/auth.middleware.js'; // Uncomment if you want to protect this route

const router = express.Router();

// Configure Multer (Temp storage)
const upload = multer({ dest: 'uploads/' });

// Route: POST /api/upload
// 'file' matches the formData key we will use in frontend
// Add 'protect' middleware here if needed: router.post('/', protect, upload.single('file'), uploadFile);
router.post('/', upload.single('file'), uploadFile);

export default router;