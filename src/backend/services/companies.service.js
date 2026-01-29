import { pool } from '../../config/db.js';

export async function getAllCompanies(search = '', isArchived = 0) {
    let query = `
        SELECT ID, CompanyName, Address, Email, ContactNumber, TimeOut 
        FROM im_cec_company_list 
        WHERE IsArchived = ?
    `;
    const params = [isArchived];

    if (search) {
        query += ` AND (CompanyName LIKE ? OR Email LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY CreatedAt DESC`;

    const [rows] = await pool.query(query, params);

    return rows.map(row => ({
        ...row,
        FormattedID: `C-${String(row.ID).padStart(4, '0')}`
    }));
}

export async function createCompany(data) {
    const { name, address, email, contact, timeout } = data;
    const [result] = await pool.query(
        `INSERT INTO im_cec_company_list (CompanyName, Address, Email, ContactNumber, TimeOut) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, address, email, contact, timeout]
    );
    return result.insertId;
}

export async function toggleArchiveCompany(id, isArchived) {
    const [result] = await pool.query(
        `UPDATE im_cec_company_list SET IsArchived = ? WHERE ID = ?`,
        [isArchived, id]
    );
    return result.affectedRows > 0;
}

export async function updateCompany(id, data) {
    const { name, address, email, contact, timeout } = data;
    const [result] = await pool.query(
        `UPDATE im_cec_company_list 
         SET CompanyName = ?, Address = ?, Email = ?, ContactNumber = ?, TimeOut = ?
         WHERE ID = ?`,
        [name, address, email, contact, timeout, id]
    );
    return result.affectedRows > 0;
}