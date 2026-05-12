import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as c from '../controllers/resource.controller.js';
const r = Router();
r.use(protect);
r.get('/', c.list);
r.post('/', c.create);
r.delete('/:id', c.remove);
export default r;
