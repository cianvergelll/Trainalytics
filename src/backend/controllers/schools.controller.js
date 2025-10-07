import * as schoolsService from '../services/schools.service.js';

export async function getSchools(req, res) {
    try {
        const schools = await schoolsService.getAllSchools();
        res.json(schools);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get schools' });
    }
}

export async function addSchool(req, res) {
    try {
        const { schoolID, school_name } = req.body;
        if (!schoolID || !school_name) {
            return res.status(400).json({ error: 'schoolID and school_name are required.' });
        }
        await schoolsService.createSchool(schoolID, school_name);
        res.status(201).json({ message: 'School created successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create school' });
    }
}

export async function deleteSchool(req, res) {
    try {
        const { id } = req.params;
        const result = await schoolsService.deleteSchoolById(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'School not found.' });
        }
        res.status(200).json({ message: 'School deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete school' });
    }
}