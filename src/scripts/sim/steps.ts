/** The simulator's first five steps: from one see-saw to a double reverse four-bar.

    Each step is a small machine of bars and pins, worked out with nothing but circles: a pin
    that sits on two bars is where two circles meet. `draw` says where every bar is for one
    position of the part the student moves. Lengths are in the drawing's own units, x to the
    right and y up. The sixth step, the hand's own finger, is in finger.ts.

    The bars take the colours the homepage gives the finger's links, so that by the last step
    the student has already met each colour doing the same job. */

export type Point = [number, number];
export type Bar = { points: Point[]; colour: string; name?: string; faint?: boolean; closed?: boolean };
export type Drawing = {
  bars: Bar[];
  /** Pins that hold a bar to the frame, and pins that join two bars. */
  fixed: Point[];
  joints: Point[];
  /** The point the student drags. */
  handle: Point;
  labels?: { at: Point; text: string; anchor?: 'start' | 'middle' | 'end' }[];
  /** Thin lines that show a path or a level, as SVG path data in drawing units (y up). */
  traces?: Point[][];
};
export type Step = {
  title: string;
  body: string[];
  notice: string;
  /** What the student moves. `round` means it goes all the way round, so Play keeps turning it. */
  input: { label: string; min: number; max: number; start: number; round?: boolean };
  /** One thing about the machine the student can change. `choices` makes it a set of buttons. */
  setting?: { label: string; min: number; max: number; start: number; step: number; choices?: string[] };
  /** The part of the drawing to show: left, bottom, width, height. */
  window: [number, number, number, number];
  draw(input: number, setting: number): Drawing;
  /** Where a pointer at (x, y) puts the input. */
  follow(x: number, y: number, setting: number): number;
  question: { ask: string; choices: string[]; right: number; why: string };
};

// The finger's colours on the homepage: first segment, its bar, middle segment, its bar, fingertip.
export const CORAL = '#f26b5e', YELLOW = '#f0b000', VIOLET = '#8f6be8', ORANGE = '#fa8c26', SKY = '#40b3eb', NAVY = '#133476', PINK = '#f580b0', TEAL = '#1fbfa6';

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const clamp = (x: number, low: number, high: number) => Math.min(high, Math.max(low, x));
const from = (p: Point, length: number, angle: number): Point => [p[0] + length * Math.cos(angle), p[1] + length * Math.sin(angle)];
const far = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const angleOf = (centre: Point, x: number, y: number) => Math.atan2(y - centre[1], x - centre[0]);
/** The angle brought into -180 to 180 degrees. */
const wrap = (degrees: number) => ((((degrees + 180) % 360) + 360) % 360) - 180;

/** Where a circle about `a` and a circle about `b` meet: the meeting point to the left of the
    line from a to b when `left` is true, the other one when it is false. If they cannot reach
    each other, the nearest thing: the point on the line between them. */
export function meet(a: Point, ra: number, b: Point, rb: number, left: boolean): Point {
  const d = far(a, b) || 1e-9;
  const along = (d * d + ra * ra - rb * rb) / (2 * d);
  const up = Math.sqrt(Math.max(0, ra * ra - along * along)) * (left ? 1 : -1);
  const ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d;
  return [a[0] + ux * along - uy * up, a[1] + uy * along + ux * up];
}
const arc = (centre: Point, radius: number, fromAngle: number, toAngle: number): Point[] =>
  Array.from({ length: 25 }, (_, i) => from(centre, radius, fromAngle + ((toAngle - fromAngle) * i) / 24));

// ---- 1. a see-saw ----
const seesaw: Step = {
  title: 'A see-saw',
  body: ['A bar that turns on a pin is a lever. A see-saw is one. Push one end down and the other end comes up.', 'Drag the left end. Then move the pin and try again.'],
  notice: 'The end that is further from the pin always travels further.',
  input: { label: 'Tip the bar', min: -24, max: 24, start: 14 },
  setting: { label: 'Where the pin is', min: 20, max: 80, start: 32, step: 1 },
  window: [-260, -170, 520, 340],
  draw(tip, pin) {
    const pivot: Point = [-200 + 4 * pin, 0], a = rad(tip);
    const left = from(pivot, 4 * pin, a + Math.PI), right = from(pivot, 400 - 4 * pin, a);
    const swing = rad(24);
    return {
      bars: [{ points: [left, right], colour: CORAL }],
      fixed: [pivot],
      joints: [],
      handle: left,
      traces: [arc(pivot, 4 * pin, Math.PI - swing, Math.PI + swing), arc(pivot, 400 - 4 * pin, -swing, swing)],
      labels: [
        { at: [left[0], left[1] + (tip > 0 ? -34 : 30)], text: `${Math.round(Math.abs(left[1]))} ${tip > 0 ? 'down' : 'up'}`, anchor: 'middle' },
        { at: [right[0], right[1] + (tip > 0 ? 30 : -34)], text: `${Math.round(Math.abs(right[1]))} ${tip > 0 ? 'up' : 'down'}`, anchor: 'middle' },
      ],
    };
  },
  follow(x, y, pin) {
    const pivot: Point = [-200 + 4 * pin, 0];
    return clamp(wrap((angleOf(pivot, x, y) * 180) / Math.PI - 180), -24, 24);
  },
  question: {
    ask: 'The pin is close to the left end. You push the left end down a little. Which end moves further?',
    choices: ['The left end', 'The right end', 'Both move the same'],
    right: 1,
    why: 'The right end is further from the pin, so it sweeps a bigger arc.',
  },
};

// ---- 2. two see-saws joined by a rod ----
// The first see-saw's right end and the second one's left end are joined by a rod. Moving the
// second see-saw's pin changes how long its arm on the rod's side is.
const FIRST_PIN: Point = [-170, -70], FIRST_OUT = 110, FIRST_IN = 90, ROD = 130, SECOND_BAR = 250;
function linked(tip: number, arm: number) {
  const a = rad(tip);
  const grip = from(FIRST_PIN, FIRST_IN, a + Math.PI), out = from(FIRST_PIN, FIRST_OUT, a);
  // At rest the rod stands straight up from the first see-saw's end, and the second see-saw is level.
  const pin: Point = [FIRST_PIN[0] + FIRST_OUT + arm, FIRST_PIN[1] + ROD];
  const end = meet(out, ROD, pin, arm, true);
  const turn = angleOf(pin, end[0], end[1]) + Math.PI;
  const other = from(pin, SECOND_BAR - arm, turn);
  return { grip, out, pin, end, other, turned: wrap((turn * 180) / Math.PI) };
}
const twoSeesaws: Step = {
  title: 'Two see-saws and a rod',
  body: ['Join the end of one see-saw to the end of another with a rod. Now moving the first one moves the second. The rod carries the motion across.', 'Drag the left end of the lower see-saw. Then move the upper see-saw\'s pin.'],
  notice: 'The closer the upper pin is to the rod, the further the upper see-saw swings.',
  input: { label: 'Tip the lower see-saw', min: -20, max: 20, start: 12 },
  setting: { label: 'Where the upper pin is', min: 60, max: 190, start: 125, step: 1 },
  window: [-290, -190, 580, 380],
  draw(tip, arm) {
    const m = linked(tip, arm);
    return {
      bars: [{ points: [m.grip, m.out], colour: CORAL }, { points: [m.out, m.end], colour: YELLOW }, { points: [m.end, m.other], colour: VIOLET }],
      fixed: [FIRST_PIN, m.pin],
      joints: [m.out, m.end],
      handle: m.grip,
      labels: [{ at: [m.other[0], m.other[1] + 30], text: `turned ${Math.round(Math.abs(m.turned))}°`, anchor: 'end' }, { at: [m.grip[0] + 4, m.grip[1] - 30], text: `turned ${Math.abs(Math.round(tip))}°`, anchor: 'start' }],
    };
  },
  follow(x, y) {
    return clamp(wrap((angleOf(FIRST_PIN, x, y) * 180) / Math.PI - 180), -20, 20);
  },
  question: {
    ask: 'You slide the upper pin closer to the rod. For the same push on the lower see-saw, the upper one turns…',
    choices: ['More', 'Less', 'The same'],
    right: 0,
    why: 'The rod moves its end of the upper see-saw the same distance. On a shorter arm, the same distance is a bigger turn.',
  },
};

// ---- 3. a four-bar ----
const LEFT_PIN: Point = [-120, -60], RIGHT_PIN: Point = [100, -60], COUPLER = 215, ROCKER = 150;
function fourBar(turn: number, crank: number) {
  const a = from(LEFT_PIN, crank, rad(turn));
  const b = meet(a, COUPLER, RIGHT_PIN, ROCKER, true);
  return { a, b, rock: (angleOf(RIGHT_PIN, b[0], b[1]) * 180) / Math.PI };
}
const fourBarStep: Step = {
  title: 'A four-bar',
  body: ['Count the bars: the two see-saws, the rod, and the frame that holds the two pins. Four bars joined in a loop is a four-bar linkage.', 'Make the first bar short enough and it can go all the way round. Then it is called a crank. Drag it round, or press Play.'],
  notice: 'The crank goes round and round. The far bar only rocks out and back. That is how a motor that spins can move a part that swings.',
  input: { label: 'Turn the crank', min: 0, max: 360, start: 50, round: true },
  setting: { label: 'Length of the crank', min: 35, max: 90, start: 60, step: 1 },
  window: [-270, -190, 540, 380],
  draw(turn, crank) {
    const m = fourBar(turn, crank);
    const rocks = Array.from({ length: 73 }, (_, i) => fourBar(i * 5, crank).rock);
    const low = Math.min(...rocks), high = Math.max(...rocks);
    return {
      bars: [{ points: [LEFT_PIN, RIGHT_PIN], colour: NAVY, faint: true }, { points: [LEFT_PIN, m.a], colour: CORAL }, { points: [m.a, m.b], colour: YELLOW }, { points: [RIGHT_PIN, m.b], colour: VIOLET }],
      fixed: [LEFT_PIN, RIGHT_PIN],
      joints: [m.a, m.b],
      handle: m.a,
      traces: [arc(LEFT_PIN, crank, 0, 2 * Math.PI), arc(RIGHT_PIN, ROCKER, rad(low), rad(high))],
      labels: [
        { at: [LEFT_PIN[0], LEFT_PIN[1] - 36], text: 'crank', anchor: 'middle' },
        { at: [(m.a[0] + m.b[0]) / 2, (m.a[1] + m.b[1]) / 2 + 24], text: 'rod', anchor: 'middle' },
        { at: [RIGHT_PIN[0] + 18, RIGHT_PIN[1] - 36], text: `rocker: swings ${Math.round(high - low)}°`, anchor: 'middle' },
        { at: [(LEFT_PIN[0] + RIGHT_PIN[0]) / 2, LEFT_PIN[1] - 14], text: 'frame', anchor: 'middle' },
      ],
    };
  },
  follow(x, y) {
    return (((angleOf(LEFT_PIN, x, y) * 180) / Math.PI) % 360 + 360) % 360;
  },
  question: {
    ask: 'The crank turns one full circle. What does the far bar do?',
    choices: ['It goes round once too', 'It rocks out and back once', 'It stays still'],
    right: 1,
    why: 'The far bar is too long to be pulled all the way round, so the rod swings it out and back.',
  },
};

// ---- 4. a six-bar ----
// The four-bar again, further left. Its rocker is one bar with a third pin on it, and from that
// pin a second rod drives a last bar on a third frame pin: a second four-bar that shares a bar
// with the first.
const P1: Point = [-230, -80], P2: Point = [-60, -80], P3: Point = [150, -80];
const ROD_1 = 170, ROCK_1 = 115, REACH = 185, ROD_2 = 290, LAST = 100;
function sixBar(turn: number, crank: number) {
  const a = from(P1, crank, rad(turn));
  const b = meet(a, ROD_1, P2, ROCK_1, true);
  const lean = angleOf(P2, b[0], b[1]);
  const c = from(P2, REACH, lean);
  const d = meet(c, ROD_2, P3, LAST, true);
  return { a, b, c, d, rock: (lean * 180) / Math.PI, last: (angleOf(P3, d[0], d[1]) * 180) / Math.PI };
}
const sixBarStep: Step = {
  title: 'A six-bar',
  body: ['Give the rocking bar one more pin, and hang a second rod and a last bar from it. That is a second four-bar, and it shares a bar with the first. Six bars in all, counting the frame.', 'Turn the crank and watch the motion pass from one loop to the next.'],
  notice: 'The last bar swings further than the bar that drives it. One motor, two loops, and a movement neither loop could make alone.',
  input: { label: 'Turn the crank', min: 0, max: 360, start: 40, round: true },
  setting: { label: 'Length of the crank', min: 30, max: 60, start: 48, step: 1 },
  window: [-300, -190, 600, 380],
  draw(turn, crank) {
    const m = sixBar(turn, crank);
    const sweep = Array.from({ length: 73 }, (_, i) => sixBar(i * 5, crank));
    const span = (key: 'rock' | 'last') => Math.round(Math.max(...sweep.map((s) => s[key])) - Math.min(...sweep.map((s) => s[key])));
    return {
      bars: [
        { points: [P1, P3], colour: NAVY, faint: true },
        { points: [P1, m.a], colour: CORAL }, { points: [m.a, m.b], colour: YELLOW }, { points: [P2, m.c], colour: VIOLET },
        { points: [m.c, m.d], colour: ORANGE }, { points: [P3, m.d], colour: SKY },
      ],
      fixed: [P1, P2, P3],
      joints: [m.a, m.b, m.c, m.d],
      handle: m.a,
      traces: [arc(P1, crank, 0, 2 * Math.PI)],
      labels: [
        { at: [P2[0], P2[1] - 36], text: `swings ${span('rock')}°`, anchor: 'middle' },
        { at: [P3[0], P3[1] - 36], text: `swings ${span('last')}°`, anchor: 'middle' },
      ],
    };
  },
  follow(x, y) {
    return (((angleOf(P1, x, y) * 180) / Math.PI) % 360 + 360) % 360;
  },
  question: {
    ask: 'How many of the six bars move when the crank turns?',
    choices: ['Three', 'Five', 'Six'],
    right: 1,
    why: 'The crank, two rods and two rocking bars move. The sixth bar is the frame, and it stays still.',
  },
};

// ---- 5. a double reverse four-bar ----
// Two four-bars, each with its opposite bars the same length, so each stays a parallelogram.
// The upper one folds the opposite way to the lower one, so the top comes back over the base.
const BASE: Point = [-45, -150], GAP = 44, ARM = 140, FOLDED = 8, RAISED = 58;   // the arms' angle at the bottom and at the top, in degrees
function lift(height: number) {
  const a = rad(FOLDED + (RAISED - FOLDED) * clamp(height, 0, 1));
  const low1 = BASE, low2: Point = [BASE[0], BASE[1] + GAP];
  const mid1 = from(low1, ARM, a), mid2 = from(low2, ARM, a), mid3: Point = [mid2[0], mid2[1] + GAP];
  const top1 = from(mid2, ARM, Math.PI - a), top2 = from(mid3, ARM, Math.PI - a);
  return { low1, low2, mid1, mid2, mid3, top1, top2 };
}
const dr4b: Step = {
  title: 'A double reverse four-bar',
  body: ['Make a four-bar whose opposite bars are the same length. It is a parallelogram, and it stays one however it moves, so the bar at its end never tilts.', 'Stack a second one on top that folds the opposite way. Robot lifts use this. It is called a double reverse four-bar, or DR4B. Drag the platform up.'],
  notice: 'The platform goes straight up. It never tilts, and it stays above the base.',
  input: { label: 'Lift the platform', min: 0, max: 100, start: 35 },
  window: [-300, -200, 600, 400],
  draw(height) {
    const m = lift(height / 100);
    const shelf: Point[] = [[m.top2[0] - 70, m.top2[1]], [m.top2[0] + 70, m.top2[1]]];
    const low = lift(0), high = lift(1);
    return {
      bars: [
        { points: [[BASE[0], BASE[1] - 22], m.low2], colour: NAVY },
        { points: [m.low1, m.mid1], colour: CORAL }, { points: [m.low2, m.mid2], colour: CORAL },
        { points: [m.mid1, m.mid3], colour: VIOLET },
        { points: [m.mid2, m.top1], colour: ORANGE }, { points: [m.mid3, m.top2], colour: ORANGE },
        { points: [m.top1, m.top2], colour: SKY }, { points: shelf, colour: SKY },
      ],
      fixed: [m.low1, m.low2],
      joints: [m.mid1, m.mid2, m.mid3, m.top1, m.top2],
      handle: [m.top2[0], m.top2[1]],
      traces: [[[low.top2[0], low.top2[1]], [high.top2[0], high.top2[1]]]],
      labels: [{ at: [m.top2[0] + 84, m.top2[1] - 6], text: `${Math.round(m.top2[1] - low.top2[1])} up`, anchor: 'start' }],
    };
  },
  follow(_x, y) {
    // The platform's height above its lowest place is two arms' rise.
    const lowest = lift(0).top2[1], sine = (y - lowest) / (2 * ARM) + Math.sin(rad(FOLDED));
    return clamp(((Math.asin(clamp(sine, -1, 1)) * 180) / Math.PI - FOLDED) / (RAISED - FOLDED), 0, 1) * 100;
  },
  question: {
    ask: 'Why does the platform stay level all the way up?',
    choices: ['Each four-bar is a parallelogram, so its end bar stays parallel to its first bar', 'The bars are too stiff to let it tilt', 'The motor holds it level'],
    right: 0,
    why: 'Opposite bars of a parallelogram stay parallel. The base is upright, so the middle bar stays upright, and so does the top one.',
  },
};

export const STEPS: Step[] = [seesaw, twoSeesaws, fourBarStep, sixBarStep, dr4b];
