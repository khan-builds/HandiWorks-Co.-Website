# HelpingHand by HandiWorks Co.

**Putting Robotics Within Every Student's Grasp**

HelpingHand is a modular robotic hand that students CAD, wire, and program themselves.
Paired with an interactive education interface, students learn mechanics, circuits, and
coding concepts one lesson at a time without following a finished kit. It is for learners
aged 11 and up.

This repository is the HelpingHand website: the product, the lessons, and a demo of how a
teacher and a student would use them.

**Live site:** https://khan-builds.github.io/HandiWorks-Co.-Website/

## Team

| Name | Role |
|---|---|
| Billy Jin | Programming Lead |
| Golam Khan | Design Lead |
| Clarence Li | Circuitry Lead |
| Lingbo Zhang | Project Manager |

Founded at NYU Tandon, 2026, as a Semester-Long Design Project.

## What the site is today

A static demo. There are no accounts, no database and no server.

- **Sign in** is a page with two buttons, "Explore as a teacher" and "Explore as a student".
  They set a role in the browser and nothing else.
- **Dashboards** show a fictional class with made-up students.
- Anything not finished is labelled on the page as a draft, demo data, or coming soon.

Real accounts, classrooms and progress tracking are planned. Nothing of them is built.

## Pages that still need review and updating

As of 2026-11-21. A page not listed here has no known work waiting.

| Page | What it still needs |
|---|---|
| Home | The 3D hand is drawn from an older CAD. New motor housings are coming, and the hand will be exported again from them. The scroll animation is to be looked at again after that. |
| The Kit | The hand and finger models, and the specs beside them, are out of date for the same reason. The circuit diagram is an empty labelled box until the image arrives. |
| Lessons | Lessons 2 to 4 have no final titles or summaries. |
| Lesson 1 (overview, CAD, Hardware, Software) | Incomplete. Every page of it says "Draft · under team review". The wiring pictures are placeholders and there is no slides link. |
| Student dashboard, "Test your code" | A demo. It drives the hand from the browser over USB and shows the same hand on screen. It has never been tried on the real hand, and its Arduino sketch (`public/downloads/helpinghand_bench.ino`) has never been compiled. |
| Student dashboard, "Simulator" | A demo: six guided steps for Lesson 1, from a see-saw to the finger of the hand. Its wording and its questions have not been reviewed. |
| Roadmap | Empty on purpose. The roadmap has not been written. |
| Team | Photos and bios are missing; the page shows initials. |
| Every page | The logo is traced by hand from the team poster until the real file arrives. |

The full list, with who owes what, is in `docs/README.md` under "To do".

## What is in this repository

| Path | What |
|---|---|
| `index.html` | The homepage with the scroll-driven 3D hand. One hand-edited file; it has no build step of its own. The hand's shape and motion inside it are written by `scripts/hand_motion.py`. |
| `src/pages/` | Every other page: The Problem, The Kit, Lessons, Sign in, the two dashboards, "Test your code", the Simulator, Roadmap, Team. |
| `src/content/lessons/` | Lesson text. One folder per lesson, with a CAD, a hardware and a software part. |
| `src/data/` | `evidence.ts`: every figure on The Problem page with its source. `mock.ts`: the fictional class for the dashboards. |
| `src/components/`, `src/layouts/`, `src/styles/` | Shared nav, footer, page shell and styles for the inner pages. |
| `src/scripts/` | What the two student pages run in the browser: `bench/` talks to the hand's Arduino for "Test your code", `sim/` is the simulator's six steps, `hand/view.ts` draws the hand for both. |
| `src/pages/hand-data.js.ts` | Hands the homepage's hand data to the inner pages as `/hand-data.js`. |
| `public/` | Files served as they are: 3D models, fonts, and downloads (Lesson 1's sketch, and `helpinghand_bench.ino` for "Test your code"). |
| `scripts/` | `check-homepage.mjs` checks the homepage's scripts before a build. `screenshots.mjs` takes review screenshots. `hand_motion.py` exports the homepage's moving hand from the CAD: its parts and how each one moves. `step_to_glb.py` exports the still hand and finger models on The Kit page from the CAD. `stl_to_glb.py` converts Lesson 1's step models from the `version-1` branch. |
| `docs/README.md` | One file: where the site stands, the to-do list, the log of design changes, the theme (colours, type, building blocks, the wording from the team poster), and the plan with its prompts. |
| `.github/workflows/deploy.yml` | Builds and publishes the site on every push to `main`. |

## Run it

Needs Node 22.23 or newer.

```bash
npm install
npm run dev       # http://localhost:4321/HandiWorks-Co.-Website/
npm run build     # checks the homepage, then builds everything into dist/
npm run preview   # serves dist/ the way the live site is served
npm run check     # type check
```

The site lives under `/HandiWorks-Co.-Website/` because that is its GitHub Pages path.

Review screenshots, at laptop and phone width, of the built site:

```bash
npm run build
npm run shots -- my-label            # the whole demo path
npm run shots -- my-label /team/     # one page
npm run shots -- my-label /lessons/beginner/01-finger-module/ --role teacher   # as a teacher sees it
```

They land in `screenshots/my-label/`, which git ignores.

## Editing the homepage

Edit `index.html` directly. The build copies it to the root of the site unchanged.

- Link to other pages and files with relative paths: `lessons/`, `team/`,
  `fonts/inter-latin-opsz-normal.woff2`. They then work on the live site and locally.
- The hand model and the animation code are inside the file. `npm run build` stops if one of
  its scripts no longer parses.
- The hand's model and its joint tables sit between two `HAND-DATA` comments. They come from
  the CAD: do not edit them, run `scripts/hand_motion.py` (`docs/README.md`, "The hand on
  the homepage"). The scroll scenes, their timing, the camera and the colours are ordinary
  code around that block and can be edited as before.

## Adding or changing a lesson

1. Copy an existing folder under `src/content/lessons/beginner/`, for example
   `05-your-lesson/`, and edit the frontmatter in `index.mdx`.
2. Add `cad.mdx`, `hardware.mdx` and `software.mdx` next to it when they are ready. A lesson
   without them shows as "coming soon".

## Publishing

Pushing to `main` runs `.github/workflows/deploy.yml`. It builds the site and publishes it to
GitHub Pages. Each run also keeps a downloadable copy of the built site, `helpinghand-site`,
for 14 days.

## Branches

| Branch | What |
|---|---|
| `main` | The live site. |
| `version-1` | Billy's learning app with real login and a database. It needs a server, so it is not what is published. It holds the full Lesson 1: steps, 3D models for each step, wiring, and the Arduino sketch. |
| `a/project-setup`, `a/db-schema`, `a/auth-and-lessons`, `a/wire-frontend` | Earlier stages of `version-1`. |
| `nov15-hand-model` | An earlier version of the homepage hand. `main` has moved past it. |

Two things that used to be on `main` left it when this site was merged on 2026-11-21 and
remain in the history (last present at commit `5fb3427`): `app/`, an early draft of the
learning app, and `version-1/`, an earlier dark homepage.
