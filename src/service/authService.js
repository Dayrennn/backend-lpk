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
            email: true,
            username: true,
            role: true,
            password: true,
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

export const updateUser = async (id, { email, username, password, role }) => {
    const existing = await prisma.user.findUnique({
        where: { id },
    });

    if (!existing) {
        throw new Error("User tidak ditemukan");
    }

    if (username || email) {
        const existing = await prisma.user.findFirst({
            where: {
                OR: [username ? { username } : undefined, email ? { email } : undefined].filter(Boolean),
                NOT: { id },
            },
        });
        if (existing) throw new Error("Username atau email sudah di gunakan");
    }

    // validasi role
    const validRoles = ["Admin", "SuperAdmin"];

    // berarti role nya ga ada
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
            username: true,
            email: true,
            password: true,
            role: true,
        },
    });

    return update;
};
