import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, validateSession } from './lib/auth';

const PROTECTED = ['/lessons'];

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  context.locals.user = token ? await validateSession(token) : null;
  if (token && !context.locals.user) context.cookies.delete(SESSION_COOKIE, { path: '/' });

  const path = context.url.pathname;
  const needsLogin = PROTECTED.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
  if (needsLogin && !context.locals.user) {
    return context.redirect(`/login?next=${encodeURIComponent(path)}`);
  }
  if (path === '/login' && context.locals.user) return context.redirect('/lessons');

  const response = await next();
  if (context.locals.user) response.headers.set('Cache-Control', 'private, no-store');
  return response;
});
