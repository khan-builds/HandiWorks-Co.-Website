import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ locals }) => {
  return Response.json({ user: locals.user }, { status: locals.user ? 200 : 401 });
};
