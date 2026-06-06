import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import positionRoutes from './routes/positionRoutes';
import teamRoutes from './routes/teamRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4821;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export { app, prisma };
