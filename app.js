import express from 'express'
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoutes.js'
import profileRoutes from './src/routes/profileRoutes.js'

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRoutes);
app.use("/api/profile",profileRoutes)

export default app;