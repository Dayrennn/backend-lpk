import { verifyToken } from '../utils/jwt.js';
import prisma from '../config/prisma.js';

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Token tidak di temukan' });
    }

    try {
        // cek apakah token ini sudah di-blacklist (logout)
        const blacklisted = await prisma.blacklistedToken.findUnique({
            where: { token },
        });

        if (blacklisted) {
            return res.status(401).json({ message: 'Token sudah tidak berlaku, silakan login ulang' });
        }

        const decoded = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, username: true, role: true },
        });

        if (!user) {
            return res.status(401).json({ message: 'Akun tidak ditemukan' });
        }

        req.user = user; // pakai data fresh dari DB, bukan cuma payload token yang bisa basi
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token tidak valid atau expired' });
    }
};