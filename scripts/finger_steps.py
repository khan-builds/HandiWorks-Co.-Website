"""Cut the five Lesson 1 step models from the finger of the current CAD.

Run it with the CAD environment, from the repo root:

    ~/.venvs/sldp-cad/bin/python scripts/finger_steps.py

Lesson 1 grows one finger in five CAD steps, and each step shows a model to compare with. The
five models are one finger module of the hand on The Kit page (scripts/step_to_glb.py,
"finger-final-v3"), cut across its length a little further along each time: STEPS below says
where and why. The cut is a real cut of each solid, so a cut end is closed, and the parts keep
the colours they have on the rest of the site.

Until 2026-11-23 the five models were slices of an older finger file kept on the `version-1`
branch. scripts/stl_to_glb.py still makes those, and writes to the same five files.

When the CAD changes: run scripts/step_to_glb.py first, then this, and read the step pictures
against the lesson's words (src/content/lessons/beginner/01-finger-module/cad.mdx). If a
part moved along the finger, move the cuts.
"""

from __future__ import annotations

import sys
from pathlib import Path

from build123d import Align, Box, Compound, Pos, import_step

sys.dont_write_bytecode = True  # importing the script next door would leave a cache folder in the repo
from step_to_glb import CAD, MODELS, colour_for, find, write_glb  # noqa: E402

FINGER = MODELS["finger-final-v3"]
OUT = Path(__file__).resolve().parent.parent / "public" / "models" / "lesson-1"
MAX_BYTES = 2_000_000
MESH = {"linear_deflection": 0.12, "angular_deflection": 0.35}

# File name, and how far along the finger it is cut: mm from the rear face of the motor housing,
# measured in the finger's own frame. None keeps the whole finger. Final v3's finger runs from 0
# to 291: the housing ends at 130.45, the knuckle is at 148.5, the middle joint at 208.8 and
# the fingertip's joint at 250.9.
STEPS = (
    ("01-base", 66.0),            # the rear of the housing: its mounting face, and the motor's pocket cut open
    ("02-drive", 130.45),         # the whole housing, with the carriage inside and the link coming out of it
    ("03-first-joints", 188.0),   # the base, the knuckle and the first pivots; the first segment is cut short
    ("04-links", 244.0),          # the first segment and both bars, up to just before the fingertip's joint
    ("05-finished-finger", None),
)
SLIVER = 0.5  # a part that would keep less than this much of its length is left out of the step


def leaves(node):
    children = list(getattr(node, "children", ()) or ())
    if not children:
        yield node
    for child in children:
        yield from leaves(child)


def cut_at(part, x: float | None):
    """The part up to `x` along the finger: the part itself, a cut copy of it, or None."""
    box = part.bounding_box()
    if x is None or box.max.X <= x + 1e-6:
        return part
    if box.min.X >= x - SLIVER:
        return None
    keep = Pos(box.min.X - 1, box.min.Y - 1, box.min.Z - 1) * Box(
        x - box.min.X + 1, box.size.Y + 2, box.size.Z + 2, align=(Align.MIN, Align.MIN, Align.MIN)
    )
    piece = part & keep
    if piece is None or not getattr(piece, "volume", 0):
        return None
    piece.label = part.label
    return piece


if __name__ == "__main__":
    source = CAD / FINGER["source"]
    if not source.exists():
        sys.exit(f"missing {source}")
    finger = find(import_step(str(source)), FINGER["only"])
    if finger is None:
        sys.exit(f"nothing named {FINGER['only']} in {source.name}")
    parts = list(leaves(finger))
    # Take each part out of the assembly before working on it: a part still attached to the
    # assembly drags a copy of the whole hand along with every copy of itself.
    for part in parts:
        part.parent = None
    start = min(part.bounding_box().min.X for part in parts)
    ok = True
    for name, along in STEPS:
        kept, cut = [], 0
        for part in parts:
            piece = cut_at(part, None if along is None else start + along)
            if piece is None:
                continue
            cut += piece is not part
            piece.color = colour_for(piece.label or "")
            kept.append(piece)
        size = write_glb(Compound(label=f"Lesson 1: {name}", children=kept), OUT / f"{name}.glb", MESH)
        fits = size <= MAX_BYTES
        ok &= fits
        where = "the whole finger" if along is None else f"cut {along:g} mm along"
        print(f"{name}: {where}, {len(kept)} of {len(parts)} parts ({cut} cut), {size / 1e6:.2f} MB, {'ok' if fits else 'TOO BIG'}")
        for part in kept:  # free the parts for the next step
            part.parent = None
    sys.exit(0 if ok else 1)
