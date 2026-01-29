import * as companyService from '../services/companies.service.js';

export async function getCompanies(req, res) {
    try {
        const search = req.query.search || '';
        const isArchived = req.query.archived === 'true' ? 1 : 0;
        const companies = await companyService.getAllCompanies(search, isArchived);
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
}

export async function addCompany(req, res) {
    try {
        const { name, address, email, contact, timeout } = req.body;
        if (!name) return res.status(400).json({ error: 'Company Name is required' });

        await companyService.createCompany({ name, address, email, contact, timeout });
        res.status(201).json({ message: 'Company created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create company' });
    }
}

export async function archiveCompany(req, res) {
    try {
        const { id } = req.params;
        await companyService.toggleArchiveCompany(id, 1);
        res.json({ message: 'Company archived' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to archive company' });
    }
}

export async function restoreCompany(req, res) {
    try {
        const { id } = req.params;
        await companyService.toggleArchiveCompany(id, 0);
        res.json({ message: 'Company restored' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to restore company' });
    }
}

export async function editCompany(req, res) {
    try {
        const { id } = req.params;
        const { name, address, email, contact, timeout } = req.body;

        if (!name) return res.status(400).json({ error: 'Company Name is required' });

        const success = await companyService.updateCompany(id, { name, address, email, contact, timeout });

        if (!success) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json({ message: 'Company updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update company' });
    }
}