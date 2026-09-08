import { registerSchema, updateUserSchema } from "../schemas/userSchema.js";
import { getAllUser, login, me, register, registerVerifyOtp, updateUser } from "../service/authService.js";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const registerUser = async (req, res) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;

            return res.status(400).json({
                message: "Validasi Gagal",
                errors,
            });
        }
        const { username, email, password } = result.data;
        const create = await register({ username, email, password });
        res.status(200).json({
            message: "Berhasil Mendaftar User",
            data: create,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyOtpUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const verify = await registerVerifyOtp({ email, otp });
        res.status(200).json({
            message: "Berhasil Verifikasi",
            data: verify,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await login({ email, password });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "login berhasil",
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (token) {
            const decoded = jwt.decode(token);
            if (decoded?.exp) {
                await prisma.blacklistedToken.create({
                    data: {
                        token,
                        expiresAt: new Date(decoded.exp * 1000),
                    },
                });
            }
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        return res.status(200).json({ message: "Logout Berhasil" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const result = await me(req.user.id);
        res.status(200).json({
            message: "Berhasil",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getOneUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await me(id);
        res.status(200).json({
            message: "Berhasil Mengambil Data Satu User",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const seeAllUser = async (req, res) => {
    try {
        const result = await getAllUser();
        res.status(200).json({
            message: "Berhasil Ambil Data User",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const modifyUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = updateUserSchema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;

            return res.status(400).json({
                message: "Validasi Gagal",
                errors,
            });
        }
        const { username, email, password, role } = result.data;

        const update = await updateUser(id, { username, email, password, role }, req.user);
        return res.status(200).json({
            message: "Berhasil Merubah User",
            data: update,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};
