import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTimeEntries } from '../_lib/harvestApi';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { from, to } = req.query;

    if (!from || !to || typeof from !== 'string' || typeof to !== 'string') {
      return res.status(400).json({ error: 'Both "from" and "to" query parameters are required' });
    }

    const entries = await getTimeEntries(from, to);
    res.json(entries);
  } catch (error) {
    console.error('Harvest entries error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
