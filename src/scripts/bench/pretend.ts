/** A stand-in for the hand's Arduino that lives in the page.

    It keeps the same books as public/downloads/helpinghand_bench.ino and speaks the same lines
    (protocol.ts), so the page talks to it exactly as it talks to the real board. It is what
    moves the on-screen hand when no hand is plugged in, and it goes on covering any motor the
    plugged-in board does not have. Change it and the sketch together. */
import { JOG_HOLD_MS, MOTOR_COUNT } from './protocol';

/** Milliseconds from fully open to fully closed, per motor, at the sketch's capped speed. The
    sketch has the same table. These are first guesses: time each on the real hand. */
export const TRAVEL_MS = [3000, 3000, 3000, 3000, 2500, 1500];
/** The board says where things are this often. */
export const REPORT_MS = 50;

const clamp = (x: number, low: number, high: number) => Math.min(high, Math.max(low, x));

export class PretendBoard {
  private motors: number[];
  private guess = new Array<number>(MOTOR_COUNT).fill(0);
  private goal = new Array<number>(MOTOR_COUNT).fill(0);
  private jogUntil = new Array<number>(MOTOR_COUNT).fill(0);
  private last = 0;
  private reported = -Infinity;
  /** Which way is down, as the pretend sensor feels it, and how fast it is turning. */
  gravity: [number, number, number] = [0, 0, 1];
  turning: [number, number, number] = [0, 0, 0];
  /** False while a real board's own sensor is doing the talking. */
  sensing = true;

  constructor(motors: number[], private say: (line: string) => void) {
    this.motors = [...motors];
  }

  /** Cover these motors from now on. Each keeps the place it was last known to be in. */
  cover(motors: number[], places?: number[]) {
    this.motors = [...motors];
    if (places) for (const m of motors) this.guess[m] = this.goal[m] = clamp(places[m], 0, 100);
  }

  /** A line from the page. */
  hear(line: string, now: number) {
    const [word, a, b] = line.trim().split(/\s+/);
    const motor = Number(a);
    const mine = Number.isInteger(motor) && this.motors.includes(motor);
    if (word === '?') this.say(`HELLO pretend 1 motors=${this.motors.join(',')} imu=${this.sensing ? 1 : 0} buttons=0`);
    else if (word === 'T' && mine) {
      this.goal[motor] = clamp(Number(b), 0, 100);
      this.jogUntil[motor] = 0;
    } else if (word === 'J' && mine) {
      // A nudge turns a real motor and leaves the guess alone. Here there is no motor to turn.
      this.goal[motor] = this.guess[motor];
      this.jogUntil[motor] = Number(b) ? now + JOG_HOLD_MS : 0;
    } else if (word === 'Z') for (const m of this.motors) this.guess[m] = this.goal[m] = 0;
    else if (word === 'S') for (const m of this.motors) this.goal[m] = this.guess[m];
  }

  /** Let time pass: every motor on its way moves at its own steady speed, and stops on arrival. */
  tick(now: number) {
    const passed = this.last ? Math.min(now - this.last, 250) : 0;
    this.last = now;
    for (const m of this.motors) {
      const left = this.goal[m] - this.guess[m];
      if (!left || now < this.jogUntil[m]) continue;
      const step = (passed / TRAVEL_MS[m]) * 100;
      this.guess[m] += Math.sign(left) * Math.min(step, Math.abs(left));
    }
    if (now - this.reported < REPORT_MS) return;
    this.reported = now;
    if (this.motors.length) this.say('P ' + this.motors.map((m) => `${m}:${this.guess[m].toFixed(1)}/${Math.round(this.goal[m])}`).join(' '));
    if (this.sensing) this.say('G ' + [...this.gravity, ...this.turning].map((x) => x.toFixed(3)).join(' '));
  }
}
