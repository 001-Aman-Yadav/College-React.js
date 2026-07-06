import express from 'express';
import { createPayment, getPayments, downloadReceipt } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createPayment)
  .get(protect, getPayments);

router.get('/:id/receipt', protect, downloadReceipt);

export default router;
