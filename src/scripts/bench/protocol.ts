/** The lines the "Test your code" page and the hand's Arduino pass over the USB cable.

    One line each way, plain text, ended by a newline, at 115200 baud. The sketch that speaks
    the other end is public/downloads/helpinghand_bench.ino. Change the two together.

    Page to board
      ?          who are you                                   answered by HELLO
      T m pct    motor m to pct (0 to 100) of its travel
      J m dir    nudge motor m: dir -1 toward open, 1 toward closed, 0 stop. The board's guess
                 of where the finger is does not change. Send it again within JOG_HOLD_MS to
                 keep the motor running: a held button, not a switch.
      Z          the hand is open now: every guess becomes 0
      S          stop every motor where it is

    Board to page
      HELLO helpinghand-bench 1 motors=2,3,4,5 imu=1 buttons=1
      P 2:45.0/60 3:60.0/60 ...   per fitted motor: where the board guesses it is / where it is going, in percent
      G ax ay az gx gy gz         accelerometer in g, gyroscope in degrees per second
      B close open                the two buttons on the hand, 1 while held down
      E words                     something is wrong, said plainly

    The hand has nothing that senses where a finger is. The board only knows how long it has
    run each motor, and "P" is that guess. */

/** Motor numbers on the wire. The first four are in the CAD's finger order. */
export const MOTORS = ['little', 'ring', 'middle', 'index', 'thumbCurl', 'thumbSwing'] as const;
export const MOTOR_COUNT = MOTORS.length;
export const BAUD = 115200;
/** A nudge stops by itself this long after the last "J" line for it. */
export const JOG_HOLD_MS = 300;

export const ask = () => '?';
export const target = (motor: number, percent: number) => `T ${motor} ${Math.round(Math.min(100, Math.max(0, percent)))}`;
export const jog = (motor: number, dir: -1 | 0 | 1) => `J ${motor} ${dir}`;
export const zero = () => 'Z';
export const stop = () => 'S';

export type Hello = { type: 'hello'; name: string; version: number; motors: number[]; imu: boolean; buttons: boolean };
export type Places = { type: 'places'; at: Map<number, { guess: number; goal: number }> };
export type Motion = { type: 'motion'; g: [number, number, number]; turn: [number, number, number] };
export type Buttons = { type: 'buttons'; close: boolean; open: boolean };
export type Trouble = { type: 'trouble'; words: string };
export type Unknown = { type: 'unknown'; line: string };
export type FromBoard = Hello | Places | Motion | Buttons | Trouble | Unknown;

/** Read one line from the board. A line that is not understood comes back as 'unknown', never as an error. */
export function read(line: string): FromBoard {
  const words = line.trim().split(/\s+/);
  const numbers = words.slice(1).map(Number);
  switch (words[0]) {
    case 'HELLO': {
      const field = (key: string) => words.find((w) => w.startsWith(key + '='))?.slice(key.length + 1);
      const motors = (field('motors') ?? '').split(',').filter(Boolean).map(Number);
      if (words.length < 3 || motors.some((m) => !Number.isInteger(m) || m < 0 || m >= MOTOR_COUNT)) break;
      return { type: 'hello', name: words[1], version: Number(words[2]), motors, imu: field('imu') === '1', buttons: field('buttons') === '1' };
    }
    case 'P': {
      const at = new Map<number, { guess: number; goal: number }>();
      for (const word of words.slice(1)) {
        const found = /^(\d+):(-?[\d.]+)\/(-?[\d.]+)$/.exec(word);
        if (!found || Number(found[1]) >= MOTOR_COUNT) return { type: 'unknown', line };
        at.set(Number(found[1]), { guess: Number(found[2]), goal: Number(found[3]) });
      }
      return { type: 'places', at };
    }
    case 'G':
      if (numbers.length !== 6 || numbers.some(Number.isNaN)) break;
      return { type: 'motion', g: [numbers[0], numbers[1], numbers[2]], turn: [numbers[3], numbers[4], numbers[5]] };
    case 'B':
      if (numbers.length !== 2) break;
      return { type: 'buttons', close: numbers[0] === 1, open: numbers[1] === 1 };
    case 'E':
      return { type: 'trouble', words: words.slice(1).join(' ') };
  }
  return { type: 'unknown', line };
}
