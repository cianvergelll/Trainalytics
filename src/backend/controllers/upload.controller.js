import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
export async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const originalName = req.file.originalname;
        const sanitizedName = originalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');

        console.log("🚀 STARTING UPLOAD (RAW MODE)");
        console.log("File:", sanitizedName);

        const isMimePdf = req.file.mimetype === 'application/pdf';
        const isExtPdf = path.extname(sanitizedName).toLowerCase() === '.pdf';

        const resourceType = 'auto';

        const nameWithoutExt = path.parse(sanitizedName).name;
        const publicId = nameWithoutExt;

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'trainalytics_uploads',
            resource_type: resourceType,
            public_id: nameWithoutExt,
            use_filename: true,
            unique_filename: false,
            overwrite: true
        });

        console.log("✅ UPLOAD SUCCESS");
        console.log("Type:", result.resource_type);
        console.log("URL:", result.secure_url);

        fs.unlinkSync(req.file.path);

        res.json({
            url: result.secure_url,
            format: result.format,
            originalName: originalName
        });

    } catch (error) {
        console.error('❌ UPLOAD ERROR:', error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Upload failed' });
    }
}