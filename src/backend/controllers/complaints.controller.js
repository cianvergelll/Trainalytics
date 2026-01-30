import * as complaintsService from '../services/complaints.service.js';
import * as studentsService from '../services/students.service.js'; // Import student service
import { sendNotification } from '../utils/notification.js'; // Import notification utility
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

export async function fileComplaint(req, res) {
    try {
        const user = req.user;
        let studentId = user.Extra1;

        if (!studentId && user.role === 'student') {
            const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [user.id]);
            studentId = rows[0]?.Extra1;
        }

        const { title, description, date } = req.body;

        if (!studentId) {
            return res.status(400).json({ error: 'Student ID not found for this account.' });
        }

        const newComplaint = await complaintsService.createComplaint({
            studentId,
            title,
            description,
            date
        });

        // --- NOTIFICATION LOGIC START ---
        try {
            // Fetch student details to get the name
            const studentProfile = await studentsService.getStudentByStudentId(studentId);
            const studentName = studentProfile ? studentProfile.StudentName : 'A Student';

            await sendNotification(req, {
                userId: 'ADMIN', // Send to Admin Room
                title: 'New Complaint Filed',
                message: `${studentName} filed a complaint: "${title}".`,
                type: 'warning', // Use 'warning' for complaints to grab attention
                targetUrl: '/admin/main/complaints'
            });
        } catch (notifErr) {
            console.error('Failed to send notification for complaint:', notifErr);
            // Don't fail the request if notification fails, just log it
        }
        // --- NOTIFICATION LOGIC END ---

        res.status(201).json(newComplaint);
    } catch (err) {
        console.error('File complaint controller error:', err);
        res.status(500).json({ error: err.message || 'Failed to submit complaint.' });
    }
}

export async function editComplaint(req, res) {
    try {
        const { id } = req.params;
        const { title, description, date } = req.body;
        const user = req.user;

        let studentId = user.Extra1;
        if (!studentId && user.role === 'student') {
            const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [user.id]);
            studentId = rows[0]?.Extra1;
        }

        const success = await complaintsService.updateComplaintDetails(id, { title, description, date });

        if (!success) {
            return res.status(400).json({ error: 'Update failed. You can only edit "Pending" complaints or the complaint does not exist.' });
        }

        res.json({ message: 'Complaint updated successfully.' });
    } catch (err) {
        console.error('Edit Complaint Error:', err);
        res.status(500).json({ error: 'Server error while updating complaint.' });
    }
}

export async function getArchived(req, res) {
    try {
        let studentId = req.params.studentId;
        const user = req.user;

        if (!studentId || studentId === 'undefined' || studentId === 'null') {
            if (user.role === 'student') {
                const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [user.id]);
                if (rows.length > 0) {
                    studentId = rows[0].Extra1;
                }
            }
        }

        if (!studentId) {
            return res.status(400).json({ error: 'Student ID missing and could not be retrieved.' });
        }

        if (user.role === 'student') {
            const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [user.id]);
            if (rows.length === 0 || rows[0].Extra1 != studentId) {
            }
        }

        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';

        const data = await complaintsService.getArchivedComplaints(studentId, page, search);
        res.json(data);
    } catch (err) {
        console.error('Get Archived Error:', err);
        res.status(500).json({ error: 'Server error fetching archived complaints' });
    }
}

export async function archive(req, res) {
    try {
        const { id } = req.params;
        const success = await complaintsService.archiveComplaint(id);
        if (!success) return res.status(404).json({ error: 'Complaint not found' });

        res.json({ message: 'Complaint archived successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error archiving complaint' });
    }
}

export async function restore(req, res) {
    try {
        const { id } = req.params;
        const success = await complaintsService.unarchiveComplaint(id);

        if (!success) {
            return res.status(404).json({ error: 'Complaint not found or already active.' });
        }

        res.json({ message: 'Complaint restored successfully.' });
    } catch (err) {
        console.error('Restore Error:', err);
        res.status(500).json({ error: 'Server error restoring complaint.' });
    }
}