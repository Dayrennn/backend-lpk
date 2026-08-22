import express from 'express';
import { sendRegisterOtp } from '../controller/otpController.js';

const router = express.Router();

router.post('/send-otp', sendRegisterOtp);

export default router;
