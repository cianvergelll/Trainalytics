import bcrypt from 'bcryptjs';
import { pool } from '../../config/db.js';

export async function verifyUserCredentials(email, password) {
    let [rows] = await pool.query('SELECT ID, Username, Password, Role FROM im_admin_users WHERE Username = ? AND IsDeleted = 0', [email]);
    let userType = 'admin';

    if (rows.length === 0) {
        [rows] = await pool.query('SELECT ID, Username, Password FROM im_users WHERE Username = ? AND IsDeleted = 0', [email]);
        userType = 'student';
    }

    if (rows.length === 0) {
        return null;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.Password);

    return isMatch ? { user, userType } : null;
}

export async function createSession(userId, userType, token) {
    const expiresAt = new Date(Date.now() + 3600 * 1000);
    await pool.query(
        'INSERT INTO im_sessions (user_id, user_type, session_token, expires_at) VALUES (?, ?, ?, ?)',
        [userId, userType, token, expiresAt]
    );
}

export async function terminateSession(token) {
    await pool.query('DELETE FROM im_sessions WHERE session_token = ?', [token]);
}

export async function getUserDetailsById(userId, userType) {
    try {
        let query;
        if (userType === 'admin') {
            query = 'SELECT ID, Username, Role FROM im_admin_users WHERE ID = ? AND IsDeleted = 0';
        } else if (userType === 'student') {
            query = 'SELECT ID, Username FROM im_users WHERE ID = ? AND IsDeleted = 0';
        } else {
            return null;
        }

        const [rows] = await pool.query(query, [userId]);

        if (rows.length === 0) {
            return null;
        }
        return { ...rows[0], userType: userType };
    } catch (error) {
        console.error("Error fetching user details by ID:", error);
        throw error;
    }
}
