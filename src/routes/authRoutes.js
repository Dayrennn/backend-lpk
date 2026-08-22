import express from 'express';
import { getMe, loginUser, logout, registerUser, verifyOtpUser } from '../controller/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtpUser);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

export default router;
