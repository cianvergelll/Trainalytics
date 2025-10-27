import { pool } from '../../config/db.js';

export async function getFilterOptions() {
    const [companies] = await pool.query('SELECT DISTINCT CompanyName FROM im_cec_students WHERE CompanyName IS NOT NULL AND CompanyName != "" ORDER BY CompanyName ASC');
    const [sections] = await pool.query('SELECT DISTINCT Section FROM im_cec_students WHERE Section IS NOT NULL AND Section != "" ORDER BY Section ASC');

    return {
        companies: companies.map(c => c.CompanyName),
        sections: sections.map(s => s.Section)
    };
}