import express from "express";
import { getMe, getOneUser, loginUser, logout, modifyUser, registerUser, seeAllUser, verifyOtpUser } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtpUser);
router.put("/:id", authMiddleware, modifyUser);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);
router.get("/one-user/:id", authMiddleware, getOneUser)
router.get("/", authMiddleware, seeAllUser);

export default router;
