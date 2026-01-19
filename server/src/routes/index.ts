import { Router } from 'express';
import statusRouter from './status.js';
import harvestRouter from './harvest.js';
import togglRouter from './toggl.js';

const router = Router();

router.use(statusRouter);
router.use('/harvest', harvestRouter);
router.use('/toggl', togglRouter);

export default router;
