"""Export the hand and finger from the CAD (STEP assemblies) to GLB files for the site.

Run it with the CAD environment, from the repo root:

    ~/.venvs/sldp-cad/bin/python scripts/step_to_glb.py                 # every model below
    ~/.venvs/sldp-cad/bin/python scripts/step_to_glb.py hand-final-v3   # one model

The CAD lives outside this repo, in ~/workspace/SLDP CAD on the build machine (set SLDP_CAD to
point somewhere else). Part names in the STEP become node names in the GLB, so a page can
pick out one finger or one part later.

When the CAD changes: add or edit an entry in MODELS, check that COLOURS and HIDDEN still name
the new file's parts (this prints every part it left grey), run it, and update the caption on
the page that shows the model. The caption must name the CAD version. The Lesson 1 step models
are cut from the same finger by scripts/finger_steps.py: run that too.
"""

from __future__ import annotations

import hashlib
import json
import os
import struct
import sys
import tempfile
from pathlib import Path

import numpy as np
from build123d import Color, Compound, Unit, export_gltf, import_step

CAD = Path(os.environ.get("SLDP_CAD", "~/workspace/SLDP CAD")).expanduser()
OUT = Path(__file__).resolve().parent.parent / "public" / "models"
MAX_BYTES = 3_000_000  # each model must stay under this to load quickly
# The CAD lays the hand flat: fingers along +X, palm side up (+Z). This stands it up, fingers
# up and palm toward the viewer: a quarter turn about Y, then one about Z. As glTF quaternions
# (x, y, z, w), applied in that order.
HALF = 0.5**0.5
UPRIGHT = ((0.0, -HALF, 0.0, HALF), (0.0, 0.0, HALF, HALF))

# What sits inside printed parts and is never seen. Dropping it keeps the files small.
HIDDEN = (
    "Arduino_Mega",
    "protoboard",
    "GY-521",
    "12_V_panel_jack",
    "L298N",
    "9_V_block",
    "screws_through_the_electronics_plate",
    "screws:_finger_modules_onto_their_webs",
    "VEX_2-Wire_Motor_393",
    "Small_DC_motor",
)

# The STEP files carry no colours. These are the hand's colours on the homepage (index.html,
# SCHEME; docs/README.md, "The hand on the homepage", says why): a navy palm, blue-grey
# housings, the three finger segments in blues from navy to sky, and the four parts that pass
# the motion along from brick to gold. Change them together. Bought parts are grey.
PALM, HOUSING = (0.072, 0.204, 0.463), (0.623, 0.736, 0.824)
SEGMENT_1, SEGMENT_2, SEGMENT_3 = (0.128, 0.271, 0.617), (0.106, 0.525, 0.818), (0.335, 0.765, 0.926)
CARRIAGE, LINK, BAR_1, BAR_2 = (0.616, 0.185, 0.087), (0.717, 0.373, 0.119), (0.829, 0.536, 0.078), (0.896, 0.721, 0.148)
GREY = (0.61, 0.63, 0.65)
# Part name contains -> colour. First match wins. "=" in front means the whole name. A part no
# line names is grey: the screws, nuts and pins, which the CAD leaves unnamed.
COLOURS = (
    ("motor_housing", HOUSING),  # before "reference": the CAD calls the uploaded housing a reference solid
    ("reference", GREY),
    ("Proximal_half", SEGMENT_1),
    ("Thumb_proximal", SEGMENT_1),
    ("Middle_phalanx", SEGMENT_2),
    ("Distal_half", SEGMENT_3),
    ("Thumb_distal", SEGMENT_3),
    ("Coupler_bar_Q", BAR_1),
    ("Thumb_coupler_bar", BAR_1),
    ("Coupler_bar_R", BAR_2),
    ("Link_plate", PALM),
    ("Thumb_link", LINK),
    ("=Link", LINK),
    ("Carriage", CARRIAGE),
    ("Thumb_carriage", CARRIAGE),
    ("Finger_base", HOUSING),
    ("Knuckle_pin", HOUSING),
    ("Thumb_unit", HOUSING),
    ("Thumb_base", HOUSING),
    ("Thumb_lead_screw", HOUSING),
    ("Spacer_tube", HOUSING),
    ("Palm", PALM),
    ("Wire_cover", PALM),
    ("Electronics_", PALM),
    ("Thumb_module", PALM),
)
left_grey: set[str] = set()


def colour_for(label: str):
    for name, rgb in COLOURS:
        if label == name[1:] if name.startswith("=") else name in label:
            return Color(*rgb)
    left_grey.add(label)
    return Color(*GREY)


MODELS = {
    # Final v3 (2026-11-22): the hand built round the final motor housings, with the electronics
    # under one curved shell. Marked CURRENT in ~/workspace/SLDP CAD/CLAUDE.md.
    "hand-final-v3": {
        "source": "Final v3/OPEN IN CAD/Final_v3.step",
        "drop": HIDDEN,
        "upright": True,
        "linear_deflection": 0.3,
        "angular_deflection": 0.6,
    },
    # One finger module of the same hand, straight: the middle finger, taken out of the same file.
    "finger-final-v3": {
        "source": "Final v3/OPEN IN CAD/Final_v3.step",
        "only": "Finger_2",
        "drop": (),
        "upright": False,
        "linear_deflection": 0.12,
        "angular_deflection": 0.35,
    },
}


def find(node, name: str):
    """The first part or group in the tree whose name contains `name`."""
    if name in (node.label or ""):
        return node
    for child in getattr(node, "children", ()) or ():
        found = find(child, name)
        if found is not None:
            return found
    return None


def prune(node, drop: tuple[str, ...]):
    """The assembly tree, coloured, without the parts whose label contains a dropped name.

    The parts stay where the CAD put them. Do not turn or move a part here: each one is still
    attached to the assembly, so copying it (which rotate() and moved() do) copies the whole
    hand, 65 MB a time for Final v3 and about 20 GB over its 156 parts. tidy() stands the
    model up afterwards, in the file.
    """
    label = node.label or ""
    if any(name in label for name in drop):
        return None
    children = list(getattr(node, "children", ()) or ())
    if not children:
        node.color = colour_for(label)
        return node
    kept = [child for child in (prune(c, drop) for c in children) if child is not None]
    if not kept:
        return None
    return Compound(label=label, children=kept)


COMPONENT = {5120: "i1", 5121: "u1", 5122: "<i2", 5123: "<u2", 5125: "<u4", 5126: "<f4"}
WIDTH = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}


def turned(first, then):
    """The quaternion for turning by `first` and then by `then` (both x, y, z, w)."""
    (x1, y1, z1, w1), (x2, y2, z2, w2) = then, first
    return [
        w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
        w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
        w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
        w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
    ]


def tidy(data: bytes, upright: bool = False) -> bytes:
    """Rewrite the GLB the CAD kernel wrote: smaller, and standing up if `upright`.

    The kernel writes one piece of mesh for every face of every part (8,000 for the hand), each
    with texture coordinates nothing uses, and it writes four identical fingers four times.
    This joins a part's faces into one piece per colour, drops the texture coordinates, and
    stores each distinct shape once. Names, colours, positions and shading are unchanged.
    """
    (length,) = struct.unpack_from("<I", data, 12)
    doc = json.loads(data[20 : 20 + length])
    blob = data[20 + length + 8 :]

    def read(index: int) -> np.ndarray:
        accessor = doc["accessors"][index]
        view = doc["bufferViews"][accessor["bufferView"]]
        kind, width = np.dtype(COMPONENT[accessor["componentType"]]), WIDTH[accessor["type"]]
        start = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
        stride = view.get("byteStride") or kind.itemsize * width
        return np.ndarray((accessor["count"], width), kind, blob, start, (stride, kind.itemsize)).copy()

    index_bytes, vertex_bytes, accessors, stored = bytearray(), bytearray(), [], {}

    def store(array: np.ndarray, *, vertex: bool, bounds: bool = False) -> int:
        raw = array.tobytes()
        key = (vertex, array.dtype.str, hashlib.sha1(raw).digest())
        if key not in stored:
            target = vertex_bytes if vertex else index_bytes
            target.extend(b"\0" * (-len(target) % 4))
            accessor = {"bufferView": 1 if vertex else 0, "byteOffset": len(target), "count": len(array),
                        "componentType": 5126 if vertex else (5123 if array.dtype.itemsize == 2 else 5125),
                        "type": "VEC3" if vertex else "SCALAR"}
            if bounds:
                accessor["min"], accessor["max"] = array.min(axis=0).tolist(), array.max(axis=0).tolist()
            target.extend(raw)
            accessors.append(accessor)
            stored[key] = len(accessors) - 1
        return stored[key]

    for mesh in doc["meshes"]:
        by_material: dict = {}
        for piece in mesh["primitives"]:
            if piece.get("mode", 4) == 4:
                by_material.setdefault(piece.get("material"), []).append(piece)
        mesh["primitives"] = []
        for material, pieces in by_material.items():
            positions = [read(piece["attributes"]["POSITION"]) for piece in pieces]
            shaded = all("NORMAL" in piece["attributes"] for piece in pieces)
            starts = np.cumsum([0] + [len(p) for p in positions])
            corners = [
                (read(piece["indices"]).reshape(-1).astype(np.uint32) if "indices" in piece else np.arange(len(p), dtype=np.uint32)) + start
                for piece, p, start in zip(pieces, positions, starts)
            ]
            joined = np.concatenate(positions).astype("<f4")
            attributes = {"POSITION": store(joined, vertex=True, bounds=True)}
            if shaded:
                attributes["NORMAL"] = store(np.concatenate([read(piece["attributes"]["NORMAL"]) for piece in pieces]).astype("<f4"), vertex=True)
            indices = np.concatenate(corners).astype("<u2" if len(joined) < 65536 else "<u4")
            new = {"attributes": attributes, "indices": store(indices, vertex=False), "mode": 4}
            if material is not None:
                new["material"] = material
            mesh["primitives"].append(new)

    if upright:
        for root in doc["scenes"][doc.get("scene", 0)]["nodes"]:
            node = doc["nodes"][root]
            rotation = turned(UPRIGHT[0], UPRIGHT[1])
            node["rotation"] = turned(rotation, node.get("rotation", [0.0, 0.0, 0.0, 1.0]))

    index_bytes.extend(b"\0" * (-len(index_bytes) % 4))
    binary = bytes(index_bytes) + bytes(vertex_bytes)
    binary += b"\0" * (-len(binary) % 4)
    out = {
        "asset": {"version": "2.0", "generator": "HelpingHand scripts/step_to_glb.py"},
        "scene": doc.get("scene", 0),
        "scenes": doc["scenes"],
        "nodes": doc["nodes"],
        "meshes": doc["meshes"],
        "materials": doc.get("materials", []),
        "accessors": accessors,
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": len(index_bytes), "target": 34963},
            {"buffer": 0, "byteOffset": len(index_bytes), "byteLength": len(vertex_bytes), "byteStride": 12, "target": 34962},
        ],
        "buffers": [{"byteLength": len(binary)}],
    }
    text = json.dumps(out, separators=(",", ":")).encode()
    text += b" " * (-len(text) % 4)
    total = 12 + 8 + len(text) + 8 + len(binary)
    return b"".join([
        struct.pack("<4sII", b"glTF", 2, total),
        struct.pack("<I4s", len(text), b"JSON"), text,
        struct.pack("<I4s", len(binary), b"BIN\0"), binary,
    ])


def write_glb(assembly, target: Path, spec: dict) -> int:
    """Mesh the coloured assembly, tidy the file and write it. Returns its size in bytes."""
    with tempfile.TemporaryDirectory() as folder:
        raw = Path(folder) / "raw.glb"
        export_gltf(
            assembly,
            str(raw),
            unit=Unit.MM,
            binary=True,
            linear_deflection=spec["linear_deflection"],
            angular_deflection=spec["angular_deflection"],
        )
        data = tidy(raw.read_bytes(), spec.get("upright", False))
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return len(data)


def count_parts(node) -> int:
    children = list(getattr(node, "children", ()) or ())
    return 1 if not children else sum(count_parts(c) for c in children)


def export(name: str, spec: dict) -> bool:
    source = CAD / spec["source"]
    if not source.exists():
        print(f"{name}: missing {source}")
        return False
    assembly = import_step(str(source))
    if spec.get("only"):
        assembly = find(assembly, spec["only"])
        if assembly is None:
            print(f"{name}: nothing named {spec['only']} in {source.name}")
            return False
    before = count_parts(assembly)
    left_grey.clear()
    assembly = prune(assembly, tuple(spec["drop"]))
    size = write_glb(assembly, OUT / f"{name}.glb", spec)
    verdict = "ok" if size <= MAX_BYTES else f"TOO BIG (limit {MAX_BYTES / 1e6:.1f} MB)"
    print(f"{name}: {count_parts(assembly)} of {before} parts, {size / 1e6:.2f} MB, {verdict}  <- {spec['source']}")
    print(f"  left grey: {', '.join(sorted(label[:42] or '(no name)' for label in left_grey))}")
    return size <= MAX_BYTES


if __name__ == "__main__":
    wanted = sys.argv[1:] or list(MODELS)
    unknown = [name for name in wanted if name not in MODELS]
    if unknown:
        sys.exit(f"Unknown model(s): {', '.join(unknown)}. Known: {', '.join(MODELS)}")
    results = [export(name, MODELS[name]) for name in wanted]
    sys.exit(0 if all(results) else 1)
