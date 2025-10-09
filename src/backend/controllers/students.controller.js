import * as studentsService from '../services/students.service.js';

export async function getStudents(req, res) {
    try {
        const page = parseInt(req.query.page || '1', 10);
        const limit = parseInt(req.query.limit || '10', 10);

        const { students: studentsRaw, total } = await studentsService.getStudentsPaginated(page, limit);

        const students = studentsRaw.map(student => {
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