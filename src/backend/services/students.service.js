import { pool } from '../../config/db.js';

export async function getStudentsPaginated(page = 1, limit = 10, searchTerm = '', filters = {}) {
    const offset = (page - 1) * limit;

    let baseQuery = 'FROM im_cec_students WHERE 1=1';
    const params = [];

    if (searchTerm) {
        baseQuery += ' AND (StudentName LIKE ? OR StudentID LIKE ?)';
        const searchQuery = `%${searchTerm}%`;
        params.push(searchQuery, searchQuery);
    }

    if (filters.status && filters.status.length > 0) {
        const statusConditions = [];
        if (filters.status.includes('Completed')) statusConditions.push('(IsCompleted = 1 AND IsActive = 0)');
        if (filters.status.includes('On-going')) statusConditions.push('(IsCompleted = 0 AND IsActive = 1)');
        if (filters.status.includes('None')) statusConditions.push('(IsActive = 0 AND IsCompleted = 0)');
        if (statusConditions.length > 0) baseQuery += ` AND (${statusConditions.join(' OR ')})`;
    }
    if (filters.hours && filters.hours.length > 0) {
        baseQuery += ' AND TargetHours IN (?)';
        params.push(filters.hours);
    }
    if (filters.companies && filters.companies.length > 0) {
        baseQuery += ' AND CompanyName IN (?)';
        params.push(filters.companies);
    }
    if (filters.sections && filters.sections.length > 0) {
        baseQuery += ' AND Section IN (?)';
        params.push(filters.sections);
    }

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, params);

    const [students] = await pool.query(`SELECT StudentID, StudentName, Section, CompanyName, TargetHours, IsCompleted, IsActive ${baseQuery} ORDER BY StudentName ASC LIMIT ? OFFSET ?`, [...params, limit, offset]);

    return { students, total };
}