import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { users } from '../src/lib/schema';

const accounts = [
  {
    email: 'student@helpinghand.test',
    name: 'Sample Student',
    role: 'student' as const,
    password: process.env.SEED_STUDENT_PASSWORD,
  },
  {
    email: 'teacher@helpinghand.test',
    name: 'Sample Teacher',
    role: 'teacher' as const,
    password: process.env.SEED_TEACHER_PASSWORD,
  },
];

for (const account of accounts) {
  if (!account.password) {
    console.error(`Missing password for ${account.email}. Set it in .env and run again.`);
    process.exit(1);
  }
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, account.email));
  if (existing) {
    console.log(`skip ${account.email}`);
    continue;
  }
  await db.insert(users).values({
    id: crypto.randomUUID(),
    email: account.email,
    name: account.name,
    passwordHash: await bcrypt.hash(account.password, 12),
    role: account.role,
    createdAt: new Date(),
  });
  console.log(`created ${account.email}`);
}
