import * as dashboardService from '../services/dashboard.service.js';

export async function getStats(req, res) {
    try {
        const stats = await dashboardService.getDashboardStats();
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
}
