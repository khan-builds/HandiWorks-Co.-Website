# HandiWorks-Co.-Website

HelpingHand by HandiWorks Co.

## Website preview

[Open preview workflow](https://github.com/khan-builds/HandiWorks-Co.-Website/actions/workflows/preview.yml)

The Website preview workflow packages `index.html` on every change to the demo. Download the `helpinghand-preview` artifact from a completed run and open its index.html locally.

For a hosted browser preview:
1. Open repository **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Open **Actions → Website preview → Run workflow**.
4. After deployment succeeds, open the URL shown in the `github-pages` environment.

Private repositories require a GitHub plan that supports Pages. Pages normally publishes the demo publicly even when the source repository is private. Repository visibility is not changed by this workflow. Only the standalone demo is deployed; Astro source, credentials, and backend files are excluded.

## Application source

The `app/` directory contains the Astro source; see `app/README.md` for setup and remaining work. The Astro build and real account deployment are not yet verified. The standalone demo uses simulated roles only.
