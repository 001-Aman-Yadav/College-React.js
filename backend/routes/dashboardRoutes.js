import express from 'express';
import { getAdminStats } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', protect, authorize('Admin', 'SuperAdmin'), getAdminStats);

export default router;
