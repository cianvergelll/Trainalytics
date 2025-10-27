import { pool } from '../../config/db.js';

export async function getDashboardStats() {
    try {
        console.log('Fetching dashboard stats...');

        console.log('Querying total students...');
        const [[{ totalStudents }]] = await pool.query(
            'SELECT COUNT(*) as totalStudents FROM im_system.im_cec_students WHERE IsActive = 1 OR IsCompleted = 1'
        );
        console.log(`Total students found: ${totalStudents}`);

        console.log('Querying total companies...');
        const [[{ totalCompanies }]] = await pool.query(
            "SELECT COUNT(DISTINCT CompanyName) as totalCompanies FROM im_system.im_cec_students WHERE CompanyName IS NOT NULL AND CompanyName != ''"
        );
        console.log(`Total companies found: ${totalCompanies}`);

        console.log('Querying completion status...');
        const [completionStatus] = await pool.query(`
            SELECT
                SUM(CASE WHEN IsCompleted = 1 THEN 1 ELSE 0 END) AS completedCount,
                SUM(CASE WHEN IsActive = 1 AND IsCompleted = 0 THEN 1 ELSE 0 END) AS ongoingCount
            FROM im_system.im_cec_students
            WHERE IsActive = 1 OR IsCompleted = 1
        `);
        const completed = completionStatus[0]?.completedCount || 0;
        const ongoing = completionStatus[0]?.ongoingCount || 0;
        console.log(`Completion stats: Completed=${completed}, Ongoing=${ongoing}`);

        console.log('Querying internship status...');
        const [internshipStatus] = await pool.query(`
            SELECT
                SUM(CASE WHEN CompanyName IS NOT NULL AND CompanyName != '' THEN 1 ELSE 0 END) AS withInternshipCount,
                SUM(CASE WHEN CompanyName IS NULL OR CompanyName = '' THEN 1 ELSE 0 END) AS noInternshipCount
            FROM im_system.im_cec_students
            WHERE IsActive = 1 OR IsCompleted = 1
        `);
        const withInternship = internshipStatus[0]?.withInternshipCount || 0;
        const noInternship = internshipStatus[0]?.noInternshipCount || 0;
        console.log(`Internship stats: With=${withInternship}, None=${noInternship}`);

        console.log('Successfully fetched all stats.');
        return {
            totalStudents,
            totalCompanies,
            completionStats: {
                completed: completed,
                ongoing: ongoing,
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

