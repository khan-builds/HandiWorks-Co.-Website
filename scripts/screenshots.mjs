// Review screenshots of the built site at laptop and phone width.
//
//   npm run build
//   npm run shots -- <label> [route ...] [--steps] [--role teacher|student]
//
//   npm run shots -- rehearsal              the whole demo path
//   npm run shots -- team /team/            one page
//   npm run shots -- notes /lessons/beginner/01-finger-module/ --role teacher
//                                           a lesson as a teacher sees it
//
// Writes to screenshots/<label>/, which git ignores: download the folder to look at it.
//
//   <page>-1440.png, <page>-390.png         the full page, top to bottom. A page taller than
//                                           6000 px is cut into <page>-390-a.png, -b.png, ...
//                                           (Chrome cannot paint more than about 8000 px).
//   home-1440-01.png, -02.png, ...          the homepage, one frame per screen of scrolling,
//                                           because its hand moves with the scroll.
//                                           --steps does the same for any other page.
//
// A dashboard only opens for someone with a demo role, so /dashboard/teacher/ and
// /dashboard/student/ are opened with that role set; every other page has none unless --role
// is given. Full-page shots are taken with reduced motion, so nothing is caught half drawn.
//
// It also prints, per page, script errors and anything loaded from another site.
// Needs Chrome or Chromium (set CHROME to its path if it is not found).

import { createServer } from 'node:http';
import { readFile, mkdir, mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const BASE = (process.env.BASE_PATH ?? '/HandiWorks-Co.-Website').replace(/\/+$/, '');

// The judge's click path, in order.
const DEMO_PATH = [
  '/',
  '/problem/',
  '/kit/',
  '/lessons/beginner/',
  '/lessons/beginner/01-finger-module/',
  '/lessons/beginner/01-finger-module/cad/',
  '/lessons/beginner/01-finger-module/hardware/',
  '/lessons/beginner/01-finger-module/software/',
  '/teachers/',
  '/signin/',
  '/dashboard/teacher/',
  '/dashboard/student/',
  '/dashboard/student/test-your-code/',
  '/dashboard/student/simulator/',
  '/team/',
];

const SIZES = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 },
];
const SLICE_HEIGHT = 6000; // Chrome wraps an image taller than about 8000 px back to the top.
const MAX_FRAMES = 16;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.webm': 'video/webm',
  '.glb': 'model/gltf-binary', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const slug = (route) => (route.replace(/^\/|\/$/g, '') || 'home').replace(/[\/#?=&]+/g, '_');

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    try {
      return execFileSync('which', [name], { encoding: 'utf8' }).trim();
    } catch {}
  }
  throw new Error('Chrome not found. Install it or set CHROME=/path/to/chrome.');
}

// Serve dist/ under the same base path GitHub Pages uses, so links behave as they do live.
function serve() {
  const server = createServer(async (req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split(/[?#]/)[0]);
    if (!url.startsWith(BASE + '/')) return res.writeHead(404).end('outside base path');
    let file = normalize(join(dist, url.slice(BASE.length)));
    if (!file.startsWith(dist)) return res.writeHead(403).end();
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function launchChrome() {
  const profile = await mkdtemp(join(tmpdir(), 'helpinghand-shots-'));
  const child = spawn(findChrome(), [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    // Without this Chrome waits 25 s on the desktop keyring at launch.
    '--password-store=basic',
    '--no-first-run', '--hide-scrollbars', '--mute-audio',
    // Software WebGL, so the homepage hand renders on a machine with no display.
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  const wsUrl = await new Promise((resolve, reject) => {
    let log = '';
    const timer = setTimeout(() => reject(new Error('Chrome did not start within 40 s')), 40_000);
    child.stderr.on('data', (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    child.on('exit', () => reject(new Error('Chrome exited before it was ready')));
  });
  return { child, profile, wsUrl };
}

// Minimal Chrome DevTools Protocol client over Node's built-in WebSocket.
class Browser {
  #ws;
  #nextId = 0;
  #pending = new Map();
  #listeners = new Set();

  static async connect(wsUrl) {
    const browser = new Browser();
    browser.#ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      browser.#ws.addEventListener('open', resolve, { once: true });
      browser.#ws.addEventListener('error', () => reject(new Error('Cannot reach Chrome')), { once: true });
    });
    browser.#ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const waiting = browser.#pending.get(message.id);
        browser.#pending.delete(message.id);
        if (message.error) waiting.reject(new Error(message.error.message));
        else waiting.resolve(message.result);
      } else {
        for (const listener of browser.#listeners) listener(message);
      }
    });
    return browser;
  }

  send(method, params = {}, sessionId) {
    const id = ++this.#nextId;
    this.#ws.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((resolve, reject) => this.#pending.set(id, { resolve, reject }));
  }

  on(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  once(method, sessionId, timeoutMs = 30_000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        off();
        reject(new Error(`timed out waiting for ${method}`));
      }, timeoutMs);
      const off = this.on((message) => {
        if (message.method !== method || message.sessionId !== sessionId) return;
        clearTimeout(timer);
        off();
        resolve(message.params);
      });
    });
  }

  close() {
    this.#ws.close();
  }
}

async function shoot(browser, origin, route, size, outDir, stepped, role) {
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  const call = (method, params) => browser.send(method, params, sessionId);
  const evaluate = async (expression) =>
    (await call('Runtime.evaluate', { expression, returnByValue: true })).result.value;

  const problems = new Set();
  const off = browser.on((message) => {
    if (message.sessionId !== sessionId) return;
    if (message.method === 'Runtime.exceptionThrown') {
      const details = message.params.exceptionDetails;
      problems.add(`script error: ${details.exception?.description?.split('\n')[0] ?? details.text}`);
    }
    if (message.method === 'Network.requestWillBeSent') {
      const url = message.params.request.url;
      if (/^https?:/.test(url) && !url.startsWith(origin.split(BASE)[0])) {
        problems.add(`loads from another site: ${new URL(url).host}`);
      }
    }
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) {
      problems.add(`HTTP ${message.params.response.status}: ${message.params.response.url}`);
    }
  });

  await call('Page.enable');
  await call('Runtime.enable');
  await call('Network.enable');
  await call('Emulation.setDeviceMetricsOverride', {
    width: size.width, height: size.height, deviceScaleFactor: 1, mobile: size.width < 600,
  });
  if (!stepped) {
    await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  }
  // The demo role lives in localStorage (key hh-role). Set it, or clear it, before the page runs.
  const pageRole = role ?? route.match(/^\/dashboard\/(teacher|student)\//)?.[1] ?? null;
  await call('Page.addScriptToEvaluateOnNewDocument', {
    source: pageRole
      ? `try { localStorage.setItem('hh-role', ${JSON.stringify(pageRole)}); } catch {}`
      : `try { localStorage.removeItem('hh-role'); } catch {}`,
  });
  const loaded = browser.once('Page.loadEventFired', sessionId);
  await call('Page.navigate', { url: origin + route });
  await loaded;
  // The homepage plays a five-second intro before it settles.
  await sleep(route === '/' ? 6000 : 1200);

  const pageHeight = await evaluate('document.documentElement.scrollHeight');
  const files = [];
  const save = async (name, params) => {
    const { data } = await call('Page.captureScreenshot', { format: 'png', ...params });
    await writeFile(join(outDir, name), Buffer.from(data, 'base64'));
    files.push(name);
  };

  if (stepped) {
    const last = Math.max(0, pageHeight - size.height);
    const count = Math.min(MAX_FRAMES, Math.ceil(last / size.height) + 1);
    for (let i = 0; i < count; i++) {
      const y = count === 1 ? 0 : Math.round((last * i) / (count - 1));
      await evaluate(`window.scrollTo(0, ${y})`);
      await sleep(700);
      await save(`${slug(route)}-${size.name}-${String(i + 1).padStart(2, '0')}.png`, {});
    }
  } else {
    // Scroll through once so anything that appears on scroll has appeared, then capture.
    for (let y = 0; y < pageHeight; y += Math.round(size.height * 0.8)) {
      await evaluate(`window.scrollTo(0, ${y})`);
      await sleep(260);
    }
    await evaluate('window.scrollTo(0, 0)');
    await sleep(1400);
    const height = await evaluate('document.documentElement.scrollHeight');
    const slices = Math.ceil(height / SLICE_HEIGHT);
    for (let i = 0; i < slices; i++) {
      const top = i * SLICE_HEIGHT;
      const part = slices === 1 ? '' : `-${String.fromCharCode(97 + i)}`;
      await save(`${slug(route)}-${size.name}${part}.png`, {
        captureBeyondViewport: true,
        clip: { x: 0, y: top, width: size.width, height: Math.min(SLICE_HEIGHT, height - top), scale: 1 },
      });
    }
  }

  off();
  await browser.send('Target.closeTarget', { targetId });
  return { files, problems: [...problems] };
}

const args = process.argv.slice(2);
const steps = args.includes('--steps');
const roleAt = args.indexOf('--role');
const role = roleAt === -1 ? null : args[roleAt + 1];
if (roleAt !== -1 && role !== 'teacher' && role !== 'student') {
  console.error('--role takes "teacher" or "student".');
  process.exit(1);
}
const [label = 'review', ...routes] = args.filter((arg, i) => arg !== '--steps' && i !== roleAt && (roleAt === -1 || i !== roleAt + 1));

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/ is missing. Run `npm run build` first.');
  process.exit(1);
}

const outDir = join(root, 'screenshots', label);
await mkdir(outDir, { recursive: true });
const server = await serve();
const origin = `http://127.0.0.1:${server.address().port}${BASE}`;
const chrome = await launchChrome();
const browser = await Browser.connect(chrome.wsUrl);
let failed = 0;

try {
  for (const route of routes.length ? routes : DEMO_PATH) {
    const status = (await fetch(origin + route)).status;
    if (status !== 200) {
      console.error(`MISSING  ${route}  (HTTP ${status})`);
      failed++;
      continue;
    }
    for (const size of SIZES) {
      const { files, problems } = await shoot(browser, origin, route, size, outDir, steps || route === '/', role);
      const shown = files.length > 1 ? `${files[0]} to ${files.at(-1)}` : files[0];
      console.log(`ok       ${route}  ->  screenshots/${label}/${shown}`);
      for (const problem of problems) console.log(`         ! ${problem}`);
    }
  }
} finally {
  browser.close();
  chrome.child.kill();
  server.close();
  await rm(chrome.profile, { recursive: true, force: true }).catch(() => {});
}

if (failed) {
  console.error(`${failed} route(s) missing from the build.`);
  process.exit(1);
}
