import * as complaintsService from '../services/complaints.service.js';
import { pool } from '../../config/db.js';

export async function getComplaints(req, res) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const searchTerm = req.query.search || '';

        const { complaints, total } = await complaintsService.getComplaintsPaginated(
            page,
            limit,
            searchTerm
        );

        res.json({
            complaints,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error('Failed to get complaints:', err);
        res.status(500).json({ error: 'Server error fetching complaints.' });
    }
}

export async function updateStatus(req, res) {
    try {
        const complaintId = parseInt(req.params.id, 10);
        const { status } = req.body;

        if (!complaintId || !status) {
            return res.status(400).json({ error: 'Complaint ID and status are required.' });
        }

        const updatedComplaint = await complaintsService.updateComplaintStatus(complaintId, status);
        res.json(updatedComplaint);

    } catch (err) {
        console.error('Failed to update complaint status:', err);
        if (err.message === 'Complaint not found or status unchanged.' || err.message === 'Invalid status value.') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error updating status.' });
    }
}

export async function getMyComplaints(req, res) {
    try {
        const user = req.user;
        let studentId = user.Extra1;

        // Fetch StudentID from DB if not in session (Matching Journals logic)
        if (!studentId && user.role === 'student') {
            const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [user.id]);
            studentId = rows[0]?.Extra1;
        }

        if (!studentId) {
            return res.status(400).json({ error: 'Student ID not found for this account.' });
        }

        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const searchTerm = req.query.search || '';

        const data = await complaintsService.getStudentComplaintsPaginated(
            studentId, page, limit, searchTerm
        );
        res.json(data);
    } catch (err) {
        console.error('Failed to fetch student complaints:', err);
        res.status(500).json({ error: 'Failed to fetch your complaints.' });
    }
}