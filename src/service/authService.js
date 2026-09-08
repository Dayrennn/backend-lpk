import prisma from "../config/prisma.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { sendOtp, verifyOtp } from "./otpService.js";

export const register = async ({ email, username, password, role }) => {
    if (!email) {
        throw new Error("Email Wajib di Isi");
    }
    if (!username) {
        throw new Error("Username Wajib di Isi");
    }
    if (!password) {
        throw new Error("Password Wajib di Isi");
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ username }, { email }],
        },
    });

    if (existingUser) {
        throw new Error("Email atau username Sudah diGunakan");
    }

    const hash = await hashPassword(password);
    await sendOtp({
        email,
        type: "register",
        metadata: {
            email,
            username,
            password: hash,
            ...(role ? { role } : {}),
        },
    });

    return {
        message: "OTP Telah dikirim ke email",
    };
};

export const registerVerifyOtp = async ({ email, otp }) => {
    // simpan sementara di metadata ygy
    const metadata = await verifyOtp({ email, code: otp, type: "register" });

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
        throw new Error("Email Wajib di isi");
    }
    if (!password) {
        throw new Error("Password Wajib di isi");
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
        throw new Error("User tidak ditemukan");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        throw new Error("Username atau password salah");
    }

    const token = generateToken({ id: user.id, username: user.username, email: user.email });

    return { user, token };
};

export const me = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            last_seen: true,
        },
    });
    return user;
};

export const getAllUser = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
        },
    });

    return result;
};

export const updateUser = async (id, { email, username, password, role }, currentUser) => {
    const existing = await prisma.user.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new Error("User tidak ditemukan");
    }

    // Hanya SuperAdmin yang boleh mengubah role atau mengedit akun pengguna lain
    if (role && role !== existing.role) {
        if (currentUser?.role !== "SuperAdmin") {
            throw new Error("Hanya SuperAdmin yang memiliki wewenang untuk mengubah role pengguna");
        }
    }

    if (currentUser?.role !== "SuperAdmin" && currentUser?.id !== id) {
        throw new Error("Anda tidak memiliki izin untuk mengubah data akun pengguna lain");
    }

    if (username || email) {
        const existingWithSameName = await prisma.user.findFirst({
            where: {
                OR: [username ? { username } : undefined, email ? { email } : undefined].filter(Boolean),
                NOT: { id },
            },
        });
        if (existingWithSameName) throw new Error("Username atau email sudah di gunakan");
    }

    // validasi role
    const validRoles = ["Admin", "SuperAdmin"];

    if (role && !validRoles.includes(role)) throw new Error("Role tidak valid");

    const data = {};

    if (email) data.email = email;
    if (username) data.username = username;
    if (password) data.password = await hashPassword(password);
    if (role) data.role = role;

    const update = await prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
        },
    });

    return update;
};

export const updateOnline = async (userId) => {
    const result = await prisma.user.update({
        where: { id: userId },
        data: {
            last_seen: new Date(),
        },
        select: {
            id: true,
            last_seen: true,
        },
    });

    return result;
};

export const getOnline = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            last_seen: true,
        },
    });

    const now = Date.now();

    return result.map((user) => {
        const isOnline = user.last_seen && now - new Date(user.last_seen).getTime() < 60_000;

        return {
            ...user,
            status: isOnline ? "Online" : "Offline",
        };
    });
};
