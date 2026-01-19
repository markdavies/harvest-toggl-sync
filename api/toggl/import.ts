import type { VercelRequest, VercelResponse } from '@vercel/node';
import { importEntries } from '../_lib/togglApi';
import type { ImportRequest } from '../../shared/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body as ImportRequest;

    if (!body.entries || !Array.isArray(body.entries)) {
      return res.status(400).json({ error: 'entries array is required' });
    }

    if (!body.workspaceId) {
      return res.status(400).json({ error: 'workspaceId is required' });
    }

    const results = await importEntries(
      body.entries,
      body.workspaceId,
      body.projectMapping || {}
    );

    res.json(results);
  } catch (error) {
    console.error('Toggl import error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
