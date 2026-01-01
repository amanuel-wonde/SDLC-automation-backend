import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.AI_DATABASE_URL
      ? process.env.AI_DATABASE_URL.split('?')[0] + '?schema=public'
      : undefined,
  },
});
