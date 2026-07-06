import express from 'express';
import { getNotices, createNotice, deleteNotice } from '../controllers/noticeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getNotices)
  .post(protect, authorize('Admin', 'SuperAdmin', 'Teacher'), createNotice);

router.delete('/:id', protect, authorize('Admin', 'SuperAdmin'), deleteNotice);

export default router;
