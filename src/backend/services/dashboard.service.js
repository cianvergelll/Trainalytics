import { pool } from '../../config/db.js';

export async function getDashboardStats() {
    try {

        const [[{ totalStudents }]] = await pool.query(
            'SELECT COUNT(*) as totalStudents FROM im_system.im_cec_students WHERE IsActive = 1 OR IsCompleted = 1'
        );

        const [[{ totalCompanies }]] = await pool.query('SELECT COUNT(*) as totalCompanies FROM im_cec_company_list WHERE IsArchived = 0');

        const [completionStatus] = await pool.query(`
            SELECT
                SUM(CASE WHEN IsCompleted = 1 THEN 1 ELSE 0 END) AS completedCount,
                SUM(CASE WHEN IsActive = 1 AND IsCompleted = 0 AND TargetHours > 0 THEN 1 ELSE 0 END) AS ongoingCount,
                SUM(CASE WHEN IsActive = 1 AND IsCompleted = 0 AND TargetHours = 0 THEN 1 ELSE 0 END) AS processingCount
            FROM im_system.im_cec_students
            WHERE IsActive = 1 OR IsCompleted = 1
        `);

        const completed = completionStatus[0]?.completedCount || 0;
        const ongoing = completionStatus[0]?.ongoingCount || 0;
        const processing = completionStatus[0]?.processingCount || 0;
        const [internshipStatus] = await pool.query(`
            SELECT
                SUM(CASE WHEN CompanyName IS NOT NULL AND CompanyName != '' AND CompanyName != 'None' THEN 1 ELSE 0 END) AS withInternshipCount,
                SUM(CASE WHEN CompanyName IS NULL OR CompanyName = '' OR CompanyName = 'None' THEN 1 ELSE 0 END) AS noInternshipCount
            FROM im_system.im_cec_students
            WHERE IsActive = 1 OR IsCompleted = 1
        `);
        const withInternship = internshipStatus[0]?.withInternshipCount || 0;
        const noInternship = internshipStatus[0]?.noInternshipCount || 0;
        return {
            totalStudents,
            totalCompanies,
            completionStats: {
                completed: completed,
                ongoing: ongoing,
                processing: processing,
            },
            internshipStats: {
                withInternship: withInternship,
                noInternship: noInternship,
            }
        };
    } catch (error) {
        console.error("!!! Error in getDashboardStats service:", error);
        throw error;
    }
}