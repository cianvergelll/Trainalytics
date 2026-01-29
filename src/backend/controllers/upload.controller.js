import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';

export async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // --- DEBUGGING ---
        console.log("UPLOADING:", req.file.originalname);
        console.log("MIMETYPE:", req.file.mimetype);

        // --- STRONGER CHECK ---
        // Check BOTH the mimetype AND the file extension
        const isMimePdf = req.file.mimetype === 'application/pdf';
        const isExtPdf = path.extname(req.file.originalname).toLowerCase() === '.pdf';

        // If EITHER says it's a PDF, treat it as 'raw'
        const resourceType = (isMimePdf || isExtPdf) ? 'raw' : 'auto';

        console.log("FORCE TYPE:", resourceType); // This MUST say 'raw'

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'trainalytics_uploads',
            use_filename: true,
            resource_type: resourceType
        });

        // Delete local file
        fs.unlinkSync(req.file.path);

        res.json({
            url: result.secure_url,
            format: result.format,
            originalName: req.file.originalname
        });

    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Upload failed' });
    }
}