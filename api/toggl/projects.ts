import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getProjects } from '../_lib/togglApi';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workspaceId } = req.query;

    if (!workspaceId || typeof workspaceId !== 'string') {
      return res.status(400).json({ error: 'workspaceId query parameter is required' });
    }

    const projects = await getProjects(Number(workspaceId));
    res.json(projects);
  } catch (error) {
    console.error('Toggl projects error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
