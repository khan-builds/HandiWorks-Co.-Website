import type { APIRoute } from 'astro';
import { SESSION_COOKIE, deleteSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return redirect('/login?loggedOut=1', 303);
};
