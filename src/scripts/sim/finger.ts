/** The simulator's sixth step: the finger of the hand, as the linkage it is.

    The CAD's tables (see src/scripts/hand/view.ts) say where each link of a finger is for every
    share of the carriage's travel. They do not say which link is pinned to which. This file
    knows the pairs, and finds each pin from the tables themselves: the one point that stays
    put on both links through the whole motion. So the drawing is the real finger's geometry,
    and it follows the CAD when the CAD changes, as long as the links keep their names.

    The pairs, checked against hand v11 on 2026-11-21 (each fits to under a thousandth of a mm):
      the carriage and its link; the link and the first segment (P);
      the frame and P (the knuckle); the frame and the first bar (Q);
      P and the middle segment (S); S and Q;      -> frame, P, Q, S: one four-bar
      P and the second bar (R); S and the fingertip (T); T and R.   -> P, S, R, T: a second four-bar */
import type { HandInfo } from '../hand/view';
import { BAR_1, BAR_2, CARRIAGE, FRAME, LINK, SEGMENT_1, SEGMENT_2, SEGMENT_3, type Bar, type Point, type Step } from './steps';

type Table = HandInfo['fingers'];
const PAIRS = [['carriage', 'link'], ['link', 'P'], ['frame', 'P'], ['frame', 'Q'], ['P', 'S'], ['S', 'Q'], ['P', 'R'], ['S', 'T'], ['T', 'R']] as const;
type Pin = `${(typeof PAIRS)[number][0]}-${(typeof PAIRS)[number][1]}`;

/** A link's placement in the finger's side view: x' = c x - s z + tx, z' = s x + c z + tz. */
type Frame = [number, number, number, number];
function frameAt(table: Table, body: string, share: number): Frame {
  if (body === 'frame') return [1, 0, 0, 0];
  const rows = table.rows[body], x = Math.min(1, Math.max(0, share)) * (rows.length - 1), j = Math.min(Math.floor(x), rows.length - 2), t = x - j;
  const a = rows[j], b = rows[j + 1], pin = table.pivot[body];
  const turn = ((a[0] + (b[0] - a[0]) * t) * Math.PI) / 180, c = Math.cos(turn), s = Math.sin(turn);
  return [c, s, a[1] + (b[1] - a[1]) * t - (c * pin[0] - s * pin[1]), a[2] + (b[2] - a[2]) * t - (s * pin[0] + c * pin[1])];
}
const place = ([c, s, tx, tz]: Frame, [x, z]: Point): Point => [c * x - s * z + tx, s * x + c * z + tz];

/** Four equations, four unknowns. Null if they do not pin the answer down. */
function solve(rows: number[][], right: number[]): number[] | null {
  const n = right.length, m = rows.map((row, i) => [...row, right[i]]);
  for (let i = 0; i < n; i++) {
    let best = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(m[r][i]) > Math.abs(m[best][i])) best = r;
    if (Math.abs(m[best][i]) < 1e-6) return null;
    [m[i], m[best]] = [m[best], m[i]];
    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const f = m[r][i] / m[i][i];
      for (let c = i; c <= n; c++) m[r][c] -= f * m[i][c];
    }
  }
  return m.map((row, i) => row[n] / row[i]);
}

/** The pin two links share, as a point on the first of them with the finger straight. It is
    the point that the two links' placements agree on at every row of the tables. */
function sharedPin(table: Table, first: string, second: string): Point {
  const count = table.rows.P.length;
  const sums = Array.from({ length: 4 }, () => [0, 0, 0, 0]), rights = [0, 0, 0, 0], lines: [number[], number][] = [];
  for (let j = 0; j < count; j++) {
    const a = frameAt(table, first, j / (count - 1)), b = frameAt(table, second, j / (count - 1));
    lines.push([[a[0], -a[1], -b[0], b[1]], b[2] - a[2]], [[a[1], a[0], -b[1], -b[0]], b[3] - a[3]]);
  }
  for (const [row, value] of lines) for (let p = 0; p < 4; p++) { rights[p] += row[p] * value; for (let q = 0; q < 4; q++) sums[p][q] += row[p] * row[q]; }
  const found = solve(sums, rights);
  const miss = found ? Math.sqrt(lines.reduce((sum, [row, value]) => sum + (row[0] * found[0] + row[1] * found[1] + row[2] * found[2] + row[3] * found[3] - value) ** 2, 0) / lines.length) : Infinity;
  if (!found || miss > 0.05) throw new Error(`The CAD's tables do not show ${first} pinned to ${second}`);
  return [found[0], found[1]];
}

const STAGES = ['The push', 'First loop', 'Second loop', 'All of it'];
const SAYS = [
  'The motor turns a screw and the screw pulls the carriage. The link pulls the short arm of the first segment, and the segment swings on the knuckle pin. That is the see-saw of step 1.',
  'The frame, the first segment, a bar and the middle segment make a four-bar, as in step 3. When the first segment swings, the bar holds the middle segment back, so it bends further.',
  'The first segment, the middle segment, a second bar and the fingertip make another four-bar. It shares two bars with the first loop, which makes the finger a six-bar, as in step 4.',
  'One motor, one screw, and three joints bend, each further than the one before. No joint has a motor of its own.',
];
/** Which links each stage lights. The rest are drawn pale. */
const LIT = [['carriage', 'link', 'P'], ['frame', 'P', 'Q', 'S'], ['P', 'S', 'R', 'T'], ['frame', 'carriage', 'link', 'P', 'Q', 'S', 'R', 'T']];
const PALE = '#c9cfda';
export const FINGER_TITLE = 'The finger of the hand';
export const litLinks = (stage: number) => LIT[Math.min(LIT.length, Math.max(1, Math.round(stage))) - 1];

/** Build the step from the CAD's data. `tip` is the fingertip's far end with the finger straight, in mm. */
export function fingerStep(table: Table, tip: Point): Step & { says(stage: number): string } {
  const pins = Object.fromEntries(PAIRS.map(([a, b]) => [`${a}-${b}`, sharedPin(table, a, b)])) as Record<Pin, Point>;
  const owner = (pin: Pin) => pin.split('-')[0];
  const at = (pin: Pin, share: number) => place(frameAt(table, owner(pin), share), pins[pin]);
  const carriageRest = at('carriage-link', 0)[0], carriageFull = at('carriage-link', 1)[0];
  // The window: everything the finger reaches through its travel, with room round it.
  const reach: Point[] = [];
  for (let i = 0; i <= 12; i++) reach.push(place(frameAt(table, 'T', i / 12), tip), at('S-T', i / 12), at('carriage-link', i / 12));
  const xs = reach.map((p) => p[0]).concat(pins['frame-Q'][0]), zs = reach.map((p) => p[1]).concat(pins['frame-Q'][1]);
  const pad = 26, left = Math.min(...xs) - pad - 14, bottom = Math.min(...zs) - pad, width = Math.max(...xs) - left + pad, height = Math.max(...zs) - bottom + pad;

  return {
    title: FINGER_TITLE,
    body: ['This is the finger of the hand, drawn from its CAD, with every bar and pin where it really is. It is built from the pieces you have just met.', 'Pick a part of it to light up, then run the motor.'],
    notice: 'Each joint bends further than the one before it, and one motor does all of it.',
    input: { label: 'Run the motor', min: 0, max: 100, start: 35 },
    setting: { label: 'Show', min: 1, max: 4, start: 1, step: 1, choices: STAGES },
    window: [left, bottom, width, height],
    says: (stage) => SAYS[Math.min(4, Math.max(1, Math.round(stage))) - 1],
    draw(travel, stage) {
      const u = travel / 100, lit = litLinks(stage);
      const colour = (link: string, own: string) => (lit.includes(link) ? own : PALE);
      const p = (pin: Pin) => at(pin, u);
      const carriage = p('carriage-link');
      const bars: Bar[] = [
        // The frame: the screw the carriage rides on, and the two pins the housing holds.
        { points: [[Math.min(carriageRest, carriageFull) - 16, carriage[1]], [Math.max(carriageRest, carriageFull) + 16, carriage[1]]], colour: colour('frame', FRAME), faint: true },
        { points: [p('frame-P'), p('frame-Q')], colour: colour('frame', FRAME), faint: true },
        { points: [p('frame-P'), p('link-P'), p('P-R'), p('P-S')], colour: colour('P', SEGMENT_1), closed: true },
        { points: [p('P-S'), p('S-Q'), p('S-T')], colour: colour('S', SEGMENT_2), closed: true },
        { points: [p('S-T'), place(frameAt(table, 'T', u), tip), p('T-R')], colour: colour('T', SEGMENT_3), closed: true },
        { points: [p('frame-Q'), p('S-Q')], colour: colour('Q', BAR_1) },
        { points: [p('P-R'), p('T-R')], colour: colour('R', BAR_2) },
        { points: [carriage, p('link-P')], colour: colour('link', LINK) },
        { points: [[carriage[0] - 7, carriage[1]], [carriage[0] + 7, carriage[1]]], colour: colour('carriage', CARRIAGE) },
      ];
      const angle = (body: string) => Math.round((Math.atan2(frameAt(table, body, u)[1], frameAt(table, body, u)[0]) * 180) / Math.PI);
      // Each joint's turn is written beside its pin, on the side away from the next segment.
      const label = (pin: Pin, toward: Pin, text: string) => {
        const [x, z] = p(pin), [nx, nz] = p(toward), size = Math.hypot(nx - x, nz - z) || 1;
        return { at: [x + ((nz - z) / size) * 15 - ((nx - x) / size) * 4, z - ((nx - x) / size) * 15 - 2] as Point, text, anchor: 'middle' as const };
      };
      return {
        bars,
        fixed: [p('frame-P'), p('frame-Q')],
        joints: [p('link-P'), p('P-S'), p('S-Q'), p('P-R'), p('S-T'), p('T-R')],
        handle: carriage,
        labels: [label('frame-P', 'P-S', `${angle('P')}°`), label('P-S', 'S-T', `${angle('S')}°`), label('S-T', 'T-R', `${angle('T')}°`)],
      };
    },
    follow(x) {
      return Math.min(100, Math.max(0, ((x - carriageRest) / (carriageFull - carriageRest)) * 100));
    },
    question: {
      ask: 'The motor turns one screw. How many joints of the finger bend?',
      choices: ['One', 'Two', 'Three'],
      right: 2,
      why: 'The knuckle, the middle joint and the tip all bend. The two bars pass the motion from each segment to the next.',
    },
  };
}
