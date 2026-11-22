// Fails if any inline <script> in the hand-edited homepage does not parse.
// index.html has no build step of its own, so this is its only safety net before deploy.
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (!scripts.length) throw new Error('index.html has no inline script: the hand animation is missing.');
for (const [, source] of scripts) new Function(source);
console.log(`index.html: ${scripts.length} inline scripts parse.`);
