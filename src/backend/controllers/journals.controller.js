import * as journalsService from '../services/journals.service.js';
import { pool } from '../../config/db.js';

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
        const user = req.user;
        const { title, description, date, q1, q2, q3 } = req.body;

        let studentId;

        if (user.role === 'student') {
            const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [user.id]);
            studentId = rows[0]?.Extra1;
        } else {
            studentId = req.body.studentId;
        }

        if (!studentId) {
            return res.status(400).json({ error: 'Student profile not found for this account.' });
        }

        const newJournal = await journalsService.createJournal({
            studentId,
            title,
            description,
            date,
            q1,
            q2,
            q3
        });

        res.status(201).json(newJournal);
    } catch (err) {
        console.error('Add Journal Error:', err);
        res.status(500).json({ error: 'Server error while creating journal.' });
    }
}

export async function getJournalDetails(req, res) {
    try {
        const { id } = req.params;
        const user = req.user;

        const journal = await journalsService.getJournalById(id);

        if (!journal) {
            return res.status(404).json({ error: 'Journal not found' });
        }

        if (user.role === 'student') {
            const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [user.id]);
            const studentIdFromSession = rows[0]?.Extra1;

            if (journal.studentId !== studentIdFromSession) {
                return res.status(403).json({ error: 'Access Denied: You can only view your own journals.' });
            }
        }

        res.json(journal);
    } catch (err) {
        console.error('Error in getJournalDetails:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function submitFeedback(req, res) {
    try {
        const { id } = req.params;
        const { message, senderType } = req.body;

        if (!id || !message) {
            return res.status(400).json({ error: 'Journal ID and Message are required.' });
        }

        let adminId = null;
        let studentId = null;

        if (req.user.role !== 'student') {
            adminId = req.user.id;
        } else {
            studentId = req.user.id;
        }

        await journalsService.addJournalFeedback(id, adminId, message, senderType);

        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (err) {
        console.error('Failed to submit feedback:', err);
        res.status(500).json({ error: 'Server error while submitting feedback.' });
    }
}

export async function getStudentJournals(req, res) {
    try {
        const studentId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const status = req.query.status || '';

        const user = req.user;

        if (user.role === 'student') {
            const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [user.id]);

            if (rows.length === 0 || rows[0].Extra1 !== studentId) {
                return res.status(403).json({ error: 'Forbidden: You can only view your own journals.' });
            }
        }

        const data = await journalsService.getStudentJournalLogs(studentId, page, limit, search, status);

        res.json(data);
    } catch (err) {
        console.error('Error fetching student journals:', err);
        res.status(500).json({ error: 'Server error fetching journals.' });
    }
}