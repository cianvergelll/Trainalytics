import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
export async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // 1. Sanitize Filename
        const originalName = req.file.originalname;
        const sanitizedName = originalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');

        console.log("🚀 STARTING UPLOAD (RAW MODE)");
        console.log("File:", sanitizedName);

        // 2. Determine Settings
        // We FORCE 'raw' for PDFs. This tells Cloudinary: "Just store the file, don't touch it."
        const isMimePdf = req.file.mimetype === 'application/pdf';
        const isExtPdf = path.extname(sanitizedName).toLowerCase() === '.pdf';

        const resourceType = (isMimePdf || isExtPdf) ? 'raw' : 'auto';

        // For RAW files, we MUST include the extension in the public_id
        // For Images (auto), we remove it (Cloudinary adds it)
        const nameWithoutExt = path.parse(sanitizedName).name;
        const publicId = resourceType === 'raw' ? sanitizedName : nameWithoutExt;

        // 3. Upload
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'trainalytics_uploads',
            resource_type: resourceType, // <--- CRITICAL: 'raw' for PDFs
            public_id: nameWithoutExt,       // <--- CRITICAL: "Name.pdf" for raw
            use_filename: true,
            unique_filename: false,
            overwrite: true
        });

        console.log("✅ UPLOAD SUCCESS");
        console.log("Type:", result.resource_type); // Should say 'raw'
        console.log("URL:", result.secure_url);

        // 4. Cleanup
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