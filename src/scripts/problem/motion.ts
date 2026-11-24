/** The Problem's motion, made with Anime.js. Three things move: the lead numbers count up
    as they come into view, the comparison's rows and squares arrive one after another, and
    the drawing plays "follow the steps" against "change one bar".
    None of it runs for a visitor who has asked for less motion, and the page is whole
    without it: every number, row and drawing is in the HTML in its finished state, and this
    script only takes them back to a start and plays them forward. */
import { animate, createTimeline, stagger } from 'animejs';
import { SHAPES, between, pose, trace, type Shape } from './linkage';

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Run once, the first time `el` is on screen. */
function whenSeen(el: Element, run: () => void, share = 0.2) {
  const watch = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    watch.disconnect();
    run();
  }, { threshold: share });
  watch.observe(el);
}

// ---- 1. numbers count up ----
function countUp(el: HTMLElement) {
  const written = el.textContent ?? '';
  const parts = written.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!parts) return;
  const [, before, digits, after] = parts;
  const target = Number(digits.replace(/,/g, ''));
  const places = (digits.split('.')[1] ?? '').length;
  const show = (value: number) => before + value.toLocaleString('en-US', { minimumFractionDigits: places, maximumFractionDigits: places }) + after;
  const at = { value: 0 };
  el.textContent = show(0);
  // Printing must never catch a number part of the way up.
  addEventListener('beforeprint', () => { el.textContent = written; }, { once: true });
  whenSeen(el, () => {
    animate(at, {
      value: target,
      duration: 1500,
      ease: 'outExpo',
      onUpdate: () => { el.textContent = show(at.value); },
      onComplete: () => { el.textContent = written; },
    });
  }, 0.6);
}

// ---- 2. the comparison arrives row by row, then its squares ----
function arrive(table: HTMLElement) {
  const rows = [...table.querySelectorAll<HTMLElement>('.cmp-row')];
  const squares = rows.map((row) => [...row.querySelectorAll<HTMLElement>('.strip-cell')]);
  for (const row of rows) row.style.opacity = '0';
  for (const cell of squares.flat()) cell.style.opacity = '0';
  whenSeen(table, () => {
    animate(rows, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 650,
      delay: stagger(110),
      ease: 'outExpo',
      onComplete: () => rows.forEach((row) => row.removeAttribute('style')),
    });
    squares.forEach((cells, i) => {
      animate(cells, {
        opacity: [0, 1],
        scale: [0.3, 1],
        duration: 420,
        delay: stagger(45, { start: 420 + i * 110 }),
        ease: 'outBack',
        onComplete: () => cells.forEach((cell) => { cell.style.removeProperty('opacity'); cell.style.removeProperty('transform'); }),
      });
    });
  }, 0.08);
}

// ---- 3. the drawing ----
function drawing(root: HTMLElement) {
  const parts = [1, 2, 3, 4, 5].map((n) => root.querySelector<SVGElement>(`[data-part="${n}"]`)!);
  const ticks = [1, 2, 3, 4, 5].map((n) => root.querySelector<SVGElement>(`[data-tick="${n}"]`)!);
  const crank = root.querySelector<SVGLineElement>('[data-crank]')!, rocker = root.querySelector<SVGLineElement>('[data-rocker]')!;
  const rod = root.querySelector<SVGPolylineElement>('[data-rod]')!, path = root.querySelector<SVGPolylineElement>('[data-trace]')!;
  const pinB = root.querySelector<SVGCircleElement>('[data-pin-b]')!, pinC = root.querySelector<SVGCircleElement>('[data-pin-c]')!, tip = root.querySelector<SVGCircleElement>('[data-tip]')!;
  if (parts.includes(null!) || !crank || !rocker || !rod || !path || !pinB || !pinC || !tip) return;

  // Left: the five steps, ticked off as each part drops into place. Then again, the same.
  document.documentElement.classList.add('duo-live');
  const steps = createTimeline({ loop: true, loopDelay: 500, autoplay: false });
  steps.call(() => ticks.forEach((tick) => tick.classList.remove('is-done')), 0);
  steps.set(parts, { opacity: 0 }, 0);
  parts.forEach((part, i) => {
    // On an SVG <rect>, `y` is the rect's own attribute: the drop has to be a transform.
    steps.add(part, { opacity: [0, 1], translateY: [-22, 0], duration: 520, ease: 'outBack' }, 300 + i * 720);
    steps.call(() => ticks[i].classList.add('is-done'), 300 + i * 720 + 260);
  });
  steps.add(parts, { opacity: [1, 0], duration: 380, ease: 'inQuad' }, 300 + 5 * 720 + 1500);

  // Right: the linkage goes round twice, one bar changes length, and the path changes.
  const place = (turn: number, shape: Shape) => {
    const at = pose(turn, shape), fix = (v: number) => v.toFixed(1);
    crank.setAttribute('x2', fix(at.b[0])); crank.setAttribute('y2', fix(at.b[1]));
    rocker.setAttribute('x2', fix(at.c[0])); rocker.setAttribute('y2', fix(at.c[1]));
    rod.setAttribute('points', [at.b, at.c, at.tip].map((q) => q.map(fix).join(',')).join(' '));
    pinB.setAttribute('cx', fix(at.b[0])); pinB.setAttribute('cy', fix(at.b[1]));
    pinC.setAttribute('cx', fix(at.c[0])); pinC.setAttribute('cy', fix(at.c[1]));
    tip.setAttribute('cx', fix(at.tip[0])); tip.setAttribute('cy', fix(at.tip[1]));
  };
  const state = { turn: 2.1, blend: 0 };
  let now = 0, running: { pause(): unknown; play(): unknown } | null = null, watching = false;
  const round = () => {
    const shape = SHAPES[now];
    path.setAttribute('points', trace(shape));
    running = animate(state, {
      turn: state.turn + Math.PI * 4,
      duration: 5600,
      ease: 'linear',
      onUpdate: () => place(state.turn, shape),
      onComplete: change,
    });
    animate(path, { opacity: [0, 0.55], duration: 500, ease: 'outQuad' });
  };
  const change = () => {
    const from = SHAPES[now], to = SHAPES[(now + 1) % SHAPES.length];
    state.blend = 0;
    animate(path, { opacity: 0, duration: 300, ease: 'outQuad' });
    running = animate(state, {
      blend: 1,
      duration: 1100,
      ease: 'inOutQuad',
      onUpdate: () => place(state.turn, between(from, to, state.blend)),
      onComplete: () => { now = (now + 1) % SHAPES.length; round(); },
    });
  };

  // Both halves play only while the drawing is on screen.
  new IntersectionObserver((entries) => {
    const on = entries.some((entry) => entry.isIntersecting);
    if (on && !watching) { watching = true; steps.play(); running ? running.play() : round(); }
    else if (!on && watching) { watching = false; steps.pause(); running?.pause(); }
  }, { threshold: 0.15 }).observe(root);
}

if (!calm) {
  document.querySelectorAll<HTMLElement>('[data-count] .stat-number').forEach(countUp);
  const table = document.querySelector<HTMLElement>('[data-cmp]');
  if (table) arrive(table);
  const duo = document.querySelector<HTMLElement>('[data-duo]');
  if (duo) drawing(duo);
}
