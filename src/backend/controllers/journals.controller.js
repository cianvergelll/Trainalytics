import * as journalsService from '../services/journals.service.js';

export async function getJournals(req, res) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const searchTerm = req.query.search || '';

        const { journals, total } = await journalsService.getJournalsPaginated(
            page,
            limit,
            searchTerm
        );

        res.json({
            journals,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error('Failed to get journals:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function addJournal(req, res) {
    try {
        const adminId = req.user.id;
        const journalData = req.body;

        if (!journalData.studentId || !journalData.title || !journalData.date) {
            return res.status(400).json({ error: 'StudentID, Title, and Date are required.' });
        }

        const newJournal = await journalsService.createJournal(journalData, adminId);
        res.status(201).json(newJournal);
    } catch (err) {
        console.error('Failed to create journal:', err);
        res.status(500).json({ error: 'Server error while creating journal.' });
    }
}
