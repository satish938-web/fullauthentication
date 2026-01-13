import express from 'express';
import { GetNewAccessToken, loginUser, registerUser, verifiyEmail, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/register',registerUser)
router.get('/verifyEmail/:token',verifiyEmail);
router.post('/verifyOtp',verifyOtp)
router.post('/login',loginUser)
router.get("/refresh-token",GetNewAccessToken);

export default router;
