import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';

import authRoutes from './src/backend/routes/auth.routes.js';
import schoolsRoutes from './src/backend/routes/schools.routes.js';
import studentsRoutes from './src/backend/routes/students.routes.js';
import filtersRoutes from './src/backend/routes/filters.routes.js';
import announcementsRoutes from './src/backend/routes/announcements.routes.js';
import journalsRoutes from './src/backend/routes/journals.routes.js';
import attendancesRoutes from './src/backend/routes/attendances.routes.js';
import complaintsRoutes from './src/backend/routes/complaints.routes.js';
import dashboardRoutes from './src/backend/routes/dashboard.routes.js';
import companyRoutes from './src/backend/routes/companies.routes.js';
import uploadRoutes from './src/backend/routes/upload.routes.js';
import notificationsRoutes from './src/backend/routes/notifications.routes.js';


dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

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
app.use('/api/companies', companyRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationsRoutes);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

