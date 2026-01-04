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

export async function getJournalDetails(req, res) {
    try {
        const { id } = req.params;

        const journal = await journalsService.getJournalById(id);

        if (!journal) {
            console.log("Journal not found in DB");
            return res.status(404).json({ error: 'Journal not found' });
        }

        res.json(journal);
    } catch (err) {
        console.error('Controller Error - Failed to get journal details:', err);
        res.status(500).json({ error: 'Server error fetching details: ' + err.message });
    }
}

export async function submitFeedback(req, res) {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const adminId = req.user.id;

        if (!id || !message) {
            return res.status(400).json({ error: 'Journal ID and Message are required.' });
        }

        await journalsService.addJournalFeedback(id, adminId, message);

        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (err) {
        console.error('Failed to submit feedback:', err);
        res.status(500).json({ error: 'Server error while submitting feedback.' });
    }
}

export async function getStudentJournals(req, res) {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);

        const result = await journalsService.getStudentJournalLogs(id, page, limit);

        if (!result) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.json({
            student: result.student,
            logs: result.logs,
            totalPages: Math.ceil(result.total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Failed to get student journal logs:', err);
        res.status(500).json({ error: 'Server error fetching student journals.' });
    }
}