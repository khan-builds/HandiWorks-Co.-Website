import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const url = import.meta.env.DATABASE_URL ?? process.env.DATABASE_URL!;
const authToken = import.meta.env.DATABASE_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url,
  // A blank token is rejected by libSQL. Omit it for the local file database.
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client);
