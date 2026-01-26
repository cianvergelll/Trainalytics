import * as attendanceService from '../services/attendances.service.js'; // Standardized Import
import { pool } from '../../config/db.js';

// --- HELPER: Get Student ID reliably ---
const getStudentId = async (req) => {
    // 1. Try getting from the authenticated user object (Token)
    if (req.user && req.user.Extra1) {
        return req.user.Extra1;
    }

    // 2. If not in token, fetch from DB using the User ID
    if (req.user && req.user.id) {
        const [rows] = await pool.query('SELECT Extra1 FROM im_users WHERE ID = ?', [req.user.id]);
        if (rows.length > 0 && rows[0].Extra1) {
            return rows[0].Extra1;
        }
    }

    // 3. Fallback: Check if frontend sent it in body
    if (req.body && req.body.studentId) {
        return req.body.studentId;
    }

    return null;
};

// --- ADMIN: Get All Attendances ---
export async function getAttendances(req, res) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const searchTerm = req.query.search || '';

        const { attendances, total } = await attendanceService.getAttendancesPaginated(
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

// --- ADMIN: Manual Add ---
export async function addAttendance(req, res) {
    try {
        const adminId = req.user.id;
        const attendanceData = req.body;

        if (!attendanceData.studentId || !attendanceData.timeIn || !attendanceData.timeOut) {
            return res.status(400).json({ error: 'StudentID, TimeIn, and TimeOut are required.' });
        }

        const newRecord = await attendanceService.addAttendanceRecord(attendanceData, adminId);
        res.status(201).json(newRecord);
    } catch (err) {
        console.error('Failed to add attendance record:', err);
        res.status(500).json({ error: 'Server error while adding attendance.' });
    }
}

// --- STUDENT & ADMIN: Get Specific Student History ---
export async function getStudentAttendance(req, res) {
    try {
        // This endpoint is used by Student (My Attendance) AND Admin (View Student Attendance)
        // If req.params.id exists, use it. 
        // If not (and user is student), get their ID.
        let studentId = req.params.id;

        if (!studentId || studentId === 'undefined') {
            // Fallback for student side if param wasn't passed clearly
            studentId = await getStudentId(req);
        }

        if (!studentId) {
            return res.status(400).json({ error: "Student ID missing." });
        }

        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);

        const result = await attendanceService.getStudentAttendancePaginated(studentId, page, limit);

        // It is fine if result.records is empty, we just need the structure
        if (!result) {
            return res.status(404).json({ error: 'Student data not found.' });
        }

        res.json({
            student: result.student,
            records: result.records,
            totalPages: Math.ceil(result.total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Failed to get student attendance:', err);
        res.status(500).json({ error: 'Server error fetching student attendance.' });
    }
}

// --- CLOCK IN ---
export const clockIn = async (req, res) => {
    try {
        const studentId = await getStudentId(req);

        if (!studentId) {
            return res.status(400).json({ error: 'No Student ID linked to your account.' });
        }

        await attendanceService.studentClockIn(studentId);
        res.status(200).json({ message: 'Clocked in successfully.' });
    } catch (error) {
        console.error("Clock In Error:", error);
        res.status(400).json({ error: error.message });
    }
};

// --- CLOCK OUT ---
export const clockOut = async (req, res) => {
    try {
        const studentId = await getStudentId(req);

        if (!studentId) {
            return res.status(400).json({ error: 'No Student ID linked to your account.' });
        }

        const result = await attendanceService.studentClockOut(studentId);
        res.status(200).json({ message: 'Clocked out successfully.', result });
    } catch (error) {
        console.error("Clock Out Error:", error);
        res.status(400).json({ error: error.message });
    }
};

// --- GET STATUS ---
export const getStatus = async (req, res) => {
    try {
        let studentId = req.params.studentId;

        if (!studentId || studentId === 'undefined') {
            studentId = await getStudentId(req);
        }

        if (!studentId) {
            return res.status(400).json({ error: 'Student ID missing' });
        }

        const status = await attendanceService.getLatestAttendanceStatus(studentId);
        res.json(status);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch status' });
    }
};