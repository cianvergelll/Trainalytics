import * as announcementsService from '../services/announcements.service.js';

export async function getAnnouncements(req, res) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const searchTerm = req.query.search || '';

        const archived = req.query.archived;

        const { announcements, total } = await announcementsService.getAnnouncementsPaginated(
            page,
            limit,
            searchTerm,
            { archived }
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

export async function editAnnouncement(req, res) {
    try {
        const { id } = req.params;
        const { title, description, startDate, startTime, endDate, endTime } = req.body;

        const updateData = {
            title,
            description,
            startDate: `${startDate} ${startTime}:00`,
            endDate: `${endDate} ${endTime}:00`
        };

        const success = await announcementsService.updateAnnouncement(id, updateData);
        if (!success) return res.status(404).json({ error: 'Announcement not found.' });

        res.json({ message: 'Announcement updated successfully.' });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Server error updating announcement.' });
    }
}

export async function archiveAnnouncement(req, res) {
    try {
        const { id } = req.params;
        const success = await announcementsService.toggleArchiveAnnouncement(id);
        if (!success) return res.status(404).json({ error: 'Announcement not found.' });

        res.json({ message: 'Announcement archive status toggled.' });
    } catch (err) {
        console.error('Archive error:', err);
        res.status(500).json({ error: 'Server error archiving announcement.' });
    }
}