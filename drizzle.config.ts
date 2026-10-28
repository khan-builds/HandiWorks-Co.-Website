import { defineConfig } from 'drizzle-kit';

const authToken = process.env.DATABASE_AUTH_TOKEN;

export default defineConfig({
  schema: './src/lib/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // A blank token fails validation. Omit it for the local file database.
    ...(authToken ? { authToken } : {}),
  },
});
