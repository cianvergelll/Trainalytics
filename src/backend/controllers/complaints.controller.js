import * as complaintsService from '../services/complaints.service.js';

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
