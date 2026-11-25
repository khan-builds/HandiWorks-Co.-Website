// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { copyFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// GitHub Pages serves this repo under /<repo-name>/.
// Set BASE_PATH=/ at build time if the site ever moves to a custom domain.
const base = process.env.BASE_PATH ?? '/HandiWorks-Co.-Website';

// The homepage is the hand-edited index.html at the repo root, not an Astro page.
// This integration puts it at the site root in the build and serves it in `npm run dev`.
const homepageFile = fileURLToPath(new URL('./index.html', import.meta.url));

/** @returns {import('astro').AstroIntegration} */
function homepage() {
  return {
    name: 'helpinghand-homepage',
    hooks: {
      'astro:server:setup': ({ server }) => {
        // Depending on middleware order the base path may already be stripped from req.url.
        const prefix = base.replace(/\/+$/, '');
        const homepagePaths = new Set(['/', '/index.html', prefix + '/', prefix + '/index.html']);
        server.middlewares.use(async (req, res, next) => {
          const path = (req.url ?? '').split(/[?#]/)[0];
          if (!homepagePaths.has(path)) return next();
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(await readFile(homepageFile));
        });
      },
      'astro:build:done': async ({ dir }) => {
        await copyFile(homepageFile, new URL('index.html', dir));
      },
    },
  };
}

export default defineConfig({
  site: 'https://khan-builds.github.io',
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), homepage()],
  // Lesson code is coloured from CSS variables, set in src/styles/global.css from the theme
  // and the hand's own colours ("Code colours"), so no colour comes from a stock editor theme.
  markdown: { shikiConfig: { theme: 'css-variables' } },
  vite: { plugins: [tailwindcss()] },
});
