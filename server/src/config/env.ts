import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  HARVEST_ACCESS_TOKEN: z.string().min(1, 'HARVEST_ACCESS_TOKEN is required'),
  HARVEST_ACCOUNT_ID: z.string().min(1, 'HARVEST_ACCOUNT_ID is required'),
  TOGGL_API_TOKEN: z.string().min(1, 'TOGGL_API_TOKEN is required'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Environment validation failed:');
  console.error(result.error.format());
  process.exit(1);
}

export const env = result.data;
