import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getAnalytics } from '../controllers/analytics.controller.js';
const r = Router();
r.get('/', protect, getAnalytics);
export default r;
