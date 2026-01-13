import express from 'express';
import { getProfile } from '../controllers/profileController.js';
import { auth } from '../middleware/auth.Middleware.js';
import authorize from '../middleware/authorize.js';

const router=express.Router();

router.get('/read',auth,authorize("read"),getProfile);
router.post('/create',auth,authorize("create"),getProfile)
router.get('/me',auth,getProfile)

export default router;