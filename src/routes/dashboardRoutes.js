import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { seeAllKandidatDashboard } from '../controller/dashboardController.js';

const router = express.Router();

router.get('/kandidat', authMiddleware, seeAllKandidatDashboard);

export default router;
