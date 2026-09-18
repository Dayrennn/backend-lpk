import express from "express";
import { getMe, getOneUser, heartbeat, loginUser, logout, modifyUser, registerUser, seeAllUser, seeAllUserOnline, verifyOtpUser } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/apiLimiterMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/verify-otp", verifyOtpUser);
router.post("/heartbeat", authMiddleware, heartbeat);
router.put("/:id", authMiddleware, modifyUser);
router.post("/logout", authMiddleware, logout);
router.get("/status", authMiddleware, seeAllUserOnline);
router.get("/me", authMiddleware, getMe);
router.get("/one-user/:id", authMiddleware, getOneUser);
router.get("/", authMiddleware, seeAllUser);

export default router;
