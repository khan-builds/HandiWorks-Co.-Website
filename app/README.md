# HelpingHand learning site

Implementation based on the October 28 design guide. The original single-file demo remains in ../dist.

## Run
1. Install Node 22+ and run `npm install`.
2. Copy `.env.example` to `.env`. Set DATABASE_URL=file:local.db and two private passwords (12+ characters).
3. Load the environment when applying the schema: `node --env-file=.env node_modules/drizzle-kit/bin.cjs push`.
4. Run `npm run seed`, then `npm run dev`.
5. Run `npm run build` before deployment. Configure the Netlify base directory to this app directory and provide the Turso URL/token in production.

Accounts: student@helpinghand.test and teacher@helpinghand.test. Passwords are supplied through environment variables, never hardcoded.

## Verification status
Dependencies could not be installed because registry.npmjs.org could not resolve in the execution environment. This source has NOT passed an Astro build, browser QA, role-isolation integration tests, or Lighthouse. Dependency version ranges are a compatible starting baseline, not a verified latest-version claim.

## Remaining assets and work
Real STL/STEP files, assembly photos, final motor/driver specs, wiring diagrams, validated Arduino sketch, and Tinkercad/Wokwi/Google Forms URLs are required. The lesson clearly marks these pending items. The included STL is an illustrative block only. Complete component parity (embeds, downloadable bundles, code-copy UI, active TOC highlighting), accessibility and performance checks, and end-to-end security testing before classroom release. Production deployment requires Netlify and Turso account configuration.
