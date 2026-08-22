import { sendOtp } from '../service/otpService.js';

export const sendRegisterOtp = async (req, res) => {
    try {
        const { email } = req.body;
        await sendOtp({ email, type: 'register' });
        res.status(200).json({
            message: 'Otp Berhasil di kirim',
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
