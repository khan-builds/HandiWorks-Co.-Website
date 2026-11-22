/** The hand's shape and motion tables, as a script any inner page can load: /hand-data.js.

    There is one copy of that data in the repo: the two lines between the HAND-DATA comments in
    the homepage (index.html), written there by scripts/hand_motion.py. This file reads them at
    build time and hands them on unchanged, so a page that draws the hand always draws the same
    hand as the homepage, and a new export from the CAD reaches both at once. */
import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const GET: APIRoute = async () => {
  // `npm run build` and `npm run dev` both start in the repo root, where index.html is.
  const html = await readFile(join(process.cwd(), 'index.html'), 'utf8');
  const from = html.indexOf('/* HAND-DATA');
  const to = html.indexOf('/* END HAND-DATA */');
  if (from < 0 || to < from) throw new Error('index.html has no HAND-DATA block');
  const lines = html.slice(from, to).split('\n');
  const info = lines.find((line) => line.startsWith('const HAND_INFO='));
  const mesh = lines.find((line) => line.startsWith('const HAND_MESH='));
  if (!info || !mesh) throw new Error('The HAND-DATA block in index.html is missing HAND_INFO or HAND_MESH');
  return new Response(`export ${info}\nexport ${mesh}\n`, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
};
