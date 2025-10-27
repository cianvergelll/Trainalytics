import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import authRoutes from './src/backend/routes/auth.routes.js';
import schoolsRoutes from './src/backend/routes/schools.routes.js';
import studentsRoutes from './src/backend/routes/students.routes.js';
import filtersRoutes from './src/backend/routes/filters.routes.js';
import announcementsRoutes from './src/backend/routes/announcements.routes.js';
import journalsRoutes from './src/backend/routes/journals.routes.js';
import attendancesRoutes from './src/backend/routes/attendances.routes.js';
import complaintsRoutes from './src/backend/routes/complaints.routes.js';
import dashboardRoutes from './src/backend/routes/dashboard.routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/filters', filtersRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/journals', journalsRoutes);
app.use('/api/attendances', attendancesRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

