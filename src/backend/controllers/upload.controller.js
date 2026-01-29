import cloudinary from '../../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
export async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log("UPLOADING:", req.file.originalname);
        const isMimePdf = req.file.mimetype === 'application/pdf';
        const isExtPdf = path.extname(req.file.originalname).toLowerCase() === '.pdf';

        const resourceType = (isMimePdf || isExtPdf) ? 'raw' : 'auto';

        const originalName = req.file.originalname;
        const nameWithoutExt = path.parse(originalName).name;

        const publicId = resourceType === 'raw' ? originalName : nameWithoutExt;

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'trainalytics_uploads',
            resource_type: resourceType,
            public_id: publicId,
            use_filename: true,
            unique_filename: false
        });

        fs.unlinkSync(req.file.path);

        res.json({
            url: result.secure_url,
            format: result.format,
            originalName: req.file.originalname
        });

    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting temp file:', unlinkError);
            }
        }
        res.status(500).json({ error: 'Upload failed' });
    }
}