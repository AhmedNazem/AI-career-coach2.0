import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local for development and migrations
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
