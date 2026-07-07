import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Middlewares
import { errorHandler } from './middleware/error.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import placementRoutes from './routes/placementRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allows images to load on local client
  })
);

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/placements', placementRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'College ERP Backend running' });
});

// Centralized error handler middleware
app.use(errorHandler);

export default app;
