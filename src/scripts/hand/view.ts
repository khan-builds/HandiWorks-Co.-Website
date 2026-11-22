/** The hand from the CAD, drawn in a canvas and posed by numbers.

    The data is the homepage's (see src/pages/hand-data.js.ts): the hand as rigid parts, and a
    table per finger link saying where it is at each share of its carriage's travel. Nothing
    here bends a joint directly. One number per finger says how far its carriage has run along
    the lead screw, and the linkage does the rest, the way the real finger works. The homepage
    (index.html) holds the same sums for its scroll story; a change to how the CAD's tables are
    read belongs in both. */

type Table = { curl: number[]; pivot: Record<string, [number, number]>; rows: Record<string, [number, number, number][]> };
export type HandInfo = {
  label: string;
  unitsPerMm: number;
  centre: [number, number, number];
  size: [number, number, number];
  vertices: number;
  indices: number;
  bodies: string[];
  /** One per rigid part: [part, first corner, first index, index count]. */
  chunks: [number, number, number, number][];
  fingers: Table & { names: string[]; x: number[]; y: number[]; maxCurl: number };
  thumb: Table & { maxSwing: number; maxCurl: number; axis: [number, number, number]; mount: number[] };
  pinch: { fingerCurl: number; thumbSwing: number; thumbCurl: number };
};

/** Where the hand is: each finger's carriage, the thumb's own carriage, and the thumb's swing
    across the palm, all 0 (open) to 1 (the end of the travel). Fingers are in the CAD's order. */
export type Pose = { fingers: number[]; thumbCurl: number; thumbSwing: number };
/** A turn, as nine numbers row by row. */
export type Turn = number[];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const FINGER_LINKS = ['carriage', 'link', 'P', 'S', 'T', 'Q', 'R'];
const THUMB_LINKS = ['carriage', 'link', 'prox', 'distal', 'bar'];
// The homepage's colours (index.html, SCHEME): every finger alike, a colour for each joint.
const SCHEME: Record<string, [number, number, number]> = {
  palm: [0.1, 0.17, 0.4], module: [0.12, 0.75, 0.65], carriage: [0.96, 0.5, 0.69], link: [0.075, 0.204, 0.463],
  P: [0.95, 0.42, 0.37], Q: [0.98, 0.75, 0.18], S: [0.56, 0.42, 0.91], R: [0.98, 0.55, 0.15], T: [0.25, 0.7, 0.92],
};
const AS_FINGER: Record<string, string> = { unit: 'module', prox: 'P', bar: 'Q', distal: 'T', mount: 'palm' };

/** Fetch the hand's data and unpack its triangles. */
export async function loadHand(url: string): Promise<{ info: HandInfo; data: ArrayBuffer }> {
  const { HAND_INFO, HAND_MESH } = (await import(/* @vite-ignore */ url)) as { HAND_INFO: HandInfo; HAND_MESH: string };
  const bytes = Uint8Array.from(atob(HAND_MESH), (c) => c.charCodeAt(0));
  const data = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  return { info: HAND_INFO, data };
}

/** The share of a carriage's travel that gives a knuckle angle (the tables are even in travel). */
function driveFor(table: Table, curl: number) {
  const c = table.curl;
  let j = 1;
  while (j < c.length - 1 && c[j] < curl) j++;
  return clamp((j - 1 + (curl - c[j - 1]) / (c[j] - c[j - 1])) / (c.length - 1));
}

/** The grip the CAD checks: the fingers and the thumb closed until they meet, and no further. */
export const gripPose = (info: HandInfo): Pose => ({
  fingers: info.fingers.x.map(() => driveFor(info.fingers, info.pinch.fingerCurl)),
  thumbCurl: driveFor(info.thumb, info.pinch.thumbCurl),
  thumbSwing: clamp(info.pinch.thumbSwing / info.thumb.maxSwing),
});

// ---- where every part is (4 x 4 matrices, column by column, in mm) ----
type Matrix = number[];
const IDENTITY: Matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const slide = (x: number, y: number, z: number): Matrix => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
function mul(a: Matrix, b: Matrix): Matrix {
  const m = new Array<number>(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) m[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
  return m;
}
/** The reverse of a placement (a turn and a shift, no scaling). */
function undo(m: Matrix): Matrix {
  const x = m[12], y = m[13], z = m[14];
  return [m[0], m[4], m[8], 0, m[1], m[5], m[9], 0, m[2], m[6], m[10], 0,
    -(m[0] * x + m[1] * y + m[2] * z), -(m[4] * x + m[5] * y + m[6] * z), -(m[8] * x + m[9] * y + m[10] * z), 1];
}
/** One link at a share u of the travel: it turns about the Y axis through its own pin, and the pin moves. */
function link(table: Table, body: string, u: number): Matrix {
  const rows = table.rows[body], x = clamp(u) * (rows.length - 1), j = Math.min(Math.floor(x), rows.length - 2), t = x - j;
  const a = rows[j], b = rows[j + 1], pin = table.pivot[body];
  const turn = ((a[0] + (b[0] - a[0]) * t) * Math.PI) / 180, c = Math.cos(turn), s = Math.sin(turn);
  const px = a[1] + (b[1] - a[1]) * t, pz = a[2] + (b[2] - a[2]) * t;
  return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, px - (c * pin[0] - s * pin[1]), 0, pz - (s * pin[0] + c * pin[1]), 1];
}

function placer(info: HandInfo) {
  const { fingers, thumb } = info;
  const mount = thumb.mount;
  const MOUNT: Matrix = [mount[0], mount[4], mount[8], 0, mount[1], mount[5], mount[9], 0, mount[2], mount[6], mount[10], 0, mount[3], mount[7], mount[11], 1];
  // The thumb unit's frame in the hand: on the swing shaft, turned by the swing, then out along its mount.
  const thumbFrame = (swing: number) => {
    const a = (swing * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return mul(mul(slide(...thumb.axis), [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]), MOUNT);
  };
  const THUMB_REST = undo(thumbFrame(0));
  return (pose: Pose): Matrix[] => {
    const at: Record<string, Matrix> = { 'palm:palm': IDENTITY, 'thumb:mount': IDENTITY };
    fingers.x.forEach((x, i) => {
      const seat = slide(x, 0, 0), home = slide(-x, 0, 0);
      at[`finger${i}:module`] = IDENTITY;
      for (const body of FINGER_LINKS) at[`finger${i}:${body}`] = mul(mul(seat, link(fingers, body, pose.fingers[i] ?? 0)), home);
    });
    const now = thumbFrame(clamp(pose.thumbSwing) * thumb.maxSwing);
    at['thumb:unit'] = mul(now, THUMB_REST);
    for (const body of THUMB_LINKS) at[`thumb:${body}`] = mul(mul(now, link(thumb, body, pose.thumbCurl)), THUMB_REST);
    return info.bodies.map((name) => at[name] ?? IDENTITY);
  };
}

// ---- turns (3 x 3, row by row) ----
export const NO_TURN: Turn = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const turnTimes = (a: Turn, b: Turn): Turn => {
  const m = new Array<number>(9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) m[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
  return m;
};
const aboutX = (a: number): Turn => [1, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a)];
const aboutY = (a: number): Turn => [Math.cos(a), 0, Math.sin(a), 0, 1, 0, -Math.sin(a), 0, Math.cos(a)];
/** The shortest turn that carries direction `from` onto direction `to`. */
export function turnBetween(from: number[], to: number[]): Turn {
  const size = (v: number[]) => Math.hypot(v[0], v[1], v[2]) || 1;
  const a = from.map((x) => x / size(from)), b = to.map((x) => x / size(to));
  const axis = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const cos = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  // Facing exactly opposite: any half turn about a line square to `from` will do.
  if (cos < -0.9999) {
    const side = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const k = [a[1] * side[2] - a[2] * side[1], a[2] * side[0] - a[0] * side[2], a[0] * side[1] - a[1] * side[0]];
    const n = size(k), [x, y, z] = k.map((v) => v / n);
    return [2 * x * x - 1, 2 * x * y, 2 * x * z, 2 * x * y, 2 * y * y - 1, 2 * y * z, 2 * x * z, 2 * y * z, 2 * z * z - 1];
  }
  const [x, y, z] = axis, f = 1 / (1 + cos);
  return [cos + f * x * x, f * x * y - z, f * x * z + y, f * x * y + z, cos + f * y * y, f * y * z - x, f * x * z - y, f * y * z + x, cos + f * z * z];
}

/** What a canvas shows, when it is not the whole hand upright: only some parts, about another
    point (in mm), fitted to another size, or faced another way. `reach` is the furthest any
    shown part is from that point, in mm: one number if the view may be turned any way, or
    [across, up] for a view that stays put. */
export type Scene = { only?: (part: string) => boolean; look?: [number, number, number]; reach?: number | [number, number]; face?: Turn };
/** A colour for one part in place of its own, or nothing to keep its own. */
export type Shade = (part: string) => [number, number, number] | undefined;
/** From the thumb's side: the fingertips to the right, the palm's face up. */
export const SIDE_ON: Turn = [1, 0, 0, 0, 0, 1, 0, -1, 0];

/** Where a part's corners reach with the hand at rest: lowest and highest x, y and z, in mm. */
export function extent(info: HandInfo, data: ArrayBuffer, part: string): [number[], number[]] {
  const body = info.bodies.indexOf(part), at = info.chunks.findIndex((chunk) => chunk[0] === body);
  const first = info.chunks[at][1], last = at + 1 < info.chunks.length ? info.chunks[at + 1][1] : info.vertices;
  const corners = new Int16Array(data, 0, info.vertices * 5), low = [Infinity, Infinity, Infinity], high = [-Infinity, -Infinity, -Infinity];
  for (let v = first; v < last; v++) for (let a = 0; a < 3; a++) {
    const here = corners[v * 5 + a] / info.unitsPerMm + info.centre[a];
    if (here < low[a]) low[a] = here;
    if (here > high[a]) high[a] = here;
  }
  return [low, high];
}

/** Start drawing in a canvas. Returns null if this browser cannot start WebGL. */
export function startHandView(canvas: HTMLCanvasElement, info: HandInfo, data: ArrayBuffer, scene: Scene = {}) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) return null;
  const program = gl.createProgram()!;
  const shader = (type: number, source: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    gl.attachShader(program, s);
  };
  // The hand's own axes, in mm: X toward the fingertips, Y toward the thumb, Z out of the palm.
  // `view` turns them to the screen's: x right, y up, z toward the viewer. `depth` draws near
  // things a little larger.
  shader(gl.VERTEX_SHADER, `attribute vec3 position,normal;
  uniform mat4 body; uniform mat3 view; uniform vec3 centre,look; uniform vec2 scale; uniform float depth;
  varying vec3 n;
  void main(){
   vec3 p=view*((body*vec4(position/${info.unitsPerMm}.+centre,1.)).xyz-look);
   n=view*(body*vec4(normal/127.,0.)).xyz;
   float w=1.-depth*p.z;
   gl_Position=vec4(p.xy*scale,-p.z*.002*w,w);}`);
  shader(gl.FRAGMENT_SHADER, `precision mediump float;varying vec3 n;uniform vec3 paint;
  void main(){vec3 N=normalize(n);float diffuse=max(dot(N,normalize(vec3(-.5,.75,.65))),0.);
  float spec=pow(max(dot(N,normalize(vec3(-.3,.35,.88))),0.),22.);
  gl_FragColor=vec4(paint*(.56+.56*diffuse)+spec*.16,1.);}`);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'program');
  gl.useProgram(program);
  // The data is every corner (10 bytes each: place, facing, colour), then the triangles as corner numbers.
  const corners = info.vertices * 10;
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(data, 0, corners), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data, corners, info.indices), gl.STATIC_DRAW);
  const attributes = ([['position', 3, gl.SHORT, 0], ['normal', 3, gl.BYTE, 6]] as const).map(([name, size, type, offset]) => {
    const at = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(at);
    return [at, size, type, offset] as const;
  });
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const u = { body: uniform('body'), view: uniform('view'), centre: uniform('centre'), look: uniform('look'), scale: uniform('scale'), depth: uniform('depth'), paint: uniform('paint') };
  gl.uniform3fv(u.centre, info.centre);
  gl.uniform3fv(u.look, scene.look ?? info.centre);
  gl.uniform1f(u.depth, 0.0011);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  const place = placer(info);
  const colours = info.bodies.map((name) => { const kind = name.split(':')[1]; return SCHEME[AS_FINGER[kind] ?? kind] ?? SCHEME.palm; });
  // Upright, palm toward the viewer: the fingertips up the screen, the thumb's side to the left.
  const face: Turn = scene.face ?? [0, -1, 0, 1, 0, 0, 0, 0, 1];
  const reach = scene.reach ?? Math.hypot(...info.size) / 2;   // nothing of the hand is further than this from its middle, in mm
  const chunks = info.chunks.filter(([body]) => !scene.only || scene.only(info.bodies[body]));

  return {
    /** Draw the hand in this pose. `yaw` and `pitch` are the viewer walking round it, in radians;
        `tilt` is the hand itself turned, in its own axes. `shade` recolours parts. */
    draw(pose: Pose, yaw: number, pitch: number, tilt: Turn = NO_TURN, shade?: Shade) {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * ratio)), h = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // Pixels per mm: so the hand fits however it is turned, or so a fixed view fills its canvas.
      const fit = typeof reach === 'number' ? (Math.min(w, h) * 0.56) / reach : Math.min(w / (2 * reach[0]), h / (2 * reach[1])) * 0.94;
      gl.uniform2f(u.scale, (2 * fit) / w, (2 * fit) / h);
      const view = turnTimes(turnTimes(aboutX(pitch), aboutY(yaw)), turnTimes(face, tilt));
      gl.uniformMatrix3fv(u.view, false, [view[0], view[3], view[6], view[1], view[4], view[7], view[2], view[5], view[8]]);
      const bodies = place(pose);
      for (const [body, first, start, count] of chunks) {
        gl.uniformMatrix4fv(u.body, false, bodies[body]);
        gl.uniform3fv(u.paint, shade?.(info.bodies[body]) ?? colours[body]);
        for (const [at, size, type, offset] of attributes) gl.vertexAttribPointer(at, size, type, false, 10, first * 10 + offset);
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, start * 2);
      }
    },
  };
}
