/** The simulator page: six guided steps for Lesson 1, from a see-saw to the finger of the hand.

    Each step is one small machine the student moves (steps.ts, finger.ts), one thing to change
    about it, a sentence on what to notice and one question. This file draws the machine,
    follows the pointer, plays the motion and marks the answers. Nothing is saved: a reload
    starts again. */
import { STEPS, type Point, type Step } from './steps';
import { fingerStep, litLinks } from './finger';
import { NO_TURN, SIDE_ON, extent, loadHand, startHandView, type Pose, type Shade } from '../hand/view';

type AnyStep = Step & { says?(setting: number): string };
const root = document.querySelector<HTMLElement>('[data-sim]')!;
const one = <T extends Element>(selector: string) => root.querySelector<T>(selector)!;
const all = <T extends Element>(selector: string) => [...root.querySelectorAll<T>(selector)];

const steps: (AnyStep | null)[] = [...STEPS, null];   // the sixth is built when the hand's data arrives
const inputs = STEPS.map((step) => step.input.start).concat(35);
const settings = STEPS.map((step) => step.setting?.start ?? 0).concat(1);
const done = steps.map(() => false);
let at = 0;
let playing = false;

// ---- the drawing ----
const svg = one<SVGSVGElement>('[data-stage]');
const point = ([x, y]: Point) => `${x.toFixed(2)},${(-y).toFixed(2)}`;
function paint() {
  const step = steps[at];
  if (!step) return;
  const d = step.draw(inputs[at], settings[at]);
  const [x, y, w, h] = step.window, k = w / 600;   // every step is drawn as if its window were 600 wide
  svg.setAttribute('viewBox', `${x} ${-(y + h)} ${w} ${h}`);
  let out = '';
  for (const trace of d.traces ?? []) out += `<polyline class="sim-trace" stroke-width="${1.5 * k}" stroke-dasharray="${5 * k} ${6 * k}" points="${trace.map(point).join(' ')}"/>`;
  for (const bar of d.bars) {
    const points = bar.points.map(point).join(' ');
    if (bar.faint) out += `<polyline class="sim-frame" stroke="${bar.colour}" stroke-width="${4 * k}" stroke-dasharray="${2 * k} ${9 * k}" points="${points}"/>`;
    // Under each bar goes a slightly wider navy line at low strength. The gold and the sky are
    // light, and on the pale stage that line is what holds their edge.
    else if (bar.closed) out += `<polygon class="sim-under" stroke-width="${9.5 * k}" points="${points}"/><polygon fill="${bar.colour}" fill-opacity="0.3" stroke="${bar.colour}" stroke-width="${7 * k}" stroke-linejoin="round" points="${points}"/>`;
    else out += `<polyline class="sim-under" stroke-width="${14.5 * k}" points="${points}"/><polyline fill="none" stroke="${bar.colour}" stroke-width="${12 * k}" stroke-linecap="round" stroke-linejoin="round" points="${points}"/>`;
  }
  for (const [px, py] of d.joints) out += `<circle class="sim-joint" cx="${px}" cy="${-py}" r="${5 * k}" stroke-width="${2.5 * k}"/>`;
  for (const [px, py] of d.fixed) out += `<circle class="sim-fixed" cx="${px}" cy="${-py}" r="${8 * k}"/><circle class="sim-fixed-eye" cx="${px}" cy="${-py}" r="${2.6 * k}"/>`;
  out += `<circle class="sim-handle" cx="${d.handle[0]}" cy="${-d.handle[1]}" r="${15 * k}" stroke-width="${2.5 * k}"/>`;
  // Labels keep one size on the screen, 13 px, however small the stage is.
  const type = 13 * (w / (svg.clientWidth || 600));
  for (const label of d.labels ?? []) out += `<text class="sim-label" x="${label.at[0]}" y="${-label.at[1]}" font-size="${type.toFixed(2)}" text-anchor="${label.anchor ?? 'start'}">${label.text}</text>`;
  svg.innerHTML = out;
  if (at === 5) paintFinger();
}

// ---- the real finger, beside its drawing in the last step ----
const fingerBox = one<HTMLElement>('[data-three]');
const fingerCanvas = one<HTMLCanvasElement>('[data-finger]');
let finger: { draw(pose: Pose, yaw: number, pitch: number, tilt: number[], shade?: Shade): void } | null = null;
const PALE: [number, number, number] = [0.86, 0.88, 0.92];
function paintFinger() {
  if (!finger) return;
  const lit = litLinks(settings[5]);
  // The housing is the frame the two fixed pins sit in.
  const shade: Shade = (part) => (lit.includes(part.endsWith(':module') ? 'frame' : part.split(':')[1]) ? undefined : PALE);
  finger.draw({ fingers: [0, 0, inputs[5] / 100, 0], thumbCurl: 0, thumbSwing: 0 }, 0.34, -0.2, NO_TURN, shade);
}

// ---- moving it: the pointer, the slider, Play ----
const range = one<HTMLInputElement>('[data-input]');
const playButton = one<HTMLButtonElement>('[data-play]');
function setInput(value: number) {
  const step = steps[at];
  if (!step) return;
  inputs[at] = Math.min(step.input.max, Math.max(step.input.min, value));
  range.value = String(inputs[at]);
  paint();
}
function follow(e: PointerEvent) {
  const step = steps[at], to = svg.getScreenCTM();
  if (!step || !to) return;
  const here = new DOMPoint(e.clientX, e.clientY).matrixTransform(to.inverse());
  setInput(step.follow(here.x, -here.y, settings[at]));
}
svg.addEventListener('pointerdown', (e) => {
  play(false);
  svg.setPointerCapture(e.pointerId);
  svg.classList.add('is-held');
  follow(e);
  const stop = () => {
    svg.classList.remove('is-held');
    svg.removeEventListener('pointermove', follow);
    svg.removeEventListener('pointerup', stop);
    svg.removeEventListener('pointercancel', stop);
  };
  svg.addEventListener('pointermove', follow);
  svg.addEventListener('pointerup', stop);
  svg.addEventListener('pointercancel', stop);
});
range.addEventListener('input', () => { play(false); setInput(Number(range.value)); });

let phase = 0, before = 0;
function play(on: boolean) {
  const step = steps[at];
  if (on === playing || (on && !step)) return;
  playing = on;
  playButton.textContent = on ? 'Pause' : 'Play';
  playButton.setAttribute('aria-pressed', String(on));
  if (!on || !step) return;
  const { min, max } = step.input;
  phase = Math.asin(Math.min(1, Math.max(-1, (inputs[at] - (min + max) / 2) / ((max - min) / 2))));
  before = performance.now();
  requestAnimationFrame(turn);
}
function turn(now: number) {
  const step = steps[at];
  if (!playing || !step) return;
  const passed = Math.min(0.05, (now - before) / 1000);
  before = now;
  const { min, max, round } = step.input;
  if (round) setInput((inputs[at] + 75 * passed) % 360);   // round and round, a turn in about five seconds
  else {
    phase += (passed * 2 * Math.PI) / 3.6;   // out and back in 3.6 seconds
    setInput((min + max) / 2 + ((max - min) / 2) * Math.sin(phase));
  }
  requestAnimationFrame(turn);
}
playButton.addEventListener('click', () => play(!playing));

// ---- the one thing to change ----
const settingRow = one<HTMLElement>('[data-setting]');
const settingRange = one<HTMLInputElement>('[data-setting-range]');
const settingLabel = one<HTMLElement>('[data-setting-label]');
const choiceRow = one<HTMLElement>('[data-setting-choices]');
const says = one<HTMLElement>('[data-says]');
function setSetting(value: number) {
  settings[at] = value;
  for (const button of all<HTMLButtonElement>('[data-choice]')) button.setAttribute('aria-pressed', String(Number(button.dataset.choice) === value));
  const step = steps[at];
  says.hidden = !step?.says;
  if (step?.says) says.textContent = step.says(value);
  paint();
}
settingRange.addEventListener('input', () => setSetting(Number(settingRange.value)));

// ---- the question ----
const ask = one<HTMLElement>('[data-ask]');
const answers = one<HTMLElement>('[data-answers]');
const verdict = one<HTMLElement>('[data-verdict]');
const TICK = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function showQuestion(step: Step) {
  ask.textContent = step.question.ask;
  verdict.textContent = done[at] ? 'Right. ' + step.question.why : '';
  answers.replaceChildren(...step.question.choices.map((text, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sim-answer';
    button.textContent = text;
    if (done[at] && i === step.question.right) markRight(button);
    button.addEventListener('click', () => {
      for (const other of answers.children) other.classList.remove('is-wrong');
      if (i === step.question.right) {
        done[at] = true;
        markRight(button);
        verdict.textContent = 'Right. ' + step.question.why;
        showProgress();
      } else {
        button.classList.add('is-wrong');
        verdict.textContent = 'Not that one. Move it again and watch: ' + step.notice.charAt(0).toLowerCase() + step.notice.slice(1);
      }
    });
    return button;
  }));
}
function markRight(button: HTMLButtonElement) {
  button.classList.add('is-right');
  if (!button.querySelector('svg')) button.insertAdjacentHTML('afterbegin', TICK);
}

// ---- going from step to step ----
const tabs = all<HTMLButtonElement>('[data-step]');
const count = one<HTMLElement>('[data-count]');
const title = one<HTMLElement>('[data-title]');
const body = one<HTMLElement>('[data-body]');
const notice = one<HTMLElement>('[data-notice]');
const back = one<HTMLButtonElement>('[data-back]');
const next = one<HTMLButtonElement>('[data-next]');
const waiting = one<HTMLElement>('[data-waiting]');
const live = one<HTMLElement>('[data-live]');
function showProgress() {
  tabs.forEach((tab, i) => {
    tab.classList.toggle('is-done', done[i]);
    tab.setAttribute('aria-current', i === at ? 'step' : 'false');
    tab.setAttribute('aria-label', `Step ${i + 1}: ${tab.dataset.name}${done[i] ? ', answered' : ''}`);
  });
  const total = done.filter(Boolean).length;
  one('[data-total]').textContent = total === done.length ? 'All six answered.' : `${total} of ${done.length} answered`;
}
function show(n: number) {
  play(false);
  at = n;
  const step = steps[at];
  count.textContent = `Step ${at + 1} of ${steps.length}`;
  back.disabled = at === 0;
  next.disabled = at === steps.length - 1;
  fingerBox.hidden = at !== 5;
  live.hidden = !step;
  waiting.hidden = !!step;
  showProgress();
  if (!step) {
    title.textContent = tabs[at].dataset.name ?? '';
    return;
  }
  title.textContent = step.title;
  body.replaceChildren(...step.body.map((text) => Object.assign(document.createElement('p'), { textContent: text })));
  notice.textContent = step.notice;
  one('[data-input-label]').textContent = step.input.label;
  range.min = String(step.input.min);
  range.max = String(step.input.max);
  range.step = step.input.round ? '1' : '0.5';
  range.value = String(inputs[at]);
  svg.setAttribute('aria-label', `${step.title}. ${step.notice}`);
  settingRow.hidden = !step.setting;
  if (step.setting) {
    const s = step.setting;
    settingLabel.textContent = s.label;
    settingRange.hidden = !!s.choices;
    choiceRow.hidden = !s.choices;
    if (s.choices) {
      choiceRow.replaceChildren(...s.choices.map((text, i) => {
        const button = Object.assign(document.createElement('button'), { type: 'button', textContent: text, className: 'sim-choice' });
        button.dataset.choice = String(i + 1);
        button.addEventListener('click', () => setSetting(i + 1));
        return button;
      }));
    } else {
      settingRange.min = String(s.min);
      settingRange.max = String(s.max);
      settingRange.step = String(s.step);
      settingRange.value = String(settings[at]);
    }
  }
  showQuestion(step);
  setSetting(settings[at]);
}
tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i)));
back.addEventListener('click', () => show(at - 1));
next.addEventListener('click', () => show(at + 1));

// A link can name its step: .../simulator/#step-3 opens "A four-bar". Lesson 1's "Change it" does.
show(Number(/^#step-([1-6])$/.exec(location.hash)?.[1] ?? 1) - 1);
root.dataset.ready = 'steps';

// The sixth step needs the hand's own data: its tables for the drawing, its parts for the picture.
loadHand(root.dataset.handData!).then(({ info, data }) => {
  const [low, high] = extent(info, data, 'finger2:T');
  steps[5] = fingerStep(info.fingers, [high[0] - 2, (low[2] + high[2]) / 2]);
  const view = startHandView(fingerCanvas, info, data, { only: (part) => part.startsWith('finger2:'), look: [146, info.fingers.y[2], 56], reach: [152, 76], face: SIDE_ON });   // the finger of Final v3 reaches X 0..291, Z -15..127 mm through its travel
  finger = view;
  if (!view) one('[data-three-note]').textContent = 'This browser could not draw the 3D finger. The drawing above is the same finger.';
  else one<HTMLElement>('[data-three-note]').hidden = true;
  root.dataset.ready = 'all';
  if (at === 5) show(5);
}).catch((error: Error) => {
  waiting.textContent = 'The finger could not be loaded, so this step is missing. ' + (error.message.startsWith('The CAD') ? error.message + '.' : '');
  root.dataset.ready = 'failed';
});

// For the page's own checks. Not used by the page.
(window as unknown as { helpingHandSim: unknown }).helpingHandSim = { inputs, settings, done, at: () => at, steps, show };
