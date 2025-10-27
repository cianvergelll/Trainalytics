import * as attendancesService from '../services/attendances.service.js';

export async function getAttendances(req, res) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const searchTerm = req.query.search || '';

        const { attendances, total } = await attendancesService.getAttendancesPaginated(
            page,
            limit,
            searchTerm
        );

        res.json({
            attendances,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error('Failed to get attendances:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function addAttendance(req, res) {
    try {
        const adminId = req.user.id;
        const attendanceData = req.body;

        if (!attendanceData.studentId || !attendanceData.timeIn || !attendanceData.timeOut) {
            return res.status(400).json({ error: 'StudentID, TimeIn, and TimeOut are required.' });
        }

        const newRecord = await attendancesService.addAttendanceRecord(attendanceData, adminId);
        res.status(201).json(newRecord);
    } catch (err) {
        console.error('Failed to add attendance record:', err);
        res.status(500).json({ error: 'Server error while adding attendance.' });
    }
}
