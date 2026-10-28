import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import {
  SESSION_COOKIE,
  createSession,
  safeNext,
  sessionCookieOptions,
  verifyLogin,
} from '../../../lib/auth';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

type Failure = { count: number; firstAt: number };
const failures = new Map<string, Failure>();

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
  next: z.string().optional(),
});

function failureKey(ip: string, email: string) {
  return `${ip}\n${email}`;
}

function isLimited(key: string) {
  const row = failures.get(key);
  if (!row) return false;
  if (Date.now() - row.firstAt > WINDOW_MS) {
    failures.delete(key);
    return false;
  }
  return row.count >= MAX_FAILURES;
}

function recordFailure(key: string) {
  const now = Date.now();
  const row = failures.get(key);
  if (!row || now - row.firstAt > WINDOW_MS) {
    failures.set(key, { count: 1, firstAt: now });
    return;
  }
  row.count += 1;
}

function loginRedirect(error: 'invalid' | 'rate', next: string | null) {
  const params = new URLSearchParams({ error });
  if (next) params.set('next', next);
  return `/login?${params.toString()}`;
}

export const POST: APIRoute = async ({ request, cookies, redirect, clientAddress }) => {
  const form = await request.formData();
  const nextField = form.get('next');
  const rawNext = typeof nextField === 'string' && nextField.length > 0 ? nextField : undefined;
  const parsed = LoginSchema.safeParse({
    email: form.get('email'),
    password: form.get('password'),
    next: rawNext,
  });
  const next = safeNext(rawNext);

  if (!parsed.success) {
    return redirect(loginRedirect('invalid', next), 303);
  }

  const email = parsed.data.email.toLowerCase();
  const key = failureKey(clientAddress, email);
  if (isLimited(key)) return redirect(loginRedirect('rate', next), 303);

  const user = await verifyLogin(email, parsed.data.password);
  if (!user) {
    recordFailure(key);
    return redirect(loginRedirect('invalid', next), 303);
  }

  failures.delete(key);
  const { token, expiresAt } = await createSession(user.id);
  cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
  return redirect(next ?? '/lessons', 303);
};
