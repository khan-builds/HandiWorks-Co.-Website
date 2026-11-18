"""Export the hand and finger from the CAD (STEP assemblies) to GLB files for the site.

Run it with the CAD environment, from the repo root:

    ~/.venvs/sldp-cad/bin/python scripts/step_to_glb.py            # every model below
    ~/.venvs/sldp-cad/bin/python scripts/step_to_glb.py hand-v10   # one model

The CAD lives outside this repo, in ~/workspace/SLDP on the build machine (set SLDP_CAD to
point somewhere else). Part names in the STEP become node names in the GLB, so a page can
pick out one finger or one part later.

When the CAD changes: add or edit an entry in MODELS, run this, and update the caption on
the page that shows the model. The caption must name the CAD version.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from build123d import Axis, Color, Compound, Unit, export_gltf, import_step

CAD = Path(os.environ.get("SLDP_CAD", "~/workspace/SLDP")).expanduser()
OUT = Path(__file__).resolve().parent.parent / "public" / "models"
MAX_BYTES = 3_000_000  # each model must stay under this to load quickly

# Hardware that sits inside printed parts and is never seen. Dropping it keeps the files small.
HIDDEN_HARDWARE = (
    "M3_threaded_rod",
    "M3_lead_nut",
    "Coupler__press_fit",
    "Carriage__captive",
)

# The STEP files carry no colours. These are display colours only, chosen to match the hand
# on the homepage: first matching name wins, anything unnamed is hardware grey.
GOLD, STEEL, NAVY, GREY, ORANGE = (
    (0.85, 0.59, 0.035),
    (0.52, 0.70, 0.78),
    (0.13, 0.22, 0.40),
    (0.61, 0.63, 0.65),
    (0.98, 0.53, 0.055),
)
COLOURS = (
    ("reference", GREY),
    ("Distal_half", ORANGE),
    ("Proximal_half", NAVY),
    ("Middle_phalanx_half", NAVY),
    ("Coupler_bar", STEEL),
    ("Link_plate", STEEL),
    ("Link", STEEL),
    ("Housing_half", GOLD),
    ("Finger_base", GOLD),
    ("Thumb_unit", GOLD),
    ("Electronics_box", GOLD),
    ("Box_lid", GOLD),
    ("Palm", STEEL),
    ("Pod_lid", STEEL),
)


def colour_for(label: str):
    for name, rgb in COLOURS:
        if name in label:
            return Color(*rgb)
    return Color(*GREY)


MODELS = {
    # Hand v10 (2026-11-17): the palm built round the real VEX 393, fingers v4, thumb v5.
    # Marked CURRENT in ~/workspace/SLDP/CLAUDE.md and README.md.
    "hand-v10": {
        "source": "11.17 Thumb Updates/hand/v10_real_393/parts/Hand_v10_flat.step",
        "drop": HIDDEN_HARDWARE,
        "upright": True,
        "linear_deflection": 0.3,
        "angular_deflection": 0.6,
    },
    # Finger module v4 on actuator v4 (2026-11-11): one finger with its drive, straight.
    "finger-v4": {
        "source": "11.11 Fable 2 Hand Output/finger/v4_on_actuator_v4/parts/Finger_Module_v4_straight.step",
        "drop": (),
        "upright": False,
        "linear_deflection": 0.12,
        "angular_deflection": 0.35,
    },
}


def prune(node, drop: tuple[str, ...], upright: bool):
    """Copy of the assembly tree, coloured, without the parts whose label contains a dropped name.

    The CAD lays the hand flat: fingers along +X, palm side up (+Z). `upright` turns every part
    so the fingers point up and the palm faces the viewer, which is how the site shows it.
    """
    label = node.label or ""
    if any(name in label for name in drop):
        return None
    children = list(getattr(node, "children", ()) or ())
    if not children:
        part = node.rotate(Axis.Y, -90).rotate(Axis.Z, 90) if upright else node
        part.label = label
        part.color = colour_for(label)
        return part
    kept = [child for child in (prune(c, drop, upright) for c in children) if child is not None]
    if not kept:
        return None
    return Compound(label=label, children=kept)


def count_parts(node) -> int:
    children = list(getattr(node, "children", ()) or ())
    return 1 if not children else sum(count_parts(c) for c in children)


def export(name: str, spec: dict) -> bool:
    source = CAD / spec["source"]
    if not source.exists():
        print(f"{name}: missing {source}")
        return False
    assembly = import_step(str(source))
    before = count_parts(assembly)
    assembly = prune(assembly, tuple(spec["drop"]), spec["upright"])
    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / f"{name}.glb"
    export_gltf(
        assembly,
        str(target),
        unit=Unit.MM,
        binary=True,
        linear_deflection=spec["linear_deflection"],
        angular_deflection=spec["angular_deflection"],
    )
    size = target.stat().st_size
    verdict = "ok" if size <= MAX_BYTES else f"TOO BIG (limit {MAX_BYTES / 1e6:.1f} MB)"
    print(f"{name}: {count_parts(assembly)} of {before} parts, {size / 1e6:.2f} MB, {verdict}  <- {spec['source']}")
    return size <= MAX_BYTES


if __name__ == "__main__":
    wanted = sys.argv[1:] or list(MODELS)
    unknown = [name for name in wanted if name not in MODELS]
    if unknown:
        sys.exit(f"Unknown model(s): {', '.join(unknown)}. Known: {', '.join(MODELS)}")
    results = [export(name, MODELS[name]) for name in wanted]
    sys.exit(0 if all(results) else 1)
