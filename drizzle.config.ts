import { env } from '@/shared/config/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/shared/db/schema.ts',
  out: './src/shared/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_FILE_NAME
  }
});