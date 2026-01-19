import { Router } from 'express';
import { getWorkspaces, getProjects, importEntries } from '../services/togglApi.js';
import { createError } from '../middleware/errorHandler.js';
import type { ImportRequest } from '../../../shared/types.js';

const router = Router();

router.get('/workspaces', async (_req, res, next) => {
  try {
    const workspaces = await getWorkspaces();
    res.json(workspaces);
  } catch (error) {
    next(error);
  }
});

router.get('/projects', async (req, res, next) => {
  try {
    const { workspaceId } = req.query;

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw createError('workspaceId query parameter is required', 400);
    }

    const projects = await getProjects(Number(workspaceId));
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

router.post('/import', async (req, res, next) => {
  try {
    const body = req.body as ImportRequest;

    if (!body.entries || !Array.isArray(body.entries)) {
      throw createError('entries array is required', 400);
    }

    if (!body.workspaceId) {
      throw createError('workspaceId is required', 400);
    }

    const results = await importEntries(
      body.entries,
      body.workspaceId,
      body.projectMapping || {}
    );

    res.json(results);
  } catch (error) {
    next(error);
  }
});

export default router;
