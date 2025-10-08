import jwt from 'jsonwebtoken';
import * as authService from '../services/auth.service.js';

export async function handleLogin(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const result = await authService.verifyUserCredentials(email, password);
        if (!result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { user, userType } = result;

        const role = userType === 'admin' ? user.Role : 'student';

        const token = jwt.sign(
            { id: user.ID, role: role },
            process.env.JWT_SECRET || 'your_default_secret_key',
            { expiresIn: '1h' }
        );

        await authService.createSession(user.ID, userType, token);

        return res.json({ token, role: role });
    } catch (err) {
        console.error('Login controller error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

export async function handleLogout(req, res) {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Token is required.' });
        }
        await authService.terminateSession(token);
        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        console.error('Logout controller error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
}

export async function handleVerifySession(req, res) {
    res.status(200).json({ message: 'Session is valid.' });
}