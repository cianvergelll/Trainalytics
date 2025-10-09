import { pool } from '../../config/db.js';

export async function getStudentsPaginated(page = 1, limit = 10, searchTerm = '') {
    const offset = (page - 1) * limit;
    const searchQuery = `%${searchTerm}%`;

    const [[{ total }]] = await pool.query(
        'SELECT COUNT(*) as total FROM im_cec_students WHERE IsActive = 1 AND (StudentName LIKE ? OR StudentID LIKE ?)',
        [searchQuery, searchQuery]
    );

    const [students] = await pool.query(
        'SELECT StudentID, StudentName, Section, CompanyName, TargetHours, IsCompleted, IsActive FROM im_cec_students WHERE IsActive = 1 AND (StudentName LIKE ? OR StudentID LIKE ?) ORDER BY StudentName ASC LIMIT ? OFFSET ?',
        [searchQuery, searchQuery, limit, offset]
    );

    return { students, total };
}