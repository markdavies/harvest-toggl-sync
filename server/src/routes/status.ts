import { Router } from 'express';
import { env } from '../config/env.js';
import type { StatusResponse } from '../../../shared/types.js';

const router = Router();

router.get('/status', (_req, res) => {
  const status: StatusResponse = {
    harvestConfigured: Boolean(env.HARVEST_ACCESS_TOKEN && env.HARVEST_ACCOUNT_ID),
    togglConfigured: Boolean(env.TOGGL_API_TOKEN),
  };
  res.json(status);
});

export default router;
