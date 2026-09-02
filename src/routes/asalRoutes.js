import express from "express";
import { seeAllProvinsi } from "../controller/asalController.js";

const router = express.Router();

router.get("/", seeAllProvinsi);

export default router;
