"""Render the 630x250 promo banners served at /promo.gif (the worker picks one per request, see functions/promo.js).
Variants: launch-<featured slug>, sale-<offer id> for every seasonal offer, bundle-<slug> as the default.
Run: python scripts/make-promo.py   (writes public/promo/*.gif and public/promo/variants.json)"""
import json, os, re, glob, datetime
from PIL import Image, ImageDraw, ImageFont, ImageSequence

W, H, LW = 630, 250, 300           # banner size, width of the animated preview on the left
BG, BG2, LINE = (19, 19, 19), (27, 27, 27), (42, 42, 42)
TEXT, MUTED, ACC, INK = (248, 250, 252), (154, 163, 173), (255, 122, 89), (14, 14, 14)
F = "C:/Windows/Fonts/"
font = lambda name, size: ImageFont.truetype(F + name, size)
BLACK, BOLD, SEMI, REG = "seguibl.ttf", "segoeuib.ttf", "seguisb.ttf", "segoeui.ttf"
OUT = "public/promo"
FPS_MS = 80                         # frame time; ~12 fps like the packs themselves


def js_objects(path, key):
    """Tiny reader for the data files: returns the {...} blocks that contain `key`."""
    return re.findall(r"\{[^{}]*" + key + r"[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", open(path, encoding="utf-8").read())


def field(block, name):
    m = re.search(name + r":\s*'([^']*)'", block) or re.search(name + r":\s*([\d.]+)", block)
    return m.group(1) if m else ""


products = {field(b, "slug"): {"name": field(b, "name"), "price": float(field(b, "price") or 0)}
            for b in js_objects("src/data/products.js", "slug:") if field(b, "slug")}
for s, b in [(field(b, "slug"), b) for b in js_objects("src/data/products.js", "slug:")]:
    m = re.search(r"sub: \{ en: '([^']*)'", b)
    if s in products and m: products[s]["sub"] = m.group(1)
home = open("src/data/home.js", encoding="utf-8").read()
featured = re.search(r"featured: '([^']+)'", home).group(1)
bundles_src = open("src/data/bundles.js", encoding="utf-8").read()
offers_src = open("src/data/offers.js", encoding="utf-8").read()


def cover_frames(slug, max_frames=48):
    f = (glob.glob(f"public/itch/{slug}/cover.*") or [None])[0]
    im = Image.open(f)
    frames = [fr.convert("RGB") for fr in ImageSequence.Iterator(im)] if getattr(im, "n_frames", 1) > 1 else [im.convert("RGB")]
    step = max(1, len(frames) // max_frames)
    out = []
    for fr in frames[::step][:max_frames]:
        s = H / fr.height
        fr = fr.resize((round(fr.width * s), H), Image.NEAREST if s >= 1 else Image.LANCZOS)
        x = (fr.width - LW) // 2
        out.append(fr.crop((x, 0, x + LW, H)))
    return out


def montage(slugs, per=14):
    seq = []
    for s in slugs:
        fr = cover_frames(s, per)
        seq += (fr * per)[:per]
    return seq


def text_w(d, t, f):
    return d.textlength(t, font=f)


def wrap(d, t, f, width):
    lines, cur = [], ""
    for w in t.split():
        nxt = (cur + " " + w).strip()
        if text_w(d, nxt, f) <= width or not cur: cur = nxt
        else: lines.append(cur); cur = w
    return lines + [cur]


def render(name, frames, chip, title, sub, price_new, price_old, badge, cta):
    """frames: left preview frames. Everything on the right is drawn per frame so the CTA can move."""
    n = len(frames)
    out = []
    X = LW + 22; RW = W - X - 20
    for i, left in enumerate(frames):
        im = Image.new("RGB", (W, H), BG)
        im.paste(left, (0, 0))
        d = ImageDraw.Draw(im)
        # soft fade from the preview into the panel
        for k in range(24):
            d.line([(LW - 24 + k, 0), (LW - 24 + k, H)], fill=tuple(int(c) for c in BG), width=1) if k > 20 else None
        grad = Image.new("L", (24, 1)); grad.putdata([int(255 * (k / 23) ** 2) for k in range(24)])
        im.paste(Image.new("RGB", (24, H), BG), (LW - 24, 0), grad.resize((24, H)))
        d.rectangle([LW, 0, W, H], fill=BG)
        d.rectangle([0, 0, W - 1, H - 1], outline=LINE)
        # chip
        cf = font(BOLD, 11)
        cw = text_w(d, chip, cf) + 16
        d.rounded_rectangle([X, 20, X + cw, 40], radius=6, fill=ACC)
        d.text((X + 8, 23), chip, font=cf, fill=INK)
        # title (auto size to 2 lines)
        for size in (30, 27, 24, 22):
            tf = font(BLACK, size); lines = wrap(d, title, tf, RW)
            if len(lines) <= 2: break
        y = 48
        for ln in lines:
            d.text((X, y), ln, font=tf, fill=TEXT); y += size + 4
        # sub
        sf = font(REG, 13)
        for ln in wrap(d, sub, sf, RW)[:2]:
            d.text((X, y + 2), ln, font=sf, fill=MUTED); y += 18
        # price row
        py = max(158, y + 10)
        if price_new:
            pf = font(BLACK, 24); d.text((X, py - 4), price_new, font=pf, fill=TEXT)
            px = X + text_w(d, price_new, pf) + 10
            if price_old:
                of = font(SEMI, 14); d.text((px, py + 4), price_old, font=of, fill=MUTED)
                ow = text_w(d, price_old, of); d.line([(px, py + 14), (px + ow, py + 14)], fill=MUTED, width=2); px += ow + 10
            if badge:
                bf = font(BOLD, 12); bw = text_w(d, badge, bf) + 12
                d.rounded_rectangle([px, py + 2, px + bw, py + 22], radius=6, outline=ACC, width=1)
                d.text((px + 6, py + 5), badge, font=bf, fill=ACC)
        # CTA: full-width button, arrow nudges and a highlight sweeps across once per loop
        by0, by1 = 196, 230
        d.rounded_rectangle([X, by0, W - 20, by1], radius=6, fill=ACC)
        t = i / n
        sweep = int(X - 60 + (W - 20 - X + 120) * min(1, t * 2.2))
        if t < 0.46:
            hl = Image.new("RGB", (W, H), (255, 177, 153)); mask = Image.new("L", (W, H), 0)
            ImageDraw.Draw(mask).polygon([(sweep, by0), (sweep + 26, by0), (sweep + 12, by1), (sweep - 14, by1)], fill=110)
            clip = Image.new("L", (W, H), 0); ImageDraw.Draw(clip).rounded_rectangle([X, by0, W - 20, by1], radius=6, fill=255)
            from PIL import ImageChops
            im.paste(hl, (0, 0), ImageChops.multiply(mask, clip)); d = ImageDraw.Draw(im)
        bf = font(BLACK, 15)
        nudge = [0, 1, 2, 3, 2, 1][i % 6]
        d.text((X + 14, by0 + 7), cta, font=bf, fill=INK)
        ax = W - 20 - 26 + nudge
        d.text((ax, by0 + 5), "\u2192", font=font(BLACK, 17), fill=INK)
        uf = font(SEMI, 10); d.text((X, 236), "icemanstudio.com", font=uf, fill=MUTED)
        out.append(im)
    pal = [fr.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE) for fr in out]
    pal[0].save(f"{OUT}/{name}.gif", save_all=True, append_images=pal[1:], duration=FPS_MS, loop=0, optimize=True, disposal=1)
    return f"{OUT}/{name}.gif"


def eur(v): return f"\u20ac{v:.2f}"


os.makedirs(OUT, exist_ok=True)
made = {}

# launch: the product featured on the home page
p = products[featured]
off = 25  # launch offer percent (src/data/offers.js: id 'launch')
made[f"launch-{featured}"] = render(f"launch-{featured}", cover_frames(featured, 60), "NEW RELEASE", p["name"],
                                     p.get("sub", ""), eur(p["price"] * (1 - off / 100)), eur(p["price"]), f"-{off}%", f"Get {p['name']} {off}% off")

# seasonal sales
vfx = ["epic-explosions-pixel-vfx", "50-vfx-fire-mage-spells", "ice-and-frost-mage", "blood-impacts-vfx-pixel", "pixel-projectile-effects-and-hits"]
year = datetime.date.today().year
for b in re.findall(r"\{ id: '([a-z]+)', kind: '(season|blackfriday)'([^\n]*)", offers_src):
    oid, kind, rest = b
    pct = int(re.search(r"percent: (\d+)", rest).group(1))
    name = re.search(r"en: '([^']+)'", rest).group(1)
    scope = "every VFX pack" if "cat:vfx" in rest else "everything in the store"
    end = re.search(r"end: '(\d\d)-(\d\d)'", rest)
    when = datetime.date(year, int(end.group(1)), int(end.group(2))).strftime("Ends %b %-d") if end and os.name != "nt" else \
        (datetime.date(year, int(end.group(1)), int(end.group(2))).strftime("Ends %b ") + str(int(end.group(2))) if end else "Ends Monday")
    made[f"sale-{oid}"] = render(f"sale-{oid}", montage(vfx[:4]), name.upper(), f"-{pct}% on {scope}",
                                 f"{when}. Aseprite extensions, pixel art VFX, tilesets and low-poly packs.", "", "", "", f"Shop the {name.lower()}")

# default: the VFX bundle
bm = re.search(r"slug: 'pixel-vfx-complete'[^\n]*price: ([\d.]+),\s*items: \[([^\]]*)\]", bundles_src)
bprice = float(bm.group(1)); items = re.findall(r"'([^']+)'", bm.group(2))
full = sum(products[s]["price"] for s in items)
made["bundle-pixel-vfx-complete"] = render("bundle-pixel-vfx-complete", montage([s for s in vfx if s in items][:4]), "BUNDLE",
                                           f"{len(items)} VFX packs, one price", "Explosions, blood, projectiles, fire and ice spells, plus the 500-effect RPG pack.",
                                           eur(bprice), eur(full), f"-{round(100 * (1 - bprice / full))}%", "Get the bundle")

json.dump({"launch": featured, "variants": sorted(made)}, open(f"{OUT}/variants.json", "w"), indent=1)
for k, v in made.items(): print(k, os.path.getsize(v) // 1024, "KB")
