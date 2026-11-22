/** The USB cable to the hand's Arduino, through the browser's own serial-port access.

    Chrome and Edge on a computer have it; Safari and Firefox do not. The page must be served
    over https or from localhost, which the live site and the offline copy both are. Opening the
    port restarts an Arduino, so the first answer takes a second or two. */
import { BAUD } from './protocol';

export type Link = { write(line: string): void; close(): Promise<void> };

/** The part of the browser's SerialPort this file uses. A test can hand in anything shaped like it. */
type Port = {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
};
type Serial = { requestPort(): Promise<Port> };

const serial = (): Serial | undefined => (navigator as unknown as { serial?: Serial }).serial;
export const canConnect = () => !!serial();

/** Ask which port, open it, and pass every line it sends to `onLine`. `onLost` is called once if
    the cable is pulled or the port fails. Rejects with a NotFoundError if no port was chosen. */
export async function connect(onLine: (line: string) => void, onLost: (why: string) => void): Promise<Link> {
  const port = await serial()!.requestPort();
  await port.open({ baudRate: BAUD });
  const writer = port.writable!.getWriter();
  const reader = port.readable!.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let closing = false;

  (async () => {
    let rest = '';
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        rest += decoder.decode(value, { stream: true });
        const lines = rest.split('\n');
        rest = lines.pop()!;
        for (const line of lines) if (line.trim()) onLine(line.trim());
      }
    } catch {
      // The cable was pulled, or the port broke. Both end the same way below.
    }
    if (!closing) {
      closing = true;
      try { writer.releaseLock(); reader.releaseLock(); await port.close(); } catch { /* already gone */ }
      onLost('The cable was unplugged.');
    }
  })();

  return {
    write(line) {
      if (!closing) writer.write(encoder.encode(line + '\n')).catch(() => {});
    },
    async close() {
      if (closing) return;
      closing = true;
      try { await reader.cancel(); } catch { /* nothing to cancel */ }
      try { writer.releaseLock(); reader.releaseLock(); await port.close(); } catch { /* already gone */ }
    },
  };
}
