import * as announcementsService from '../services/announcements.service.js';

export async function getAnnouncements(req, res) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const searchTerm = req.query.search || '';

        const { announcements, total } = await announcementsService.getAnnouncementsPaginated(
            page,
            limit,
            searchTerm
        );

        res.json({
            announcements,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error('Failed to get announcements:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function setAnnouncement(req, res) {
    try {
        const adminId = req.user.id;
        if (!adminId) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        const { title, description, startDate, startTime, endDate, endTime, attachment } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and Description are required.' });
        }

        const announcementData = {
            title,
            description,
            targetAudience: 'All',
            startDate: `${startDate} ${startTime}:00`,
            endDate: `${endDate} ${endTime}:00`,
        };

        const newAnnouncement = await announcementsService.createAnnouncement(announcementData, adminId);

        res.status(201).json(newAnnouncement);
    } catch (err) {
        console.error('Failed to create announcement:', err);
        res.status(500).json({ error: 'Server error while creating announcement.' });
    }
}
