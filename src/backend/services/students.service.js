import { pool } from '../../config/db.js';
import bcrypt from 'bcryptjs';

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

export async function createStudent(studentData) {
    const {
        studentId,
        firstName,
        middleName,
        lastName,
        email,
        contactNumber,
        classSection,
        username,
        password,
        schoolId
    } = studentData;

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [userResult] = await conn.query(
            'INSERT INTO im_users (Username, Password, IsDeleted) VALUES (?, ?, 0)',
            [username, hashedPassword]
        );

        const studentName = `${firstName} ${lastName}`;
        const departmentId = '1';
        const isActive = 1;

        const [studentResult] = await conn.query(
            'INSERT INTO im_cec_students (StudentID, StudentName, SchoolID, DepartmentID, Email, ContactNumber, Section, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                studentId,
                studentName,
                schoolId,
                departmentId,
                email,
                contactNumber,
                classSection,
                isActive
            ]
        );

        await conn.commit();
        return { success: true, userId: userResult.insertId, studentId: studentResult.insertId };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

