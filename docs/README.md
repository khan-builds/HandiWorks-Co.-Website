# HelpingHand site: plan, design and to do

One file for the whole site: where it stands, what is left to do, what changed in the design,
the theme, and the plan with its prompts. Agreed 2026-11-17 between Lingbo and Claude. On
2026-11-18 the build plan and the theme, until then two files, were combined here, `main` was
pulled, the look was brought closer to the poster, and the work was first pushed to GitHub,
as branch `LZ-C5.2`.

| Date | What |
|---|---|
| Sun 2026-11-22 | Site freeze. Copy fixes only after this. |
| Tue 2026-12-01 | Presentation to faculty judges. |

| Section | What it holds |
|---|---|
| [Where things stand](#where-things-stand) | What is on GitHub, and what is on the build machine, page by page. |
| [To do](#to-do) | Every open item, with who owes it. |
| [Design changes](#design-changes) | A dated log of what changed, and the choices made without asking. |
| [Theme](#theme) | Colours, type, building blocks, motion, and the wording from the team poster. |
| [The plan](#the-plan) | What the site has to do, the decisions, the rules, and the prompts still in use. |
| [Prompts already run](#prompts-already-run) | Prompts 1 to 7, kept for the record. |

## Where things stand

Checked against GitHub on 2026-11-18 at 06:50 Pacific.

**The new site is on GitHub as branch `LZ-C5.2`. It is not on `main`.** The live site still
shows the old one-page homepage, now with Clarence's finger simulator beside it.

### On GitHub

`main` is at `d06ded1`, "Merge pull request #5", merged by Clarence on 2026-11-18. Its deploy
run is what the live site shows: <https://khan-builds.github.io/HandiWorks-Co.-Website/>.

Two teammates changed `main` that morning:

- **Golam** pushed three commits to the hand on the homepage. Together they change three
  lines of the hand's script: the fingers and the thumb now curl the other way, toward the
  palm, and the message shown when the 3D hand cannot start is plainer. **These are in this
  branch.**
- **Clarence** then merged pull request 5: a finger simulator for Lesson 1 that runs with no
  kit. It is a static page at `lessons/finger-module/` with one script and one stylesheet,
  and the old homepage's Lessons buttons point at it. **This is not in this branch.** Lingbo
  chose on 2026-11-18 to push the version from before it. It is in [To do](#to-do).

Both are still working, so fetch again before a merge.

What the live site is:

- One page: Golam's homepage, a dark stage with the scroll-driven hand. An older preview
  sits at `/version-1/`.
- "Lessons", "Start learning" and "Enter learning lab" open Clarence's finger simulator at
  `lessons/finger-module/`, a page in its own look.
- There is no Problem, Kit, Lessons list, Sign in, Roadmap or Team page.

Other branches on GitHub:

| Branch | Last change | What it is | What happens to it |
|---|---|---|---|
| `version-1` | Billy, 2026-11-06 | His Lesson 1 and its five step models. | Keep it. `scripts/stl_to_glb.py` reads the step models from it. |
| `nov15-hand-model` | Golam, 2026-11-15 | An earlier take on the Nov 15 homepage update, made a few minutes before the one on `main`. Not merged. | Golam's call. It is in [To do](#to-do). |
| `LZ-C5.2` | Lingbo, 2026-11-18 | This branch: the whole new site, on top of `main` as it stood at `7b2cf6d`, the commit before Clarence's simulator. | Merge into `main` when the team agrees. The steps are in [To do](#to-do). |
| `feature/interactive-finger-module` | Clarence, 2026-11-18 | The finger simulator, merged into `main` as pull request 5. | It is in `main` and not in this branch. It is in [To do](#to-do). |
| `a/project-setup`, `a/db-schema`, `a/auth-and-lessons`, `a/wire-frontend` | Billy, 2026-10-28 | A server app with real login, as pull requests 1 to 4. All four are still open. | Set aside by the static-mock decision. Billy's call. It is in [To do](#to-do). |

### On the build machine

Branch `LZ-C5.2`, in `~/workspace/SLDP Website`. It was called `site-buildout` until Lingbo
named it on 2026-11-18, when it was first committed and pushed. It sits on `7b2cf6d`, Golam's
last commit of that morning, with his changes to the hand merged into the rebuilt homepage.
It is two commits behind `main`: Clarence's simulator is not in it. Prompts 1 to 9 were run
on 2026-11-17, and the look was brought closer to the poster on 2026-11-18 (see
[Design changes](#design-changes)).

| Page | State | Still open |
|---|---|---|
| Home | Golam's scroll-driven hand with his curl changes of 2026-11-18, in the poster theme, with the shared nav and footer. Every button leads to a real page. | The stage is light. A navy stage is the option not taken. |
| The Problem | Poster's goal and objectives, the 18% / 42% figure checked against the Gallup report, 15 more sourced figures. | The "250,000 students" and "$500 kit" figures are left off: no source says them. |
| The Kit | Hand v10 and finger v4 from the CAD, specs from the CAD notes, the poster's testing table. | Circuit diagram is a labelled placeholder until the image arrives. |
| Lessons | Lesson 1 live. Lessons 2 to 4 and the Intermediate track are coming-soon rows. | Titles for lessons 3 and 4. |
| Lesson 1 | Billy's lesson from `version-1`: five CAD steps with their models, wiring, the sketch and its download, questions, teacher notes. Every page says "Draft · under team review". | Team review (prompt 11). Wiring diagram is a labelled placeholder. No slides link. Clarence's simulator is not in it. |
| Sign in, dashboards | Two roles, a made-up class of 20, "Demo data" on both dashboards, Assign visibly switched off. | Nothing. |
| Roadmap | Four phases as the poster's timeline, and a table of what is live, draft, demo or coming soon. | Nothing. |
| Team | Names and roles from the poster, initials for photos, the one line about NYU Tandon. | Bios and photos. |
| Every page | The HandiWorks mark in the nav, the footer and the browser tab, traced from the poster. | The real logo file. |

`npm run build` passed on 2026-11-18: the homepage and 23 pages built by Astro, one of them
a redirect and one a 404 page.

Checked on 2026-11-18, after the poster pass, on the built site in headless Chrome: every
link and file the pages ask for exists; nothing is loaded from another site; no page scrolls
sideways at 360, 390, 768, 960, 1000, 1024, 1100 or 1280 px wide, signed out or in either
role; no script errors on any page. What was not checked is in [To do](#not-checked-yet).

Screenshots, in `screenshots/` on the build machine (the folder is not in git):

| Folder | What |
|---|---|
| `rehearsal/` | Every page of the demo path, and the style guide, at 1440 and 390 px wide. 55 images. |
| `rehearsal-models/` | The Kit and the CAD page frame by frame, so the 3D models show. |
| `rehearsal-teacher/` | Lesson 1 as a teacher sees it, with the teacher notes. |
| `offline-copy/` | The demo path taken from the unzipped offline copy. |
| `poster-before/` | Five pages as they stood before the poster pass of 2026-11-18. |
| `baseline/` | The site before the rebuild of 2026-11-17: what GitHub shows. |

All but the last two were taken again on 2026-11-18.

The offline copy from prompt 8 is `~/workspace/HelpingHand-site-offline-2026-11-18.zip` on
the build machine (6.6 MB), with `HOW-TO-OPEN.txt` and a small `serve.py` inside. It is a
snapshot of the build of 2026-11-18 and replaces the one of the day before.

## To do

Tick an item by changing `[ ]` to `[x]`. Add what you find missing.

### Put it on GitHub

Lingbo does these. `main` is the live site, and it changes only when Lingbo merges.

- [x] Commit and push the branch. Done on 2026-11-18, as `LZ-C5.2`. That push needed
  `gh auth refresh -h github.com -s workflow` once on the build machine, because the branch
  changes the deploy workflow and GitHub refuses that from a login without the `workflow`
  permission.
- [ ] Look at the build: `screenshots/rehearsal/`, then `screenshots/rehearsal-models/` for
  the 3D models. `screenshots/baseline/` is the site on GitHub, and
  `screenshots/poster-before/` is five pages before the poster pass.
- [ ] Tell Golam, Billy and Clarence before the merge.
  - Golam: his `index.html` changed. Of its 2,188 lines, 1,975 were removed and 566 added.
    The hand's model data is byte for byte the same, his curl changes of 2026-11-18 are in,
    and the hand moves through the same four-step scroll story. The colours, fonts, nav,
    buttons and words around it changed: see [Design changes](#design-changes). His logo is
    on every page as a tracing from the poster, and the real file would replace it.
  - Billy: `app/` leaves the repo, so pull requests 1 to 4 no longer fit `main`. His
    Lesson 1 is on the site as a draft, waiting for his review.
  - Clarence: his simulator is in `main` and not in this branch, which removes `app/` and
    the old workflow and replaces the homepage his buttons are on. It has to come into this
    branch before the merge: see [For the team to decide](#for-the-team-to-decide).
  - All three: the `/version-1/` address stops existing. The `version-1` branch stays.
- [ ] `git fetch`, then `git merge origin/main`, so that edits made there are not lost. This
  branch holds `main` up to `7b2cf6d`; `main` is two commits ahead with Clarence's simulator.
  Expect `index.html` to conflict wherever a teammate edits the old nav, buttons or footer:
  the rebuild replaced that markup, so keep this branch's side there and carry the intent
  over by hand.
- [ ] Merge into `main`, check that the "Deploy site" run passes under Actions, and open the
  live site.

### Who owes what

Nothing here blocks a prompt. Each item ships as a labelled placeholder until it arrives,
then goes in with prompt 10.

- [ ] **Golam:** the HandiWorks Co. logo as an SVG or a large PNG. Until then the site shows
  a mark traced by hand from the poster image (`src/components/Logo.astro`, with copies in
  `index.html` and `public/favicon.svg`). Goes on the nav, the footer and the browser tab.
- [ ] **Clarence:** the circuit diagram as an image file. Goes on The Kit.
- [ ] **Billy:** a review of Lesson 1. Prompt 11 applies it.
- [ ] **Billy:** wiring and assembly photos or diagrams. His branch has stand-ins. Goes on
  Lesson 1.
- [ ] **Everyone:** a bio of two or three sentences and a photo. Goes on Team.
- [ ] **Lingbo:** titles and one-line summaries for Lessons 2 to 4. The site and Billy's
  branch disagree. Goes on Lessons.
- [ ] **Lingbo:** the published slides link for Lesson 1. "Open slides" stays hidden until
  then.
- [ ] **Lingbo:** a licence for the CAD files, before any CAD download is offered. Lesson 1's
  CAD page says the example files are on hold for this reason.

### For the team to decide

- [ ] **Servo or DC motor.** Lesson 1 teaches a positional servo. The hand on The Kit page is
  driven by DC motors on threaded rods. Decide which the lesson should teach, in the review.
- [ ] **288 mm or 282 mm.** Lesson 1 says the finger is 288 mm long. The CAD notes give the
  finger module as 282 mm. Billy's step models come from an older finger file.
- [ ] **Light or navy stage on the homepage.** Light is built. Navy with white captions is
  the option not taken, and it has not been built to compare.
- [ ] **Clarence's finger simulator.** In `main` since 2026-11-18 and not in this branch.
  It was built on the old site: its page is `lessons/finger-module/`, it points the old
  homepage's Lessons buttons at that page, and it embeds itself in `app/`. This branch
  replaces that homepage and removes `app/`, so merging `main` in will conflict on those.
  The simulator itself is one script and one stylesheet with no server. It was tried in this
  branch on 2026-11-18 and it works inside Lesson 1's overview page, in the site's look,
  with his two files untouched. The patch that does it is on the build machine at
  `~/workspace/HelpingHand-finger-simulator-in-lesson-1.patch`: merge `main`, then apply it.
  Decide with Clarence whether that is where it goes.
- [ ] **Pull requests 1 to 4** (Billy, 2026-10-28: the server app with real login). The site
  is a static mock through Dec 1 and real login is a Roadmap item, so they can be closed, or
  left open as the start of that work. Billy's call.
- [ ] **Branch `nov15-hand-model`.** `main` holds the later version of the same homepage
  update. Delete it or keep it. Golam's call.

### Not checked yet

- [ ] A real phone. Phone widths were checked in headless Chrome only.
- [ ] A real Windows laptop, opening the offline copy with no network.
- [ ] Hover states and the page-to-page cross-fade, which a screenshot cannot show.
- [ ] `npm run check`. The type check has never run: `@astrojs/check` is not installed.

### After any change

Run prompt 8 again, because the offline copy is a snapshot, then prompt 9. When a teammate
sends content, use prompt 10. When the team has reviewed Lesson 1, use prompt 11. All four
are under [Prompts in use](#prompts-in-use).

What waits until after Dec 1 is under [Not in this plan](#not-in-this-plan).

## Design changes

Newest first. Each entry says what changed and why, then what was decided during the work and
not by Lingbo, with the option not taken. Say so if any of those should change.

### 2026-11-18: closer to the poster

Lingbo asked for the site to match the poster more. The build of the day before used the
poster's colours and blocks but read heavier than the poster does: extra-bold headlines,
large navy statements, thick labels. This pass takes the type and the blocks back to what
the poster shows. It is on the build machine only.

| | Build of 2026-11-17 | Now |
|---|---|---|
| Logo | The names in text. | The HandiWorks mark, traced from the poster, in the nav, the footer and the browser tab. The footer carries the poster's lockup: the mark, "HandiWorks", and "Co." under its end. |
| Weights | Up to 800, with the letters pulled tight. | Three, as on the poster: 400 for text, 600 for labels and small headings, 700 for titles. |
| Section label | Heavy capitals in a tall box, with a hairline rule. | The poster's: lighter capitals, a closer box, a 2px rule after a gap. |
| The sentence under a label | A navy headline, 26 to 36px. | Black and bold, 20 to 26px. Where the words are the poster's, regular with the poster's bold words: "To **transform** how robotics is taught". |
| Text on white | Ledes in grey. | Black, as on the poster. Grey is kept for captions and sources. |
| Stat panel | Number, a square bar on a track, then a sentence. | The poster's order: caption, number, label, bar. The bar has round ends and no track. Sky numbers are lighter, white ones bold. |
| The 18% / 42% pair | Sentence labels. Each bar was a share of its own track. | Labels in capitals in the colour of their number. The 42% bar is full width and the 18% bar is in proportion to it, as drawn on the poster. |
| Figures in a row | Three separate navy panels. | One navy block split by hairlines, like the two figures on the poster. On The Problem and on the homepage. |
| Bars | Under every big number. | Only under a percentage. The homepage's 3, 6 and 11+ have none. |
| Result table | Pale cell lines, bold header and row labels. | The poster's thin grey grid, with lighter header and row labels. |
| Objectives | Plain text. | Bold on the poster's words: scalable, affordable, accessible. |
| Roadmap timeline | Phase above the line, text below, left-aligned. | The poster's "Next steps": centred on open circles, with the phase and its text swapping sides from one step to the next. Stacked on a phone. |
| Homepage, the three subjects | Three grey cards. | Three columns split by hairlines, like the poster's columns. |
| Nav | Menu button below 960 px. | Below 1024 px: the mark needs the room once a role is set. |

Decided during that work:

| Decision | Option not taken |
|---|---|
| Trace the logo from the poster and use it now, as a stand-in. | Text only until Golam's file arrives. |
| In the nav the mark sits beside "HelpingHand", with "HandiWorks Co." after it. The poster's own lockup is in the footer. | The poster's lockup in the nav, with the product name only on the homepage. |
| Inner page headers stay left-aligned. | A centred title and tagline on every page, as in the poster's header. |
| The homepage's first screen keeps Golam's layout: name, tagline and paragraph beside the hand. | A navy title band above the hand, as on the poster. It would push the hand below the first screen. |
| Short labels for the 18% / 42% pair: "No computer science classes at school" and "Computer science classes at school". The report's full wording stays in the note under the pair. | The poster's "tech opportunities" wording, which the report does not support. |
| One navy for every block. | A second, lighter navy for the stat panel, which is how it looks in the poster image. |
| A stat bar has round ends: the one place a corner is not square. | Square bars, to keep one rule. |
| The poster's red "$500" is not used. | A red accent colour. The figure is not on the site. |

### 2026-11-17: the site built to the poster theme

Prompts 1 to 7 were run in one evening by two Claude sessions working in the same checkout,
then prompts 8 and 9. This is on the build machine only.

What a visitor would see change, from the site on GitHub to the build:

| | On GitHub (`main`, 2026-11-15) | On this branch |
|---|---|---|
| Pages | One homepage. | The homepage, 22 inner pages and a 404 page: The Problem, The Kit, Lessons, Lesson 1 in four pages, Sign in, two dashboards, Roadmap, Team, a style guide, and coming-soon pages for the lessons not written yet. |
| Look | Dark stage with a grid behind the hand. Rounded pill buttons. | White page with navy bands. Square corners. A boxed label heads every section. |
| Colours | Four colour sets stacked in the one file. | One set of eight from the poster: navy, white, panel grey, edge, lime, sky, ink, rule. |
| Type | Orbitron, Share Tech Mono, Barlow Condensed and DM Sans, loaded from Google Fonts. | Inter only, from one font file in the repo. |
| Navigation | Home, The product, Lessons, Our team, "Enter learning lab". All of them jump within the one page. | The Problem, The Kit, Lessons, Roadmap, Team, Sign in. Each opens a page. The same nav is on every page. |
| Lessons and sign-in buttons | Jump to the note "Login and lessons require server hosting." | Open the lessons and the sign-in page. The note is gone. |
| First screen | "Our mission" above the name. | The name, then the poster's tagline "Putting Robotics Within Every Student's Grasp", then the same paragraph. |
| The hand | Golam's model and four-step scroll story. | The same model data, byte for byte, and the same four steps, on a light stage. |
| The electronics, in words | "six positional servos" and "a three-axis gyroscope and accelerometer". | "An Arduino Mega runs six DC motors, with two push buttons to drive them", as the circuit is built. |
| The class | Named twice on the homepage ("EG-UY 1004"). | Named once on the whole site, on the Team page. |
| Motion | Sections fade up as they are scrolled to. | One idea, "lines draw": a section label's box and rule, and a stat bar, extend from the left. Pages cross-fade into each other with the nav held still. |
| Loaded from other sites | Google Fonts, and the finger video by its full `github.io` address. | Nothing. The site runs with no network. |

Why: the site has to read as one company with one look, the poster is that look, and a judge
has to be able to click from the homepage into real pages.

The inner pages arrived in an earlier design, the Workbench look, which was never published.
These parts of it went:

- warm paper background `#F5F3EC` became white
- safety orange `#FF5A1F` became navy
- Space Grotesk and JetBrains Mono became Inter
- the graph-paper grid and the mono callouts on models were removed
- teal and amber status colours became lime, panel grey and navy

The homepage carried four stacked colour sets and four web fonts. They collapsed into the
theme's colours and its one font. The hand keeps its own material colours: those are baked
into the model, not the page.

Decided during that work:

| Decision | Option not taken |
|---|---|
| Square corners everywhere, as on the poster. Circles only for numbered points, timeline nodes and status dots. | Rounded cards and pill buttons. |
| The boxed section label is the heading of a section. No small line above a heading anywhere. | A label above a larger heading. |
| One motion idea, "lines draw": a section label's box and rule, and a stat bar, extend from the left as they come on screen. Pages cross-fade into each other with the nav held still. Both switch off when the reader asks for reduced motion. | Fade-ins on every block; count-up numbers. |
| The Problem leads with the poster's 18% / 42% figure in the page header, worded as the report words it. | The poster's "tech" wording. |
| Lessons are listed as numbered rows, one per line, not a grid of cards. | Cards. |
| The roster on the teacher dashboard is a result table: lime cells for Done, as on the poster's testing table. | Three percentage tiles. |
| "Part" is the word on the page for CAD, Hardware and Software. The code still says `portion`. | "Portion" on the page. |
| Lesson 1's title is Billy's, "Build a Finger". His quiz and "Go further" sit at the end of the Software part; his teacher notes are split across the four pages where each applies. | Everything on the overview page. |
| Billy's five step models are trimmed at their cut when converted (`scripts/stl_to_glb.py`): his files keep whole triangles that cross the cut, which show as shards. | Showing the files as they are. |
| Two sentences of Billy's CAD text that tell the student to import the example STL in inches are left out, because the files are not offered. One sentence says why. They return with the downloads. | Offering the STL files now. |
| The navigation folds into a Menu button below 960 px and drops "HandiWorks Co." below 1100 px, so it still fits once "Switch role" and "Teacher dashboard" are showing. | One breakpoint at 900 px. |
| Homepage wording: "Four engineers. One shared curiosity." (was "Four students"), to match the Team page; the three stat panels are labelled "The kit in numbers" (was "How the hand works"). | Leaving both. |
| With reduced motion on a laptop, the homepage puts the captions beside the hand. | The hand stacked under the captions, as on a phone. |

### 2026-11-17: the repo reorganised

Earlier the same day, before any prompt ran. What it did, on the branch then called
`site-buildout`:

- Removed from the working tree: `app/`, `version-1/`, `assets/hand-colored.mesh.gz`. All
  three remain in the git history.
- Moved the inner pages in from Lingbo's earlier Workbench demo site (`src/`, `public/`,
  `scripts/`, the Astro and npm config). That site was never published. A copy of it as it
  stood is archived in Lingbo's private repo `lingbo-z/Website-V1`.
- Copied the hero video into `public/videos/` and pointed the homepage at it with a
  relative path.
- Replaced the deploy workflow: it now builds the Astro pages, adds the homepage, and
  publishes the result.
- Added `npm run shots` and the homepage script check.

Decided during that work:

| Decision | Option not taken |
|---|---|
| Branch name `site-buildout`. Lingbo renamed it `LZ-C5.2` on 2026-11-18, when it was first pushed. | Any other name. |
| `index.html` stays at the repo root and a few lines in `astro.config.mjs` copy it into the build and serve it in `npm run dev`. | Moving it to `public/index.html`, which needs no code but changes where Golam edits. |
| The Workbench site's own home page was dropped, since Golam's is the homepage. It is in the archive. | Keeping it as a second landing page. |
| Workflow renamed from `preview.yml` ("Website preview") to `deploy.yml` ("Deploy site"), Node 24, built site kept as the `helpinghand-site` download. | Editing `preview.yml` in place. |
| The inner pages kept the Workbench look and placeholder models through the reorganisation. Prompts 1, 4 and 5 replaced both later that day. | Restyling during the reorganisation. |
| Rule 5 applied to the homepage: prompt 2 took out its two mentions of the class. | Leaving the class named on the homepage. |
| Prompt 2 turned the homepage's dark stage light, so that it matches the poster and the hand's navy parts stay readable. | A navy stage with white captions. It is in [To do](#to-do). |

## Theme

Agreed 2026-11-17. The look comes from the team's SLDP poster. The poster image itself is not
in this repo; everything the site needs from it is written down here.

One look across the whole site: the homepage (`index.html`) and every inner page. The inner
pages take it from `src/styles/global.css`. The homepage carries its own copy, written by
hand inside `index.html`: change one and change the other.

### Colours

Sampled from the poster.

| Token | Value | Use |
|---|---|---|
| `navy` | `#133476` | bands, section labels, table header rows, primary buttons, links, headings on white |
| `white` | `#FFFFFF` | page background, text on navy |
| `panel` | `#F5F5F5` | quiet panels and rows on the white page |
| `edge` | `#ECEEF2` | hairline borders, dividers |
| `lime` | `#E5FEC3` | the highlight: result cells in tables, "live" and "done" states, callouts |
| `sky` | `#70D0F0` | the accent, on navy only: big numbers, the logo mark, small decorative strokes |
| `ink` | `#000000` | body text |
| `rule` | `#595959` | the thin rule beside a section label, secondary text |

Contrast, measured:

| Pair | Ratio | Verdict |
|---|---|---|
| white on navy | 11.8:1 | any text |
| navy on white, on panel, on lime | 11.8:1, 10.8:1, 10.8:1 | any text |
| rule grey on white | 7.0:1 | any text |
| sky on navy | 6.7:1 | any text |
| sky on white | 1.8:1 | never text; decoration only |

Light only. There is no dark mode. Navy bands are part of the light theme.

### Type

One family: Inter, self-hosted, no other typeface. One copy of the font files lives in
`public/fonts/` and both the homepage and the inner pages load it from there.

- Three weights, as on the poster: 400 for text, 600 for section labels and small headings,
  700 for titles and for the words that matter. Nothing heavier.
- Page titles: 700. White on a navy band; navy on the homepage's light stage.
- Section labels: 600, uppercase, white on a navy box.
- Text on white is black. The sentence that leads a section is black and bold, or regular
  with its key words in bold, which is how the poster writes. Navy text is for small
  headings and links. Grey is for captions and sources.
- Body: 400, black, 17px with 1.6 line height on reading pages.
- Numbers that matter (stats, counts): large. Sky at 600, white at 700.
- No monospace labels. Code blocks in lessons use the system monospace stack.

### Building blocks

These are the poster's own parts. Every page is assembled from them.

- **Band.** Full-width navy block with white text. The page header, the footer, and at most
  one more band per page.
- **Logo.** The HandiWorks mark from the poster: two white blocks and a `sky` link. On navy
  bands only. Traced from the poster image until the logo file arrives.
- **Section label.** White uppercase text in a navy box. After a gap, a 2px `rule` line runs
  to the right edge of the column. Starts every section.
- **Panel.** `panel` grey block for supporting text.
- **Stat panel.** Navy block. Top to bottom: small uppercase caption, big number, what it
  counts, a round-ended bar as long as the number, source. The number the page argues
  against is `sky`; the one it argues for is white. A bar is drawn only for a percentage.
  Several figures share one block, split by hairlines.
- **Result table.** Navy header row with white text, `lime` cells for the results, thin grey
  lines between all cells.
- **Numbered point.** Navy circle with a white number, sitting on the left edge of a `panel`
  row.
- **Timeline.** A navy line with small open circles. On a wide screen the date and the text
  swap sides from one step to the next, as in the poster's "Next steps".
- **Buttons.** Primary: navy fill, white text. Secondary: 1px navy border, navy text.
  On a navy band: white fill, navy text.
- **Status labels.** Live, Draft, Demo data, Coming soon. They stay, because the site is a
  mock and says so. Lime for Live, `panel` with a dashed `rule` border for Draft and Coming
  soon, navy outline for Demo data.

### Shape and motion

- **Square corners.** Every block, button and label is a rectangle, as on the poster. Circles
  are kept for numbered points, timeline nodes and status dots, and a stat bar has round
  ends, as on the poster.
- **A section label is the heading.** Never put a small line above a heading: the boxed label
  is the heading, and a sentence under it can make the claim.
- **Lines draw.** The one motion on the site. A section label's box and rule, and the bar in a
  stat panel, extend from the left as they come on screen. A percentage draws its bar to that
  length. Nothing else animates in.
- **Page to page.** The nav holds still and the rest cross-fades, in browsers that support it.
- **Reduced motion.** Both of the above switch off when the reader has asked for less motion,
  and everything is visible without scripting.
- **Arrows are drawn**, never typed: the font file has no arrow characters. Inner pages use
  the `Arrow` component; the homepage uses a small inline SVG.
- **Focus.** A 3px navy outline with a 2px gap on white, white on navy.

Every block is shown at `/styleguide/` on the built site.

### Words from the poster

Use these as written here. They are the team's own words, with two spelling slips on the poster corrected.

- **Tagline:** Putting Robotics Within Every Student's Grasp
- **Product, one paragraph:** HelpingHand is a modular robotic hand that students CAD, wire,
  and program themselves. Paired with an interactive education interface, students learn
  mechanics, circuits, and coding concepts one lesson at a time without following a finished
  kit.
- **Goal:** to transform how robotics is taught in the classroom, fostering the highest level
  of creativity while prioritizing accessibility.
- **Background:** Popular robotics kits for young students can be extremely costly, creating
  a high barrier for entry for schools that want to invest in engineering programs. 3D
  printers provide an affordable alternative that allows multiple students to print an
  unlimited number of parts.
- **Objective 1:** Provide a scalable framework that evolves alongside the learner.
- **Objective 2:** Offer an affordable and accessible alternative to traditional robotics
  kits (FIRST, VEX, LEGO, etc.)
- **Website, one line:** a showcase of the product design along with interactive lessons
  designed to allow teachers to assign and monitor student work, or alter the curriculum.

Team and roles:

| Name | Role |
|---|---|
| Billy Jin | Programming Lead |
| Golam Khan | Design Lead |
| Clarence Li | Circuitry Lead |
| Lingbo Zhang | Project Manager |

### Figures from the poster

A figure goes on the site only with a source a reader can open. All three were checked on
2026-11-17.

| Figure on the poster | On the site | What the check found |
|---|---|---|
| 18% of students with no tech opportunities at school plan to pursue a tech degree in college, against 42% with them | Yes, on The Problem, worded as the report words it | Confirmed. It is about computer science, not "tech": 42% of students who say their school offers computer science classes plan to study it in college, against 18% of those whose school does not. Gallup with Amazon Future Engineer, "Developing Careers of the Future", 2021, printed page 14: 4,116 US students in grades 5 to 12. The poster's wording ("tech opportunities", "tech degree") is looser than the report's. |
| Over 250,000 high school students participate in robotics competitions annually | No | Not found in any primary source. What the sources do say: FIRST Robotics Competition, more than 93,000 students (grades 9 to 12, worldwide, 2025 season); FIRST Tech Challenge, more than 109,000 (ages 12 to 18, 2024-25); REC Foundation, 316,271 students across all grades (2024-25). |
| A $500 robotics kit | No | Not a list price of any kit found. Makeblock's mBot Ultimate is $399.99 from the maker and $495 at one reseller. The Problem page carries sourced prices instead (VEX IQ kit $479.99, LEGO class bundle $3,499). |

### Product testing, from the poster

Goes on The Kit page as "Testing so far".

| Trial | Motor 1 ran? Direction | Motor 2 ran? Direction |
|---|---|---|
| Motor 1: clockwise and counterclockwise | Yes. Clockwise and counterclockwise | No |
| Motor 2: clockwise and counterclockwise | No | Yes. Clockwise and counterclockwise |
| Both motors: clockwise and counterclockwise | Yes. Clockwise and counterclockwise | Yes. Clockwise and counterclockwise |

### Circuit, from the poster

Six-motor circuit layout: an Arduino Mega 2560 R3, two stacked motor shields (addresses
`0x60` and `0x61`), six DC motors, two push buttons, and a separate motor supply. The site
describes it in words until the original diagram file is in the repo.

## The plan

### What the site has to do

On Dec 1 a judge scrolls it on a laptop. It has to read as a real company selling a modular
robotic-hand kit with a CAD, hardware and software curriculum for ages 11 and up, and it has
to show how a teacher and a student would use it. Real teachers and learners are the second
reader.

The plan covers the demo path and nothing else:

1. Home
2. The Problem
3. The Kit
4. Lessons
5. Lesson 1: overview, then CAD, Hardware, Software
6. Sign in as a teacher, teacher dashboard
7. Sign in as a student, student dashboard
8. Roadmap
9. Team

### Decisions

- **One site, in this repo.** The homepage stays Golam's hand-edited `index.html`. Every other
  page is a static Astro page under `src/`, built and published together with it.
- **Static mock through Dec 1.** No accounts, no database, no server. Real login is a
  Roadmap item.
- **One nav on every page:** The Problem · The Kit · Lessons · Roadmap · Team, plus a
  "Sign in" button. On the homepage the product and team sections stay as teasers that link
  to the full pages.
- **One look, from the team poster.** It is written down under
  [Theme](#theme). Light only.
- **Lesson 1 is Billy's**, from the `version-1` branch, ported to static pages and labelled
  as a draft until the team has reviewed it.
- **Real 3D models only.** The Kit shows the current hand from Lingbo's CAD with a version
  caption. Lesson 1 shows Billy's five step models. The homepage keeps Golam's hand.
- **Downloads:** the Arduino sketch only. CAD files are held until a licence is chosen.
- **Missing content ships as a labelled placeholder.** No prompt waits on a teammate.
  [Who owes what](#who-owes-what) lists it.
- **Contact** and "Request a kit" are mailto links to Lingbo's NYU address.
- **It must run with no network.** Fonts, scripts, models and video are all in the repo.

### Rules for every prompt

1. **Static only.** No accounts, database, server or API calls. Sign in sets a role in the
   browser (`localStorage` key `hh-role`) and nothing more.
2. **Say what is unfinished.** Anything that is a draft, demo data or coming soon carries
   that label on the page. Never make a mock look like a working feature.
3. **Invent nothing.** Specs, quantities and prices come from the CAD READMEs or from the
   team. Every figure has a source a reader can open, with its year, recorded in
   `src/data/evidence.ts`. If a fact is missing, leave it out and add it to
   [Who owes what](#who-owes-what).
4. **Fictional people only** in the dashboards. Never a real student.
5. **It reads as a company.** The class is mentioned once on the whole site: the line
   "Founded at NYU Tandon, 2026, as a Semester-Long Design Project." on the Team page.
6. **Laptop first**, 13 to 15 inch. At 390 px wide nothing may overlap or scroll sideways.
   Phone layout is not tuned beyond that.
7. **The theme is the [Theme](#theme) section of this file.** Use its colours, its one
   typeface and its building blocks. Do not add others.
8. **Nothing loads from another site.** Outbound links to sources and mailto links are fine.
   `npm run shots` prints a warning for every page that breaks this.
9. **Short words on screen.** Labels and results, not explanations.
10. **The homepage is one hand-edited 2 MB file that Golam also edits.** Before touching
    `index.html`, run `git fetch` and merge `origin/main` into the branch. Never read the
    whole file: the hand's data sits on two very long lines (562 and 592 on 2026-11-18, and
    they move). Work by `grep` and line ranges, and change only what the task needs.
11. **Links.** Inner pages link with `p()` and `asset()` from `src/lib/url.ts`. The homepage
    links with relative paths (`lessons/`, `team/`).
12. **Branch `LZ-C5.2`. Never commit, never push, unless Lingbo asks.** Lingbo names each
    commit.
13. **Finish the same way every time:**
    - `npm run build`
    - `npm run shots -- <label> <routes>`, then open the screenshots yourself and fix what
      is visibly wrong at either width
    - report: what changed, what you decided without asking and the options you did not
      take, what is still a placeholder, and the screenshot folder to download

### Prompts in use

Prompts 1 to 7 built the site and are finished. They are kept under
[Prompts already run](#prompts-already-run). These four are still in use:

| Prompt | When to run it |
|---|---|
| 8: Offline check and the laptop copy | After any change, and once more before the presentation. |
| 9: Rehearsal | After any change. |
| 10: Content drop-in | Each time a teammate sends something. |
| 11: Lesson 1 after the team review | Once, when the team has reviewed Lesson 1. |

Open Claude Code in the repo folder (`~/workspace/SLDP Website` on Lingbo's build machine),
paste one prompt, review the screenshots it names, then commit under your own name for it.

Each prompt is complete on its own. Paths that start with `~/workspace` are on the build
machine.

#### Prompt 8: Offline check and the laptop copy

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md (Decisions and
Rules) first, and follow the Rules. Do not commit or push. Run this after prompts 1 to 7.

Goal: the site works in a room with no network, and Lingbo has a copy to carry.

Do:
1. npm run build, then npm run shots -- p8-offline. Fix every "loads from another site"
   warning and every script error it prints.
2. Search dist/ for anything else fetched at runtime from another host: scripts, styles,
   fonts, images, video, models. Outbound links and mailto links are fine.
3. Make a zip that holds the built site inside a folder named HandiWorks-Co.-Website, plus
   a short text file saying how to open it on a laptop with no network: start a local file
   server one level above that folder, then open
   http://localhost:8000/HandiWorks-Co.-Website/ . Give the command for macOS and for
   Windows. Write the zip outside the repo, in ~/workspace/.
4. Unzip it somewhere temporary, serve it that way, and take screenshots of the demo path
   from that copy to prove it works.

Done when:
- npm run shots prints no warning and no error for any demo-path page
- the zip exists, and the screenshots taken from the unzipped copy show fonts, models and
  the homepage hand
```

#### Prompt 9: Rehearsal

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md (the demo path,
Decisions and Rules) first, and follow the Rules. Do not commit or push.

Goal: walk the demo path the way a judge will and leave a short list of what is still
wrong.

Do:
1. npm run build, then npm run shots -- rehearsal.
2. Check every link in the nav, the footer and every button on the nine demo-path steps:
   each one opens a page that exists in dist/.
3. Look at every screenshot at both widths. Note anything that overlaps, runs off the side
   at 390 px, is unreadable, shows a placeholder high on the page, or does not match the
   Theme section of docs/README.md.
4. Read every page once for wording: one name per thing across the whole site, no
   leftover draft text that is not labelled as a draft, no claim that breaks rule 3.
5. Fix what takes minutes. List the rest, most damaging first, with the page and what to do.
6. Bring "Who owes what" in docs/README.md up to date: tick what has arrived,
   add what you found missing.

Done when: the report gives the fix list, the updated who-owes-what list, and the
screenshot folder.
```

#### Prompt 10: Content drop-in

Use this each time a teammate sends something. Fill in the three blanks.

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md first (Rules and Theme),
and follow the Rules. Do not commit or push.

New content from ______ for the ______ page:
______ (paste the text, or give the path to the file or image)

Put it on the page in place of the placeholder that is there, and remove that
placeholder's label. Keep the sender's wording, trimmed to fit: short labels, no filler.
Do not fill gaps yourself. If something needed is missing, or a figure has no source, leave
that part as a labelled placeholder and list it in the report. Images go in public/images/
at a sensible size. Tick the item in "Who owes what" in docs/README.md.

Done when: npm run build passes, npm run shots -- content <the page> shows the new content
at both widths, and the report lists anything still missing.
```

#### Prompt 11: Lesson 1 after the team review

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md first (Rules and Theme),
and follow the Rules. Do not commit or push.

The team has reviewed Lesson 1. Their changes:
______ (paste the notes, or give the path to the reviewed text)

Apply them to the four files under src/content/lessons/beginner/01-finger-module/. Remove
"Draft · under team review" from each part the team approved and leave it on the rest. If
the CAD steps changed, rebuild the step models the way prompt 5 did. Update the dashboards'
mock data if lesson or part names changed.

Done when: npm run build passes, npm run shots -- lesson1-final with the five Lesson 1
routes shows the reviewed lesson, and the report lists every part that is still a draft.
```

### Not in this plan

Real accounts and classrooms, the forum and showcase, a custom domain, CAD downloads, a
native slide deck, the Intermediate track, and tuning for phones. They are Roadmap items for
after Dec 1.

## Prompts already run

Prompts 1 to 7 were run on 2026-11-17 and are finished. They are kept as the record of what
each page was built to do. Do not run them again: file names and line numbers in them
describe the repo as it was before they ran.

### Prompt 1: Theme

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md first (Decisions, Rules
and Theme), and follow the Rules. Do not commit or push.

Goal: every inner page wears the poster theme, and the shared nav and footer are final.
The homepage (index.html) is not part of this prompt.

Read: src/styles/global.css, src/layouts/BaseLayout.astro, src/components/ (Nav, Footer,
StatusLine, PageHeader, Stat, ModelViewer, Callout, DemoBanner, LessonCard),
src/pages/styleguide.astro.

Do:
1. Replace the Workbench tokens in global.css with the theme's colours. Rename a token when
   its old name no longer describes it. Remove the graph-paper grid, the mono label styles
   and the model callouts.
2. Inter, self-hosted. Put one copy of the font files and its licence in public/fonts/ so
   the homepage can load the same files later. Remove the Google Fonts links from
   BaseLayout. Check in dist/ that the font URL includes the base path and that the file
   is served.
3. Build the theme's building blocks as shared classes or components: band, section label
   with its rule, panel, stat panel, result table, numbered point, timeline, the three
   button styles, the four status labels.
4. Nav on every inner page: wordmark linking to the homepage, then The Problem, The Kit,
   Lessons, Roadmap, Team, then a Sign in button. Keep the existing behaviour that turns
   Sign in into the dashboard link once a role is set. Navy band, white text.
5. Footer: navy band. "© 2026 HandiWorks Co.", Contact and Request a kit as mailto links
   (the helper in src/lib/url.ts), the page links, one status line saying the site is a
   demo.
6. Rebuild /styleguide/ so it shows every colour, the type scale and every building block.
7. Go through every page and remove leftovers of the old look. Do not rewrite page content:
   prompts 3 to 7 do that.

Done when:
- grep finds no fonts.googleapis, no "Space Grotesk", no "JetBrains", and none of the old
  hex values (#FF5A1F, #F5F3EC, #0F6E8C, #FFC53D) under src/
- npm run shots reports no page loading from another site, apart from the homepage
- body text and labels meet 4.5:1 contrast; the sky colour is never text on white
- npm run build passes
- npm run shots -- p1-theme /styleguide/ /problem/ /kit/ /lessons/beginner/ /signin/ /team/
  and you have looked at each image at both widths
```

### Prompt 2: Homepage

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md first (Decisions, Rules
and Theme; rule 10 above all), and follow the Rules. Do not
commit or push. Prompt 1 must already be done.

Goal: the homepage leads into the real pages and wears the same theme as they do. It stays
Golam's single hand-edited index.html. The hand, its model and its scroll animation are not
redesigned.

First: git fetch, and merge origin/main into the branch if index.html changed there.
Then look at screenshots/baseline/home-1440-*.png (run `npm run shots -- baseline /` if the
folder is missing) so you know what the page looks like before you change it.

Map of index.html: lines 1 to about 60 hold the styles, including four stacked colour sets
(the last unscoped one wins) and the font links. About 1815 to 1930 is the page markup.
About 1932 to 1977 are small scripts. About 1978 to 1984 is the Anime.js library. About
1986 to 2166 is the hand code, with the model as one very long line near 2014. The footer
note is near 2169. Confirm with grep before editing: line numbers move.

Do:
1. Nav: the same items as the inner pages, linking with relative paths: problem/, kit/,
   lessons/beginner/, roadmap/, team/, signin/. The wordmark goes to the top of the page.
2. Every button that now jumps to #runtime-required ("Enter learning lab", "Start
   learning", the Lessons link) goes to lessons/beginner/ or signin/. Delete the
   #runtime-required note and its "Login and lessons require server hosting" text.
3. The product section and the team section stay as teasers. Give each one link to its full
   page: kit/ and team/.
4. Colours: collapse the four colour sets into one :root block that uses the theme. Header
   and footer are navy bands. The sections below the hand are white with section labels.
   The hand's stage becomes light, white into panel grey, as the middle of the scroll story
   already is, with navy and black captions: the hand has dark navy parts and has to stay
   readable in every frame. Update the colours the hand script sets from JavaScript
   (--bg, --fg, --story-accent, the background hue, the backdrop grid). Leave the hand's own
   material colours alone.
5. Type: Inter from public/fonts/ (path fonts/...). Remove the Orbitron, Share Tech Mono,
   Barlow Condensed and DM Sans links and imports.
6. Words: tagline and product paragraph from docs/README.md (Theme). The class is not
   mentioned on the homepage (rule 5): remove "Created for EG-UY 1004..." and the
   "EG-UY 1004 Section B2" footer line. Check every factual claim on the page against
   docs/README.md (Theme) and the CAD READMEs in ~/workspace/SLDP/ (for example the page
   says "six positional servos" and "gyroscope", the circuit is six DC motors on two motor
   shields). Correct what is plainly wrong and list every such change in your report.

Options, for the report: if Lingbo would rather keep Golam's dark stage for the hand, the
alternative is a navy stage with white captions. Say how the hand's navy parts read on it.

Done when:
- index.html contains no fonts.googleapis, no khan-builds.github.io, no #runtime-required,
  no EG-UY
- npm run build passes (it checks that the homepage scripts still parse)
- npm run shots -- p2-home / prints no script error and no load from another site
- you have looked at every home-1440 and home-390 frame: the hand renders and moves between
  frames as it does in screenshots/baseline/, and every caption is readable
- every nav and button link on the homepage opens a page that exists in dist/

Tell Lingbo in the report that this prompt changed Golam's file, and how much.
```

### Prompt 3: The Problem

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md first (Decisions, Rules
and Theme), and follow the Rules. Do not commit or push.
Prompt 1 must already be done.

Goal: The Problem page makes the case in the poster's words and backs every number.

Read: src/pages/problem.astro, src/data/evidence.ts, the sections "Words from the poster"
and "Figures from the poster" in docs/README.md (Theme).

Do:
1. Open with the poster's Goal and Background text and the two objectives as numbered
   points.
2. Lay the page out with section labels and stat panels. Keep the 15 sourced figures that
   are already there. Lead with the three strongest and group the rest.
3. The 18% / 42% figure: find the Gallup and Amazon Future Engineer report (2021) online,
   check both numbers and what they measure against it, then add it to evidence.ts with the
   URL and year and show it as a stat panel. If you cannot confirm it, leave it off the
   page and say so in the report.
4. "Over 250,000 high school students" and the "$500" kit: look for a source for each.
   Add one only with a source you have opened and read. Otherwise leave it off.
5. Every number on the page links to its source and shows its year.

Done when:
- every figure on the page has an entry in evidence.ts with a URL and a year
- no figure appears that the report lists as unconfirmed
- npm run build passes
- npm run shots -- p3-problem /problem/ and you have looked at both images
```

### Prompt 4: The Kit

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md first (Decisions, Rules
and Theme), and follow the Rules. Do not commit or push.
Prompt 1 must already be done.

Goal: The Kit page shows the real hand and says only true things about it.

Read: src/pages/kit.astro, src/components/ModelViewer.astro, and the CAD notes on the build
machine: ~/workspace/SLDP/README.md, then the README of the newest dated folder it names as
current (on 2026-11-17 that was "11.17 Thumb Updates/", hand v10). Read which hand variant
is current there. Do not guess.

Do:
1. Write scripts/step_to_glb.py. It runs with ~/.venvs/sldp-cad/bin/python (build123d is
   installed there), reads a short manifest in the script (source STEP, output name, parts
   to drop) and writes GLB files to public/models/. Keep the part names from the STEP as
   node names.
2. Export the current hand assembly and one finger. Keep each file under 3 MB: coarsen the
   tessellation or drop internal parts before giving up detail on the outside.
3. Show them on the page with model-viewer. Caption each with its CAD version and date.
4. Delete the placeholder models (public/models/finger.glb, hand.glb),
   scripts/make_placeholder_models.py and the "models" script in package.json. Other pages
   that pointed at them now point at the real ones.
5. Rewrite the spec rows from the CAD READMEs only. Drop any row you cannot back.
6. Add "Testing so far" with the result table from docs/README.md (Theme), and a "Circuit"
   section with the description from the same file. The circuit diagram is a labelled
   placeholder until the image file arrives.
7. Keep what is in the box, how a lesson works, and the design, build, code loop, in the
   poster's product paragraph and short labels.
8. No CAD downloads.

Done when:
- no page shows a generated placeholder shape, and grep finds no "placeholder" next to a
  model under src/
- each GLB is under 3 MB and its caption names the version
- every spec on the page can be found in a CAD README (list file and line in the report)
- npm run build passes
- npm run shots -- p4-kit /kit/ and the models are visible in the images
```

### Prompt 5: Lessons and Lesson 1

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md first (Decisions, Rules
and Theme), and follow the Rules. Do not commit or push.
Prompt 1 must already be done.

Goal: Lesson 1 is Billy's real lesson, as static pages, marked as a draft under review.

Read: src/content.config.ts, src/content/lessons/beginner/01-finger-module/ (index, cad,
hardware, software), src/pages/lessons/. Billy's lesson is on another branch. Read it
without switching branches:
  git show origin/version-1:src/content/lessons/01-finger-module.mdx
  git ls-tree -r -l origin/version-1 -- public

Do:
1. Split Billy's lesson across the four existing files: overview, CAD (his five build
   steps), Hardware (wiring the servo and button to the Mega, with his safety note),
   Software (his Arduino sketch and upload steps). Keep his wording. Replace the early
   draft text that is there now.
2. Mark the overview and each part "Draft · under team review".
3. His five step models are STL files in origin/version-1 under public/models/lesson-1/.
   Convert them to GLB with ~/.venvs/sldp-cad/bin/python, under 2 MB each, into
   public/models/lesson-1/, and show one per CAD step.
4. Put lesson-1-finger.ino in public/downloads/ with a download button on the Software
   page, and show the code on the page. No CAD zip, no STL links.
5. His quiz becomes a plain list of questions. Teacher notes and the answer key show only
   when the browser role is teacher. That is a display switch, not security: say so in a
   one-line label.
6. Where his branch has only stand-in images, use a labelled image placeholder.
7. Lessons index: Lesson 1 is live. Lessons 2 to 4 and the Intermediate track stay as
   coming-soon cards with the titles they have now.
8. Hide "Open slides" until a slides link exists.

Done when:
- the four Lesson 1 pages show Billy's steps, wiring and code, each with the draft label
- the sketch downloads from the built site
- nothing under dist/ is a .stl or a CAD .zip
- npm run build passes
- npm run shots -- p5-lessons /lessons/beginner/ /lessons/beginner/01-finger-module/
  /lessons/beginner/01-finger-module/cad/ /lessons/beginner/01-finger-module/hardware/
  /lessons/beginner/01-finger-module/software/ and the step models are visible
```

### Prompt 6: Sign in and dashboards

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md first (Decisions, Rules
and Theme), and follow the Rules. Do not commit or push.
Prompts 1 and 5 must already be done.

Goal: a judge can sign in as a teacher, then as a student, and see how each would use the
lessons.

Read: src/pages/signin.astro, src/pages/dashboard/teacher.astro, student.astro,
src/data/mock.ts, src/components/RoleGate.astro, DemoBanner.astro, Nav.astro.

Do:
1. Sign in: two buttons, "Explore as a teacher" and "Explore as a student". One line says
   this is a demo with no accounts.
2. Teacher dashboard, one screen: the class, each student's progress through the parts of
   Lesson 1, an Assign control that is visibly not live.
3. Student dashboard, one screen: progress per part, assigned items, bookmarks.
4. Both carry the "Demo data" label. Every name in mock.ts is made up. Lesson names and
   parts in mock.ts match the real Lesson 1 pages, and every lesson link opens one.
5. Once a role is set, the nav shows it and offers a way to switch.

Done when:
- on the built site: Sign in, teacher, dashboard, a lesson link, back, switch role,
  student dashboard, with no script error in npm run shots
- npm run build passes
- npm run shots -- p6-dash /signin/ /dashboard/teacher/ /dashboard/student/ and you have
  looked at each image at both widths
```

### Prompt 7: Roadmap and Team

```text
HelpingHand site, branch LZ-C5.2. Read docs/README.md first (Decisions, Rules
and Theme), and follow the Rules. Do not commit or push.
Prompt 1 must already be done.

Goal: the last two pages of the demo path are true and finished-looking.

Read: src/pages/roadmap.astro, src/pages/team.astro.

Do:
1. Team: four people with the names and roles in docs/README.md (Theme). A bio and a photo
   for each where the repo has them; otherwise a labelled placeholder (initials for the
   photo). The line "Founded at NYU Tandon, 2026, as a Semester-Long Design Project." once.
   Contact as a mailto link.
2. Roadmap: four phases as a timeline.
   1. Now: the kit and a static curriculum. Lesson 1 in draft, more lessons in progress.
   2. Accounts, classrooms, assignments, progress tracking, bookmarks.
   3. Community: project showcase, forum, questions and answers, shared docs and slides.
   4. An intermediate track and more mechanisms: gears, several motors, new fingers.
   Say plainly which parts of today's site are a demo of phase 2.

Done when:
- npm run build passes
- npm run shots -- p7-pages /roadmap/ /team/ and you have looked at each image
```
