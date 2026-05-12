import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ===== Fix __dirname for ES Modules =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Load .env safely =====
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("🔎 MONGO_URI:", process.env.MONGO_URI);

// ===== Routes =====
import authRoutes from './src/routes/auth.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import problemRoutes from './src/routes/problem.routes.js';
import resourceRoutes from './src/routes/resource.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import revisionRoutes from './src/routes/revision.routes.js';
import sessionRoutes from './src/routes/session.routes.js';
import userRoutes from './src/routes/user.routes.js';

import { errorHandler } from './src/middleware/errorHandler.js';

// ===== App Setup =====
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// ===== Health Check =====
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    message: "Server is running",
    time: new Date().toISOString()
  });
});

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/revisions', revisionRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/user', userRoutes);

// ===== Error Handler =====
app.use(errorHandler);

// ===== Server Start =====
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });