import { pool } from '../../config/db.js';

export async function getAllSchools() {
    const [rows] = await pool.query('SELECT * FROM im_schools ORDER BY school_name ASC');
    return rows;
}

export async function createSchool(schoolID, school_name) {
    const [result] = await pool.query('INSERT INTO im_schools (schoolID, school_name) VALUES (?, ?)', [
        schoolID,
        school_name
    ]);
    return result;
}

export async function deleteSchoolById(id) {
    const [result] = await pool.query('DELETE FROM im_schools WHERE schoolID = ?', [id]);
    return result;
}