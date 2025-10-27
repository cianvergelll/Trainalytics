import * as filtersService from '../services/filters.service.js';

export async function fetchFilterOptions(req, res) {
    try {
        const options = await filtersService.getFilterOptions();
        res.json(options);
    } catch (err) {
        console.error('Failed to get filter options:', err);
        res.status(500).json({ error: 'Server error' });
    }
}