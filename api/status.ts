import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const status = {
    harvestConfigured: Boolean(process.env.HARVEST_ACCESS_TOKEN && process.env.HARVEST_ACCOUNT_ID),
    togglConfigured: Boolean(process.env.TOGGL_API_TOKEN),
  };
  res.json(status);
}
