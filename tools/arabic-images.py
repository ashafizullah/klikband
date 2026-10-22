# Draws the Arabic dhikr and dua text as PNG images in the Amiri font.
#
# The watch text engine neither joins Arabic letters nor places harakat, so the
# dhikr and dua pages show these images instead of text. Run this from the repo
# root after changing any `arabic` text in src/common/dhikr*.js or duas.js:
#
#   pip install uharfbuzz freetype-py pillow
#   python3 tools/arabic-images.py
#
# It writes src/common/arabic/*.png and src/common/arabicimages.js.

import hashlib
import json
import os
import re
import subprocess

import freetype
import uharfbuzz as hb
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, 'tools', 'fonts', 'Amiri-Regular.ttf')
OUT_DIR = os.path.join(ROOT, 'src', 'common', 'arabic')
MANIFEST = os.path.join(ROOT, 'src', 'common', 'arabicimages.js')

# Each group of texts gets one image per layout, [band, narrow], sized in design
# px (the 192 px design width) and drawn at `scale` pixels per design px. Narrow
# serves wide screens (Band 9 Pro, 1.75x) and round watches (up to about 2.4x).
# Text over 40 characters gets the smaller size, like the Latin text.
# `load` is a module script printing the group's `arabic` texts as JSON, read
# through the same modules the app uses.
GROUPS = [
    {
        # The dhikr page: the full-width text block, or the text column beside
        # the counter on wide and round screens
        'export': 'DHIKR',
        'load': """
const d = (await import('./src/common/dhikr.js')).default
const m = await import('./src/common/dhikrmorningevening.js')
const all = [...d, ...m.morningEveningDhikr('morning'), ...m.morningEveningDhikr('evening')]
console.log(JSON.stringify(all.map((x) => x.arabic)))
""",
        'variants': [
            {'prefix': 'b', 'width': 176, 'scale': 1, 'size': 28, 'long_size': 21},
            {'prefix': 'n', 'width': 88, 'scale': 2, 'size': 16, 'long_size': 12}
        ]
    },
    {
        # The duas page: inside the card (176 less its padding)
        'export': 'DUAS',
        'load': """
const d = (await import('./src/common/duas.js')).default
console.log(JSON.stringify(d.map((x) => x.arabic)))
""",
        'variants': [
            {'prefix': 'db', 'width': 148, 'scale': 1, 'size': 26, 'long_size': 21},
            {'prefix': 'dn', 'width': 144, 'scale': 2, 'size': 15, 'long_size': 12}
        ]
    }
]
LINE_HEIGHT = 1.75

# A Qur'an verse number such as (١) or (٢٥٥)
VERSE_NUMBER = re.compile(r'^\([\u0660-\u0669]+\)$')
# Qur'an pause (waqf) marks, written after a space
WAQF = re.compile(r'^[\u06d6-\u06dc]+$')
# Height of the bottom of a waqf mark above the baseline, in em
WAQF_RAISE = 0.55



def load_texts(script):
    out = subprocess.run(
        ['node', '--no-warnings', '--input-type=module', '-e', script],
        cwd=ROOT, check=True, capture_output=True, text=True
    )
    texts = [t for t in json.loads(out.stdout) if t]
    return list(dict.fromkeys(texts))


class Shaper:
    def __init__(self, path):
        with open(path, 'rb') as f:
            data = f.read()
        self.hb_font = hb.Font(hb.Face(data))
        self.upem = self.hb_font.face.upem
        self.ft = freetype.Face(path)

    # Glyphs of one word in visual order, (glyph id, x, y) and the width, in font units
    def shape(self, word, direction='rtl'):
        buf = hb.Buffer()
        buf.add_str(word)
        buf.direction = direction
        buf.script = 'Arab'
        buf.language = 'ar'
        buf.flags = hb.BufferFlags.DO_NOT_INSERT_DOTTED_CIRCLE
        hb.shape(self.hb_font, buf)
        glyphs, x = [], 0
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            glyphs.append((info.codepoint, x + pos.x_offset, pos.y_offset))
            x += pos.x_advance
        return glyphs, x

    # A waqf mark on its own, raised over the gap after the word before it
    def shape_waqf(self, mark):
        glyphs, x = [], 0
        for gid, _, _ in self.shape(mark)[0]:
            e = self.hb_font.get_glyph_extents(gid)
            bottom = e.y_bearing + e.height
            glyphs.append((gid, x - e.x_bearing, round(WAQF_RAISE * self.upem) - bottom))
            x += e.width
        return glyphs, x

    def shape_segment(self, word):
        if WAQF.match(word):
            return self.shape_waqf(word)
        return self.shape(word, 'ltr' if VERSE_NUMBER.match(word) else 'rtl')


def render(shaper, text, width, px):
    unit = px / shaper.upem
    shaper.ft.set_char_size(int(px * 64))
    space = shaper.shape(' ')[1] * unit

    # Units that never break across lines: a waqf mark or a verse number (which
    # reads left to right) stays with the word before it
    units = []
    for word in text.split(' '):
        if units and (WAQF.match(word) or VERSE_NUMBER.match(word)):
            units[-1].append(word)
        else:
            units.append([word])

    # Greedy line breaking, units kept in reading order
    lines, line, line_w = [], [], 0
    for words in units:
        segments = []
        for word in words:
            glyphs, adv = shaper.shape_segment(word)
            segments.append((glyphs, adv * unit))
        w = sum(seg_w for _, seg_w in segments) + space * (len(segments) - 1)
        if line and line_w + space + w > width:
            lines.append((line, line_w))
            line, line_w = [], 0
        line_w += (space if line else 0) + w
        line.extend(segments)
    lines.append((line, line_w))

    advance = round(px * LINE_HEIGHT)
    canvas = Image.new('L', (width, advance * len(lines) + px * 2), 0)
    for n, (line, line_w) in enumerate(lines):
        baseline = px * 1.5 + n * advance
        # Centered, the first word on the right
        x = (width + line_w) / 2
        for glyphs, w in line:
            x -= w
            for gid, gx, gy in glyphs:
                shaper.ft.load_glyph(gid, freetype.FT_LOAD_RENDER | freetype.FT_LOAD_NO_HINTING)
                g = shaper.ft.glyph
                bm = g.bitmap
                if bm.width == 0 or bm.rows == 0:
                    continue
                img = Image.frombytes('L', (bm.width, bm.rows), bytes(bm.buffer), 'raw', 'L', bm.pitch)
                left = round(x + gx * unit) + g.bitmap_left
                top = round(baseline - gy * unit) - g.bitmap_top
                layer = Image.new('L', canvas.size, 0)
                layer.paste(img, (left, top))
                canvas = ImageChops.lighter(canvas, layer)
            x -= space

    # Trim empty rows, keeping the full width so the text stays centered
    box = canvas.getbbox()
    return canvas.crop((0, max(box[1] - 2, 0), width, min(box[3] + 2, canvas.height)))


# White text as a palette PNG (like the PNG8 the Vela toolkit can also make)
# with 16 levels of transparency, less than half the size of RGBA
def save_png8(alpha, path):
    png = alpha.point(lambda v: (v + 8) // 17).convert('P')
    png.putpalette([255, 255, 255] * 16)
    png.save(path, optimize=True, transparency=bytes(i * 17 for i in range(16)))


def main():
    shaper = Shaper(FONT)
    os.makedirs(OUT_DIR, exist_ok=True)
    written = set()
    manifest = []
    for group in GROUPS:
        entries = draw_group(shaper, group, written)
        manifest.append((group['export'], entries))

    for name in os.listdir(OUT_DIR):
        if name not in written:
            os.remove(os.path.join(OUT_DIR, name))

    with open(MANIFEST, 'w', encoding='utf-8') as f:
        f.write('// Generated by tools/arabic-images.py, do not edit.\n')
        f.write('// Arabic text drawn as images: text -> [band, narrow] images,\n')
        f.write('// each [path, width, height] in design px.\n')
        for export, entries in manifest:
            f.write('\nexport const %s = {\n' % export)
            for i, (text, images) in enumerate(entries):
                sep = ',' if i < len(entries) - 1 else ''
                f.write('  %s: %s%s\n' % (json.dumps(text, ensure_ascii=False).replace('"', "'"), json.dumps(images).replace('"', "'"), sep))
            f.write('}\n')
    print(', '.join('%s %d texts' % (e, len(x)) for e, x in manifest) + ', %d images' % len(written))


def draw_group(shaper, group, written):
    entries = []
    for text in load_texts(group['load']):
        key = hashlib.sha1(text.encode('utf-8')).hexdigest()[:8]
        images = []
        for v in group['variants']:
            s = v['scale']
            size = v['long_size'] if len(text) > 40 else v['size']
            alpha = render(shaper, text, v['width'] * s, size * s)
            # Height in whole design px
            h = -(-alpha.height // s)
            padded = Image.new('L', (alpha.width, h * s), 0)
            padded.paste(alpha, (0, (h * s - alpha.height) // 2))
            name = '%s-%s.png' % (v['prefix'], key)
            save_png8(padded, os.path.join(OUT_DIR, name))
            written.add(name)
            images.append(['/common/arabic/' + name, v['width'], h])
        entries.append((text, images))
    return entries


main()
