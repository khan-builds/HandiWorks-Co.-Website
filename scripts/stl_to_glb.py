"""Convert the five Lesson 1 step models from STL to GLB for the site.

NOT WHAT THE SITE SHOWS NOW. Since 2026-11-23 the five step models are cut from the finger of
the current CAD by scripts/finger_steps.py. This script is kept as the way back: running it
writes Billy's original slices over those five files again.

Billy's step models live on the `version-1` branch as STL files. This reads them straight from
that branch, so nothing has to be checked out, and writes small GLB files to
public/models/lesson-1/. Run it from the repo root with the CAD environment:

    git fetch origin
    ~/.venvs/sldp-cad/bin/python scripts/stl_to_glb.py

Only numpy is needed. If the steps change on the branch, run it again. To convert files from
somewhere else, pass a folder:  ... scripts/stl_to_glb.py path/to/folder/with/stl/files

What it does to each file:
- Trims the cut. Each step is a slice of the whole finger, cut across its length, but the STL
  keeps every triangle that touches the slice whole, so long triangles stick out past the cut
  like shards. This finds the cut (the furthest "nearest corner" of any triangle) and clips
  the triangles there.
- Joins the corners that triangles share (an STL repeats every corner three or more times).
- Drops the stored normals, so the viewer shades each face flat, as CAD does.
- Converts inches to metres and turns the finger so it lies along the screen.
"""

from __future__ import annotations

import json
import struct
import subprocess
import sys
from pathlib import Path

import numpy as np

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "models" / "lesson-1"
BRANCH = "origin/version-1"
BRANCH_DIR = "public/models/lesson-1"
STEPS = ("01-base", "02-drive", "03-first-joints", "04-links", "05-finished-finger")
MAX_BYTES = 2_000_000
INCH = 0.0254  # the STL files are in inches; glTF is in metres
SRGB = (0.52, 0.70, 0.78)  # the light blue of the palm on the homepage hand, as seen on screen
# glTF stores colour as linear light, not as screen values: convert, or it renders washed out.
COLOUR = tuple(round(((c + 0.055) / 1.055) ** 2.4, 4) for c in SRGB) + (1.0,)


def read_stl(data: bytes) -> np.ndarray:
    """Triangles of a binary STL as an array of shape (n, 3, 3)."""
    (count,) = struct.unpack_from("<I", data, 80)
    if len(data) != 84 + count * 50:
        raise ValueError("not a binary STL")
    record = np.dtype([("normal", "<f4", 3), ("corners", "<f4", (3, 3)), ("attr", "<u2")])
    return np.frombuffer(data, dtype=record, count=count, offset=84)["corners"].copy()


def trim_at_cut(triangles: np.ndarray) -> tuple[np.ndarray, float]:
    """Clip the triangles at the plane where this step was sliced. Returns them and the cut (x)."""
    x = triangles[:, :, 0]
    cut = float(x.min(axis=1).max())  # every kept triangle has a corner on or before the cut
    crossing = x.max(axis=1) > cut + 1e-6
    kept = [triangles[~crossing]]
    for corners in triangles[crossing]:
        polygon = []
        for i in range(3):
            here, there = corners[i], corners[(i + 1) % 3]
            if here[0] <= cut:
                polygon.append(here)
            if (here[0] <= cut) != (there[0] <= cut):
                polygon.append(here + (there - here) * ((cut - here[0]) / (there[0] - here[0])))
        for i in range(1, len(polygon) - 1):
            kept.append(np.array([[polygon[0], polygon[i], polygon[i + 1]]], dtype=triangles.dtype))
    return np.concatenate(kept), cut


def to_glb(triangles: np.ndarray, name: str) -> bytes:
    corners = triangles.reshape(-1, 3).astype(np.float64)
    # STL axes: the finger runs along X and stands up in Z. glTF is Y up, so Z becomes Y.
    corners = np.stack([corners[:, 0], corners[:, 2], -corners[:, 1]], axis=1) * INCH
    corners -= (corners.min(axis=0) + corners.max(axis=0)) / 2
    # Join corners that sit in the same place (to a thousandth of a millimetre).
    keys = np.round(corners / 1e-6).astype(np.int64)
    _, first, inverse = np.unique(keys, axis=0, return_index=True, return_inverse=True)
    positions = corners[first].astype("<f4")
    index_type, component = ("<u2", 5123) if len(positions) < 65536 else ("<u4", 5125)
    indices = inverse.reshape(-1).astype(index_type)

    index_bytes = indices.tobytes()
    index_bytes += b"\0" * (-len(index_bytes) % 4)
    position_bytes = positions.tobytes()
    document = {
        "asset": {"version": "2.0", "generator": "HelpingHand scripts/stl_to_glb.py"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0, "name": name}],
        "meshes": [{"name": name, "primitives": [{"attributes": {"POSITION": 1}, "indices": 0, "material": 0}]}],
        "materials": [{"name": "print", "pbrMetallicRoughness": {"baseColorFactor": COLOUR, "metallicFactor": 0.0, "roughnessFactor": 0.7}}],
        "accessors": [
            {"bufferView": 0, "componentType": component, "count": int(indices.size), "type": "SCALAR"},
            {"bufferView": 1, "componentType": 5126, "count": int(len(positions)), "type": "VEC3",
             "min": positions.min(axis=0).tolist(), "max": positions.max(axis=0).tolist()},
        ],
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": int(indices.nbytes), "target": 34963},
            {"buffer": 0, "byteOffset": len(index_bytes), "byteLength": len(position_bytes), "target": 34962},
        ],
        "buffers": [{"byteLength": len(index_bytes) + len(position_bytes)}],
    }
    text = json.dumps(document, separators=(",", ":")).encode()
    text += b" " * (-len(text) % 4)
    binary = index_bytes + position_bytes
    total = 12 + 8 + len(text) + 8 + len(binary)
    return b"".join([
        struct.pack("<4sII", b"glTF", 2, total),
        struct.pack("<I4s", len(text), b"JSON"), text,
        struct.pack("<I4s", len(binary), b"BIN\0"), binary,
    ])


def load(step: str, folder: Path | None) -> bytes:
    if folder is not None:
        return (folder / f"{step}.stl").read_bytes()
    return subprocess.run(["git", "show", f"{BRANCH}:{BRANCH_DIR}/{step}.stl"], cwd=REPO, check=True, capture_output=True).stdout


if __name__ == "__main__":
    folder = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    OUT.mkdir(parents=True, exist_ok=True)
    ok = True
    for step in STEPS:
        source = read_stl(load(step, folder))
        triangles, cut = trim_at_cut(source)
        glb = to_glb(triangles, step)
        (OUT / f"{step}.glb").write_bytes(glb)
        size = triangles.reshape(-1, 3)
        span = (size.max(axis=0) - size.min(axis=0)) * 25.4
        fits = len(glb) <= MAX_BYTES
        ok &= fits
        print(f"{step}: {len(source)} triangles, cut at {cut * 25.4:.0f} mm, {len(glb) / 1e6:.2f} MB, {span[0]:.0f} x {span[1]:.0f} x {span[2]:.0f} mm, {'ok' if fits else 'TOO BIG'}")
    sys.exit(0 if ok else 1)
