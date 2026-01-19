import { Router } from 'express';
import { getTimeEntries, getProjects } from '../services/harvestApi.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

router.get('/entries', async (req, res, next) => {
  try {
    const { from, to } = req.query;

    if (!from || !to || typeof from !== 'string' || typeof to !== 'string') {
      throw createError('Both "from" and "to" query parameters are required', 400);
    }

    const entries = await getTimeEntries(from, to);
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.get('/projects', async (_req, res, next) => {
  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

export default router;
