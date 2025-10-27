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
        const username = user.Username;

        const token = jwt.sign(
            { id: user.ID, role: role, username: username, userType: userType },
            process.env.JWT_SECRET || 'your_default_secret_key',
            { expiresIn: '1h' }
        );

        await authService.createSession(user.ID, userType, token);

        return res.json({ token, role: role, username: username });

    } catch (err) {
        console.error('Login controller error:', err);
        return res.status(500).json({ error: 'Server error during login.' });
    }
}

export async function handleLogout(req, res) {
    try {
        let token = req.body.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(400).json({ error: 'Token is required.' });
        }
        await authService.terminateSession(token);
        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        console.error('Logout controller error:', err);
        return res.status(500).json({ error: 'Server error during logout.' });
    }
}

export async function handleVerifySession(req, res) {
    res.status(200).json({ message: 'Session is valid.' });
}

export async function getCurrentUser(req, res) {
    if (!req.user || !req.user.id || !req.user.role) {
        return res.status(401).json({ error: 'Not authorized or user data missing.' });
    }
    try {
        const tokenPayload = jwt.decode(req.headers.authorization.split(' ')[1]);
        if (!tokenPayload || !tokenPayload.userType) {
            return res.status(401).json({ error: 'User type missing from token.' });
        }

        res.json({
            id: req.user.id,
            role: req.user.role,
            username: tokenPayload.username || 'N/A',
            userType: tokenPayload.userType
        });

    } catch (err) {
        console.error('Error fetching current user:', err);
        res.status(500).json({ error: 'Server error fetching user details.' });
    }
}
