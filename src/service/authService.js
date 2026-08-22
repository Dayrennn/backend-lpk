import prisma from '../config/prisma.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { sendOtp, verifyOtp } from './otpService.js';

export const register = async ({ email, username, password, role }) => {
    if (!email) {
        throw new Error('Email Wajib di Isi');
    }
    if (!username) {
        throw new Error('Username Wajib di Isi');
    }
    if (!password) {
        throw new Error('Password Wajib di Isi');
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ username }, { email }],
        },
    });

    if (existingUser) {
        throw new Error('Email atau username Sudah diGunakan');
    }

    const hash = await hashPassword(password);
    await sendOtp({
        email,
        type: 'register',
        metadata: {
            email,
            username,
            password: hash,
            ...(role ? { role } : {}),
        },
    });

    return {
        message: 'OTP Telah dikirim ke email',
    };
};

export const registerVerifyOtp = async ({ email, otp }) => {
    // simpan sementara di metadata ygy
    const metadata = await verifyOtp({ email, code: otp, type: 'register' });

    const newUser = await prisma.user.create({
        data: {
            email,
            username: metadata.username,
            password: metadata.password,
        },
    });
    return newUser;
};

export const login = async ({ email, password }) => {
    if (!email) {
        throw new Error('Email Wajib di isi');
    }
    if (!password) {
        throw new Error('Password Wajib di isi');
    }

    const user = await prisma.user.findFirst({
        where: { email },
        select: {
            id: true,
            email: true,
            username: true,
            password: true,
            role: true,
        },
    });

    if (!user) {
        throw new Error('User tidak ditemukan');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        throw new Error('Username atau password salah');
    }

    const token = generateToken({ id: user.id, username: user.username, email: user.email });

    return { user, token };
};

export const me = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            email: true,
            username: true,
            role: true,
        },
    });
    return user;
};
