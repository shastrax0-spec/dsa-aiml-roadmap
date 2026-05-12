import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as c from '../controllers/session.controller.js';
const r = Router();
r.use(protect);
r.get('/', c.listSessions);
r.post('/', c.addSession);
export default r;
