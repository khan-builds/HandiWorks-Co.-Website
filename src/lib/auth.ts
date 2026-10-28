import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { sessions, users } from './schema';

export const SESSION_COOKIE = 'hh_session';
const DAY = 24 * 60 * 60 * 1000;
const SESSION_LENGTH = 30 * DAY;
// Generated with bcrypt.hash('unused', 12). Not a real password.
const DUMMY_HASH = '$2b$12$1LjyZujDlr79md8l8Tu7JepRk87I/L6WLv0lcrveT4EXqtwvOJs.2';

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax' as const,
    path: '/',
    expires: expiresAt,
  };
}

/** Same-site path only. Rejects protocol-relative and encoded bypasses. */
export function safeNext(next: string | undefined): string | null {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return null;
  try {
    const decoded = decodeURIComponent(next);
    if (
      !decoded.startsWith('/') ||
      decoded.startsWith('//') ||
      decoded.startsWith('/\\') ||
      decoded.includes('://')
    ) {
      return null;
    }
  } catch {
    return null;
  }
  return next;
}

export async function verifyLogin(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
  // Always run compare so a wrong email takes as long as a wrong password.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  return user && ok ? user : null;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_LENGTH);
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });
  return { token, expiresAt };
}

export async function validateSession(token: string): Promise<SessionUser | null> {
  const id = hashToken(token);
  const [row] = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, id));
  if (!row) return null;
  if (row.session.expiresAt.getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return null;
  }
  // Slide the expiry forward when less than 15 days remain.
  if (row.session.expiresAt.getTime() - Date.now() < 15 * DAY) {
    await db
      .update(sessions)
      .set({ expiresAt: new Date(Date.now() + SESSION_LENGTH) })
      .where(eq(sessions.id, id));
  }
  const { id: uid, name, email, role } = row.user;
  return { id: uid, name, email, role };
}

export async function deleteSession(token: string) {
  await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
}
