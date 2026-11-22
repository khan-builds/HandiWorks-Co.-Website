"""Export the moving hand on the homepage from the CAD: its parts and how each one moves.

Run it with the CAD environment, from the repo root:

    ~/.venvs/sldp-cad/bin/python scripts/hand_motion.py --check         # rebuild, compare with the CAD, write into index.html (1 min)
    ~/.venvs/sldp-cad/bin/python scripts/hand_motion.py --check-path    # is the way into the pinch free of collisions? (10 min)
    ~/.venvs/sldp-cad/bin/python scripts/hand_motion.py --dry-run       # with either: write nothing

The CAD lives outside this repo, in ~/workspace/SLDP on the build machine (set SLDP_CAD to point
somewhere else). This reads hand v11 (11.17 Thumb Updates/hand/v11_modular/palm11.py) and takes
nothing from the page: every joint position, angle and limit below comes out of the CAD's own
functions, so the hand on the homepage can only move the way the CAD says it does.

What it writes, between the two HAND-DATA markers in index.html:

  HAND_INFO   the rigid bodies, where each one's triangles are, and the motion tables
  HAND_MESH   every triangle of the hand with fingers straight and thumb at rest (gzip, base64)

How the motion is stored. A finger is a linkage: one motor pushes a carriage along a lead screw,
and that one movement turns six links at once. So each finger has one number, how far its
carriage has travelled, and a table that gives every link's position for that travel. The page
looks the links up in the table; it never bends a finger by itself. The thumb has two numbers:
the swing of its whole unit on the VEX 393's shaft, and the travel of its own carriage.

The page draws two things from this one block: the whole hand at the top of the homepage, and
the middle finger's module on its own beside "The kit".

When the CAD changes: point HAND at the new hand's folder and change LABEL, check that the part
names in MATERIAL, FINGER_BODY_OF and THUMB_BODY_OF still match, run this with --check and then
with --check-path, run `npm run build`, and look at the homepage (`npm run shots -- hand /`).
docs/README.md, "The hand on the homepage", says what the page does with these numbers.
"""

from __future__ import annotations

import base64
import gzip
import json
import math
import os
import re
import sys
import time
from pathlib import Path

sys.dont_write_bytecode = True  # leave nothing behind in the CAD folders

import numpy as np

CAD = Path(os.environ.get("SLDP_CAD", "~/workspace/SLDP")).expanduser()
HAND = CAD / "11.17 Thumb Updates" / "hand" / "v11_modular"
LABEL = "Hand v11 · 2026-11-17"
REPO = Path(__file__).resolve().parent.parent
HTML = REPO / "index.html"

SAMPLES = 49  # rows in each motion table, evenly spaced along the carriage's travel
UNITS_PER_MM = 100  # positions are stored as whole numbers of 0.01 mm
LINEAR, ANGULAR = 0.12, 0.45  # how finely curved faces are cut into triangles (mm, radians)
MAX_BYTES = 1_900_000  # the data must not get heavier than the model it replaced (1.84 MB in the page)
CHECK_LIMIT = 0.2  # mm: how far a part may sit from the CAD in --check
NOT_RIGID = ("t_hw_H",)  # the screw and nut where the thumb's bar meets its tip: the CAD keeps the nut unturned

# Display colours, the same five the homepage has always used.
GOLD, STEEL, NAVY, GREY, ORANGE = 0, 1, 2, 3, 4

# Part name -> colour. First match wins. Parts not listed here are left out: they sit inside
# other parts (motors in their pockets, boards in the closed box) and are never seen.
MATERIAL = (
    ("palm", STEEL),
    ("plate", STEEL),
    ("tbase", STEEL),
    ("pod_lid", STEEL),
    ("box_", GOLD),
    ("shaft", GREY),
    ("dock_screws", GREY),
    ("motor_screws", GREY),
    ("act_housing", GOLD),
    ("act_carriage", GREY),
    ("base", GOLD),
    ("P_", NAVY),
    ("S_", NAVY),
    ("T_", ORANGE),
    ("Q_", STEEL),
    ("R_", STEEL),
    ("link", STEEL),
    ("tube_B", GREY),
    ("kpin_", GREY),
    ("hw_", GREY),
    ("t_housing_", GOLD),
    ("t_base", GOLD),
    ("t_prox_", NAVY),
    ("t_distal_", ORANGE),
    ("t_bar_", STEEL),
    ("t_link", STEEL),
    ("t_carriage", GREY),
    ("t_screw", GREY),
    ("t_tube_G", GREY),
    ("t_hw_", GREY),
)
HIDDEN = ("m393", "module_screws", "mega", "proto", "gyro", "jack", "driver_", "battery", "t_motor_ref")

# Which rigid body of a finger each of its parts belongs to. Anything else on a finger module
# (housing, base, pins, base screws) is bolted to the housing and only moves when the module does.
FINGER_BODIES = ("module", "carriage", "link", "P", "S", "T", "Q", "R")
FINGER_BODY_OF = {
    "act_carriage": "carriage",
    "link": "link",
    "P_p": "P", "P_n": "P", "hw_PIP_p": "P", "hw_PIP_n": "P", "hw_ARM": "P", "hw_E_p": "P", "hw_E_n": "P",
    "S_p": "S", "S_n": "S", "hw_DIP_p": "S", "hw_DIP_n": "S",
    "T_p": "T", "T_n": "T", "hw_F_p": "T", "hw_F_n": "T",
    "Q_p": "Q", "Q_n": "Q",
    "R_p": "R", "R_n": "R",
}
# The thumb: "mount" is the printed module on the palm's rails (it only moves when the module is
# lifted off), "unit" is everything that swings on the 393's shaft, the rest are the unit's links.
THUMB_BODIES = ("mount", "unit", "carriage", "link", "prox", "distal", "bar")
THUMB_BODY_OF = {
    "tbase": "mount", "pod_lid": "mount", "dock_screws": "mount", "motor_screws": "mount",
    "shaft": "unit",
    "t_carriage": "carriage", "t_hw_C": "carriage",
    "t_link": "link",
    "t_prox_p": "prox", "t_prox_n": "prox", "t_hw_IP": "prox", "t_hw_A": "prox",
    "t_distal_p": "distal", "t_distal_n": "distal", "t_hw_D": "distal", "t_hw_H": "distal",
    "t_bar_p": "bar", "t_bar_n": "bar",
}
FINGER_NAMES = ("little", "ring", "middle", "index")


def load_cad():
    sys.path.insert(0, str(HAND))
    import palm11  # noqa: PLC0415  (the import builds nothing, but it needs the CAD environment)

    return palm11


def material_of(name: str):
    if any(name.startswith(h) or name == h for h in HIDDEN):
        return None
    for prefix, colour in MATERIAL:
        if name.startswith(prefix):
            return colour
    raise SystemExit(f"hand_motion: part '{name}' is new. Give it a colour in MATERIAL or add it to HIDDEN.")


def body_of(key: str) -> tuple[str, str] | None:
    """Part key from palm11.build -> (group, body), or None for a part that is left out."""
    m = re.match(r"f(\d)_(.+)", key)
    if m:
        name = m.group(2)
        if material_of(name) is None:
            return None
        return f"finger{m.group(1)}", FINGER_BODY_OF.get(name, "module")
    if key.startswith("t_") or key in THUMB_BODY_OF:
        if material_of(key) is None:
            return None
        return "thumb", THUMB_BODY_OF.get(key, "unit")
    if material_of(key) is None:
        return None
    return "palm", "palm"


# ------------------------------------------------------------------------------------ triangles
def triangles(part):
    """Triangles of one CAD part: positions (n, 3), unit normals (n, 3), corner indices (m, 3).

    Each face is cut on its own, so an edge between two faces stays sharp, and inside a face the
    normals are blended, so a cylinder looks round.
    """
    pos, nrm, tri = [], [], []
    base = 0
    part.mesh(LINEAR, ANGULAR)  # the whole part at once, so two faces meet on the same points
    for face in part.faces():
        verts, faces = face.tessellate(LINEAR, ANGULAR)
        if not faces:
            continue
        v = np.array([(p.X, p.Y, p.Z) for p in verts], dtype=np.float64)
        f = np.array(faces, dtype=np.int64)
        a, b, c = v[f[:, 0]], v[f[:, 1]], v[f[:, 2]]
        cross = np.cross(b - a, c - a)  # length = twice the triangle's area, so big triangles count for more
        keep = np.linalg.norm(cross, axis=1) > 1e-9
        f, cross = f[keep], cross[keep]
        if not len(f):
            continue
        n = np.zeros_like(v)
        for k in range(3):
            np.add.at(n, f[:, k], cross)
        length = np.linalg.norm(n, axis=1)
        length[length == 0] = 1
        pos.append(v)
        nrm.append(n / length[:, None])
        tri.append(f + base)
        base += len(v)
    if not pos:
        return np.zeros((0, 3)), np.zeros((0, 3)), np.zeros((0, 3), dtype=np.int64)
    return np.vstack(pos), np.vstack(nrm), np.vstack(tri)


# ------------------------------------------------------------------------------------ motion
def mat4(loc) -> np.ndarray:
    """A CAD placement as a 4 x 4 matrix."""
    trsf = loc.wrapped.Transformation()
    m = np.eye(4)
    for r in range(3):
        for c in range(4):
            m[r, c] = trsf.Value(r + 1, c + 1)
    return m


def planar(loc):
    """A CAD placement that turns about Y -> (degrees, x, z) with  [x'; z'] = R(deg) [x; z] + (x, z).

    R turns +x toward +z for a positive angle.
    """
    m = mat4(loc)
    return math.degrees(math.atan2(m[2, 0], m[0, 0])), m[0, 3], m[2, 3]


def about(pivot, row):
    """Re-express (deg, x, z) as the angle and where `pivot` ends up: steadier to interpolate."""
    deg, tx, tz = row
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    return deg, c * pivot[0] - s * pivot[1] + tx, s * pivot[0] + c * pivot[1] + tz


def finger_tables(P):
    """One finger module: for evenly spaced carriage travel, where each link is.

    Frame: the module's own (X from the housing's rear face toward the fingertip, Z toward the
    palm face). Everything is taken from finger3.pose(), the function the CAD places its parts with.
    """
    from build123d import Location, Pos  # noqa: PLC0415

    M, F5 = P.M, P.M.F5
    F3 = F5.F3
    M.HOST.set()  # knuckle position of finger v5 on this housing
    travel = M.TRAVEL

    grid = np.linspace(0.0, M.FINGER_MAX, 215)
    used = np.array([F5.travel_used(c) for c in grid])

    def curl_at(s):
        return float(np.interp(s, used, grid))

    pivots = {}
    rows = {b: [] for b in FINGER_BODIES[1:]}
    curls = []
    for j in range(SAMPLES):
        s = travel * j / (SAMPLES - 1)
        curl = min(curl_at(s), M.FINGER_MAX) if j else 0.0
        p = F5.pose(curl)
        curls.append(curl)
        for body in ("P", "S", "T", "Q", "R", "link"):
            pivot, deg, tr = p["xf"][body]
            loc = F3.to_act(Pos(tr[0], 0, tr[1]) * F3.rot_about(Location(), pivot, deg))
            # to_act(x) = A * x; the placement of a part already in the module frame is A x A^-1
            loc = loc * F3.to_act(Location()).inverse()
            home = mat4(F3.to_act(Pos(pivot[0], 0, pivot[1])))
            pivots[body] = (home[0, 3], home[2, 3])
            rows[body].append(about(pivots[body], planar(loc)))
        pivots["carriage"] = (M.X_PIN_MAX, M.Z_PIN)
        rows["carriage"].append((0.0, M.X_PIN_MAX + p["carriage_dx"], M.Z_PIN))
    return {
        "travel": travel,
        "curl": [round(c, 3) for c in curls],
        "pivot": {b: [round(v, 4) for v in pivots[b]] for b in rows},
        "rows": {b: [[round(v, 4) for v in r] for r in rows[b]] for b in rows},
    }


def thumb_tables(P):
    """The thumb unit's own linkage, in the unit's frame, from thumb4.kin() as thumb6.build() uses it."""
    from build123d import Location, Pos  # noqa: PLC0415

    T = P.T
    x0, x1 = T.kin(0.0)["xpin"], T.kin(T.CURL_MAX)["xpin"]
    travel = x0 - x1

    grid = np.linspace(0.0, T.CURL_MAX, 161)
    used = np.array([x0 - T.kin(c)["xpin"] for c in grid])

    def curl_at(s):
        return float(np.interp(s, used, grid))

    K, Gp = T.K, T.Gp
    IP0 = K + np.array([T.L1, 0.0])
    H0 = IP0 + T.H_REL
    pin0 = np.array([T.X_PIN_MAX, T.Z_PIN])
    pitch0 = math.degrees(math.asin((T.Z_K + T.A0[1] - T.Z_PIN) / T.LINK_L))
    bar0 = math.degrees(math.atan2(H0[1] - Gp[1], H0[0] - Gp[0]))
    pivots = {"prox": K, "distal": IP0, "bar": Gp, "link": pin0, "carriage": pin0}
    rows = {b: [] for b in THUMB_BODIES[2:]}
    curls = []
    for j in range(SAMPLES):
        s = travel * j / (SAMPLES - 1)
        curl = 0.0 if j == 0 else T.CURL_MAX if j == SAMPLES - 1 else curl_at(s)
        k = T.kin(curl)
        curls.append(curl)
        place = {
            "prox": T.rot_about(Location(), K, curl),
            "distal": Pos(k["IP"][0] - T.L1, 0, k["IP"][1]) * T.rot_about(Location(), IP0, k["phi"]),
            "bar": T.rot_about(Location(), Gp, k["bar"] - bar0),
            "link": Pos(k["xpin"] - T.X_PIN_MAX, 0, 0) * T.rot_about(Location(), pin0, k["pitch"] - pitch0),
            "carriage": Pos(k["xpin"] - T.X_PIN_MAX, 0, 0),
        }
        for body, loc in place.items():
            rows[body].append(about(pivots[body], planar(loc)))
    return {
        "travel": travel,
        "curl": [round(c, 3) for c in curls],
        "pivot": {b: [round(float(v), 4) for v in pivots[b]] for b in rows},
        "rows": {b: [[round(v, 4) for v in r] for r in rows[b]] for b in rows},
    }


def matrix(loc) -> list[float]:
    """A CAD placement as 12 numbers: the three rows of [R | t]."""
    return [round(float(v), 6) for v in mat4(loc)[:3, :].ravel()]


# ------------------------------------------------------------------------------------ export
def export(check: bool, check_path: bool = False):
    t0 = time.time()
    P = load_cad()
    from build123d import Pos, Rot  # noqa: PLC0415

    parts = P.build(0.0, 0.0, 0.0, quiet=True)
    print(f"hand built from {HAND.relative_to(CAD)} in {time.time() - t0:.0f}s: {len(parts)} parts")

    order = ["palm:palm"] + [f"finger{i}:{b}" for i in range(P.N_FINGERS) for b in FINGER_BODIES] + [f"thumb:{b}" for b in THUMB_BODIES]
    by_body: dict[str, list] = {name: [] for name in order}
    left_out = []
    for key, part in parts.items():
        where = body_of(key)
        if where is None:
            left_out.append(key)
            continue
        name = re.sub(r"^f\d_", "", key)
        by_body[":".join(where)].append((key, material_of(name), part))
    print(f"left out, never seen: {', '.join(sorted(set(re.sub(r'^f\d_', '', k) for k in left_out)))}")

    # one mesh per part, cached across the four identical fingers
    cache = {}
    meshes = {}
    for body in order:
        for key, colour, part in by_body[body]:
            m = re.match(r"f(\d)_(.+)", key)
            if m:
                i, name = int(m.group(1)), m.group(2)
                if name not in cache:
                    first = parts[f"f0_{name}"]
                    cache[name] = triangles(Pos(-P.DX[0], -P.FINGER_Y[0], 0) * first)
                v, n, f = cache[name]
                meshes[key] = (v + np.array([P.DX[i], P.FINGER_Y[i], 0.0]), n, f)
            else:
                meshes[key] = triangles(part)

    everything = np.vstack([meshes[k][0] for b in order for k, _, _ in by_body[b]])
    lo, hi = everything.min(0), everything.max(0)
    centre = np.round((lo + hi) / 2, 2)
    reach = np.abs(everything - centre).max() * UNITS_PER_MM
    if reach > 32767:
        raise SystemExit("hand_motion: the hand no longer fits 16-bit positions. Lower UNITS_PER_MM.")

    # pack: 10 bytes a corner (x, y, z as int16; normal as 3 int8; colour as uint8), then uint16 indices
    vertex_dtype = np.dtype([("p", "<i2", 3), ("n", "i1", 3), ("c", "u1")])
    vertex_blocks, index_blocks, chunks = [], [], []
    v_total = i_total = 0
    for b, body in enumerate(order):
        cur_v, cur_i, count = [], [], 0

        def flush():
            nonlocal cur_v, cur_i, count, v_total, i_total
            if not cur_v:
                return
            vb, ib = np.concatenate(cur_v), np.concatenate(cur_i).astype("<u2")
            chunks.append([b, v_total, i_total, len(ib)])
            vertex_blocks.append(vb)
            index_blocks.append(ib)
            v_total += len(vb)
            i_total += len(ib)
            cur_v, cur_i, count = [], [], 0

        for key, colour, _ in by_body[body]:
            v, n, f = meshes[key]
            if len(v) > 65535:
                raise SystemExit(f"hand_motion: part '{key}' has {len(v)} corners, over 65,535. Make LINEAR or ANGULAR coarser.")
            if count + len(v) > 65535:
                flush()
            block = np.zeros(len(v), dtype=vertex_dtype)
            block["p"] = np.round((v - centre) * UNITS_PER_MM)
            block["n"] = np.round(n * 127)
            block["c"] = colour
            cur_v.append(block)
            cur_i.append((f + count).ravel())
            count += len(v)
        flush()
    vertices = np.concatenate(vertex_blocks)
    indices = np.concatenate(index_blocks)
    blob = vertices.tobytes() + indices.tobytes()
    packed = base64.b64encode(gzip.compress(blob, 9, mtime=0)).decode()

    T = P.T
    info = {
        "label": LABEL,
        "source": str(HAND.relative_to(CAD)),
        "unitsPerMm": UNITS_PER_MM,
        "centre": [float(c) for c in centre],
        "size": [round(float(s), 1) for s in hi - lo],
        "vertices": int(len(vertices)),
        "indices": int(len(indices)),
        "bodies": order,
        "chunks": chunks,
        "fingers": {
            "names": list(FINGER_NAMES),
            "x": [float(x) for x in P.DX],
            "y": [round(float(y), 4) for y in P.FINGER_Y],
            "maxCurl": round(float(P.M.FINGER_MAX), 2),
            **finger_tables(P),
        },
        "thumb": {
            "maxSwing": float(T.SWING_MAX),
            "maxCurl": float(T.CURL_MAX),
            # unit frame -> hand frame is  Pos(axis) * Rot(swing about X) * mount
            "axis": [round(float(v), 4) for v in (P.X_HC, P.Y_A, P.Z_A)],
            "mount": matrix(Pos(T.X_OFF, T.RHO0, 0) * Rot(0, 0, T.BETA)),
            **thumb_tables(P),
        },
        # poses the CAD has checked: only the two fingertips touch
        "pinch": {"fingerCurl": P.PINCH[0], "thumbSwing": P.PINCH[1], "thumbCurl": P.PINCH[2]},
        "pinchMiddle": {"fingerCurl": P.PINCH_MIDDLE[0], "thumbSwing": P.PINCH_MIDDLE[1], "thumbCurl": P.PINCH_MIDDLE[2]},
    }
    tris = len(indices) // 3
    print(f"{len(order)} bodies, {len(chunks)} chunks, {len(vertices):,} corners, {tris:,} triangles; "
          f"{len(blob) / 1e6:.2f} MB raw, {len(packed) / 1e6:.2f} MB in the page")
    print(f"hand {info['size'][0]} x {info['size'][1]} x {info['size'][2]} mm; fingers curl to {info['fingers']['maxCurl']} deg "
          f"on {info['fingers']['travel']} mm of travel; thumb swings {T.SWING_MAX:.0f}, curls {T.CURL_MAX:.0f} deg on {info['thumb']['travel']:.2f} mm")
    if len(packed) > MAX_BYTES:
        raise SystemExit(f"hand_motion: {len(packed) / 1e6:.2f} MB is over the {MAX_BYTES / 1e6:.1f} MB limit. Make LINEAR or ANGULAR coarser.")
    if check:
        verify(P, info, order, by_body, meshes)
    if check_path:
        verify_path(P, info)
    return info, packed


# ------------------------------------------------------------------------------------ the same maths the page does
def lookup(table, body, u):
    rows = table["rows"][body]
    x = min(max(u, 0.0), 1.0) * (len(rows) - 1)
    j = min(int(x), len(rows) - 2)
    t = x - j
    deg, px, pz = (rows[j][k] + (rows[j + 1][k] - rows[j][k]) * t for k in range(3))
    return deg, px, pz


def planar_matrix(pivot, deg, px, pz):
    """4x4 that turns about Y through `pivot` (x, z) and carries the pivot to (px, pz)."""
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    m = np.eye(4)
    m[0, 0], m[0, 2], m[2, 0], m[2, 2] = c, -s, s, c
    m[0, 3] = px - (c * pivot[0] - s * pivot[1])
    m[2, 3] = pz - (s * pivot[0] + c * pivot[1])
    return m


def shift(x, y, z):
    m = np.eye(4)
    m[:3, 3] = (x, y, z)
    return m


def thumb_frame(info, swing):
    t = info["thumb"]
    a = math.radians(swing)
    c, s = math.cos(a), math.sin(a)
    rx = np.eye(4)
    rx[1, 1], rx[1, 2], rx[2, 1], rx[2, 2] = c, -s, s, c
    mount = np.eye(4)
    mount[:3, :] = np.array(t["mount"]).reshape(3, 4)
    return shift(*t["axis"]) @ rx @ mount


def body_matrices(info, drive, pull, thumb_swing, thumb_drive, thumb_lift):
    """Every body's placement in the hand frame, from the numbers the page animates.

    drive[i]     0..1  finger i's carriage travel, as a share of the whole
    pull[i]      mm    finger module i slid forward out of its socket
    thumb_swing  deg   the thumb unit on the 393's shaft
    thumb_drive  0..1  the thumb's own carriage travel
    thumb_lift   mm    the thumb module raised off its two rails (the page no longer plays this;
                       --check still builds it, so the tables are tested with the module off)
    """
    out = {"palm:palm": np.eye(4)}
    f = info["fingers"]
    for i in range(len(f["x"])):
        seat = shift(f["x"][i] + pull[i], 0, 0)
        home = shift(-f["x"][i], 0, 0)
        out[f"finger{i}:module"] = shift(pull[i], 0, 0)
        for body in FINGER_BODIES[1:]:
            out[f"finger{i}:{body}"] = seat @ planar_matrix(f["pivot"][body], *lookup(f, body, drive[i])) @ home
    t = info["thumb"]
    lift = shift(0, 0, thumb_lift)
    now, rest = thumb_frame(info, thumb_swing), np.linalg.inv(thumb_frame(info, 0.0))
    out["thumb:mount"] = lift
    out["thumb:unit"] = lift @ now @ rest
    for body in THUMB_BODIES[2:]:
        out[f"thumb:{body}"] = lift @ now @ planar_matrix(t["pivot"][body], *lookup(t, body, thumb_drive)) @ rest
    return out


def drive_for(table, curl):
    """Share of the carriage travel that gives this knuckle curl."""
    return float(np.interp(curl, table["curl"], np.linspace(0, 1, len(table["curl"]))))


def verify(P, info, order, by_body, meshes):
    """Move the exported straight-hand triangles with the tables and compare with the CAD built at that pose."""
    poses = [
        ("fingers at their limit", [P.M.FINGER_MAX] * 4, 0.0, 0.0, None, 0.0),
        ("pinch on the index", [P.PINCH[0]] * 4, P.PINCH[1], P.PINCH[2], None, 0.0),
        ("pinch on the middle", list(P.PINCH_MIDDLE[0]), P.PINCH_MIDDLE[1], P.PINCH_MIDDLE[2], None, 0.0),
        ("uneven curls, thumb across and curled", [7.0, 21.5, 33.3, 48.9], 95.0, 80.0, None, 0.0),
        ("modules out, thumb module lifted", [0.0] * 4, 0.0, 0.0, {0: 30.0, 1: 45.0, 2: 60.0, 3: 20.0}, 40.0),
    ]
    worst = loose = 0.0
    for name, curls, swing, tcurl, pull, lift in poses:
        cad = P.build(curls, swing, tcurl, pull=pull, thumb_lift=lift, quiet=True)
        mats = body_matrices(
            info,
            [drive_for(info["fingers"], c) for c in curls],
            [(pull or {}).get(i, 0.0) for i in range(4)],
            swing,
            drive_for(info["thumb"], tcurl),
            lift,
        )
        pose_worst, where = 0.0, ""
        for body in order:
            m = mats[body]
            for key, _, _ in by_body[body]:
                v = meshes[key][0]
                if not len(v):
                    continue
                moved = v @ m[:3, :3].T + m[:3, 3]
                bb = cad[key].bounding_box()
                want = np.array([[bb.min.X, bb.min.Y, bb.min.Z], [bb.max.X, bb.max.Y, bb.max.Z]])
                got = np.array([moved.min(0), moved.max(0)])
                err = float(np.abs(want - got).max())
                if key in NOT_RIGID:
                    loose = max(loose, err)
                elif err > pose_worst:
                    pose_worst, where = err, key
        print(f"  check, {name}: worst difference {pose_worst:.3f} mm ({where})")
        worst = max(worst, pose_worst)
    # A curved part's box moves a little with where its triangles fall: LINEAR is the size of that.
    if worst > CHECK_LIMIT or loose > 1.0:
        raise SystemExit(f"hand_motion: the tables disagree with the CAD by {max(worst, loose):.2f} mm (limit {CHECK_LIMIT}). Nothing written.")
    print(f"check passed: every part within {worst:.2f} mm of the CAD in {len(poses)} poses "
          f"({', '.join(NOT_RIGID)}: {loose:.2f} mm, a hex nut the CAD turns with neither of its two links)")


def verify_path(P, info):
    """The way between the open hand and the pinch, with the fingers always at least as far closed
    as the thumb. Since 2026-11-19 the page plays it outward only: it starts in the pinch and the
    thumb leaves first.

    Builds the CAD at a grid of poses on that way and intersects every outer part of the thumb with
    the index and middle fingers, the palm, the plate and the thumb module. Shares are of the pinch:
    f for the fingers' carriage travel, g for the thumb's swing and its carriage travel together.
    The page keeps f >= g all the way, so only that half is tested.
    """
    fingers, thumb = info["fingers"], info["thumb"]
    pinch = info["pinch"]
    uf, ut = drive_for(fingers, pinch["fingerCurl"]), drive_for(thumb, pinch["thumbCurl"])

    def curl_of(table, u):
        return float(np.interp(u, np.linspace(0, 1, len(table["curl"])), table["curl"]))

    def overlap(a, b):
        A, B = a.bounding_box(), b.bounding_box()
        if (A.max.X < B.min.X or B.max.X < A.min.X or A.max.Y < B.min.Y or B.max.Y < A.min.Y
                or A.max.Z < B.min.Z or B.max.Z < A.min.Z):
            return 0.0
        common = a & b
        return 0.0 if common is None else common.volume

    shares = (0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 0.95, 1.0)
    pairs = [(f, g) for g in shares for f in shares if f >= g and f > 0]
    worst, contact = 0.0, 0.0
    t0 = time.time()
    for f, g in pairs:
        parts = P.build(curl_of(fingers, f * uf), g * pinch["thumbSwing"], curl_of(thumb, g * ut), with_refs=False, quiet=True)
        moving = {k: v for k, v in parts.items() if k.startswith("t_") and k not in ("t_motor_ref", "t_screw", "t_carriage")}
        others = {k: v for k, v in parts.items() if k.startswith(("f2_", "f3_")) or k in ("palm", "plate", "tbase", "pod_lid")}
        here, where = 0.0, ""
        for tk, tv in moving.items():
            for ok, ov in others.items():
                v = overlap(tv, ov)
                if v > here:
                    here, where = v, f"{tk} x {ok}"
        at_pinch = f == 1.0 and g == 1.0
        print(f"  path, fingers {f:.2f} thumb {g:.2f}: {here:.3f} mm3 {where}{'  (the pinch: the two tips touching)' if at_pinch else ''}  [{time.time() - t0:.0f}s]", flush=True)
        if at_pinch:
            contact = here
        else:
            worst = max(worst, here)
    if worst > 0.001:
        raise SystemExit(f"hand_motion: parts pass through each other on the way into the pinch ({worst:.2f} mm3). "
                         "Change the order in index.html's prepareStory(), or the pinch pose.")
    print(f"path clear: {len(pairs) - 1} poses on the way with nothing touching; at the pinch the tips meet by {contact:.2f} mm3")


# ------------------------------------------------------------------------------------ write
START, END = "/* HAND-DATA: written by scripts/hand_motion.py, do not edit by hand */", "/* END HAND-DATA */"


def write(info, packed, html: Path):
    text = html.read_text()
    if START not in text or END not in text:
        raise SystemExit(f"hand_motion: the two HAND-DATA markers are not in {html.name}. Nothing written.")
    head, rest = text.split(START, 1)
    _, tail = rest.split(END, 1)
    data = (
        f"{START}\nconst HAND_INFO={json.dumps(info, separators=(',', ':'), ensure_ascii=False)};\n"
        f"const HAND_MESH='{packed}';\n{END}"
    )
    html.write_text(head + data + tail)
    print(f"written into {html.name}: {info['label']}")


if __name__ == "__main__":
    args = sys.argv[1:]
    target = HTML
    if "--html" in args:
        target = Path(args[args.index("--html") + 1])
    info, packed = export(check="--check" in args, check_path="--check-path" in args)
    if "--dry-run" in args:
        print("dry run: nothing written")
    else:
        write(info, packed, target)
