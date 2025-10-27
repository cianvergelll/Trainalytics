import * as dashboardService from '../services/dashboard.service.js';

export async function getStats(req, res) {
    try {
        const stats = await dashboardService.getDashboardStats();
        res.json(stats);
    } catch (err) {
        console.error('Failed to get dashboard stats:', err);
        res.status(500).json({ error: 'Server error fetching dashboard stats.' });
    }
}
