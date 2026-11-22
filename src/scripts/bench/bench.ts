/** "Test your code": the page that drives the hand.

    Every motor is either on the plugged-in board or on the pretend board in the page
    (pretend.ts). The page talks to both the same way (protocol.ts) and always draws what they
    report, so the on-screen hand is the board's own guess of where the real one is. With no
    hand plugged in, the pretend board covers all six motors.

    The page itself decides three things: where a slider sends a motor, the Reset steps, and
    the tilt rule (close the hand when it is turned past an angle). */
import { MOTOR_COUNT, ask, jog, read, stop, target, zero } from './protocol';
import { PretendBoard } from './pretend';
import { canConnect, connect, type Link } from './serial';
import { NO_TURN, gripPose, loadHand, startHandView, turnBetween, type Pose, type Turn } from '../hand/view';

const root = document.querySelector<HTMLElement>('[data-bench]')!;
const one = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
const all = <T extends HTMLElement>(selector: string) => [...root.querySelectorAll<T>(selector)];
const EVERY = Array.from({ length: MOTOR_COUNT }, (_, m) => m);

// ---- what the page knows ----
const set = new Array<number>(MOTOR_COUNT).fill(0);       // where each slider sends its motor, percent
const guess = new Array<number>(MOTOR_COUNT).fill(0);     // where the board in charge of it believes it is
const drawn = new Array<number>(MOTOR_COUNT).fill(0);     // where the on-screen hand has got to, easing after `guess`
const touched = new Array<number>(MOTOR_COUNT).fill(-1e9);   // when each slider was last moved here, so a report does not fight a drag
let grip: number[] = new Array<number>(MOTOR_COUNT).fill(100);   // "Close", in percent per motor: the CAD's checked grip
let link: Link | null = null;
let onBoard = new Set<number>();    // the motors the plugged-in board drives
let boardSenses = false;            // true while the readings come from the real sensor
let resetting = false;

// ---- the two boards ----
const pretend = new PretendBoard(EVERY, (line) => heard(line, false));
function send(line: string, motor?: number) {
  const now = performance.now();
  const toBoard = link && (motor === undefined || onBoard.has(motor));
  const toPretend = motor === undefined || !onBoard.has(motor);
  if (toBoard) link!.write(line);
  if (toPretend) pretend.hear(line, now);
  print('out', line, toBoard ? '' : 'on screen only');
}

// ---- the readout ----
const logBox = one<HTMLElement>('[data-log]');
const everyLine = one<HTMLInputElement>('[data-every-line]');
let paused = false;
const sampled: Record<string, number> = {};
const printed: Record<string, string> = {};
function print(way: 'out' | 'in' | 'note', text: string, aside = '') {
  if (paused) return;
  const row = document.createElement('div');
  row.className = 'bench-line bench-line-' + way;
  const time = new Date();
  const stamp = [time.getHours(), time.getMinutes(), time.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':') + '.' + Math.floor(time.getMilliseconds() / 100);
  row.textContent = `${stamp}  ${way === 'out' ? '>' : way === 'in' ? '<' : '#'}  ${text}${aside ? '   ' + aside : ''}`;
  const pinned = logBox.scrollHeight - logBox.scrollTop - logBox.clientHeight < 24;
  logBox.append(row);
  while (logBox.childElementCount > 240) logBox.firstElementChild!.remove();
  if (pinned) logBox.scrollTop = logBox.scrollHeight;
}
one('[data-pause]').addEventListener('click', (e) => {
  paused = !paused;
  (e.currentTarget as HTMLElement).textContent = paused ? 'Resume' : 'Pause';
  (e.currentTarget as HTMLElement).setAttribute('aria-pressed', String(paused));
});
one('[data-clear]').addEventListener('click', () => logBox.replaceChildren());

// ---- a line from either board ----
const sense = all<HTMLElement>('[data-sense]');
let level: number[] | null = null;      // which way was down when the hand was called level
let down: number[] = [0, 0, 1];         // which way is down now, smoothed a little
let settled = false;                    // false until the first reading from a sensor that has just taken over
let tilt: Turn = NO_TURN;
let tiltAngle = 0;
let tilted = false;
function heard(line: string, fromBoard: boolean) {
  const said = read(line);
  // "P" and "G" arrive twenty times a second. Unless asked for every line, the readout shows at
  // most two of each a second, and none while nothing in them is changing.
  const steady = said.type === 'places' || said.type === 'motion';
  const now = performance.now(), key = said.type + fromBoard;
  if (!steady || everyLine.checked || (now - (sampled[key] ?? 0) > 500 && printed[key] !== line)) {
    sampled[key] = now;
    printed[key] = line;
    print('in', line, fromBoard ? '' : 'pretend');
  }
  if (said.type === 'places') {
    for (const [motor, { guess: at, goal }] of said.at) {
      guess[motor] = at;
      // The board moved the goal itself (a button on the hand, or Stop): the slider follows it.
      if (Math.abs(goal - set[motor]) > 0.5 && now - touched[motor] > 400) showSet(motor, goal);
    }
  } else if (said.type === 'motion') {
    if (fromBoard !== boardSenses) return;
    said.g.concat(said.turn).forEach((value, i) => { sense[i].textContent = (value >= 0 ? '+' : '') + value.toFixed(i < 3 ? 2 : 0); });
    down = settled ? down.map((was, i) => was + (said.g[i] - was) * 0.3) : [...said.g];
    settled = true;
    level ??= [...down];
    tilt = turnBetween(down, level);
    const size = (v: number[]) => Math.hypot(v[0], v[1], v[2]) || 1;
    tiltAngle = (Math.acos(Math.min(1, Math.max(-1, (down[0] * level[0] + down[1] * level[1] + down[2] * level[2]) / (size(down) * size(level))))) * 180) / Math.PI;
    tiltNow.textContent = `tilt ${Math.round(tiltAngle)}°`;
    tiltRule();
  } else if (said.type === 'hello' && fromBoard) greeted(said.motors, said.imu, said.buttons);
  else if (said.type === 'trouble') say('trouble', said.words);
}

// ---- the sliders ----
const sliders = new Map(all<HTMLInputElement>('[data-motor]').map((el) => [Number(el.dataset.motor), el]));
const setText = new Map(all<HTMLElement>('[data-set]').map((el) => [Number(el.dataset.set), el]));
const guessText = new Map(all<HTMLElement>('[data-guess]').map((el) => [Number(el.dataset.guess), el]));
function showSet(motor: number, percent: number) {
  set[motor] = percent;
  sliders.get(motor)!.value = String(Math.round(percent));
  setText.get(motor)!.textContent = String(Math.round(percent));
}
// A dragged slider reports every pixel. The board is told at most 25 times a second, and always the last place.
const waiting = new Map<number, number>();
function sendSoon(motor: number) {
  if (waiting.has(motor)) return;
  send(target(motor, set[motor]), motor);
  waiting.set(motor, window.setTimeout(() => {
    waiting.delete(motor);
    if (Math.round(set[motor]) !== sentLast[motor]) sendSoon(motor);
  }, 40));
  sentLast[motor] = Math.round(set[motor]);
}
const sentLast = new Array<number>(MOTOR_COUNT).fill(0);
for (const [motor, slider] of sliders) {
  slider.addEventListener('input', () => {
    touched[motor] = performance.now();
    showSet(motor, Number(slider.value));
    sendSoon(motor);
  });
}
function sendAll(to: (motor: number) => number) {
  for (const motor of EVERY) {
    touched[motor] = performance.now();
    showSet(motor, to(motor));
    send(target(motor, set[motor]), motor);
    sentLast[motor] = Math.round(set[motor]);
  }
}
const openHand = () => sendAll(() => 0);
const closeHand = () => sendAll((motor) => grip[motor]);
function stopAll() {
  send(stop());
  touched.fill(-1e9);   // the sliders now follow where the boards say everything stopped
}
one('[data-open]').addEventListener('click', openHand);
one('[data-close]').addEventListener('click', closeHand);
one('[data-stop]').addEventListener('click', stopAll);
addEventListener('keydown', (e) => { if (e.key === 'Escape') stopAll(); });

// ---- Reset: the sliders go quiet, each finger is nudged open by hand, then every guess is set to 0 ----
const resetButton = one<HTMLButtonElement>('[data-reset]');
const resetPanel = one<HTMLElement>('[data-reset-panel]');
const jogButtons = all<HTMLButtonElement>('[data-jog]');
function showReset(on: boolean) {
  resetting = on;
  resetPanel.hidden = !on;
  resetButton.setAttribute('aria-expanded', String(on));
  for (const slider of sliders.values()) slider.disabled = on;
  for (const key of ['[data-open]', '[data-close]']) one<HTMLButtonElement>(key).disabled = on;
  tiltOn.disabled = on;
  if (on) { stopAll(); markJogs(); resetPanel.querySelector<HTMLElement>('h2')!.focus(); }
}
/** A nudge needs a real motor. The buttons for motors that only exist on screen are switched off. */
function markJogs() {
  for (const button of jogButtons) {
    const real = onBoard.has(Number(button.dataset.jog));
    button.disabled = !real;
    button.title = real ? 'Hold to run the motor' : 'No motor on the hand for this one';
  }
  one('[data-jog-note]').hidden = onBoard.size > 0;
}
resetButton.addEventListener('click', () => showReset(!resetting));
one('[data-reset-cancel]').addEventListener('click', () => { showReset(false); resetButton.focus(); });
one('[data-zero]').addEventListener('click', () => {
  send(zero());
  for (const motor of EVERY) showSet(motor, 0);
  showReset(false);
  print('note', 'reset done: every guess is 0, the hand is taken to be open');
  resetButton.focus();
});
for (const button of jogButtons) {
  const motor = Number(button.dataset.jog), dir = Number(button.dataset.dir) as -1 | 1;
  let holding = 0;
  const start = () => {
    if (holding || button.disabled) return;
    send(jog(motor, dir), motor);
    holding = window.setInterval(() => link?.write(jog(motor, dir)), 100);   // kept quiet in the readout
  };
  const end = () => {
    if (!holding) return;
    clearInterval(holding);
    holding = 0;
    send(jog(motor, 0), motor);
  };
  button.addEventListener('pointerdown', (e) => {
    try { button.setPointerCapture(e.pointerId); } catch { /* a pointer the browser no longer has */ }
    start();
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture', 'blur']) button.addEventListener(type, end);
  button.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) start(); });
  button.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') end(); });
}

// ---- the tilt rule ----
const tiltOn = one<HTMLInputElement>('[data-tilt-on]');
const tiltAt = one<HTMLInputElement>('[data-tilt-at]');
const tiltNow = one<HTMLElement>('[data-tilt-now]');
const pretendTilt = one<HTMLInputElement>('[data-pretend-tilt]');
const pretendRow = one<HTMLElement>('[data-pretend-row]');
/** Past the angle the hand closes. It opens again 10 degrees short of it, so it does not chatter at the edge. */
function tiltRule() {
  if (!tiltOn.checked || resetting) return;
  const at = Math.min(150, Math.max(20, Number(tiltAt.value) || 60));
  if (!tilted && tiltAngle > at) { tilted = true; print('note', `tilt ${Math.round(tiltAngle)}° is past ${at}°: closing`); closeHand(); }
  else if (tilted && tiltAngle < at - 10) { tilted = false; print('note', `tilt ${Math.round(tiltAngle)}° is back under ${at - 10}°: opening`); openHand(); }
}
tiltOn.addEventListener('change', () => { tilted = false; tiltRule(); });
one('[data-level]').addEventListener('click', () => { level = [...down]; tilted = false; print('note', 'level set: this is the hand held flat'); });
pretendTilt.addEventListener('input', () => {
  const angle = (Number(pretendTilt.value) * Math.PI) / 180;
  // Rolled about the hand's own length, the way a wrist turns a palm over.
  pretend.gravity = [0, Math.sin(angle), Math.cos(angle)];
  one('[data-pretend-tilt-text]').textContent = pretendTilt.value + '°';
});

// ---- connecting ----
const connectButton = one<HTMLButtonElement>('[data-connect]');
const statusText = one<HTMLElement>('[data-status-text]');
const lamp = one<HTMLElement>('[data-lamp]');
function say(state: 'off' | 'waiting' | 'on' | 'trouble', words: string) {
  lamp.className = 'dot ' + (state === 'on' ? 'dot-done' : state === 'waiting' ? 'dot-progress' : 'dot-none');
  statusText.textContent = words;
  root.dataset.link = state;
}
let asking = 0;
function hangUp(words: string, state: 'off' | 'trouble' = 'off') {
  clearInterval(asking);
  link = null;
  // The pretend board takes every motor back, each from where it was last believed to be.
  pretend.cover(EVERY, guess);
  pretend.sensing = true;
  onBoard = new Set();
  boardSenses = false;
  level = null;
  settled = false;
  pretendRow.hidden = false;
  connectButton.textContent = 'Connect the hand';
  connectButton.disabled = false;
  if (resetting) markJogs();
  say(state, words);
}
function greeted(motors: number[], imu: boolean, buttons: boolean) {
  clearInterval(asking);
  onBoard = new Set(motors);
  pretend.cover(EVERY.filter((m) => !onBoard.has(m)));
  pretend.sensing = !imu;
  boardSenses = imu;
  level = null;
  settled = false;
  pretendRow.hidden = imu;
  // Opening the port restarted the board, so it believes every finger is fully open.
  for (const motor of motors) { guess[motor] = 0; showSet(motor, 0); }
  if (resetting) markJogs();
  const parts = [`${motors.length} motor${motors.length === 1 ? '' : 's'}`, imu ? 'gyroscope' : 'no gyroscope', buttons ? 'buttons' : 'no buttons'];
  say('on', `Connected: ${parts.join(', ')}. The board has just restarted and takes the hand to be open. If it is not, press Reset.`);
}
connectButton.addEventListener('click', async () => {
  if (link) {
    const old = link;
    hangUp('Disconnected. The sliders move the hand on screen.');
    await old.close();
    return;
  }
  connectButton.disabled = true;
  try {
    link = await connect((line) => heard(line, true), (why) => hangUp(why, 'trouble'));
  } catch (error) {
    connectButton.disabled = false;
    // Closing the browser's list without choosing is not a fault.
    if ((error as Error).name !== 'NotFoundError') say('trouble', 'The port would not open. Close the Arduino Serial Monitor if it is open, then try again.');
    return;
  }
  connectButton.textContent = 'Disconnect';
  connectButton.disabled = false;
  say('waiting', 'Port open. Waiting for the board to start…');
  const began = performance.now();
  asking = window.setInterval(() => {
    if (!link) return clearInterval(asking);
    if (performance.now() - began > 7000) {
      const old = link;
      hangUp('The board did not answer. Upload helpinghand_bench.ino to it, then connect again.', 'trouble');
      old.close();
      return;
    }
    link.write(ask());
  }, 500);
});
if (!canConnect()) {
  connectButton.disabled = true;
  const note = one<HTMLElement>('[data-connect-note]');
  note.hidden = false;
  note.textContent = 'Connecting a hand needs Chrome or Edge on a computer. The hand on screen works in any browser.';
}

// ---- the hand on screen ----
const canvas = one<HTMLCanvasElement>('[data-hand]');
const stageNote = one<HTMLElement>('[data-stage-note]');
let yaw = -0.6, pitch = -0.28;
let draw: ((pose: Pose, yaw: number, pitch: number, tilt: Turn) => void) | null = null;
let last = '';
function frame(now: number) {
  pretend.tick(now);
  for (const motor of EVERY) {
    drawn[motor] += (guess[motor] - drawn[motor]) * 0.35;
    if (Math.abs(guess[motor] - drawn[motor]) < 0.02) drawn[motor] = guess[motor];
    const text = String(Math.round(guess[motor]));
    const cell = guessText.get(motor)!;
    if (cell.textContent !== text) cell.textContent = text;
    sliders.get(motor)!.style.setProperty('--guess', guess[motor].toFixed(1) + '%');
  }
  if (draw) {
    // Only draw when something moved: the pose, the view, or the size of the canvas.
    const key = [drawn.map((x) => x.toFixed(2)), yaw.toFixed(3), pitch.toFixed(3), tilt.map((x) => x.toFixed(3)), canvas.clientWidth, canvas.clientHeight].join();
    if (key !== last) {
      last = key;
      draw({ fingers: drawn.slice(0, 4).map((x) => x / 100), thumbCurl: drawn[4] / 100, thumbSwing: drawn[5] / 100 }, yaw, pitch, tilt);
    }
  }
  requestAnimationFrame(frame);
}
canvas.addEventListener('pointerdown', (e) => {
  canvas.setPointerCapture(e.pointerId);
  let x = e.clientX, y = e.clientY;
  const move = (m: PointerEvent) => {
    yaw += (m.clientX - x) * 0.008;
    pitch = Math.min(1.2, Math.max(-1.2, pitch + (m.clientY - y) * 0.008));
    x = m.clientX; y = m.clientY;
  };
  const up = () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); };
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
});
canvas.addEventListener('keydown', (e) => {
  const steps: Record<string, number[] | undefined> = { ArrowLeft: [-0.15, 0], ArrowRight: [0.15, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] };
  const step = steps[e.key];
  if (!step) return;
  e.preventDefault();
  yaw += step[0];
  pitch = Math.min(1.2, Math.max(-1.2, pitch + step[1]));
});

say('off', 'No hand connected. The sliders move the hand on screen.');
print('note', 'pretend board ready: six motors, on screen only');
requestAnimationFrame(frame);
loadHand(root.dataset.handData!).then(({ info, data }) => {
  const pose = gripPose(info);
  grip = [...pose.fingers, pose.thumbCurl, pose.thumbSwing].map((share) => Math.round(share * 100));
  const view = startHandView(canvas, info, data);
  if (!view) throw new Error('no WebGL');
  draw = view.draw;
  stageNote.hidden = true;
  root.dataset.hand = 'ready';
}).catch(() => {
  stageNote.textContent = 'This browser could not draw the 3D hand. The sliders and the readout still work.';
  root.dataset.hand = 'failed';
});

// For the page's own checks (scripts and review screenshots). Not used by the page.
(window as unknown as { helpingHandBench: unknown }).helpingHandBench = { set, guess, drawn, grip: () => grip, heard, tilt: () => tiltAngle, onBoard: () => [...onBoard] };
