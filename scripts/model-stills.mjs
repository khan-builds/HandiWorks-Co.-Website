// Stills of the 3D models, for the page headers that show the hand without a viewer.
//
//   npm run build
//   node scripts/model-stills.mjs
//
// Renders public/models/*.glb with the site's own model-viewer bundle in headless Chrome and
// writes transparent PNGs to screenshots/model-stills/ (git ignores that folder). They are
// then cropped, scaled and saved as WebP into public/images/ by hand or with any image tool:
//   hand-final-v3.webp    560 px wide   the header of For teachers
//   finger-final-v3.webp  1040 px wide  the header of Lessons
// Run it again whenever scripts/step_to_glb.py writes new models, and rename the files with
// the CAD version. To try another angle, pass jobs of your own:
//   node scripts/model-stills.mjs 'name=model.glb@turn tilt distance@WIDTHxHEIGHT'
// Needs Chrome or Chromium on the PATH as google-chrome.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdtemp, rm, readdir, mkdir } from 'node:fs/promises';
import { spawn, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';

import { fileURLToPath } from 'node:url';
const repo = fileURLToPath(new URL('..', import.meta.url));
const outDir = join(repo, 'screenshots', 'model-stills');
const given = process.argv.slice(2);
const jobs = given.length ? given : [
  'hand=hand-final-v3.glb@35deg 62deg 105%@1000x1000',
  'finger=finger-final-v3.glb@150deg 72deg 105%@1400x700',
];
const dist = join(repo, 'dist');
const BASE = '/HandiWorks-Co.-Website';
const bundle = (await readdir(join(dist, '_astro'))).find((f) => f.startsWith('ModelViewer') && f.endsWith('.js'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.glb': 'model/gltf-binary', '.woff2': 'font/woff2' };
const page = (src, orbit, w, h, fov) => `<!doctype html><html><body style="margin:0;background:transparent">
<script type="module" src="${BASE}/_astro/${bundle}"></script>
<model-viewer id="mv" src="${BASE}/models/${src}" camera-orbit="${orbit}" field-of-view="${fov}" exposure="1.05" shadow-intensity="0" interaction-prompt="none"
 style="width:${w}px;height:${h}px;background:transparent;--poster-color:transparent"></model-viewer></body></html>`;
let current = '';
const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split(/[?#]/)[0]);
  if (url === '/still.html') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(current); }
  if (!url.startsWith(BASE + '/')) return res.writeHead(404).end();
  const file = normalize(join(dist, url.slice(BASE.length)));
  try { const body = await readFile(file); res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404).end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const chrome = execFileSync('which', ['google-chrome'], { encoding: 'utf8' }).trim();
const profile = await mkdtemp(join(tmpdir(), 'hh-stills-'));
const child = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--password-store=basic', '--no-first-run',
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((resolve, reject) => { let log = ''; const t = setTimeout(() => reject(new Error('no chrome')), 40000);
  child.stderr.on('data', (c) => { log += c; const m = log.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); resolve(m[1]); } }); });
const ws = new WebSocket(wsUrl); await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } });
const send = (method, params = {}, sessionId) => { const i = ++id; ws.send(JSON.stringify({ id: i, method, params, sessionId })); return new Promise((resolve, reject) => pending.set(i, { resolve, reject })); };
await mkdir(outDir, { recursive: true });
try {
  for (const job of jobs) {
    const [name, rest] = job.split('=');
    const [src, orbit, size, fov = '30deg'] = rest.split('@');
    const [w, h] = size.split('x').map(Number);
    current = page(src, orbit, w, h, fov);
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const call = (m, p) => send(m, p, sessionId);
    await call('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: false });
    await call('Page.enable');
    await call('Page.navigate', { url: origin + '/still.html' });
    const expr = `(async () => { const mv = document.getElementById('mv'); await customElements.whenDefined('model-viewer');
      if (!mv.loaded) await new Promise((r) => mv.addEventListener('load', r, { once: true }));
      mv.jumpCameraToGoal(); await new Promise((r) => setTimeout(r, 1500)); return mv.toDataURL('image/png'); })()`;
    let data;
    for (let tries = 0; tries < 20 && !data; tries++) {
      await new Promise((r) => setTimeout(r, 500));
      try { const out = await call('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); data = out.result?.value; } catch {}
    }
    if (!data || !data.startsWith('data:image/png')) throw new Error('no image for ' + name);
    await writeFile(join(outDir, name + '.png'), Buffer.from(data.split(',')[1], 'base64'));
    console.log('wrote', name);
    await send('Target.closeTarget', { targetId });
  }
} finally { ws.close(); child.kill(); server.close(); await new Promise((r) => setTimeout(r, 400)); await rm(profile, { recursive: true, force: true }).catch(() => {}); }
