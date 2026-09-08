import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "../routes/authRoutes.js";
import otpRoutes from "../routes/otpRoutes.js";
import kandidatRoutes from "../routes/kandidatRoutes.js";
import dashboardRoutes from "../routes/dashboardRoutes.js";
import asalRoutes from "../routes/asalRoutes.js";

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://delta-abadi-international.netlify.app",
            "https://lpkdeltaabadiinternational.vercel.app",
        ],
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);
app.use("/kandidat", kandidatRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/asal", asalRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(err.status || 500).json({
        message: err.message || "Terjadi kesalahan internal pada server",
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;
