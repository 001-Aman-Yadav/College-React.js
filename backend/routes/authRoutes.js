import express from 'express';
import { register, login, refresh, logout, forgotPassword, verifyOTP, resetPassword, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.put('/change-password', protect, changePassword);

export default router;
