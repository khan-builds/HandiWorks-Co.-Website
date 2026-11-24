/** The four-bar in The Problem's drawing: a crank that goes round, a rod, and a rocker, with a
    fingertip carried on the end of the rod. The page uses it to draw the still picture and
    its script (motion.ts) uses it to move the same picture, so the two cannot disagree.
    Lengths are in the drawing's own units; y grows downward, as in SVG. */
export type P = [number, number];
export type Shape = { rod: number; rocker: number };

export const LEFT: P = [60, 150];
export const RIGHT: P = [170, 150];
export const CRANK = 28;
/** Three linkages that differ only in two bar lengths. Each lets the crank go all the way
    round (the shortest bar plus the longest is less than the other two together). */
export const SHAPES: Shape[] = [
  { rod: 118, rocker: 70 },
  { rod: 100, rocker: 92 },
  { rod: 128, rocker: 56 },
];
const REACH = 60, BEND = 0.9;

/** Where the three moving pins are when the crank has turned `turn` radians. */
export function pose(turn: number, shape: Shape) {
  const b: P = [LEFT[0] + CRANK * Math.cos(turn), LEFT[1] + CRANK * Math.sin(turn)];
  const dx = RIGHT[0] - b[0], dy = RIGHT[1] - b[1], d = Math.hypot(dx, dy);
  // The rod's far pin is where a circle round `b` meets a circle round the rocker's pin.
  const along = (shape.rod ** 2 - shape.rocker ** 2 + d * d) / (2 * d);
  const off = Math.sqrt(Math.max(0, shape.rod ** 2 - along ** 2));
  const mx = b[0] + (along * dx) / d, my = b[1] + (along * dy) / d;
  const up: P = [mx + (off * dy) / d, my - (off * dx) / d], down: P = [mx - (off * dy) / d, my + (off * dx) / d];
  const c = up[1] < down[1] ? up : down;
  const ux = (c[0] - b[0]) / shape.rod, uy = (c[1] - b[1]) / shape.rod;
  const tip: P = [c[0] + REACH * (ux * Math.cos(BEND) - uy * Math.sin(BEND)), c[1] + REACH * (ux * Math.sin(BEND) + uy * Math.cos(BEND))];
  return { b, c, tip };
}

/** The path the fingertip draws in one turn of the crank, as SVG points. */
export function trace(shape: Shape): string {
  return Array.from({ length: 121 }, (_, i) => pose((i * 3 * Math.PI) / 180, shape).tip.map((v) => v.toFixed(1)).join(',')).join(' ');
}

/** A shape part of the way from one to another, for the change between two linkages. */
export const between = (a: Shape, b: Shape, t: number): Shape => ({ rod: a.rod + (b.rod - a.rod) * t, rocker: a.rocker + (b.rocker - a.rocker) * t });
