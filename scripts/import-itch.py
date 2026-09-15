"""Import product pages from icemaan.itch.io into src/data/itch-import.json and public/itch/<slug>/.
Downloads: gallery + description images, the itch theme banner (header background) and the cover (og:image).
Run: python scripts/import-itch.py   (re-run any time a listing changes; new slugs get firstSeen = today)"""
import re, json, os, time, html, datetime, urllib.request

BASE = "https://icemaan.itch.io/"
SLUGS = json.load(open("scripts/itch-slugs.json"))
UA = {"User-Agent": "Mozilla/5.0"}
PNG = b"\x89PNG"


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()


def ext_of(data):
    return ".gif" if data[:3] == b"GIF" else ".png" if data[:4] == PNG else ".jpg"


def clean(h):
    h = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S)
    h = re.sub(r'\s(class|style|id|data-[a-z-]+|width|height|loading)="[^"]*"', '', h)
    h = re.sub(r'<(/?)(div|span|section|figure)[^>]*>', '', h)
    h = re.sub(r'\n\s*\n+', '\n', h)
    h = re.split(r'<a href="javascript:void\(0\)">More information', h)[0]
    h = re.sub(r'<svg.*?</svg>', '', h, flags=re.S)
    h = re.sub(r'<table>.*?</table>', '', h, flags=re.S)
    h = re.sub(r'<iframe[^>]*>\s*<a href="([^"]+)">(.*?)</a>\s*</iframe>',
               lambda m: '<p><a class="btn ghost" href="/assets/%s/">%s</a></p>' % (m.group(1).rstrip('/').split('/')[-1], re.sub('<[^>]+>', '', m.group(2)).strip()), h, flags=re.S)
    h = re.sub(r'<iframe.*?</iframe>', '', h, flags=re.S)
    h = re.sub(r'(<p><br></p>\s*){2,}', '<p><br></p>', h)
    h = re.sub(r'<h3>\s*</h3>', '', h)
    return h.strip()


prev = json.load(open("src/data/itch-import.json", encoding="utf-8")) if os.path.exists("src/data/itch-import.json") else {}
out = {}
for slug in SLUGS:
    url = BASE + slug
    try:
        page = get(url).decode("utf-8", "ignore")
    except Exception as e:
        print("ERR", slug, e); continue
    title = re.search(r'<h1 class="game_title">(.*?)</h1>', page, re.S)
    title = html.unescape(re.sub('<[^>]+>', '', title.group(1))).strip() if title else slug
    short = re.search(r'<meta name="description" content="([^"]*)"', page)
    short = html.unescape(short.group(1)) if short else ""
    desc = re.search(r'<div class="formatted_description user_formatted">(.*?)</div>\s*(?:</div>|<div class="game_info_panel_widget|$)', page, re.S)
    desc_html = clean(desc.group(1)) if desc else ""
    shots = re.findall(r'<div class="screenshot_list">(.*?)</div>\s*</div>', page, re.S)
    imgs = []
    srcs = re.findall(r'<a[^>]+href="(https://img\.itch\.zone/[^"]+)"', shots[0]) if shots else []
    srcs += re.findall(r'<img[^>]+src="(https://img\.itch\.zone/[^"]+)"', desc_html)
    d = f"public/itch/{slug}"; os.makedirs(d, exist_ok=True)
    for i, src in enumerate(dict.fromkeys(srcs)):
        try:
            data = get(src)
            fn = f"{i:02d}{ext_of(data)}"; open(f"{d}/{fn}", "wb").write(data)
            local = f"/itch/{slug}/{fn}"; imgs.append(local)
            desc_html = desc_html.replace(src, local)
            desc_html = desc_html.replace(f'<img src="{local}">', f'<img src="{local}" loading="lazy">')
        except Exception as e:
            print("  img err", src[:60], e)
    banner = ""
    hm = re.search(r'<div id="header"[^>]*has_image[^>]*>\s*<img src="([^"]+)"', page)
    if hm:
        try:
            data = get(hm.group(1).strip().strip('"').strip("'"))
            open(f"{d}/banner{ext_of(data)}", "wb").write(data); banner = f"/itch/{slug}/banner{ext_of(data)}"
        except Exception as e:
            print("  banner err", e)
    cover = ""
    om = re.search(r'<meta content="([^"]+)" property="og:image"', page) or re.search(r'property="og:image" content="([^"]+)"', page)
    if om:
        try:
            data = get(om.group(1))
            open(f"{d}/cover{ext_of(data)}", "wb").write(data); cover = f"/itch/{slug}/cover{ext_of(data)}"
        except Exception as e:
            print("  cover err", e)
    out[slug] = {"title": title, "short": short, "url": url, "description_html": desc_html, "images": imgs, "banner": banner, "cover": cover,
                 "firstSeen": (prev[slug].get("firstSeen", "") if slug in prev else (datetime.date.today().isoformat() if prev else ""))}
    print("ok", slug, "|", len(imgs), "imgs |", "banner" if banner else "no banner", "|", "cover" if cover else "no cover")
    time.sleep(1)
json.dump(out, open("src/data/itch-import.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("saved", len(out), "products")
