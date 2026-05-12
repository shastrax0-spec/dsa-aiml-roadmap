import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as c from '../controllers/revision.controller.js';
const r = Router();
r.use(protect);
r.get('/', c.listRevisions);
r.put('/:id/complete', c.completeRevision);
export default r;
