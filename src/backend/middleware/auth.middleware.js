import jwt from 'jsonwebtoken';
import { pool } from '../../config/db.js';

export async function protect(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret_key');

            const [rows] = await pool.query(
                'SELECT * FROM im_sessions WHERE user_id = ? AND session_token = ?',
                [decoded.id, token]
            );

            if (rows.length === 0) {
                return res.status(401).json({ error: 'Not authorized, session not found.' });
            }

            const session = rows[0];
            const isExpired = new Date(session.expires_at) < new Date();

            if (isExpired) {
                await pool.query('DELETE FROM im_sessions WHERE ID = ?', [session.ID]);
                return res.status(401).json({ error: 'Not authorized, session expired.' });
            }

            req.user = { id: decoded.id, role: decoded.role };
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ error: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token.' });
    }
}

export function isAdmin(req, res, next) {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ error: 'Not authorized, user role not found.' });
    }

    const role = req.user.role;

    if (role === 'SuperAdmin' || role === 'Coordinator' || role === 'Staff') {
        next();
    } else {
        return res.status(403).json({ error: 'Forbidden: Admin access required.' });
    }
}

export function isSuperAdmin(req, res, next) {
    if (!req.user || !req.user.role) {
        return res.status(401).json({ error: 'Not authorized, user role not found.' });
    }

    if (req.user.role === 'SuperAdmin') {
        next();
    } else {
        return res.status(403).json({ error: 'Forbidden: SuperAdmin access required.' });
    }
}

