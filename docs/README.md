# HelpingHand site: plan, design and to do

One file for the whole site: where it stands, what is left to do, what changed in the design,
the theme, and the plan with its prompts. Agreed 2026-11-17 between Lingbo and Claude. On
2026-11-18 the build plan and the theme, until then two files, were combined here, `main` was
pulled, the look was brought closer to the poster, and the work was first pushed to GitHub,
as branch `LZ-C5.2`.

| Date | What |
|---|---|
| Sun 2026-11-22 | Lingbo uploads the new motor housings. This was to be the site freeze; the plan Lingbo agreed on 2026-11-21 runs past it (the new hand, "Test your code", the simulator), so the freeze no longer holds. That is Claude's reading: Lingbo did not mention the freeze. |
| Wed 2026-11-25 | Last day for a teammate's file. |
| Sat 2026-11-28 | "Test your code" has moved the real hand, or Dec 1 shows it on screen only. |
| Tue 2026-12-01 | Presentation to faculty judges. The site runs locally on Lingbo's Mac, in Chrome. |

| Section | What it holds |
|---|---|
| [Where things stand](#where-things-stand) | What is on GitHub, and what is on the build machine, page by page. |
| [To do](#to-do) | Every open item, with who owes it. |
| [Design changes](#design-changes) | A dated log of what changed, and the choices made without asking. |
| [The hand on the homepage](#the-hand-on-the-homepage) | Where its shape and its motion come from, and how to rebuild it when the CAD changes. |
| [Test your code](#test-your-code) | The page that drives the hand over USB: its files, the lines that cross the cable, and the sketch. |
| [Simulator](#simulator) | The six guided steps: their files, and how to add a step. |
| [Theme](#theme) | Colours, type, building blocks, motion, and the wording from the team poster. |
| [The plan](#the-plan) | What the site has to do, the decisions, the rules, and the prompts still in use. |
| [Prompts already run](#prompts-already-run) | Prompts 1 to 7, kept for the record. |

## Where things stand

Checked against GitHub on 2026-11-24 at 11:35 Pacific.

**The new site was merged into `main` on 2026-11-21, as pull request 6.** Lingbo asked for
the merge that day. The first run of the new publishing step and a look at the live site
came straight after it; what they showed is written in that pull request's conversation,
<https://github.com/khan-builds/HandiWorks-Co.-Website/pull/6>.

### On GitHub

Until the merge `main` was at `5fb3427`, "Finish removing the interactive finger module
page", pushed by Clarence on 2026-11-18 at 09:36. The live site is
<https://khan-builds.github.io/HandiWorks-Co.-Website/>.

Two teammates changed `main` that morning:

- **Golam** pushed three commits to the hand on the homepage. Together they change three
  lines of the hand's script: the fingers and the thumb now curl the other way, toward the
  palm, and the message shown when the 3D hand cannot start is plainer. **These are in this
  branch.**
- **Clarence** merged pull request 5 at 09:15: a finger simulator for Lesson 1 that runs with
  no kit, a static page at `lessons/finger-module/` with one script and one stylesheet. By
  09:36 he had taken it out again in two commits. `main` then held the same files as
  `7b2cf6d`, the commit this branch is built on, so **nothing on `main` was missing from this
  branch**. The simulator is still on his branch `feature/interactive-finger-module`. It is
  in [To do](#to-do).

No one pushed to `main` between then and the merge. It was fetched again just before.

What the live site was until the merge:

- One page: Golam's homepage, a dark stage with the scroll-driven hand. An older preview
  sits at `/version-1/`.
- "Lessons", "Start learning" and "Enter learning lab" jump to the note "Homepage preview.
  Login and lessons require server hosting."
- There was no Problem, Kit, Lessons list, Sign in, Roadmap or Team page.

Other branches on GitHub:

| Branch | Last change | What it is | What happens to it |
|---|---|---|---|
| `version-1` | Billy, 2026-11-06 | His Lesson 1 and its five step models. | Keep it. `scripts/stl_to_glb.py` reads his step models from it; the site showed those until 2026-11-23, and that script is the way back to them. |
| `nov15-hand-model` | Golam, 2026-11-15 | An earlier take on the Nov 15 homepage update, made a few minutes before the one on `main`. Not merged. | Golam's call. It is in [To do](#to-do). |
| `LZ-C5.2` | Lingbo, 2026-11-24 | This branch: the whole new site. | Merged into `main` on 2026-11-21. Work goes on here, and goes into `main` again when Lingbo asks. |
| `feature/interactive-finger-module` | Clarence, 2026-11-18 | The finger simulator. Merged into `main` as pull request 5, then removed from `main` 20 minutes later. | It is on neither `main` nor this branch. It is in [To do](#to-do). |
| `a/project-setup`, `a/db-schema`, `a/auth-and-lessons`, `a/wire-frontend` | Billy, 2026-10-28 | A server app with real login, as pull requests 1 to 4. All four are still open. | Set aside by the static-mock decision. Billy's call. It is in [To do](#to-do). |

### On the build machine

Branch `LZ-C5.2`, in `~/workspace/SLDP Website`. It was called `site-buildout` until Lingbo
named it on 2026-11-18, when it was first committed and pushed. It sits on `7b2cf6d`, Golam's
last commit of that morning, with his changes to the hand merged into the rebuilt homepage.
Before the merge `main` was four commits further on, but those four add the simulator and
take it out again, so no file differed. Twenty commits are pushed: the rebuild, the hand from the CAD, the emails
on the Team page, the scroll story, everyone's address under Contact, all four addresses
under "Talk to us", the homepage's new first and last scenes, "Request a kit" to all four
people, the homepage story with the flat hand, the receding palm and the littered parts,
and that story without the turn round the hand, with all four modules sliding out, the
played coming apart, and the litter kept clear of the page's content, and last the fingers
taken apart and one rebuilt, a colour for each link in the trace, tumbling pieces, and parts
down the whole page. The twelfth changes this file only: it names the new offline copy. The
thirteenth is the hand in the poster's colours and a tenth larger, the redrawn second scene,
fingers that drop into the palm, and the parts gathering into the mark. The fourteenth is a
colour for each finger, and the four fingers closing into one before the view turns. The
fifteenth colours every finger the same way, with a colour for each joint. The sixteenth
empties the Roadmap page and lists, in the root `README.md`, the pages that still need
review. The seventeenth adds "Test your code" and the Simulator to the student dashboard,
installs the type check and deletes Billy's unused video. The eighteenth gives the hand one
palette, on the homepage, in "Test your code" and in the simulator, and links the simulator
from Lesson 1's row on the student dashboard. The nineteenth is the hand exported from the
CAD's Final v3, wherever the hand moves, and the four fingers hopping into one. The twentieth
puts Final v3 on The Kit and in Lesson 1's step models, and turns The Problem's figures from
computer science to robotics and engineering. Prompts 1 to 9
were run on 2026-11-17, and the look was brought closer to the poster on 2026-11-18 (see
[Design changes](#design-changes)).

**The twentieth commit, "Show Final v3 on The Kit and in Lesson 1, and make The Problem's
figures about robotics", is on GitHub as the tip of `LZ-C5.2`.** It was made and pushed on
2026-11-24 at about 11:40, when Lingbo said "push to the branch" with two pieces of work
still uncommitted: the Final v3 models of 2026-11-23 and The Problem's figures of
2026-11-24. The name is Claude's; Lingbo did not give one. The eighteenth and nineteenth went
the same way. Lingbo usually asks for the two separately, as with the seventeenth: "commit to
the branch LZ-C5.2" on 2026-11-21 at 21:30, then "push it to the branch" a few minutes later.

**`main` is still the merge of 2026-11-21.** Nothing since the sixteenth commit is merged,
so the live site has none of "Test your code", the Simulator, the link in Lesson 1's row,
the hand's new colours, the Final v3 hand on any page, the new four-into-one move or The
Problem's robotics figures. Nothing is waiting uncommitted on the build machine.

What the twentieth commit holds: The Kit's two models and its numbers from Final v3
(`public/models/`, `src/pages/kit.astro`, `scripts/step_to_glb.py`), Lesson 1's five step
models cut from the same finger and the two facts in the lesson that changed with them
(`public/models/lesson-1/`, `scripts/finger_steps.py`, `src/content/lessons/`), the Arduino
sketch's "close" positions, The Problem's figures (`src/data/evidence.ts`,
`src/pages/problem.astro`, `src/pages/styleguide.astro`), the root `README.md`, and this
file. See [Design changes](#design-changes), the entry of 2026-11-24 and the first entry of
2026-11-23.

What the nineteenth commit holds: the hand exported from the CAD's Final v3 (`index.html`,
`scripts/hand_motion.py`), the new way four fingers become one (`index.html`), a wider frame
for the simulator's 3D finger and a fix to how the two dashboard pages' 3D view works out
which part is in front (`src/scripts/sim/`, `src/scripts/hand/view.ts`), the CAD folder's new
name, `~/workspace/SLDP CAD`, in the two export scripts, and this file. See
[Design changes](#design-changes), the entry of 2026-11-23.

| Page | State | Still open |
|---|---|---|
| Home | Golam's four captions, in the poster theme, with the shared nav and footer. Since 2026-11-23 the hand is Final v3 from the CAD, the hand built round Lingbo's final motor housings (from 2026-11-18 until then it was hand v11), and every joint moves by the CAD's own numbers; beside "The kit" one finger module curls and opens, drawn from the same data. The scroll story does what each caption says: the hand starts closed and flat and opens with its fingers toward the visitor; the four finger modules come out, loosen into their parts and close into one, which is rebuilt link by link; its motion is traced from the carriage to the fingertip, each link in its own colour; and at the end the fingers drop back into the palm, the whole hand comes apart, and the parts gather into the HandiWorks mark. The same parts lie in pale sky behind the rest of the page. See [The hand on the homepage](#the-hand-on-the-homepage). Every button leads to a real page. | Lingbo has not yet seen the new hand in the story, or the new way four fingers become one (both 2026-11-23). |
| The Problem | Poster's goal and objectives, and 22 sourced figures. Since 2026-11-24 they are about robotics and engineering, not computer science: teams, clubs and courses by school, hands-on work in class, kit prices, teacher preparation, evidence. | Most school figures are from 2018, the newest national survey; the page says so. The "250,000 students" and "$500 kit" figures are left off: no source says them. |
| The Kit | Since 2026-11-23, the hand and one finger of Final v3 from the CAD, in the homepage's colours, with Final v3's numbers beside them; the poster's testing table. | Final v3 is not printed. The final carriage and lead screw were not uploaded, so the CAD assumes them and the page says only "a lead screw". "What is in the box" is a draft. Circuit diagram is a labelled placeholder until the image arrives. |
| Lessons | Lesson 1 live. Lessons 2 to 4 and the Intermediate track are coming-soon rows. | Titles for lessons 3 and 4. |
| Lesson 1 | Billy's lesson from `version-1`: five CAD steps, wiring, the sketch and its download, questions, teacher notes. Every page says "Draft · under team review". Since 2026-11-23 the five step models are the Final v3 finger, cut at five stages, and the lesson gives the finger's length as 291 mm. | Incomplete, in Lingbo's words on 2026-11-21. Its words are Billy's, written for an older finger, and still teach a servo. Billy has not seen the new step models. Team review (prompt 11). Wiring diagram is a labelled placeholder. No slides link. |
| Sign in, dashboards | Two roles, a made-up class of 20, "Demo data" on both dashboards, Assign visibly switched off. Since 2026-11-21 the student dashboard has a "Test your code" section that opens a page of that name: it drives the hand over USB and shows the same hand moving on screen. See [Test your code](#test-your-code). A "Simulator" section opens six guided steps for Lesson 1, from a see-saw to the finger of the hand. See [Simulator](#simulator). | "Test your code" has never met the real hand, and its Arduino sketch has never been compiled. Neither page has been used by hand in a real browser. Lingbo has not seen the simulator's wording or its questions. |
| Roadmap | Empty on purpose since 2026-11-21: its title, "Coming soon" and one line. | The roadmap itself. Lingbo writes it later. |
| Team | Names and roles from the poster, each person's email, initials for photos, the one line about NYU Tandon. | Bios and photos. |
| Every page | The HandiWorks mark in the nav, the footer and the browser tab, traced from the poster. Under Contact in the footer, all four people's addresses. | The real logo file. |

`npm run build` passed on 2026-11-18: the homepage and 23 pages built by Astro, one of them
a redirect and one a 404 page.

Checked on 2026-11-18, after the poster pass, on the built site in headless Chrome: every
link and file the pages ask for exists; nothing is loaded from another site; no page scrolls
sideways at 360, 390, 768, 960, 1000, 1024, 1100 or 1280 px wide, signed out or in either
role; no script errors on any page. What was not checked is in [To do](#not-checked-yet).
The homepage was built and checked again that evening, after its scroll story changed; the
other pages were not touched.

Screenshots, in `screenshots/` on the build machine (the folder is not in git):

| Folder | What |
|---|---|
| `rehearsal/` | Every page of the demo path, and the style guide, at 1440 and 390 px wide. 60 images. The Problem's four were taken again on 2026-11-24. |
| `problem-robotics/` | The Problem and the style guide with the robotics figures of 2026-11-24, at both widths. |
| `rehearsal-models/` | The Kit and the CAD page frame by frame, so the 3D models show. |
| `kit-final-v3/` | `kit-models-before-after.png`: The Kit's hand and finger as they were and as they are. `lesson-1-steps-before-after.png`: Lesson 1's five step models, the same way. Each model was held still and seen from one side. |
| `rehearsal-teacher/` | Lesson 1 as a teacher sees it, with the teacher notes. |
| `offline-copy/` | The demo path taken from the unzipped offline copy. |
| `poster-before/` | Five pages as they stood before the poster pass of 2026-11-18. |
| `baseline/` | The site before the rebuild of 2026-11-17: what GitHub shows. |

All but the last two were taken again on 2026-11-18.

The offline copy from prompt 8 is `~/workspace/HelpingHand-site-offline-2026-11-24.zip` on
the build machine (3.7 MB), with `HOW-TO-OPEN.txt` and a small `serve.py` inside. It was
built on 2026-11-24 at 11:29, ten minutes before the twentieth commit was made, and holds
the same site as that commit. Its `HOW-TO-OPEN.txt` still calls the newest work "not
committed yet". Against the zip of 2026-11-23 at 19:19, which it replaced, only
three files differ: The Problem, the style guide and `HOW-TO-OPEN.txt`. Served by its own
`serve.py`, The Problem opened with all of its new figures. The pictures in
`screenshots/offline-copy/` are from the zip of 2026-11-23: nine pages at both widths with
no script error and no sideways scroll, and every model and download served.

The zip of 2026-11-22, a snapshot of the eighteenth commit with hand v11, was deleted that
evening too; an earlier session had not been allowed to. The zips of 2026-11-21 and
2026-11-19 were deleted when the next one was made. The
`HOW-TO-OPEN.txt` says to use Chrome or Edge and how to connect the hand. The zip of
2026-11-18
was deleted before that: it was made
before any address was added and before the hand changed, its "Talk to us" showed one
address, Lingbo's at NYU, and anyone opening it saw the site as it was that morning.
**Lingbo looks at the site through this zip and the pictures in `screenshots/`. Make both
again after any change, and delete the zip before it.**

Screenshots of the new hand are in `screenshots/hand-v11/`: the homepage frame by frame at
both widths, and `before-after-1440.png`, six frames of the old hand beside the new one.
They show the scroll story as it was that afternoon.

The scroll story of that evening is in `screenshots/hand-story/`: `story-1440.png` and
`story-390.png` are the whole scroll on one sheet at each width, `before-1440.png` is the
same scroll before the change, `opening-1440.png` is the first five seconds, and the
`home-*.png` files are single frames.

The story as it stands, with the hand Final v3, is in `screenshots/hand-final-v3/`, taken on
2026-11-23: `story-1440.png` and `story-390.png` are the whole scroll on one sheet at each
width; `four-into-one-1440.png` is the four fingers becoming one, in eighteen frames, and
`four-into-one-before-1440.png` is the same stretch as it was until that day;
`kit-finger-1440.png` is the finger beside "The kit" through one curl;
`test-your-code-1440.png` and `simulator-step-6-1440.png` are the two dashboard pages that
draw the same hand; `reduced-motion-1440.png` is what a visitor who has asked for less motion
sees. `rehearsal/` was taken again the same day, after the hand changed, and once more at
19:15 after The Kit's and the lesson's models did: all 15 pages of the demo path at both
widths, with no warning and no error. `rehearsal-models/` and `rehearsal-teacher/` were
taken again at 19:15 as well.

The story as it stood until 2026-11-23, with hand v11 in the colours of 2026-11-21, is in
`screenshots/hand-latest/`:
`story-1440.png` and `story-390.png` are the whole scroll on one sheet at each width,
`1-closed.png` to `9-logo.png` are single frames, `colours-1440.png` is twelve moments in
the old colours above the same twelve in the new, `palette.png` is the two sets of colours
as swatches, and `reduced-motion.png` is what a visitor who has asked for less motion sees.
The motion itself has not changed since 2026-11-19.

**`rehearsal/` and `rehearsal-teacher/` were taken again on 2026-11-19 at 16:05.** Until
then they were from the morning of 2026-11-18, before any address was added, so they showed
one address under Contact and in "Talk to us". The site itself has had all four since the
commits of 2026-11-18 and 2026-11-19. `offline-copy/`, `team-emails/` and
`contact-emails/` were taken again at 14:30 the same day, the first from the new offline
zip. `rehearsal-models/` stayed from 2026-11-18 until it was taken again on 2026-11-23;
`poster-before/` and `baseline/` are still from then, and are kept as the "before" pictures.

The story as it stood at midday on 2026-11-19, with the turn round the flat hand, is in
`screenshots/hand-litter/`: `story-1440.png` and `story-390.png` are the whole scroll
on one sheet at each width, `1-closed.png` to `6-littered.png` are single frames,
`page-1440.png` and `page-390.png` show the parts behind the rest of the page, and
`reduced-motion.png` is what a visitor who has asked for less motion sees.

The story of that morning, with the upright hand that opens and the hand in parts, is in
`screenshots/hand-opens/`: `story-1440.png` and `story-390.png` are the whole scroll on one
sheet at each width, `1-closed.png` to `6-apart.png` are single frames at 1440 px, and
`reduced-motion.png` is what a visitor who has asked for less motion sees. The "Talk to us"
band with all four addresses is in `screenshots/talk-to-us/`.

The footer with everyone's address is in `screenshots/contact-emails/`: `footer-home-1440.png`,
`footer-768.png` and `footer-390.png` are the footer alone at three widths, and the `team-*`
and `kit-*` files are those two pages whole.

## To do

Tick an item by changing `[ ]` to `[x]`. Add what you find missing.

### Put it on GitHub

Lingbo does these. `main` is the live site, and it changes only when Lingbo merges.

- [x] Commit and push the branch. Done on 2026-11-18, as `LZ-C5.2`. That push needed
  `gh auth refresh -h github.com -s workflow` once on the build machine, because the branch
  changes the deploy workflow and GitHub refuses that from a login without the `workflow`
  permission.
- [ ] Look at the build: `screenshots/rehearsal/`, then `screenshots/rehearsal-models/` and
  `screenshots/kit-final-v3/` for the 3D models. `screenshots/baseline/` is the site on GitHub, and
  `screenshots/poster-before/` is five pages before the poster pass.
- [ ] Tell Golam, Billy and Clarence. This did not happen before the merge: Lingbo asked on
  2026-11-21 for the branch to be merged as it stood. Pull request 6 carries a summary for
  them. What each should hear:
  - Golam: his `index.html` changed. Of its 2,188 lines, 2,042 were removed and 736 added.
    His four captions and his five colours for the hand are kept. Its model and the code
    that bends it were replaced on 2026-11-18 by an export from the CAD, hand v11, and that
    evening the scroll story was rewritten to do what each caption says, with his camera
    moves and the Anime.js library taken out: see
    [The hand on the homepage](#the-hand-on-the-homepage). His three curl commits of that
    morning are no longer in the file, because the joints are no longer set by hand. The
    colours, fonts, nav, buttons and words around the hand changed too: see
    [Design changes](#design-changes). His logo is on every page as a tracing from the
    poster, and the real file would replace it.
  - Billy: `app/` leaves the repo, so pull requests 1 to 4 no longer fit `main`. His
    Lesson 1 is on the site as a draft, waiting for his review. His finger video is no
    longer shown on the homepage: a finger drawn from the current CAD is in its place. The
    file is still in `public/videos/`.
  - Clarence: he took his simulator out of `main` himself on 2026-11-18, so the merge no
    longer touches it. This branch removes `app/` and the old workflow, which his simulator
    branch builds on: see [For the team to decide](#for-the-team-to-decide).
  - All three: the `/version-1/` address stops existing. The `version-1` branch stays.
- [x] `git fetch`, then check that edits made on `main` are not lost. Done on 2026-11-21:
  this branch held `main` up to `7b2cf6d`, and `main` was four commits ahead with no file
  different, so the merge took nothing of a teammate's away. From now on `main` holds the
  rebuilt homepage, so a teammate's edit to `index.html` starts from the new markup.
- [x] Merge into `main`. Done on 2026-11-21, as pull request 6. Whether the "Deploy site" run
  passed and what the live site showed is in that pull request's conversation.

### Who owes what

Nothing here blocks a prompt. Each item ships as a labelled placeholder until it arrives,
then goes in with prompt 10.

**The last day for a teammate's file is Wednesday 2026-11-25.** Lingbo set it on 2026-11-21.
What has not arrived by then stays a labelled placeholder on Dec 1.

- [x] **Lingbo:** the latest motor housings, as CAD in `~/workspace/SLDP CAD`. They came on
  2026-11-22: `Final Housing and Base/`, and the hand built round them, `Final v3/`. The hand
  on Home was exported from Final v3 on 2026-11-23, and The Kit's two models and Lesson 1's
  five step models followed that evening.
- [ ] **Lingbo:** the roadmap. The page is empty until then.
- [ ] **Lingbo:** the hand's wiring, in the table at the top of
  `public/downloads/helpinghand_bench.ino`: which shield and port each motor is on, which way
  closes it, how long each takes from open to closed, the two button pins, and whether the
  gyroscope is an MPU-6050. Then Verify, upload, and try it from "Test your code" on the Mac
  in Chrome. If it has not moved the real hand by Saturday 2026-11-28, Dec 1 shows the page on
  screen only.

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

- [x] **Which hand the site shows.** Decided by Lingbo on 2026-11-21: neither of the two
  below. Both are out of date, new motor housings are coming, and Home and The Kit are both
  exported from that one CAD. How the question stood before that:
  since 2026-11-18 the homepage shows hand v11, the newest
  CAD: the palm built for Lingbo's own finger housing, with the thumb as a module. On it a
  finger curls to 53.5°, because that housing gives the carriage 18 mm to travel. The Kit
  page still shows hand v10 and finger module v4, with v10's numbers: an M3 threaded rod, a
  90° curl, a module 282 mm long, "CAD v10". The two pages disagree until one hand is
  picked. The CAD notes say the same thing from their side: two hands are current (v11, and
  "v10 full curl" with a 90° curl) and one finger module has to be chosen. Lingbo's call.
  - If v11: add `hand-v11` and a finger v5 entry to `scripts/step_to_glb.py`, run it, and
    change the Kit page's two models, their captions, and the rows Finger drive, Finger
    curl, Finger module, Size and Status, from hand v11's README in the CAD folder.
  - If the 90° hand: point `HAND` in `scripts/hand_motion.py` at its folder and bring the
    part names up to date (its header says how), and the Kit page needs its models
    re-exported for finger v5 all the same.
- [x] **The Kit page still shows hand v10.** Done on 2026-11-23, when Lingbo said "update
  everything based on the CAD": see [Design changes](#design-changes). The Finger drive row
  says "a lead screw" and no more, because of the open point at the end of this item. How it
  stood: its two models are the old hand and the old
  finger, and the numbers beside them are the old hand's: an M3 threaded rod, a 90° curl, a
  finger module 282 mm long, an electronics box, "CAD v10, 17 Nov 2026". On Final v3 a finger
  curls to 72°, its motor housing is 130 mm long and 33 mm wide, the electronics sit under
  one curved shell on the back of the hand, and the flat hand is about 32 × 26 × 11 cm.
  Lingbo asked on 2026-11-23 for the new CAD in the site's animations, which Claude read as
  the moving hand and not this page. To bring it up to date: add Final v3's hand
  (`Final v3/OPEN IN CAD/Final_v3.step`) and one finger of it to `scripts/step_to_glb.py`,
  run it, and change the two models, their captions, the "Electronics box" line and the rows
  Finger drive, Finger curl, Finger module, Size and Status from `Final v3/README.md`. The
  Finger drive row needs Lingbo's word first: the final housing's carriage and lead screw are
  not in the CAD yet.
- [x] **Billy's finger video.** Decided by Lingbo on 2026-11-21: delete the file. Deleted the
  same day; it is in the history up to commit `4e46fcb`. It showed the older upright finger coming apart and going
  back together. A live finger from the CAD took its place on 2026-11-18. If that stays,
  delete `public/videos/finger-hero-transparent.webm` (2.6 MB, no page asks for it now). If
  the video should come back, it needs rendering again from the current finger.
- [ ] **Servo or DC motor.** Lesson 1 teaches a positional servo. The hand on The Kit page is
  driven by DC motors on lead screws. Decide which the lesson should teach, in the review.
- [x] **288 mm or 282 mm.** Neither, since 2026-11-23: Final v3's finger module is 291 mm
  from the rear of its housing to the fingertip, the lesson's step models are cut from it,
  and the lesson and The Kit both say 291. Before that the lesson said 288 mm, the CAD notes
  gave the older finger module as 282 mm, and Billy's step models came from an older file.
- [x] **Light or navy stage on the homepage.** Light, decided by Lingbo on 2026-11-21. Light
  is built. Navy with white captions is
  the option not taken, and it has not been built to compare.
- [x] **Clarence's finger simulator.** Decided by Lingbo on 2026-11-21: it stays out, and the
  team builds its own. He merged it into `main` on 2026-11-18 and removed it
  20 minutes later. It is on his branch `feature/interactive-finger-module` and nowhere
  else. It was built on the old site: its page is `lessons/finger-module/`, it points the
  old homepage's Lessons buttons at that page, and it embeds itself in `app/`, which this
  branch removes. The simulator itself is one script and one stylesheet with no server. It
  was tried in this branch on 2026-11-18 and it works inside Lesson 1's overview page, in
  the site's look, with his two files untouched. The patch that does it is on the build
  machine at `~/workspace/HelpingHand-finger-simulator-in-lesson-1.patch`. It was made
  against `main` with the simulator in it, so his two files have to be brought over from
  his branch first. Ask Clarence why he took it out, then decide whether it goes in
  Lesson 1.
- [ ] **Pull requests 1 to 4** (Billy, 2026-10-28: the server app with real login). The site
  is a static mock through Dec 1 and real login is a Roadmap item, so they can be closed, or
  left open as the start of that work. Billy's call.
- [ ] **Branch `nov15-hand-model`.** `main` holds the later version of the same homepage
  update. Delete it or keep it. Golam's call.

### Not checked yet

- [ ] A real phone. Phone widths were checked in headless Chrome only.
- [ ] A real Windows laptop, opening the offline copy with no network.
- [ ] Hover states and the page-to-page cross-fade, which a screenshot cannot show.
- [ ] How the scroll story feels under a real mouse wheel, trackpad and finger. Its poses
  were checked frame by frame; its smoothness in motion can only be judged by scrolling it.
- [x] `npm run check`. Installed and run on 2026-11-21 (`@astrojs/check`, `typescript`,
  `@types/node`): no errors, no warnings, 36 hints, all of them about a deprecated name in
  `src/content.config.ts`.
- [ ] The Arduino sketch, `public/downloads/helpinghand_bench.ino`. It has never been compiled:
  the build machine has no Arduino tools and no C++ compiler, and installing them was not
  allowed. Press Verify in the Arduino IDE first.
- [ ] "Test your code" against a real board. Every check ran against a stand-in for the board
  written in JavaScript. The browser's own USB serial code has not been exercised, and neither
  has a motor, the gyroscope or a button.

### After any change

Run prompt 8 again, because the offline copy is a snapshot, then prompt 9. When a teammate
sends content, use prompt 10. When the team has reviewed Lesson 1, use prompt 11. All four
are under [Prompts in use](#prompts-in-use).

What waits until after Dec 1 is under [Not in this plan](#not-in-this-plan).

## Design changes

Newest first. Each entry says what changed and why, then what was decided during the work and
not by Lingbo, with the option not taken. Say so if any of those should change.

### 2026-11-24: The Problem's figures, about robotics and not computer science

Lingbo: "I wnat the statistics for the problem to be more focused on robotics in general.
Right now the data is too CS skewed when our product is mainly targeted to robotics as a
whole".

Before, 10 of the page's 18 figures were about computer science: the header panel, two of
the three under "Where things stand", all four under "Access" and all three under
"Teachers". Now one of 22 is, and it is labelled as such.

| Part of the page | Before | Now |
|---|---|---|
| Header panel | Plan to study computer science in college: 18% without computer science classes at school, 42% with. | Schools with a team in engineering competitions such as robotics: 25% of the highest-poverty schools, 36% of the lowest-poverty. |
| Where things stand | 60% of high schools offer computer science; 37% of middle schools do; a FIRST Robotics Competition team's $24,250 season. | 35% of middle schools have a team in an engineering competition such as robotics (24% of elementary, 47% of high schools); 46% of high schools offer an engineering course (physics 82%, biology 97%); the $24,250 season, kept. |
| Access | Computer science by suburb, city and country, by school size, for Native American students, for young women. | A team in the largest schools against the smallest, 45% vs 20%; an engineering club in the lowest-poverty schools against the highest, 39% vs 26%; a team in rural, suburban and urban schools, 32 / 32 / 29%. |
| In class | Not on the page. | 42% of middle and high school students have used coding programs, robots or 3D printers in class, and 29% have built a circuit; 51% of middle school science classes take up engineering only a few times a year. |
| Cost | Four prices of robotics kits and teams. | Unchanged. |
| Teachers | Three figures about computer science teachers. | 3% of elementary teachers feel very well prepared to teach engineering (51% not adequately); 3 / 10 / 13% of elementary, middle and high school science teachers have taken a college engineering course; 14% of middle school science teachers feel very well prepared to teach developing solutions to an engineering problem. |
| Evidence | The meta-analysis of educational robotics; FIRST alumni. | Both kept. Added: students taught four or five technology topics such as robotics are 2.6 times more likely to want a STEM job. The poster's 18% / 42% is here now, as a row, labelled as about computer science. |
| What nobody counts | 16.9% of students at a high school with a robotics course, from 2013. | Kept. Added: 46% of eighth graders Proficient on the national test of technology and engineering literacy in 2018, a test that was retired in 2023; and a sentence that the school survey is from 2018 and the next was announced for 2027. |

What the new figures say that the old ones did not: for robotics teams and engineering
clubs, where a school is makes little difference (32 / 32 / 29%). Size and money do. So the
"Access" heading changed from "where you live and how big your school is" to "how big a
school is and how much money its families have".

Every new figure was read in its source on 2026-11-24, the document itself and not a
summary of it:

| Source | What was read | Figures |
|---|---|---|
| Horizon Research, *Report of the 2018 NSSME+* (December 2018; 1,273 schools, 7,600 teachers, nationally representative) | Tables 2.7, 2.38, 2.42, 4.4, 5.26, 7.7, 7.10, E-38 to E-40, and the text beside them | Every school, class and teacher figure. The table is named beside each one in `src/data/evidence.ts`. |
| Gallup and Walton Family Foundation, *Voices of Gen Z: Perspectives on STEM Education and Careers* (2023; 2,006 people aged 12 to 26) | The whole report, 8 pages | 42%, 29%, 81%, and 2.6 and 2.2 times. |
| NCES, *Condition of Education*, "Technology and Engineering Literacy" | The indicator, 4 pages | 46% Proficient in 2018. |
| National Assessment Governing Board, news release of 2023-08-04 | The release | The test was given in 2014 and 2018 and was voted off the schedule. |
| CADRE, project page for the 2027 NSSME+ | The page, which is marked as archived | The next survey was announced for 2027. Not checked: whether it is still funded. |

The cost figures, the two evidence figures that were kept, the 2013 figure and the poster's
figure were not opened again; they stand as checked in October and on 2026-11-17.

What to know before quoting these:

- **Most of them are from 2018.** That is the newest national survey that asks schools about
  engineering courses, clubs and competition teams. The page says so under the three lead
  figures and again under "What nobody counts".
- **The survey's question is "engineering competitions (e.g., Robotics)"**, so the page says
  "engineering competitions such as robotics". It is not a count of robotics teams alone.
- **The header's gap is 11 points with a standard error of about 5.** The quarters in between
  are 39% and 25%, so the richer half of schools is at 36 to 39% and the poorer half at 25%.
- **The teacher figures are about science teachers**, the ones the survey asked about
  engineering. Nobody surveys "robotics teachers".
- **Nothing replaces the old figure about young women** (34% of computer science students).
  No source opened gives a robotics figure by sex for schools. On the national test, girls
  outscored boys, 155 to 150; that is not on the page.

Decided during the work, not by Lingbo:

- **The header leads with robotics teams by school poverty.** It is the page's own headline,
  "still a privilege", as two numbers. Not taken: teams by school size (45% vs 20%, a wider
  gap, but about size and not money), and keeping the poster's figure on top.
- **The poster's 18% / 42% stays on the page**, as the last row under "Evidence", with the
  words "The figure on our poster. It is about computer science classes, not robotics." Not
  taken: removing it, which would leave the site without the poster's figure.
- **The computer science figures were taken off, not kept beside the new ones.** They are in
  git history and in the team's research doc.
- **A new section, "In class"**, for what students say they have done with their hands.
- **No section on the robotics industry or robotics jobs.** The page is about access at
  school. If Lingbo wants "why robotics matters" figures (robots installed, jobs), they need
  sources opened first.
- **The 2018 figures do not carry the "Older data" badge**; one sentence says their year and
  that nothing newer exists. Not taken: a badge on twelve rows.
- **In the code**, `pursuit` became `gap` and `older` became the list `uncounted`
  (`src/data/evidence.ts`); the style guide page, which shows the same panel, follows.
- **The team's research doc was not changed.** The new figures are not in it yet.

Checked: `npm run build` and the type check pass; The Problem at 1440 and 390 px wide with
nothing overlapping or running off the side; the same page served from the new offline zip,
with all 23 numbers on it. Pictures: `screenshots/problem-robotics/`, and The Problem's four
in `screenshots/rehearsal/`.

Not checked: on a real screen, and the fifteen outbound links by clicking them (the five new
addresses each answered when fetched).

### 2026-11-23: The Kit's models, Lesson 1's step models and the sketch's grip from Final v3

Lingbo, 2026-11-23: "update everything based on the CAD and summarize the changes on the
website". A few minutes before, in another session, the same thing in other words: "update
all models in the website with the new hand cad model". That session closed part way through
(its export ran the machine out of memory), and this entry is the work finished. The moving
hand was already Final v3: the entry below. This is everything else on the site that was
drawn from, or quoted, an older hand.

| What | Before | Now |
|---|---|---|
| The Kit, the hand | Hand v10, CAD of 17 Nov, lying flat, with a box on its back | Final v3, CAD of 22 Nov, standing up with the palm toward the visitor: `public/models/hand-final-v3.glb`, 1.7 MB |
| The Kit, one finger | Finger module v4, CAD of 11 Nov | The middle finger of Final v3: `public/models/finger-final-v3.glb`, 0.7 MB |
| The Kit, the numbers | M3 threaded rod; curl to 90°; module 30 × 282 mm; 31 × 24 × 13 cm; "CAD v10, 17 Nov 2026" | A lead screw; curl to 72°; module 33 × 291 mm; 32 × 26 × 11 cm lying flat with the thumb out; "CAD Final v3, 22 Nov 2026" |
| The Kit, the words | The thumb "bolts on"; the electronics "ride in a box"; M3 screws are "the only fasteners"; grey parts are "motors, the Arduino, screws" | The thumb "slides on"; the electronics "sit under one curved shell that is the back of the hand"; M3 screws are nearly all, with two #6-32 on the thumb's swing motor; grey parts are the screws and nuts, and the motors and boards are inside |
| Lesson 1, the five step models | Slices of Billy's older finger file, all one light blue, open where they were cut | The Final v3 finger cut at 66, 130.45, 188 and 244 mm from the rear of its housing, and whole; closed where they are cut; in the hand's colours |
| Lesson 1, two facts | "about 11 inches long (288 mm)"; a teacher note about STL slices in inches | "about 11.5 inches long (291 mm)"; a teacher note that says what the five models are now |
| The sketch's "close" positions | 72, 72, 45, 74: hand v11's grip | 78, 78, 91, 61: Final v3's grip, the same numbers the page sends |

The colours are the homepage's, part for part (`COLOURS` in `scripts/step_to_glb.py`, a
third copy of the table under [The hand on the homepage](#the-hand-on-the-homepage)), so the
hand looks the same on Home, on The Kit, in the lesson and on the two dashboard pages.

**Where the numbers come from.** The curl, the housing's width and the fasteners are from
`Final v1/README.md` in the CAD folder, which Final v3 is built on; the shell and the status
from `Final v3/README.md`; the lengths and the overall size were measured from
`Final v3/OPEN IN CAD/Final_v3.step` (the finger module runs from 0 to 291.0 mm, the whole
hand is 319 × 261 × 109 mm). The grip is `pinch` in the hand's data: fingers to 55°, thumb
swing 58°, thumb curl 72°, which are 78%, 61% and 91% of each motor's travel.

**How the export changed** (`scripts/step_to_glb.py`):

- It ran out of memory on this hand: past 7 GB in 40 seconds, which is what ended the
  earlier session. The cause: it turned every part upright one at a time, a part taken from
  the CAD file is still attached to the whole assembly, and copying it copies the assembly,
  65 MB a time over 156 parts. The geometry is now left as the CAD has it, and the model is
  stood up by one rotation written into the file. The whole export takes 6 seconds and half
  a gigabyte.
- `tidy()` rewrites the file the CAD kernel produces. The kernel writes a separate piece of
  mesh for every face (8,204 for the hand) with texture coordinates nothing uses, and writes
  four identical fingers four times. Joined, stripped and stored once, the hand went from
  3.4 MB to 1.7 MB and the finger from 1.2 MB to 0.7 MB, with the same shapes, names,
  colours and shading.
- `scripts/finger_steps.py` is new. It takes the same finger, cuts each solid at a plane
  across the finger, and writes the five step models. `scripts/stl_to_glb.py`, which made
  the old five, is kept and says at its top that it is the way back.

**Checked.** Each model file was read back by a separate script: the header and every
offset are right, no index points past its vertices, every normal is unit length, the hand
measures 261 × 319 × 109 mm with the fingertips highest and the palm side toward the
viewer, and the finger 291 mm. On the built site every model loads at 1440 and 390 px with
no script error and no sideways scroll; no page asks for a file that is missing; the 37
checks of "Test your code" and the 46 of the simulator pass, and the page's Close sends
78, 78, 91 and 61. The type check and the homepage check pass.

**Choices made without asking:**

| Chosen | Not taken |
|---|---|
| Lesson 1's step models were replaced too. On 2026-11-21 Lingbo said the lesson stays as it is; "everything" and "all models" were read as later and wider. | Leaving Billy's five models. They are in the history (`git show aace34e:public/models/lesson-1/01-base.glb`), and `scripts/stl_to_glb.py` writes them again. |
| The five cuts are placed so each picture still shows what Billy's step says: the rear of the housing with its mounting holes; the whole housing with the carriage and the start of the link; the base, the knuckle and the first pivots; both bars and the first two segments; the whole finger. | Cutting at Billy's own distances (68, 127, 188, 244 mm), which on this finger would cut the housing 3 mm short of its end. |
| The lesson's other words were left alone. It still calls the motor a servo. | Rewriting Billy's lesson to match the hand. That is the team's review. |
| The step models are in the hand's colours. | One light blue, as before: the parts are harder to tell apart. |
| "Finger drive" says "The motor turns a lead screw. No gears." | "A printed lead screw". The final carriage and lead screw were never uploaded; the CAD assumes actuator v3's carriage and the screw of 2026-11-17. |
| The boards, the motors and the screws under the shell are left out of the hand's model. | Drawing them. They cannot be seen and they add to the file. |
| The hand is meshed to 0.3 mm, the finger and the step models to 0.12 mm. | Finer. Nothing shows at the sizes the page draws them. |
| The sketch's `closeAt` numbers were changed, in a file Lingbo may already have downloaded. | Leaving the sketch on hand v11's grip while the page sends Final v3's. |

**Not done, and not verified:**

- Seen in headless Chrome only: no real browser, no real phone.
- Billy has not seen the new step models, and nobody has read the lesson against them but
  Claude.
- Final v3 is not printed, and no real part was measured.
- The sketch is still not compiled and has still not met the hand.

### 2026-11-23: the hand from Final v3, and four fingers that hop into one

Two asks from Lingbo on 2026-11-23: "use the updated CAD (final v3) for the website
animations", and, while that was being done, "i dont like the animation connecting the four
into one finger can you improve it using any animation you find interesting at anime.js".

**The hand.** Everything that draws the moving hand now draws Final v3, the hand the CAD
session built on 2026-11-22 round Lingbo's final motor housing: the scroll story and the
finger beside "The kit" on the homepage, "Test your code", and the simulator's sixth step.
They share one export, so they changed together. What a visitor sees that is different:

| | Hand v11, until now | Final v3 |
|---|---|---|
| Finger curl | 0 to 53.5° on 18 mm of carriage travel | 0 to 72.4° on 17.8 mm |
| Finger linkage | Finger v5, the long arm | Finger v4's, on the final housing and Lingbo's final base; the link runs 10° downhill to the carriage |
| Knuckle | 14.5 mm above the screw's line | 6.0 mm above it |
| Finger housing | 124.1 mm long, 30 wide | 130.45 mm long, 33.2 wide, with the lead windows in its sides |
| Back of the hand | A two-level electronics box, 69 mm deep | One curved shell, 36 mm deep at the wrist and 15 at the knuckles, on a plate |
| Rear of the palm | A wiring bay in the palm print | A screw-on end cap |
| Pinch the story opens on | Fingers 40°, thumb swing 70°, curl 36° | Fingers 55°, thumb swing 58°, curl 72° |
| Size, flat | 318 × 261 × 142 mm | 319 × 261 × 109 mm |

The thumb is the same unit, and its module differs only by a hole in its floor for the
motor's wire. The story's moves, its views and its timing are unchanged apart from the two
things below.

**Four become one.** Until now the three other fingers slid sideways onto the middle one as
whole lines. Now the four loosened fingers are treated as what they are at that moment, a
grid of parts four across and eight deep, and the move runs through the grid as a wave: from
the fingertips back to the housings, row after row, and in each row the middle finger's two
neighbours a beat before the finger beyond them. Each part hops over onto the same part of
the middle finger: up out of its line, across in an arc, one whole turn about the finger's
length on the way, and down. The part it lands on swells for a beat. The two neighbours'
parts meet over the middle finger as a V, row after row.

What was taken from Anime.js, read on animejs.com that day (version 4): its staggered grid,
where one animation runs through a grid of things with a delay that grows from a chosen
point (`stagger(200, { grid: [13, 13], from: 'center' })`, each dot's scale going from 1.1 to
0.75), and its sprung landing. The library itself is not used: the story still follows the
scroll through its own list of moves, which is why Anime.js was taken out on 2026-11-18.

Decided during the work, not by Lingbo:

- **Which animation.** The staggered grid, because four fingers of eight parts already are a
  grid. Not taken: Anime.js's path-following (each finger carried along a drawn curve), its
  shape morph (which needs outlines, not solid parts), and its random scatter (too close to
  the coming apart at the end of the story).
- **The wave starts at the fingertips,** the end nearest the visitor, and travels away. Not
  taken: from the middle of each finger outward, which closes both ends at once and is over
  sooner.
- **Each part makes one whole turn.** It has to end exactly as its twin lies, so the turn is
  a whole one or none. None is calmer and reads as sliding again.
- **The swell is on the part that stays,** 16 % for the neighbours' landing and 11 % for the
  far finger's. A bounce on the arriving parts would carry them through each other.
- **The move takes the same 650 steps of the scroll** as the slide did, so nothing after it
  moved.
- **A module now comes 136 mm out of its socket, not 130** (`PULL`). The new housing is longer
  and its socket is 130 mm deep, so at 130 the module would only just have left. The CAD
  checks a module pulled out as far as 130 mm; past that all of it is ahead of the palm.
- **The end cap, the electronics plate and the shell are drawn as part of the palm,** in the
  palm's navy, and stay on it when the hand comes apart. The boards under the shell are left
  out, as the boards in the box were.
- **The simulator's 3D finger is framed 14 mm higher and a little tighter,** because the
  finger now curls further and its tip came within 3 mm of the frame's top.
- **The Kit page is not touched.** Lingbo asked for the animations. Its two models and its
  numbers are still hand v10's: see [For the team to decide](#for-the-team-to-decide).
- **Lingbo had said the scroll story was not to change until they came back to it.** The
  second ask is read as that.

**Found on the way, and fixed.** With the new palm, "Test your code" drew a dark triangle
and thin streaks on the palm's top. The hand's data was right. The view those two dashboard
pages share (`src/scripts/hand/view.ts`) worked out which part is in front in a way that is
exact only at a triangle's corners, and Final v3's palm top is one plain face cut into
twelve large triangles: the first face large enough for the parts under it to show through
its middle. One term of that view's shader changed. The homepage's own view never had the
fault.

Checked: `scripts/hand_motion.py --check` puts every exported part within 0.04 mm of the CAD
in five poses, and `--check-path` finds nothing touching in 34 poses on the way into the
pinch, with the two tips meeting by 1.76 mm³ at the pinch. The simulator finds all nine of
the finger's pins in the new tables, each to under a thousandth of a mm. The build and the
type check pass. The story was filmed at 22 moments at 1440 and 390 px wide, and the
simulator, "Test your code" and the finger beside "The kit" were opened, with no script
errors. The pictures are in `screenshots/hand-final-v3/`. The rehearsal pictures and the
offline copy were made again from this work.

Not checked: on a real screen, and in motion. The hop was judged from eighteen still frames.
The scratch checks of 2026-11-21 for the simulator (46) and "Test your code" (37) were not
run again: they are not in the repo.

### 2026-11-21: the hand's colours as one palette

Lingbo: "can you update the animation to change the colors to be more cohesive reference some
color theory and design theory". The colours before were one for every joint, as Lingbo had
asked on 2026-11-19, but eight unrelated hues at full strength: teal, pink, navy, coral,
yellow, violet, orange, sky. Nothing tied them to each other or to the site.

What stays, because Lingbo asked for it earlier: every finger is coloured alike, the colour
changes at every joint, and when the trace lights a link a visitor with no training can
tell it from its neighbours. The motion is untouched.

What changed, and the idea behind each choice:

| Choice | The idea it rests on |
|---|---|
| Two colour families, not eight colours. Blues for the three segments, warm colours for the four parts that pass the motion along. | A complementary scheme: blue and orange sit opposite each other on the colour wheel, so each makes the other look clearer, and two hues read as one decision where eight read as none. Itten lists this "complementary contrast" and the "cold-warm contrast" among his seven colour contrasts (*The Art of Color*, 1961). |
| Parts with the same job share a family: what swings is blue, what carries the motion is warm. | The Gestalt law of similarity: things that look alike are read as belonging together. The colour now says what a part does, and the simulator uses the same code, so a rod is warm there too. |
| Inside a family the parts differ by lightness, in even steps, dark at the housing and light at the fingertip. | Itten's "light-dark contrast", and the practice from map-making of ordering a ramp by lightness so it reads as a sequence (Brewer's ColorBrewer schemes; two such ramps in opposite hues is her "diverging" scheme). The steps were set in OKLCH, a colour space built so that equal numbers look like equal steps (Ottosson, 2020): each is 0.11 to 0.18 of lightness. |
| The blues run from the brand's navy to the brand's sky. | The palette is anchored on the two colours the whole site is already made of (navy at hue 262, sky at hue 222), so the hand belongs to the page it sits on. |
| A navy palm, blue-grey housings, and the strong colours kept for the small moving parts. | Figure and ground: quiet large areas, strong small ones, so the eye goes to what moves. It is also the 60-30-10 habit of interior and graphic design (a dominant colour, a second, an accent), and Itten's "contrast of extension": a bright warm colour needs far less area than a blue to balance it (he gives orange to blue as about 1 to 2). |
| Any two parts that touch differ by a family or by a full step of lightness. | Checked by number, not by eye: every touching pair is at least 0.11 apart in OKLab, and stays so when the colours are passed through a model of red-green colour blindness (Machado, Oliveira and Fernandes, 2009). Blue against orange is the pair that red-green colour blindness leaves most intact. |

The numbers are in the table under [The hand on the homepage](#the-hand-on-the-homepage).

Where it applies: the homepage story, "Test your code", and the simulator, both its drawings
and its 3D finger. In the simulator's drawings the bars that swing are now blues and the rods
are amber and gold, and each bar has a faint navy line under it, because gold and sky are
light colours on a pale stage.

Decided during the work, not by Lingbo:

- **Two families, with warm for the parts that carry the motion.** Not taken: a single family
  of blues with one orange accent, which is calmer still but makes seven links hard to tell
  apart; and a three-family set, which starts to read as a rainbow again.
- **The housings went from teal to blue-grey.** They are the largest coloured parts after the
  palm, and a strong colour there competed with the fingers.
- **The link is warm, not navy.** It carries the motion, and navy made it merge with the palm.
- **Left as they were:** the finger beside "The kit" on the homepage (sky, lime and white on
  its navy band), the logo the parts gather into (navy and sky), the pale parts down the
  page, and the two models on The Kit page, which are exported with their own colours and are
  due to be exported again from the new CAD.
- **The colour names in the simulator's code are now the parts' jobs** (`SEGMENT_1`, `BAR_1`,
  and so on), not colour words, so they stay true if the colours change again.

Checked: the homepage's scripts parse and its data block is unchanged; the story was filmed
at twelve moments at 1440 and 390 px wide with no script errors; the simulator's 46 checks
and the 37 for "Test your code" pass; the type check is clean. The pictures are in
`screenshots/hand-latest/`: `colours-1440.png` is before above after, and `palette.png` is
the two sets as swatches.

Not checked: on a real screen. Colours were judged from headless Chrome's pictures.

### 2026-11-21: the simulator linked from Lesson 1's row

Lingbo: "Implement the simulator for lesson 1 as described". Claude read that as the one
piece of the agreed plan that was still missing: the simulator "also linked from Lesson 1's
row" on the student dashboard. The simulator itself was already built and pushed. If Lingbo
meant more than the link, for example the simulator inside Lesson 1's own pages, that is
not done.

Under Lesson 1's three parts on the student dashboard there is now one line: "Try Lesson 1 in
the simulator", a "Demo" badge, and "Six steps, from a see-saw to the finger of the hand."
The "Simulator" section lower on the same page stays.

Decided during the work, not by Lingbo: Lesson 1's own pages are not touched, because Lingbo
said on the same day that Lesson 1 keeps everything it has. Not taken: a link from the
lesson's overview page, which would send a visitor who is not signed in to the sign-in page.

Checked: the build, every link the built pages ask for, the simulator's 46 checks, and the
student dashboard at 390, 768, 1024 and 1440 px wide with nothing scrolling sideways.
Pictures are in `screenshots/simulator-link/`.

### 2026-11-21: the simulator, six steps from a see-saw to the finger

Lingbo: "Our sim would be more like motion gen where we walk students through the concepts
they are taught for example for the finger 1 lesson we would emphasize see saws and how
linking them can bring us four bars six bars and dr4bs. Connecting them allows thier movement
to go cyclically and have them go through guided lessons like these." It goes on the student
portal. Agreed the same evening: flat, six steps, each with one thing to drag, a Play button,
a sentence on what to notice and one question; no free "build any linkage" editor before
Dec 1; the sixth step shows "how it is implemented into the finger of our hand", as "a
combination of steps illustrating each linkage and how the linkages before effect its
movement". How it is built is under [Simulator](#simulator).

The six steps: a see-saw; two see-saws joined by a rod; a four-bar with a crank that goes all
the way round; a six-bar; a double reverse four-bar; the finger of the hand.

Decided during the work, not by Lingbo:

- **All six steps are built.** The agreement let steps 4 and 5 wait if time ran short. It did
  not.
- **"motion gen" is read as the MotionGen linkage app, and "dr4b" as a double reverse
  four-bar.** Lingbo has not confirmed either reading.
- **Every word on the page is Claude's:** the titles, the two sentences of each step, "What to
  notice", the questions and their three answers. Lingbo has not read them.
- **The bars take the colours of the finger's links on the homepage:** coral, yellow, violet,
  orange, sky. By the last step each colour has already done the same job in an earlier one.
- **The finger in step 6 is the real one.** The CAD's tables say where each link is, not which
  link is pinned to which. The page knows the nine pairs and finds each pin from the tables
  as the one point that stays put on both links, so the drawing follows the CAD when it
  changes. With hand v11 every pin fits to under a thousandth of a millimetre. Not taken: a
  finger drawn by eye.
- **Step 6 has four stages:** the push (carriage, link, first segment: the see-saw), the first
  loop (frame, first segment, bar, middle segment: a four-bar), the second loop (first
  segment, middle segment, bar, fingertip: a second four-bar, which makes a six-bar), and all
  of it. Under the drawing the same finger from the CAD moves in 3D, with the same links lit.
- **Step 4's six-bar is a plain one,** two four-bars sharing the rocking bar. It is not the
  finger's own chain; step 6 is.
- **Step 5 sets the upper stage to fold the opposite way by rule.** A real double reverse
  four-bar does it with gears or a link, and the page does not draw those.
- **A wrong answer can be tried again, and nothing is saved.** A reload starts from step 1.

Checked in headless Chrome on the built site, 46 checks, all passing: for each of the six
steps, the machine, its words and its question appear; nothing is drawn outside the stage;
the slider and a drag on the stage both move it; Play moves it and Pause holds it; a wrong
answer is not counted and the right one is. Also: the finger's four stages differ; its three
angles grow from joint to joint (53°, 80°, 116° at full travel); Back and Next; no script
errors; nothing scrolls sideways at 390, 768 or 1024 px. Separately, each machine was swept
through its whole range: no bar changes length, and dragging the handle gives back the
position it was drawn at. Pictures are in `screenshots/simulator/`.

Not checked: by hand, in a real browser, with a real finger or mouse on the stage.

### 2026-11-21: "Test your code", the hand driven from the browser

Lingbo asked for "an UI connected to the arduino so the user can control the hand movement
through a computer interface", as part of the site, on the student portal, "a bit more
technical and cooler": sliders, the gyroscope's data printed, and "a sim hand moving the
same", "very minimalist", marked as a demo "as it is very raw and incomplete". The details
were settled question by question the same evening. How it works is under
[Test your code](#test-your-code).

What Lingbo decided:

- The page talks to the Arduino straight from Chrome over the USB cable. Nothing is installed.
- The page is laid out for the whole hand. The prototype has four motors (index, middle,
  thumb curl, thumb swing); the ring and the pinky are commented out in the sketch "and
  nothing else".
- The hand senses nothing, so the board guesses where each finger is from how long it has run
  its motor. Reset lets the user nudge each finger open by hand, then calls that zero.
- Turning the whole hand past an angle closes it. The page decides that, not the board.
- Two buttons on the hand close and open it with no computer; both together stop it.
- No motor is driven above 175 of 255.
- Hardware: an Arduino Mega, two Adafruit motor shields on SDA and SCL, a VEX battery.

Decided during the work, not by Lingbo:

- **The board keeps the guess, the page draws it.** The sketch counts the run time and reports
  twenty times a second; the on-screen hand shows what the board reports. Not taken: the page
  keeping its own count, which the buttons on the hand would put out of step.
- **The ring and pinky sliders stay and move the hand on screen only.** A pretend board in the
  page covers every motor the real board does not have. Not taken: hiding or greying them,
  which Lingbo ruled out for the page.
- **"Close" is the grip the CAD checks**, not every motor to its end: fingers 78%, thumb curl
  91%, thumb swing 61% with Final v3 (72, 45 and 74 with hand v11, until 2026-11-23). The page
  works them out from the hand's data; the sketch holds them as numbers, in `closeAt`, and
  they have to be changed by hand when the CAD's grip changes. At 100% everywhere the fingers and the thumb would be
  driven into each other. The sketch's close button uses the same numbers.
- **The tilt is read from the direction of gravity**, compared with the direction when the
  hand was called level (at connect, or with "Set level"). That works however the sensor is
  mounted. The on-screen hand tilts with it and assumes the sensor's axes are the hand's:
  fingertips, thumb side, out of the palm. That needs checking once the sensor is on the hand.
- **A nudge stops 0.3 s after the page stops asking for it**, so a closed tab or a pulled
  cable cannot leave a motor running. No motor runs longer than 4 s in one go.
- **The times from open to closed are first guesses:** 3 s a finger, 2.5 s the thumb's curl,
  1.5 s its swing. Which shield port each motor is on is a guess too. Both are in the table
  at the top of the sketch.
- **The sensor is taken to be an MPU-6050.** Lingbo has not named the part.
- **Esc stops the hand**, as well as the Stop button.
- **The readout shows at most two "P" and two "G" lines a second**, and none while nothing in
  them changes; "Every line" shows all forty.
- **The hand's data is served a second time, as `/hand-data.js`,** built from the homepage's
  own block, so inner pages can draw the hand. It adds 1.3 MB to the site.
- **Billy's unused finger video is deleted and the type check is installed**, both agreed with
  Lingbo earlier that day.

Checked in headless Chrome on the built site, 37 checks, all passing: the hand loads and
draws; a slider moves its motor at a steady speed and it arrives; Close, Stop, Esc; Reset with
and without a hand; the tilt rule with the pretend sensor and with the board's; connecting at
115200 baud to a stand-in board that restarts first, as an Arduino does; only the board's own
motors are sent down the cable and only they can be nudged; a held nudge is repeated and
ends once; Disconnect, a pulled cable, and a board that never answers; no script errors;
nothing scrolls sideways at 390, 768 or 1024 px. `npm run check` is clean and every link the
built pages ask for exists. Pictures are in `screenshots/test-your-code/`.

Not checked: the sketch has never been compiled or run, and the page has never talked to a
real serial port. See [Not checked yet](#not-checked-yet).

### 2026-11-21: the Roadmap emptied, the pages to review listed, the site merged

Lingbo went through what is done and what is left, and asked for three things.

- **The Roadmap page is empty.** "Roadmap page should be empty right now I will add it in
  later." It keeps its place in the nav and the footer and shows its title, "Coming soon" and
  one line: "Nothing here yet. The roadmap will be added to this page." The four phases and
  the table of what is live are in the history: `src/pages/roadmap.astro` at commit `5d5da49`.
- **The root `README.md` says which pages still need review and updating**, because that is
  the file GitHub shows first. Lesson 1 keeps its label, "Draft · under team review", as it
  is.
- **The branch is merged into `main`**, as pull request 6, with its changes summed up there
  as a list.

Decided during the work, not by Lingbo:

- The strip on both dashboards ended with a link, "Real accounts are on the roadmap". It now
  reads "There are no real accounts yet." and links nowhere. Not taken: a link to an empty
  page.
- The empty page says in words that it is empty. Not taken: a title with nothing under it,
  which reads as a broken page.
- The root README no longer says the plans "are described on the site's Roadmap page".

What Lingbo settled the same day, and what is not acted on yet:

- Both hands on the site are out of date. New motor housings arrive on 2026-11-22, and Home
  and The Kit are exported again from them.
- The scroll story is not to change for now. Lingbo will come back to it.
- On Dec 1 the site runs locally on Lingbo's Mac, in Chrome.
- Clarence's simulator stays out. The team builds its own, "more like motion gen": guided
  lessons that walk a student through the concepts of a lesson. For Lesson 1: see-saws, and
  how linking them gives four-bars, six-bars and "dr4bs" (read here as double reverse
  four-bars). It goes on the student dashboard.
- A page on the student dashboard is to control the real hand from the browser: sliders, a
  printout of gyroscope data, and a simulated hand that moves the same way, "very minimalist".
  The prototype has four motors, each a DC motor through a driver board: two fingers, the
  thumb and the thumb's joint. The other fingers are stand-ins. Lingbo owns the Arduino side.
  The details are still being talked through.
- The last day for a teammate's file is Wednesday 2026-11-25.
- The homepage stage stays light. Billy's unused finger video is to be deleted. The type
  check is to be installed and run. None of the three is done.

Checked on 2026-11-21 before the merge: the site builds from a clean copy of the tracked
files with `npm ci` and `npm run build`, which is what the new publishing step runs, and that
build is file for file the same as the one on the build machine; every link and file the
built pages ask for exists; the Roadmap page was looked at at 1440 and 390 px wide. The
pictures are in `screenshots/roadmap-empty/`.

### 2026-11-19: every finger the same, a colour for each joint

Lingbo: make each finger the same colour, and change up the joint colours.

| | Before | Now |
|---|---|---|
| The fingers | Each finger one colour of its own: coral, yellow, teal, violet. | All four alike. The colours change along the finger: teal housing, pink carriage, navy link, coral, yellow, violet and orange for the two segments and their bars, sky fingertip. |
| The thumb | Pink. | The same colours as a finger, part for part. |
| "See what moves." | Each link lit in one of seven colours picked for the trace. | Each link gets its own colour back: the trace reads the same table. |

It is in branch `LZ-C5.2`, not in `main`. Only colours changed, so the story's moves, its
rules and its framing are as checked in the entry below. The homepage was run again in
headless Chrome: no script errors, the rules pass over all 2,601 steps, and it does not
scroll sideways at 390, 1024 or 1440 px.

Decided during that work:

| Decision | Option not taken |
|---|---|
| The housing is teal, the colour of the finger that stayed in the last scheme. | Navy, which merges with the palm, or white, which is lost on the white stage. |
| The trace uses the finger's own colours. | Keep a second set of seven colours for the trace, which would no longer match the finger. |
| With every finger alike, four-to-one is told by the motion alone. | Keep one finger a different colour so it can be followed. |

### 2026-11-19: a colour for each finger, and four fingers that close into one

Two notes from Lingbo on the entry below: the colours do not look good, make them more fun;
and the change from the hand to the one finger, four fingers to one, is still off.

| | Before | Now |
|---|---|---|
| The hand's colours | The poster's: sky housings, navy palm, white segments, lime fingertips. | A colour for each finger (coral, yellow, teal, violet), a pink thumb, a navy palm, white segments. |
| Four fingers to one | The other three drifted part of the way toward the middle one and faded, while the view was already turning. Half-faded parts lay over one another. | The other three slide all the way onto the middle one, its neighbours first, and each is gone the moment it lies on it. Nothing is ever half-faded. The view comes in on the one that stays. |
| The view's turn | Roll, lean and bank each on its own timing, so the finger wobbled through odd angles. It began before the fingers had closed. | One turn of 111° about one line, the shortest way. It begins only when one finger is left. |

Each finger having its own colour is also what makes four-to-one easy to follow: the teal
one is the one that stays. Four schemes were drawn side by side
(`screenshots/hand-latest/colour-schemes-compared.png`): this one, one in pink, yellow and
cyan, one in orange and teal, and this one on a white palm.

It is in branch `LZ-C5.2`, not in `main`.

Checked in headless Chrome: every step of the story, 2,601 of them, keeps the six rules, the
last now including that the view does not turn until the fingers have closed; 400 random
jumps agree with scrolling; at 1440 x 900, 1100 x 1000, 1024 x 768 and 390 x 844 the hand
keeps at least 36 px clear through this passage; the build passes with no script errors and
no sideways scroll from 360 to 1440 px. Not checked: a real wheel, trackpad, finger or phone.

Decided during that work:

| Decision | Option not taken |
|---|---|
| The palm stays navy, so the hand still belongs to the site. | A coloured palm, which fought with the fingers. |
| The trace's seven colours and the mark's two are unchanged. | Recolour them to match. |
| The finger beside "The kit" stays sky, lime and white on its navy stage. | The teal of the story's finger. Say so if they should match. |

### 2026-11-19: the poster's colours, a larger hand, a calmer second scene, fingers dropped in, the mark at the end

Five more notes from Lingbo on the entry below:

1. Change the hand's colours to something better looking, and make the hand bigger.
2. At the end of the fourth animation the pieces should spell out the H logo.
3. In the fourth animation the fingers pass through the palm again. They should look dropped
   into it.
4. The second animation looks clunky. Research it and come back with a new one.

| | Before | Now |
|---|---|---|
| The hand's colours | The CAD's: amber housings, a steel-blue palm, navy links, orange fingertips. | The poster's: sky housings, a navy palm and bars, white segments, lime fingertips. The same family as the finger beside "The kit". |
| The hand's size | As first framed. | A tenth larger on a wide stage. Unchanged on a squarer stage and on a phone, where it already fills its place. |
| Build one finger. | Modules slid out, fingers flew apart with a spring and a tumble, three slid sideways onto the middle one, it was rebuilt, and the view turned it once round. | One move of the view and nothing spins. The fingers rise together, loosen into tidy lines of parts, three drift in and fade, the view glides to the middle one, and it is built link by link. |
| The return, in "Try your own design." | The hand came back with one module out, and it slid in as the palm faded in round it. | The hand comes back with all four fingers held above their sockets, clear of the palm. They drop in one after another, land, lift a hair and settle. |
| The very end | The parts spread over the stage and turned pale sky. | The parts gather into the HandiWorks mark and take its colours, and the mark's own shape comes up behind them. |
| The scroll | 7.7 screens. | 7.8 screens. |

What the research said about the second scene, and what was taken from it:

- Guides to scroll-driven 3D say gradual moves read well and twisting or spinning does not,
  and that the camera should move once and stay on the subject. The full turn of the module
  and the tumbling parts are gone, and the view makes one move.
- Guides to exploded views give each part a single line to travel, let the outer parts leave
  first so nothing crosses, and send a part that sits inside another out a different way.
  `LINE` does that: the carriage and its link lift out of the housing, everything else goes
  along the finger.
- Motion-design guides say to ease out on arrival and to let each move start before the
  last has finished. The finger is built that way, carriage first, with no spring: a spring
  tied to the scroll shudders when the scroll is slow.

Four colour schemes were drawn side by side before choosing. White housings and a pale palm
both lost their outline on the white stage. Navy, sky, white and orange was the other one
that held; lime was chosen over orange because it is the poster's.

It is in branch `LZ-C5.2`, not in `main`.

Checked in headless Chrome:

- Every step of the story, 2,601 of them: the six rules under
  [The hand on the homepage](#the-hand-on-the-homepage) all hold. The first run found the
  palm starting back 80 steps before the last module was clear, which is the passing
  through Lingbo had seen; it now waits.
- 400 random jumps in the scroll give the same hand as scrolling there.
- At 1440 x 900, 1100 x 1000, 1024 x 768 and 390 x 844, the hand and its parts keep at least
  20 px clear of the caption, the nav and the edges of the stage from the first frame to
  the mark.
- The build passes, the homepage has no script errors, and it does not scroll sideways from
  360 to 1440 px.

Not checked: how it feels under a real wheel, trackpad or finger, and how fast it runs on a
real phone.

Decided during that work:

| Decision | Option not taken |
|---|---|
| The mark's own shape comes up behind the parts as they arrive. Forty parts alone, many of them thin rods, left the shape too open to read as the logo. | The parts alone. |
| A part is drawn the size of its cell in the mark, so the palm shrinks and a pin grows. | Parts at their own sizes, which cannot fill the shapes evenly. |
| The fingers are held 45 mm clear of the palm before they drop, so the gap shows. | Held just clear, 6 mm, which looks as if they are already in. |
| The larger hand is drawn only where the stage has room. | A tenth larger everywhere, which ran the thumb off a narrow stage. |
| In parts, and as the mark, the hand is the size it was. | Larger there too, which did not fit. |

Sources for the research: [Scroll-triggered animations: a guide to design and performance](https://www.draftly.space/blog/product/scroll-triggered-animation-guide),
[Prompting immersive scroll storytelling](https://williamspurlock.com/blog/scroll-storytelling-playbook-motion-conversion/),
[Three scroll-driven 3D scene patterns for product pages](https://contra.com/community/RJ1v7lWn-three-scroll-driven-3-d-scene-patterns-for),
[Exploded view animation in code](https://dev.to/mohd_yusufkhan_6c2088c04/exploded-view-animation-in-code-make-how-it-works-explainer-reels-51bd),
[5 stage exploded view animation workflow](https://rendimension.com/blog/exploded-view-animation/),
[Motion design principles explained](https://madegooddesigns.com/motion-design-principles/).

### 2026-11-19: fingers taken apart and one rebuilt, a colour per link, tumbling pieces, parts down the whole page

Five notes from Lingbo on the entry below:

1. The fingers should be taken apart and then rebuilt into one.
2. The highlighted joints should be different colours, so someone who is not technical sees
   the difference, and it should look good.
3. More explosion: the pieces should rotate.
4. Portions of the page are missing the parts.
5. Every page is missing the teammates' contact details, and "Talk to us" still has one
   address.

| | Before | Now |
|---|---|---|
| Build one finger. | Four modules slid out, then the view went to one. | Four modules slide out, the four fingers come apart into their parts, the other three slide onto the middle one and are gone, and that finger is built again part by part. Then the view goes to it. |
| See what moves. | Each link turned navy in turn. | Each link takes its own colour: orange, navy, sky, yellow, green, violet, coral. |
| The coming apart | Pieces turned by a few degrees. | Pieces tumble as they fly. Small ones go round more than once; the palm and the modules lean. A slightly deeper draw-in first, and a slightly wider spread. |
| The rest of the homepage | 39 parts, only where there was clear space, so long stretches had none and a phone had 14. | A part to every cell of a grid down the whole page: 96 at 1440 px, 72 on a phone. The words, lists and tables sit on white and the panels are solid, so content covers the parts cleanly. |
| The scroll | 7.1 screens. | 7.7 screens, for the fingers coming apart and being rebuilt. |

On note 5: the site already had all four addresses in every footer and in "Talk to us",
committed on 2026-11-18 and 2026-11-19, and the build of 2026-11-19 shows them on all 21
pages that have a footer. What was out of date was the set of review pictures in
`screenshots/rehearsal/`, taken on the morning of 2026-11-18 before any address was added.
They were taken again on 2026-11-19 at 13:37.

It is in branch `LZ-C5.2`, not in `main`.

Checked in headless Chrome:

- Every step of the story, 2,561 of them: the six rules under
  [The hand on the homepage](#the-hand-on-the-homepage) all hold.
- 400 random jumps in the scroll give the same hand as scrolling there.
- At 1440 x 900, 1100 x 1000, 1024 x 768 and 390 x 844, the hand and its parts keep at least
  26 px clear of the caption, the nav and the edges of the stage through "Build one
  finger." and after the coming apart has settled.
- The build passes, the homepage has no script errors, and it does not scroll sideways at
  390, 1024 or 1440 px with the parts laid.

Not checked: how it feels under a real wheel, trackpad or finger, and how fast it runs on a
real phone, which now draws 72 small pictures behind the page.

Decided during that work:

| Decision | Option not taken |
|---|---|
| "The first animation" is read as the one under "Build one finger.", where the caption says to assemble the links. The opening hand is as it was. | Take the fingers apart in the very first scene, before the hand has been shown whole. |
| The other three fingers' parts slide onto the middle finger's and fade, so the four become one. | Let the other three simply fade where they are. |
| The trace's seven colours go beyond the poster's palette. They are only in the trace. | Three poster colours used in turn, which leaves neighbours hard to tell apart. |
| No legend naming the seven links. | A row of seven named colour chips under the caption. Say so if wanted. |
| Content covers the parts: text sits on white. So parts lie everywhere and show in the gaps. | Parts only in clear space, which is what left portions of the page without any. |

### 2026-11-19: no turn round the hand, four modules out, a played burst, litter kept clear

Four notes from Lingbo on the entry below:

1. The explosion at the end is a bit off. Look at a reference such as Anime.js for ways to
   improve it.
2. There should be no full turn round the hand at the start. The angle it is seen at is good.
3. Pulling the finger out passes it through the palm. Try pulling out each module and
   focusing in on one.
4. The parts scattered down the page should not overlap any table or text.

| | At midday | Now |
|---|---|---|
| HelpingHand | The view went once round the flat hand. | No turn. The hand is seen from in front of the fingertips, a little to one side, and comes square on as it opens. |
| Build one finger. | One module slid out while the palm moved back at the same time, so the palm passed through it. | All four modules slide out first, the outer two first. Only when every one is clear does the rest of the hand move back, and the view goes to the middle module. |
| The coming apart | Tied to the scroll: as fast or slow as the visitor scrolled. Every part left at once along its own line. | Played in a second and a quarter once the scroll reaches it. Two stages: the assemblies part, then their parts. Sprung, with a small draw in first. |
| The spread at the end | Parts over the whole stage, some behind the caption. Yellow parts passed through green on the way to sky. | Parts only to the right of the caption. They lose their colour first, then take the sky's. |
| The rest of the homepage | Parts behind text and showing through the table. | Parts only where there is room, at least 18 px from any text, table, panel or button. |
| The scroll | 6.9 screens. | 7.1 screens. |

What the references said, and what was taken from them:

- Anime.js keeps two kinds of scroll animation apart: one tied to the scroll position, and
  one that plays by itself once a threshold is crossed. An explosion tied to the scroll can
  never be sudden, so this one now plays.
- Anime.js staggers a group from its centre and offers spring and elastic easings. The
  middle of the hand now goes first and every part overshoots a little and settles.
- Guides to exploded views in Three.js open a model in two stages: assembly groups first,
  then the parts inside each. The hand now does the same.

Anime.js itself is not back in the page. The moves are a few lines of the hand script.

It is in branch `LZ-C5.2`, not in `main`.

Checked in headless Chrome:

- Every step of the story, 2,381 of them: the four rules as before, and the rest of the hand
  never moves back before the shown module is fully out.
- 400 random jumps in the scroll give the same hand as scrolling there.
- At 1440 x 900, 1100 x 1000, 1024 x 768 and 390 x 844, the hand has at least 22 px clear of
  the caption, the nav and the edges of the stage through the first two scenes and the
  return.
- On the rest of the page, no part touches any content at 1440, 1280, 1024, 768 or 390 px
  wide. The least gap is 18 px. 39 of the 40 parts find a place at 1440 px, 36 at 1024 px
  and 14 at 390 px.
- The build passes, the homepage has no script errors, and it does not scroll sideways from
  360 to 1440 px.

Not checked: how it feels under a real wheel, trackpad or finger, and how fast it runs on a
real phone.

Decided during that work:

| Decision | Option not taken |
|---|---|
| The coming apart plays by itself and plays backward if the visitor scrolls back up. | Stay tied to the scroll. |
| The other three modules go home out of sight, during "See what moves.", so the hand comes back with one module out as before. | All four sliding home in view. |
| A littered part with no clear place is left out. | Shrink it, or let the content cover part of it. |
| Parts keep clear by position. Table cells are also white, as a second guard. | White boxes behind every block of text, which would cut parts off in mid-air. |

Sources for the references: [Anime.js stagger from](https://animejs.com/documentation/utilities/stagger/stagger-parameters/stagger-from/),
[Anime.js ScrollObserver synchronisation modes](https://animejs.com/documentation/events/onscroll/scrollobserver-synchronisation-modes/),
[Three.js exploded view, multi-part GLB](https://digitalgarden.si/blog/threejs-exploded-view/),
[Exploded view of a 3D model with React Three Fiber](https://blog.anaili.fr/articles/exploded).

### 2026-11-19: a flat hand the view goes round, a palm that moves back, parts down the page

Three more requests from Lingbo the same day, on top of the entry below:

1. At the start, zoom in and go round the hand, so every side is seen.
2. The hand should end flat and open, facing the visitor, the four fingers pointing at them.
   When the finger comes out, the palm should move back into the distance.
3. At the end, scatter the parts and litter them across the rest of the homepage in light blue.

| | That morning | Now |
|---|---|---|
| HelpingHand | The hand stood upright, seen from the little finger's side, and turned its palm to the visitor as it opened. | The hand lies flat, palm up. The view comes in and goes once round it, then stops in front of the fingertips. The hand opens on the way and ends with its four fingers pointing at the visitor. Near things are drawn larger, so the fingers reach out. |
| Build one finger. | The module slid up out of the upright hand and the rest faded where it stood. | The module slides out toward the visitor. The rest of the hand moves back into the distance, growing smaller, and fades. |
| Try your own design. | The hand came apart and the parts hung there. | The same, then the parts spread over the whole stage and turn pale sky. |
| The rest of the homepage | Plain white behind the sections. | The 40 parts in pale sky behind the sections, drifting and turning a little as the page scrolls. |
| The scroll | 6 screens. | 6.9 screens: the first scene has 800 steps more and the last 700 more. |

It is in branch `LZ-C5.2`, not in `main`. How it is built is under
[The hand on the homepage](#the-hand-on-the-homepage).

Checked in headless Chrome:

- Every step of the story, 2,301 of them: the thumb is never further closed than the index or
  middle finger, no module slides with a bent finger or with the thumb across, the hand only
  comes apart when it is whole and open, and the parts only spread once it is fully apart.
- 400 random jumps in the scroll give the same hand as scrolling there.
- At 1440 x 900, 1280 x 1024, 1100 x 1000, 1024 x 768 and 390 x 844, in 100 frames of the
  first, second and last scenes, the hand always has at least 12 px clear of the caption,
  the nav and the edges of the stage. The spread parts are meant to fill the stage and
  pass behind the caption.
- The build passes, the homepage has no script errors, and it does not scroll sideways at
  390 or 1440 px with the littered parts in place.

Not checked: how any of this feels under a real wheel, trackpad or finger, and how fast it
runs on a real phone. The CAD checks were not run again: the model and the tables did not
change.

Decided during that work:

| Decision | Option not taken |
|---|---|
| The view goes round the hand as the page is scrolled, like every other move. | A turn on a timer when the page arrives. |
| The hand opens during the last part of the turn and is open when the view stops. | Stay closed for the whole turn, then open. |
| Near things are drawn larger in the first scene only. The module's two scenes and the parts stay a flat drawing, as they were framed. | Depth everywhere. |
| After the module's scenes the whole hand comes back upright, the way the coming apart was framed. | Come back flat, as it left. |
| The littered parts are behind the page's content. Panels and tables cover them. | On top of the content, which would put them over the words. |
| On a wide screen two parts in three lie in the margins. On a phone they lie anywhere across. | Margins only, which leaves a phone with none. |
| Beside the caption, a stage squarer than about 3:2 sizes the hand by its width. | Size by height alone, which ran the hand into the caption on a squarer window. |

### 2026-11-19: "Request a kit" goes to all four

Lingbo: for Contact and "Request a kit", everyone's emails, not Lingbo's standing alone.
"Request a kit" now starts one email to all four people, on every page. Under Contact each
address is still its own link to that person. It is in branch `LZ-C5.2`, not in `main`.

One thing to know: a mailto link lists several addresses with commas, as the standard says.
Classic Outlook on Windows may show them as one unknown name until its setting "Commas can
be used to separate multiple message recipients" is switched on. Other mail programs split
them.

### 2026-11-19: the hand opens toward the visitor, and comes apart at the end

Lingbo asked for two new scenes on the homepage. The first caption is about grasp, so the hand
should start closed and open toward the visitor as they scroll, as if offering something. The
last should be "like an explosion", for what a student could go on to build. The two scenes
between them stay as they were. It is in branch `LZ-C5.2`, not in `main`.

| | Before | Now |
|---|---|---|
| On arrival | The hand was open. It closed to the pinch and opened once, on a 5 second timer. | The hand is closed, in the CAD's pinch, and still. Nothing runs on a timer. |
| HelpingHand | The open hand came a little closer. | The hand opens and turns its palm to the visitor. The thumb leaves first, then the fingers, index first. |
| Build one finger. See what moves. | | The same moves. "See what moves." gives up 2% of the scroll. |
| Try your own design. | The module went back in and the hand closed to the pinch. | The module goes back in, the view draws back, and the hand comes apart into its 40 parts. |
| Less motion asked for | The open hand. | The open hand, as before. |

The opening is the CAD's way into the pinch run backward, so the poses are the ones already
checked for collisions. The coming apart is the one move that is not from the CAD. See
[The hand on the homepage](#the-hand-on-the-homepage).

Checked in headless Chrome:

- Every step of the story, 2,001 of them: the thumb is never further closed than the index or
  middle finger, no module slides with a bent finger or with the thumb across, and the hand
  only comes apart when it is whole and open.
- 400 random jumps in the scroll give the same hand as scrolling there.
- At 1440 x 900, 1280 x 640, 1024 x 768, 1100 x 1000, 1280 x 1024 and 390 x 844, no part of
  the hand touches the caption, the nav or the edge of the stage in either new scene. The
  least clear space is 8 px, at 1100 x 1000.
- The build passes, the homepage has no script errors, and it does not scroll sideways from
  360 to 1440 px.

Not checked: how the two new scenes feel under a real wheel, trackpad or finger. The CAD
checks (`--check`, `--check-path`) were not run again: the model and the tables did not
change.

Decided during that work:

| Decision | Option not taken |
|---|---|
| The closed hand is seen from the little finger's side, where the thumb and fingers show as one closed grip. | From the thumb's side, where the electronics box fills the view. |
| "Toward the visitor" is a turn of the palm to face them, a lean of the fingertips toward them and a small step closer. The fingers stay pointing up. | The hand turned over, fingers pointing at the visitor. Without perspective they would shrink to stubs. |
| The timed pinch on arrival is gone. The hand waits, closed, for the scroll. | Keep it. It would open the hand before the visitor did. |
| The parts fly apart and stay apart at the end of the scroll. They turn a little, each the same way every time. | A tidy exploded drawing with nothing turned, or parts that fall. |
| The module goes back in before the hand comes apart. | The hand coming apart with one module already out. |
| On a stage squarer than about 3:2 the parts are drawn smaller. | One size, which put the thumb's parts over the caption on a squarer window. |

### 2026-11-19: everyone's address under "Talk to us"

Lingbo: the place to reach out showed only Lingbo's address, and that read oddly. "Talk to
us", the navy band at the foot of the Team page, had one button with that address on it. It
now lists all four, each a mailto link to that person, above "Request a kit". It is in branch
`LZ-C5.2`, not in `main`.

No page on the site now shows one person's address alone. "Request a kit" still started an
email to the project manager only (changed later that day: see the entry above). Screenshots are in
`screenshots/talk-to-us/`.

| Decision | Option not taken |
|---|---|
| The four addresses go in the band that had the one. | A separate Contact page with its own link in the nav. It was built and taken out again: with a demo role set the nav has no room for one more link. |

### 2026-11-18: everyone's address under Contact

Lingbo asked for all four addresses under Contact. Contact is the last column of the footer,
so it is on every page. It is in branch `LZ-C5.2`, not in `main`.

| | Before | Now |
|---|---|---|
| Contact, in the footer | One address: Lingbo's at NYU. | Four addresses, one per person, in the Team page's order. Each is a mailto link to that person with the subject "HelpingHand question". |
| "Request a kit", everywhere | Lingbo's NYU address. | Lingbo's Gmail address. |
| "Talk to us", on the Team page | A button showing Lingbo's NYU address. | The same button, showing Lingbo's Gmail address. (All four addresses since 2026-11-19: see the entry above.) |
| The NYU address | In the footer and on the Team page. | Nowhere on the site. |

The four people are now listed once, in `src/lib/team.ts`. The Team page and the footer both
read it. The homepage's footer is a hand-built copy in `index.html`: change both together.

The footer's last column is a quarter wider than the middle one. At 768 px the longest
address did not fit the old column and broke in two.

Checked on the built site in headless Chrome: on all 23 pages, at 360, 390, 768, 1024, 1280
and 1440 px wide, nothing scrolls sideways and every address sits on one line.

Decided during that work:

| Decision | Option not taken |
|---|---|
| The NYU address is replaced, not kept as a fifth. The site now shows one address per person. | Keep it above the four. Lingbo would be listed twice. |
| "Request a kit" goes to one person, the project manager. Outlook on a school computer may not split a list of addresses in one mailto link. | One link that writes to all four. |
| The addresses stand alone, with no names beside them. Each one reads as its owner's name. | Name and role on each line. |
| "Talk to us" on the Team page keeps one button. All four addresses are on the cards above it and in the footer below it. (Changed on 2026-11-19: see the entry above.) | The four addresses there a third time. |

### 2026-11-18: the scroll story does what its captions say

Lingbo asked for the animation to match the text beside it: where a caption speaks of one
finger, a finger module should come out of the hand and be shown. And for the thumb and the
fingers to move more smoothly, on the paths the CAD gives them. Only the hand's script on the
homepage changed. No words and no layout changed. It is in branch `LZ-C5.2`, not in `main`.

| | That afternoon | Now |
|---|---|---|
| "Build one finger." | The whole hand closed to the pinch while the view went once round it, close enough that the hand ran off the stage. | The middle finger's module slides 130 mm straight out of its socket and the rest of the hand fades. The module is turned once round, laid across the stage, and curls to its limit and opens. |
| "See what moves." | The hand opened, four finger modules slid 45 mm out and the thumb module rose, while the view went round again. | The same module from its side. Its colours drain to pale grey, then each link turns navy in the order the motion travels: carriage, link, first segment, bar, middle segment, bar, fingertip. The finger curls as they go. |
| "Try your own design." | The modules slid back. | The module slides back into its socket, then the whole hand makes its grip, the CAD's pinch, and holds it. |
| The view | Two full turns round the whole hand, with swings of zoom, tilt and bank on top. | One move to the module and one move back. The whole hand is never turned round. |
| Scrolling | The hand jumped to the scroll position at once, so each click of a mouse wheel showed as a jump. | The story follows the scroll with a soft lag of about half a second. |
| Scrolling back up, or jumping | Parts could stay where a later scene had left them. In a test, 331 of 400 jumps to a random point gave a wrong hand. | A scroll position always gives the same hand: 400 of 400. |
| The first five seconds | Fingers and thumb started and stopped at full speed. Scrolling during them froze the hand part-closed until the grip scene. | They ease in and out, and scrolling away lets go of the pinch over half a second. |
| Weight of the page | `index.html` 1.41 MB, 88 KB of it the Anime.js library. | 1.33 MB. The library is gone. |

Why jumps went wrong: the library only writes the moves that are running at the moment it is
asked, so a dial kept whatever the last scene had left in it. The story is now a list of
moves read by a few lines of the page's own script, which sets every dial every time.

Checked:

- Every part's place as the page works it out, against the export script's own maths, which
  `--check` holds to the CAD: 0.00005 mm apart at most, in eight poses, three of them with
  the module 130 mm out.
- Through the whole scroll, sampled every 5 steps of 10,000: the index and middle fingers
  are never behind the thumb on the way into the pinch, and a module only slides while its
  finger is straight and the thumb is at rest. Those are the conditions the CAD checked.
- A module pulled out alone passes its neighbours: it is 30.2 mm wide at its widest and the
  sockets are 36.6 mm apart.
- `scripts/hand_motion.py --check --check-path`, run again that evening, passed, and the
  data it rebuilt from the CAD is the block already in the page: see
  [The hand on the homepage](#the-hand-on-the-homepage).
- On the built site in headless Chrome: no script errors, the homepage does not scroll
  sideways at 360, 390, 768, 1024, 1280 or 1440 px wide, and with reduced motion the hand
  stands still at rest beside the four captions.

Decided during that work:

| Decision | Option not taken |
|---|---|
| The module taken out is the middle finger's, the one already shown beside "The kit". | The index finger, the one the thumb pinches. |
| It comes out 130 mm: the furthest the CAD checks, and 6.4 mm clear of its 123.6 mm socket. It is not moved again; the view goes to it. | 45 mm, as before, which leaves most of the housing in the socket. Or carrying the module across the stage. |
| The rest of the hand fades out while the module is shown. | The hand left in view behind it. |
| The module is turned once round its own length before it curls. | Straight to the three-quarter view. |
| In "See what moves" the links turn navy on a pale grey module. | Each link in its own CAD colour. The carriage and the bars are grey and pale blue and did not stand out. |
| No names on the links. | A label naming each link as it turns navy. |
| The taken-apart view, with all four modules out and the thumb module off its rails, is no longer played: no caption speaks of it. `--check` still builds it. | Keeping it under "See what moves". |
| The grip comes last, under "Try your own design", for "predict how the grip will move, then test it". | Under "Build one finger", as before. |
| The captions start at 0, 15, 50 and 80% of the scroll. | Golam's 0, 21, 49 and 86%. |
| The Anime.js library is taken out. | Keeping it and resetting every dial before each seek. |
| The scroll is followed with a lag. | The exact scroll position, as before. |
| The opening leans in less (zoom up by 0.2, was 0.33), so the hand stays on the stage. | As before. |
| The scroll is as long as it was: six screens. | A longer scroll, to give each move more room. |

### 2026-11-18: emails on the Team page

Lingbo gave the four addresses. Each person's card on the Team page now shows theirs under
the role, as a mailto link. It is in branch `LZ-C5.2`, not in `main`.

Decided during that work:

| Decision | Option not taken |
|---|---|
| On the Team page only. The team teaser on the homepage stays names and roles. | The addresses on the homepage too. |
| Contact and "Request a kit" still go to Lingbo's NYU address, so the site shows two addresses for Lingbo. (Changed later that day: see "everyone's address under Contact" above.) | Lingbo's Gmail address there too. |
| In a narrow column an address breaks at the @. | Smaller type, or a break wherever the line ends. |

### 2026-11-18: the hand moves the way the CAD does

Lingbo asked for the animations to be brought up to the latest CAD, and said some of the
movements were wrong. They were: the page bent the hand by itself, at joints placed by eye.
Now the page holds no joint of its own. The shape and every movement are exported from the
CAD by `scripts/hand_motion.py`. It is in branch `LZ-C5.2`, not in `main`.

| | Before | Now |
|---|---|---|
| The model | An older hand, 32 mm between the fingers, put in on 2026-11-15. | Hand v11, the CAD of 2026-11-17: 36.6 mm between the fingers, the thumb and its motor as a module on the palm's side. |
| A finger | Three hinges set in the page, turning 49°, 70° and 66°: a fist of 185°. Links and coupler bars turned with whichever segment they were tied to, so they left their pins. | One number, how far the motor's carriage has run along its screw (18 mm). The CAD's linkage table places the carriage, the link, three segments and two coupler bars for it. At the end of the travel the knuckle is at 53.5°, the middle joint 26.8° further and the tip 36.1° further. That is all this hand can curl. |
| The thumb | Turned flat in the plane of the palm, about three pivots set in the page, by the average of the four fingers. As the fingers closed it swung outward, away from them. | Swings across the palm on the VEX 393's shaft and curls by its own carriage, as built. |
| The grip | A fist, with parts passing through each other. | The CAD's pinch pose: fingers at 40°, thumb swung 70° and curled 36°, the thumb tip on the index fingertip and nothing else touching. |
| The taken-apart view | The finger linkages slid 25 mm forward and fanned out sideways, leaving their motor housings in the palm. | Each finger module slides 45 mm straight out of its socket, housing and all, and the thumb module rises 45 mm off its two rails. Both are how the CAD takes the hand apart. |
| Beside "The kit" | Billy's video of the older upright finger coming apart. | The middle finger's module from the same data, curling to its limit and opening, every 7 seconds. Housing in sky, carriage in lime, links in white. |
| Weight of the page | `index.html` 1.97 MB, and a 2.6 MB video. | `index.html` 1.41 MB. No video is asked for. |

Golam's four scroll scenes, their timing, the camera moves and the five colours are kept.

Checked against the CAD: the exported parts, moved by the tables, sit within 0.04 mm of the
CAD built at the same pose, in five poses. The way into the pinch was built in the CAD at 35
poses and nothing touches before the two tips do.

Decided during that work:

| Decision | Option not taken |
|---|---|
| "The latest CAD" is hand v11: the last one built, marked current in the CAD notes, and made for Lingbo's own housing. | "Hand v10 full curl", built the same evening, whose fingers reach 90°. The CAD notes leave the choice between the two open. It is in [To do](#for-the-team-to-decide). |
| The grip scene and the opening close to the pinch, with the fingers at 40°. | The fingers at their 53.5° limit with the thumb at rest. |
| The fingers come down first and the thumb arrives last, then leaves first. | The thumb in place first. The CAD shows the index fingertip grazing it on the way down (3.4 mm³ at 36°). |
| The Kit page is left as it is, on hand v10 with v10's numbers. | Re-exporting its two models and changing five rows of its spec table to v11's. That changes what the site says the product is, so it waits for the choice above. |
| A live finger replaces Billy's video. The video file stays in `public/videos/`. | Keeping the video of the older finger, or leaving the stage empty until a new one is rendered. |
| Parts that cannot be seen are left out: the motors in their pockets, the boards in the closed box, the eight screws inside the palm. | Exporting every part. The data would be heavier for nothing visible. |
| The hand is drawn 7% smaller, because hand v11 is 20 mm wider and 9 mm longer and would otherwise run off the stage. | The same scale, cropped. |
| The model stays inside `index.html`, as Golam set it up on 2026-11-15. | A separate file fetched by the page. |

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
| The Problem leads with the poster's 18% / 42% figure in the page header, worded as the report words it. (Until 2026-11-24: it is now a row under "Evidence", and the header shows robotics teams by school poverty.) | The poster's "tech" wording. |
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

## The hand on the homepage

Since 2026-11-18. The homepage draws two things from one block of data inside `index.html`:
the whole hand in the scroll story at the top, and one finger module beside "The kit". The
block sits between two `HAND-DATA` comments and is written by `scripts/hand_motion.py`. Never
edit it by hand.

**Where it comes from.** The CAD is not in this repo. It is in `~/workspace/SLDP CAD` on the
build machine. The script loads the hand Final v3 there (`Final v3/source/final3.py`; until
2026-11-23 it was hand v11), builds it with the fingers straight and the thumb at rest, and
writes out:

- every visible part as triangles, grouped into 40 rigid bodies: the palm with everything
  fixed to it (the link plate, the end cap, the electronics plate and its shell), eight
  bodies for each finger, seven for the thumb
- for a finger, a table of where its carriage, link, three segments and two coupler bars are
  at 49 evenly spaced points of the carriage's travel. The numbers are read from the function
  the CAD itself places those parts with
- the same for the thumb's own carriage, link, two segments and coupler bar
- where the thumb's swing shaft is, and the pinch pose the CAD was checked in

**What the page can move.** Four things, and no joint directly:

| In the script | What it is | Range |
|---|---|---|
| `poses[i].bend` | Finger `i`'s carriage along its lead screw. The whole finger follows. | 0 to 1 is 0 to 17.8 mm, a knuckle curl of 0 to 72.4° |
| `poses[i].pull` | Finger module `i` slid straight forward out of its socket, the one way it goes in and comes out. | 0 to 1 is 0 to 136 mm (`PULL`). A socket is 130 mm deep, so at 136 the module is 6 mm clear of the palm. The CAD checks a module pulled out as far as 130 mm; past that all of it is ahead of the palm. |
| `thumb.reach` | The thumb coming across to the index fingertip: its swing and its curl together. | 0 is at rest, 1 is the pinch: swing 58°, curl 72° |
| the finger beside "The kit" | The middle finger's `bend`, on a 7 second round. | 0 to 1 |

The data also holds the thumb module's own body, so it could be raised off its two rails
again (the CAD checks up to 60 mm). The page stopped playing that on 2026-11-18.

**What the scroll story does with them.** The four captions are Golam's. Since 2026-11-18
evening the hand does what each one says. On 2026-11-19 Lingbo asked for a new first and last
scene: the hand opens toward the visitor, and at the end it comes apart.

| Caption | Share of the scroll | The hand |
|---|---|---|
| Before any scrolling | | Lying flat, palm up and closed, in the CAD's pinch, seen from in front of the fingertips and a little to one side. It does not move until the page is scrolled. |
| HelpingHand | 0 to 13% | The hand opens and comes closer and square on: the thumb leaves first and the fingers follow, index first. It ends flat and open, the four fingers pointing at the visitor. The view does not go round it. |
| Build one finger. | 13 to 55% | One thing at a time, and nothing spins. All four finger modules rise 136 mm out of their sockets together, toward the visitor. Once every module is clear, the palm and thumb sink back and fade. Each finger loosens into a line of its parts, fingertip first. Then four become one: a wave runs from the fingertips back to the housings, and in each row the other three fingers' parts hop onto the middle finger's, rolling once on the way, its two neighbours' a beat before the far one's. Each is gone the moment it lies exactly on its twin, and the twin swells for a beat. Meanwhile the view comes in on the one that stays. Only then does the view turn to it, once, by the shortest way. It is built: the carriage, its link, and each segment and bar in turn out to the fingertip. Then it curls and opens. |
| See what moves. | 55 to 76% | The module seen from its side. Its colours drain, then each link gets its own colour back in the order the motion travels: the carriage pink, the link navy, the first segment coral, its bar yellow, the middle segment violet, its bar orange, the fingertip sky. The finger curls again as they light. Out of sight, the other three fingers are put back whole. |
| Try your own design. | 76 to 100% | The hand comes back upright with its four fingers held above their sockets. They are let go one after another and drop into the palm: each falls faster and faster, lands, lifts a hair and settles. At 87% of the scroll the whole hand comes apart, in about a second and a half, at its own pace, and the pieces tumble as they go. At the very end the parts gather into the HandiWorks mark, its two blocks in navy and its link in sky, and the mark's own shape comes up behind them. |

**The coming apart is played, not scrolled.** Every other move follows the scroll. This one
starts when the scroll reaches `BURST_AT` and then runs on its own clock for `BURST_SECONDS`,
however fast or slowly the page is scrolled. Scrolling back above `BURST_AT` runs it
backward. It goes in two stages, the way an exploded drawing is built: first the assemblies
part (the palm, each finger with its module, the thumb), then each assembly's own parts
spread along it. Each move is sprung: drawn in a little first, then out past its place and
back to it. The middle of the hand goes first. Every piece turns as it flies, fast at first
and slowing to a stop: the small ones go round more than once, the large ones only lean
(`WHIRL`). `scatter()` does this. Where a part ends up is its distance from `BURST_FROM`
times `SPREAD`, plus a push for its kind of part so parts that sit inside one another
separate (`LIFT`). The turn is the same every time: it comes from the part's number, not
from chance.

**The fingers loosened in "Build one finger."** are not the coming apart of the last scene.
`LINE` gives each link of a finger one line to travel, in mm along the finger and up out of
it: the carriage and its link lift out of the housing, the segments go along the finger, the
bars go along it and stand a little above. Nothing turns. `unbuild()` moves the links out by
`poses[i].apart`, fingertip first so nothing crosses, and home again by `poses[i].rebuilt`,
carriage first, each link starting before the last has seated.

**Four become one.** Since 2026-11-23. The four loosened fingers lie side by side: a grid of
parts, four across and eight deep (seven links and the housing). `story.merge` runs a wave
through that grid, the way a staggered grid plays in Anime.js: from the fingertips back to
the housings, row after row, and in each row the middle finger's two neighbours a beat
before the finger beyond them (`leaves()` says when a part sets off). Each part hops over
onto the same part of the middle finger: up out of its line, across in an arc, one whole turn
about the finger's length on the way, and down (`hop()`). It is not faded: it is drawn until
it lies exactly on its twin and then not at all, which cannot be seen because the two are the
same shape in the same place. The twin swells for a beat as each lands (`swell()`). `GATHER`
holds the numbers: `rows`, the share of the move between the first row leaving and the last;
`far`, how much later the far finger's part leaves; `hop`, how high a part rises, in mm, for
a neighbour and for the far finger; `beat` and `swell`, how long and how large a swell is.
Until 2026-11-23 the three fingers slid sideways onto the middle one as whole lines.

**The view's one turn.** From the held-out hand to the module's view is a turn of 111°.
`turnBetween()` makes it as a single turn about one line, the shortest way, with the depth
fading on the same curve. Setting roll, lean and bank each on its own timing, as before,
took the finger through a wobble on the way.

**The mark at the end.** `prepareMark()` cuts the logo's three shapes into 40 cells of about
the same size, one for each part. As `story.logo` goes from 0 to 1 each part flies to its
cell, is drawn the size of the cell, and takes the cell's colour. The logo's own shape, an
SVG behind the canvas, comes up as they arrive, so the story ends on the logo and not only
near it.

**The hand's colours** are set by part, in `SCHEME`. Every finger is coloured the same way,
and the colours change from joint to joint along it. Since 2026-11-21 the set is two
families and no more:

| Part | Colour | OKLCH (lightness, strength, hue) | Hex |
|---|---|---|---|
| Palm | The brand's navy | 0.34, 0.12, 262 | `#123476` |
| Housing | A quiet blue-grey | 0.78, 0.045, 242 | `#9fbcd2` |
| First segment | Deep blue | 0.42, 0.15, 264 | `#21459d` |
| Middle segment | Azure | 0.60, 0.145, 246 | `#1b86d1` |
| Fingertip | Sky | 0.77, 0.115, 226 | `#56c3ec` |
| Carriage | Brick | 0.47, 0.15, 34 | `#9d2f16` |
| Link | Burnt orange | 0.58, 0.135, 52 | `#b75f1e` |
| First bar | Amber | 0.69, 0.145, 70 | `#d38914` |
| Second bar | Gold | 0.80, 0.155, 90 | `#e4b826` |

The three segments are the cool family: they step from the brand's navy toward its sky as
they go out to the fingertip. The four parts that pass the motion along are the warm family,
blue's opposite on the colour wheel, and they step from brick to gold in the order the motion
reaches them. The reasons are in the design log entry of 2026-11-21. The thumb takes the same
colours for its own parts. `BODY_COLOUR` works each part's colour out from that once. The
trace's colours (`LIT`) are read from the same table, so when the trace lights a link it
gives the link its own colour back.

The same table is repeated in two places, because they are separate programs: `SCHEME` in
`src/scripts/hand/view.ts` ("Test your code", and the 3D finger in the simulator) and the
bar colours at the top of `src/scripts/sim/steps.ts` (the simulator's drawings). Change all
three together. To try a new colour, `oklch.com` converts between the two notations; keep
every colour inside what a screen can show.

**The hand's size.** `HAND_SIZE` draws the hand a tenth larger on a wide stage, where there
is room. On a stage squarer than about 3:2, and on a phone, the hand already fills its place
and is the size it was.

**The parts go on down the page.** Below the story, the same parts lie behind the rest of the
homepage in pale sky. `litterPage()` draws each part once into a small picture of its own.
`placeLitter()` lays copies down the whole page, one to a cell of a grid about 190 px wide
(130 px on a phone), so no stretch of the page is without them: 96 at 1440 px, 72 on a
phone. They are behind the page. The words, lists and tables below the story sit on white,
a little wider than themselves, and the panels are solid, so content covers the parts
cleanly and a part shows only in the open space around it. Within its cell each part takes
the spot furthest from any content. The page is laid again when the window changes size.
`driftLitter()` turns each part and moves it a little as the page scrolls. With less motion
asked for they do not move. These are not the story's own parts: the story ends on the mark.

The coming apart, the fingers loosened into lines and hopped into one, the gathering into
the mark and the litter are the things in the story that are **not motions of the CAD**. No
part of the real hand flies.

**How to change it.** The story is a list of moves in `prepareStory()`. A move takes one
dial from one value to another: `move(dial, name, from, to, start, length)`. The scroll is
13,000 steps from top to bottom, and `SCENES` says at which step each caption starts. Three
kinds of dial:

- the parts, in the table above
- the view: `story.zoom`, `story.show` (from the whole hand to the module, and the rest of
  the hand fading), `story.roll` (the view turned about the hand's length), `story.lean`
  (the fingertips tipped toward the viewer), `story.bank` (the picture turned on the screen),
  `story.spin` (the hand turned flat on its palm, which is how the view goes round it),
  `story.depth` (near things drawn larger; 0 is a flat drawing), `story.away` (the rest of
  the hand moved back into the distance), `story.side` (the module from three-quarters on to
  square from its side)
- the colours of the trace: `story.wash` and `story.trace`. The seven colours are `LIT`.
- the fingers loosened into lines: `poses[i].apart`, `poses[i].rebuilt` and `story.merge`
- the mark at the end: `story.logo`
- (The coming apart is not a dial: see above.)

`HAND_VIEW` and `MODULE_VIEW` say where the two views look from. `OFFER_VIEW` is the flat
hand the page opens on and holds out, and `BURST_VIEW` is the hand in parts. `HELD_VIEW` is the
upright hand with its fingers held above their sockets, and `LOOSE_VIEW` the one finger
while it is still a line of parts. `REST` is the step shown to a visitor who has asked for
less motion: the open hand, held out. The page follows the scroll
with a short lag (`FOLLOW` in `render()`), so a mouse wheel's steps do not show.

Keep six rules when changing the moves:

1. On the way out of the pinch the thumb leaves first, and on any way into it the fingers
   lead and the thumb arrives last. The other order puts the index fingertip through the
   thumb tip.
2. A module slides only while its finger is straight and the thumb is at rest. That is how
   the CAD checked it.
3. List each dial's moves in the order they happen, and do not let two moves of one dial
   overlap. A dial takes its latest move that has begun.
4. The hand comes apart only when it is whole and open: every module in, every finger
   straight, the thumb at rest. So `BURST_AT` comes after all of those moves have ended. The
   parts spread over the stage only once it is fully apart.
5. The palm and thumb move back (`story.away`) only once every module is fully out of its
   socket. Before that, moving back would carry the palm through a module.
6. A finger loosens into its line only when its module is out and it is straight. The
   other three hop onto the middle one (`story.merge`) only once they are loose, and the
   view turns (`story.show`) only once they have arrived.

**When the CAD changes.** With the CAD environment, from the repo folder:

```
~/.venvs/sldp-cad/bin/python scripts/hand_motion.py --check        # 1 minute
~/.venvs/sldp-cad/bin/python scripts/hand_motion.py --check-path   # 10 minutes
~/.venvs/sldp-cad/bin/python scripts/step_to_glb.py                # The Kit's two models, 6 seconds
~/.venvs/sldp-cad/bin/python scripts/finger_steps.py               # Lesson 1's five step models, 4 seconds
npm run build
npm run shots -- hand /
npm run shots -- models /kit/ /lessons/beginner/01-finger-module/cad/ --steps
```

The first two rebuild the moving hand. The next two rebuild the still models, which are
separate files in `public/models/`: for a new hand, name its file in `MODELS` at the top of
`scripts/step_to_glb.py` and check its lists of part names, and read the five step pictures
against the lesson's words. Then change by hand what no script writes: The Kit's captions
and numbers (`src/pages/kit.astro`), the finger's length in Lesson 1, and `closeAt` in
`public/downloads/helpinghand_bench.ino`.

For a new hand, first change `HAND` and `LABEL` at the top of the script, name the hand's
file in `load_cad()`, and bring the lists of part names under them up to date. The script
stops and names any part it does not know. Then read `finger_tables()`: it asks the finger
module for its pose, and two hands' finger modules need not answer the same way (hand v11's
and Final v3's do not). `--check` is the test that it was read right.

- `--check` builds the CAD at five other poses and compares every exported part, moved by
  the tables, with the CAD's own. It writes nothing if any part is more than 0.2 mm off. On
  2026-11-18 the worst was 0.04 mm.
- `--check-path` builds the CAD at 35 poses on the way into the pinch and intersects the
  thumb with the index and middle fingers and the palm. On 2026-11-18 nothing touched on the
  way, and at the pinch the two tips met by 0.3 mm³, which is the grasp.

Both were run again on the evening of 2026-11-18, after the scroll story changed: every part
within 0.04 mm in the five poses, nothing touching in 34 poses on the way into the pinch, the
tips meeting by 0.28 mm³. The data they rebuilt from the CAD was the same, character for
character, as the block in the page.

On 2026-11-23, for Final v3: every part within 0.04 mm in the five poses, nothing touching
in 34 poses on the way into the pinch, the tips meeting by 1.76 mm³.

Neither check reads the page's script. What ties the page to them is in
[Design changes](#design-changes), under "the scroll story does what its captions say": the
page's own placement of every part was compared with the script's, and the story was sampled
for the rules above.

**What is not shown.**

- The two screws that hold a finger module to the palm, and its motor's two leads. On the
  page the module slides out with nothing to undo.

- The lead screws do not turn. A finger's housing is drawn as the CAD has it, one solid
  bar standing in for Lingbo's two printed halves, with no screw inside it.
- Parts that cannot be seen are left out: the motors, the boards under the electronics
  shell, the screws inside the palm.
- One nut on the thumb sits 0.4 mm off, because the CAD does not turn it with either of the
  two links it joins.
- Final v3 has not been printed. Its carriage and lead screw are not in the CAD yet: the CAD
  takes an earlier carriage, and the 17.8 mm of travel and the 72.4° follow from that. The
  page shows what the CAD says, not a measured hand.

## Test your code

`/dashboard/student/test-your-code/`, reached from the "Test your code" section of the student
dashboard. It drives the prototype hand over its USB cable and draws the same hand on screen.
It is marked "Demo".

| File | What |
|---|---|
| `src/pages/dashboard/student/test-your-code.astro` | The page: its markup and its styles (every class starts with `bench`). |
| `src/scripts/bench/bench.ts` | What the page does: sliders, Open, Close, Stop, Reset, the tilt rule, the readout, connecting. |
| `src/scripts/bench/protocol.ts` | The lines that cross the cable, both ways. The list is repeated at the top of the sketch. |
| `src/scripts/bench/serial.ts` | The cable: the browser's serial-port access. Chrome and Edge on a computer only. |
| `src/scripts/bench/pretend.ts` | A stand-in board inside the page. It covers every motor the plugged-in board lacks, and all six when nothing is plugged in. |
| `src/scripts/hand/view.ts` | The hand from the CAD, posed by one number per motor and drawn in a canvas. |
| `src/pages/hand-data.js.ts` | Serves the homepage's `HAND-DATA` block as `/hand-data.js`, at build time. One copy of the data stays in the repo. |
| `public/downloads/helpinghand_bench.ino` | The sketch for the hand's Arduino Mega. |

**The lines.** Plain text at 115200 baud, one per line. To the board: `?` (who are you),
`T m pct` (motor m to pct percent of the way from open to closed), `J m dir` (nudge motor m;
the guess does not change; it stops 0.3 s after the last one), `Z` (the hand is open: every
guess is 0), `S` (stop everything). From the board: `HELLO helpinghand-bench 1 motors=2,3,4,5
imu=1 buttons=1`, `P 2:45.0/60 ...` (per motor, the guess and where it is going), `G ax ay az
gx gy gz` (g and degrees per second), `B close open` (the buttons), `E words` (a fault). Motor
numbers: 0 pinky, 1 ring, 2 middle, 3 index, 4 thumb curl, 5 thumb swing.

**The rule everything follows:** the hand has nothing that measures where a finger is. The
board knows how long each motor takes from open to closed and counts how long it has run it.
The page shows that count as "Guess", and the on-screen hand is drawn from it. When the guess
and the real hand drift apart, Reset puts them back together by hand.

**To change the wiring,** edit the block at the top of the sketch and nothing else: a line per
motor (shield, port, which way closes, milliseconds from open to closed, how far "close" goes),
the two button pins, the sensor. A finger with no motor is a commented-out line.

**To change the lines,** change `protocol.ts`, `pretend.ts` and the sketch together. The page's
checks are a scratch script, not in the repo; the 37 things it checks are listed in the design
log entry of 2026-11-21.

**Opening the port restarts the Arduino,** so on connecting the board believes the hand is
open. The page says so and points at Reset.

## Simulator

`/dashboard/student/simulator/`, reached from the "Simulator" section of the student
dashboard. Six guided steps for Lesson 1. It is marked "Demo".

| File | What |
|---|---|
| `src/pages/dashboard/student/simulator.astro` | The page: its markup and its styles (every class starts with `sim`). |
| `src/scripts/sim/steps.ts` | Steps 1 to 5. Each is a title, two sentences, what to notice, one question, and a small machine worked out with circles. |
| `src/scripts/sim/finger.ts` | Step 6: the finger of the hand, with its pins found from the CAD's tables. |
| `src/scripts/sim/sim.ts` | What the page does: draws the machine, follows the pointer, plays the motion, marks the answers. |
| `src/scripts/hand/view.ts` | The 3D finger under step 6's drawing (shared with "Test your code"). |

**To add a step,** add one more `Step` to the list at the end of `steps.ts`: its words, the
range of the part the student moves, the one thing they can change, `draw` (where every bar
is for one position) and `follow` (which position a pointer asks for). The page's six
buttons and its counts come from that list.

**To change a step's wording,** edit its `title`, `body`, `notice` and `question` in the same
place. Nothing else holds a copy.

**If the CAD renames a finger link,** step 6 stops with a message that names the pair it could
not find. The pairs are listed at the top of `finger.ts`.

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
- **The hand.** On the homepage the hand and the single finger move only the way the CAD
  says the real ones do: see [The hand on the homepage](#the-hand-on-the-homepage).
- **Reduced motion.** All of the above switch off when the reader has asked for less motion:
  the hand holds still, open, and the single finger holds half curled. Everything else is
  visible without scripting.
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
| 18% of students with no tech opportunities at school plan to pursue a tech degree in college, against 42% with them | Yes, on The Problem, worded as the report words it. Since 2026-11-24 it is a row under "Evidence", not the page's lead | Confirmed. It is about computer science, not "tech": 42% of students who say their school offers computer science classes plan to study it in college, against 18% of those whose school does not. Gallup with Amazon Future Engineer, "Developing Careers of the Future", 2021, printed page 14: 4,116 US students in grades 5 to 12. The poster's wording ("tech opportunities", "tech degree") is looser than the report's. |
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
7. Sign in as a student, student dashboard, then "Test your code" and the Simulator from it
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
- **Contact** is four mailto links, one per person. "Request a kit" is one mailto link to all
  four. The addresses are in `src/lib/team.ts`.
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
10. **The homepage is one hand-edited 1.4 MB file that Golam also edits.** Before touching
    `index.html`, run `git fetch` and merge `origin/main` into the branch. Never read the
    whole file: the animation library and the hand's data sit on three very long lines (552,
    557 and 558 on 2026-11-18, and they move). Work by `grep` and line ranges, and change
    only what the task needs. The two data lines, between the `HAND-DATA` comments, are
    written by `scripts/hand_motion.py` and never by hand: see
    [The hand on the homepage](#the-hand-on-the-homepage).
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
   docs/README.md (Theme) and the CAD READMEs in ~/workspace/SLDP CAD/ (for example the page
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
machine: ~/workspace/SLDP CAD/README.md, then the README of the newest dated folder it names as
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
