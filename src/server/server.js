import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from '../routes/authRoutes.js';
import otpRoutes from '../routes/otpRoutes.js';
import kandidatRoutes from '../routes/kandidatRoutes.js';
import dashboardRoutes from '../routes/dashboardRoutes.js';

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(
    cors({
        origin: ['http://localhost:3001', 'https://delta-abadi-international.netlify.app/'],
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/otp', otpRoutes);
app.use('/kandidat', kandidatRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;
