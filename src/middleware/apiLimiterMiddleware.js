import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // waktu limit
    limit: 5, // total request
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak percobaan login.",
    },
});

export const registerLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // waktu limit
    limit: 3, // total request
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Terlalu banyak percobaan Daftar.",
    },
});
