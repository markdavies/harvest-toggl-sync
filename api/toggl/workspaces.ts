import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getWorkspaces } from '../_lib/togglApi';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const workspaces = await getWorkspaces();
    res.json(workspaces);
  } catch (error) {
    console.error('Toggl workspaces error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
