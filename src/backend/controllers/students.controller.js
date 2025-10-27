import * as studentsService from '../services/students.service.js';

export async function getStudents(req, res) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);
        const searchTerm = req.query.search || '';

        const { students: studentsRaw, total } = await studentsService.getStudentsPaginated(
            page,
            limit,
            searchTerm
        );

        const students = studentsRaw.map((student) => {
            let status = 'None';
            if (student.IsCompleted) {
                status = 'Completed';
            } else if (student.IsActive) {
                status = 'On-going';
            }

            return {
                StudentID: student.StudentID,
                StudentName: student.StudentName,
                CompanyName: student.CompanyName || 'N/A',
                TargetHours: `${student.TargetHours} Hours`,
                status: status,
                avatar: 'https://i.pravatar.cc/40?u=' + student.StudentID,
                section: student.Section || 'N/A'
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

