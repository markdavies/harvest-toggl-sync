import { z } from 'zod';

const envSchema = z.object({
  HARVEST_ACCESS_TOKEN: z.string().min(1, 'HARVEST_ACCESS_TOKEN is required'),
  HARVEST_ACCOUNT_ID: z.string().min(1, 'HARVEST_ACCOUNT_ID is required'),
  TOGGL_API_TOKEN: z.string().min(1, 'TOGGL_API_TOKEN is required'),
});

export function getEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(`Environment validation failed: ${JSON.stringify(result.error.format())}`);
  }

  return result.data;
}
