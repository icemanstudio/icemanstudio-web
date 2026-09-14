"""Import product pages from icemaan.itch.io into src/data/itch-import.json and public/itch/<slug>/.
Run: python scripts/import-itch.py   (re-run any time a listing changes)"""
import re, json, os, time, html, urllib.request, sys
BASE = "https://icemaan.itch.io/"
SLUGS = json.load(open("scripts/itch-slugs.json"))
UA = {"User-Agent": "Mozilla/5.0"}
def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()
def clean(h):
    h = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S)
    h = re.sub(r'\s(class|style|id|data-[a-z-]+|width|height|loading)="[^"]*"', '', h)
    h = re.sub(r'<(/?)(div|span|section|figure)[^>]*>', '', h)
    h = re.sub(r'\n\s*\n+', '\n', h)
    return h.strip()
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
    price = re.search(r'<span class="dollars">([^<]*)</span>', page)
    price = html.unescape(price.group(1)).strip() if price else ""
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
            ext = ".gif" if data[:3] == b"GIF" else ".png" if data[:4] == b"\x89PNG" else ".jpg"
            fn = f"{i:02d}{ext}"; open(f"{d}/{fn}", "wb").write(data)
            local = f"/itch/{slug}/{fn}"; imgs.append(local)
            desc_html = desc_html.replace(src, local)
        except Exception as e:
            print("  img err", src[:60], e)
    out[slug] = {"title": title, "short": short, "price": price, "url": url, "description_html": desc_html, "images": imgs}
    print("ok", slug, "|", price or "free", "|", len(imgs), "imgs |", len(desc_html), "chars")
    time.sleep(1)
json.dump(out, open("src/data/itch-import.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("saved", len(out), "products")
