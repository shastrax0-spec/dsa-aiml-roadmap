import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as c from '../controllers/user.controller.js';
const r = Router();
r.use(protect);
r.put('/profile', c.updateProfile);
r.post('/streak-freeze', c.useStreakFreeze);
export default r;
