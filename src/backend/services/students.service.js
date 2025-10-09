import { pool } from '../../config/db.js';

export async function getStudentsPaginated(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [[{ total }]] = await pool.query(
        'SELECT COUNT(*) as total FROM im_cec_students WHERE IsActive = 1'
    );

    const [students] = await pool.query(
        'SELECT StudentID, StudentName, Section, CompanyName, TargetHours, IsCompleted, IsActive FROM im_cec_students WHERE IsActive = 1 ORDER BY StudentName ASC LIMIT ? OFFSET ?',
        [limit, offset]
    );

    return { students, total };
}