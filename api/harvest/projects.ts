import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getProjects } from '../_lib/harvestApi';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const projects = await getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Harvest projects error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
