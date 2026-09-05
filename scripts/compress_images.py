#!/usr/bin/env python3
"""
compress_images.py
-----------------------------------------------------------------------
Shrinks the illustration banners in img/ (Wild Shape / Summon Nature's
Ally artwork) for faster page loads on mobile and e-readers.

These are AI-generated illustrations with no transparency in use, saved
as full-resolution PNGs (often 3000px+ wide, several MB each) even
though the page only ever displays them as a cropped banner a few
hundred pixels tall. Re-encoding them as resized, flattened JPEGs
routinely cuts file size by 95%+ with no visible quality loss at the
sizes this sheet actually renders them at.

Requires Pillow: pip install Pillow

USAGE
  # Dry run (default) — reports projected savings, writes nothing:
  python3 scripts/compress_images.py

  # Actually rewrite the files in place (converts .png -> .jpg,
  # deletes the old .png, and updates the `image: "img/...png"`
  # references in data/*.js to match):
  python3 scripts/compress_images.py --apply

  # Tune the target width/quality, or target specific files:
  python3 scripts/compress_images.py --max-width 1200 --quality 78 --apply
  python3 scripts/compress_images.py img/crocodile.png --apply

This only ever touches files you point it at (default: everything in
img/ above --min-size). It's a git repo — if a result doesn't look
right, `git checkout -- img/ data/` undoes it.
"""

import argparse
import io
import os
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit(
        "Pillow is required but not installed.\n"
        "Install it with:  pip install Pillow"
    )

REPO_ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = REPO_ROOT / "img"
DATA_DIR = REPO_ROOT / "data"


def human(n_bytes):
    for unit in ("B", "KB", "MB", "GB"):
        if n_bytes < 1024:
            return f"{n_bytes:.0f} {unit}" if unit == "B" else f"{n_bytes:.2f} {unit}"
        n_bytes /= 1024
    return f"{n_bytes:.2f} TB"


def compress_to_jpeg(src_path, max_width, quality):
    """Returns (jpeg_bytes, new_width, new_height). Flattens any alpha
    channel onto white first, since JPEG has no transparency."""
    with Image.open(src_path) as im:
        im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
        if im.mode == "RGBA":
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[3])
            im = bg

        if im.width > max_width:
            new_height = round(im.height * (max_width / im.width))
            im = im.resize((max_width, new_height), Image.LANCZOS)

        buf = io.BytesIO()
        im.save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
        return buf.getvalue(), im.width, im.height


def find_targets(paths, min_size):
    if paths:
        return [Path(p) for p in paths]
    if not IMG_DIR.is_dir():
        return []
    exts = {".png", ".jpg", ".jpeg"}
    return sorted(
        p for p in IMG_DIR.iterdir()
        if p.suffix.lower() in exts and p.stat().st_size >= min_size
    )


def update_references(old_name, new_name):
    """Rewrites `image: "img/<old_name>"` (or any other mention of the
    old filename under img/) in data/*.js to point at the new filename."""
    changed = []
    if not DATA_DIR.is_dir():
        return changed
    pattern = re.compile(re.escape(old_name))
    for js_file in DATA_DIR.glob("*.js"):
        text = js_file.read_text(encoding="utf-8")
        new_text, n = pattern.subn(new_name, text)
        if n:
            js_file.write_text(new_text, encoding="utf-8")
            changed.append((js_file.name, n))
    return changed


def main():
    parser = argparse.ArgumentParser(
        description="Compress the sheet's illustration banners for faster page loads.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("files", nargs="*", help="Specific image files to process (default: everything in img/)")
    parser.add_argument("--max-width", type=int, default=1600, help="Downscale images wider than this (default: 1600px — plenty for a 2x-retina banner)")
    parser.add_argument("--quality", type=int, default=82, help="JPEG quality, 1-95 (default: 82 — visually lossless for photographic art)")
    parser.add_argument("--min-size", type=int, default=300 * 1024, help="Skip files already smaller than this, in bytes (default: 300 KB)")
    parser.add_argument("--apply", action="store_true", help="Write the results (default is a dry run that only reports projected savings)")
    args = parser.parse_args()

    targets = find_targets(args.files, args.min_size)
    if not targets:
        print("Nothing to do — no images found above --min-size.")
        return

    print(f"{'file':<22} {'before':>10} {'after':>10} {'saved':>8}   dimensions")
    print("-" * 72)

    total_before = 0
    total_after = 0

    for src in targets:
        before_size = src.stat().st_size
        try:
            jpeg_bytes, w, h = compress_to_jpeg(src, args.max_width, args.quality)
        except Exception as e:
            print(f"{src.name:<22} skipped ({e})")
            continue

        after_size = len(jpeg_bytes)
        total_before += before_size
        total_after += after_size
        pct = 100 * (1 - after_size / before_size) if before_size else 0

        dest = src.with_suffix(".jpg")
        print(f"{src.name:<22} {human(before_size):>10} {human(after_size):>10} {pct:>7.1f}%   {w}x{h}" + ("" if dest == src else f"  -> {dest.name}"))

        if args.apply:
            dest.write_bytes(jpeg_bytes)
            if dest != src:
                src.unlink()
                for fname, n in update_references(f"img/{src.name}", f"img/{dest.name}"):
                    print(f"    updated {n} reference(s) in data/{fname}")

    print("-" * 72)
    total_pct = 100 * (1 - total_after / total_before) if total_before else 0
    print(f"{'TOTAL':<22} {human(total_before):>10} {human(total_after):>10} {total_pct:>7.1f}%")

    if not args.apply:
        print("\nDry run only — nothing was written. Re-run with --apply to save these files.")


if __name__ == "__main__":
    main()
