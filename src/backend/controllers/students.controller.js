import * as studentsService from '../services/students.service.js';

export async function getStudents(req, res) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const searchTerm = req.query.search || '';

        const filters = {
            archived: req.query.archived || 'false',
            status: req.query.status ? (Array.isArray(req.query.status) ? req.query.status : [req.query.status]) : [],
            hours: req.query.hours ? (Array.isArray(req.query.hours) ? req.query.hours : [req.query.hours]) : [],
            companies: req.query.companies ? (Array.isArray(req.query.companies) ? req.query.companies : [req.query.companies]) : [],
            sections: req.query.sections ? (Array.isArray(req.query.sections) ? req.query.sections : [req.query.sections]) : []
        };

        const { students: studentsRaw, total } = await studentsService.getStudentsPaginated(
            page,
            limit,
            searchTerm,
            filters
        );

        const students = studentsRaw.map((student) => {
            let status = 'None';
            let targetHoursDisplay = '';
            let companyDisplay = student.CompanyName || '-';

            if (student.IsCompleted) {
                status = 'Completed';
                targetHoursDisplay = `${student.TargetHours} Hours`;
            } else if (parseFloat(student.TargetHours) === 0) {
                status = 'Processing';
                targetHoursDisplay = '-';
            } else if (student.IsActive) {
                status = 'On-going';
                targetHoursDisplay = `${student.TargetHours} Hours`;
            } else {
                targetHoursDisplay = student.TargetHours > 0 ? `${student.TargetHours} Hours` : '-';
            }

            return {
                StudentID: student.StudentID,
                StudentName: student.StudentName,
                CompanyName: companyDisplay,
                TargetHours: targetHoursDisplay,
                status: status,
                avatar: 'https://i.pravatar.cc/40?u=' + student.StudentID,
                section: student.Section || 'N/A',
                isArchived: student.IsArchived
            };
        });

        res.json({
            students,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error('Failed to get students:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function addStudent(req, res) {
    if (req.user.role === 'student') {
        return res.status(403).json({ error: 'Forbidden: You do not have permission.' });
    }

    const {
        studentId,
        firstName,
        lastName,
        email,
        username,
        password,
        schoolId,
        classSection
    } = req.body;

    if (
        !studentId ||
        !firstName ||
        !lastName ||
        !email ||
        !username ||
        !password ||
        !schoolId ||
        !classSection
    ) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        await studentsService.createStudent(req.body);
        res.status(201).json({ message: 'Student created successfully.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('Username')) {
                return res.status(409).json({ error: 'This username is already taken.' });
            }
            if (err.message.includes('unique_student_id')) {
                return res.status(409).json({ error: 'This Student ID already exists.' });
            }
        }
        console.error('Failed to create student:', err);
        res.status(500).json({ error: 'Server error while creating student.' });
    }
}

export async function toggleArchiveStudent(req, res) {
    try {
        const { id } = req.params;
        const { archived } = req.body;

        if (typeof archived !== 'boolean') {
            return res.status(400).json({ error: 'Invalid status provided.' });
        }

        const success = await studentsService.setStudentArchiveStatus(id, archived);

        if (!success) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.json({ message: `Student ${archived ? 'archived' : 'restored'} successfully.` });
    } catch (err) {
        console.error('Failed to toggle archive status:', err);
        res.status(500).json({ error: 'Server error updating archive status.' });
    }
}

export async function getStudentProfile(req, res) {
    try {
        const { id } = req.params;
        const student = await studentsService.getStudentByStudentId(id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        let age = 'N/A';
        if (student.BirthDate) {
            const birth = new Date(student.BirthDate);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                calculatedAge--;
            }
            age = calculatedAge;
        }

        res.json({ ...student, Age: age });
    } catch (err) {
        console.error('Error fetching student profile:', err);
        res.status(500).json({ error: 'Server error fetching profile.' });
    }
}

// Add to src/backend/controllers/students.controller.js

export async function updateStudentDetails(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;


        const success = await studentsService.updateStudent(id, updates);

        if (!success) {
            return res.json({ message: 'No changes detected or update failed.' });
        }

        res.json({ message: 'Student updated successfully.' });
    } catch (err) {
        console.error('Failed to update student:', err);
        res.status(500).json({ error: 'Server error while updating student.' });
    }
}