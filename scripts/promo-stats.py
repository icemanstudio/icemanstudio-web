"""Promo banner stats, local only: reads D1 (promo_events) through wrangler and writes local/promo-stats.html.
Run: python scripts/promo-stats.py [days]   (default 30; opens the page in the browser). Nothing here is deployed."""
import json, subprocess, sys, os, html, datetime, webbrowser

DAYS = next((int(a) for a in sys.argv[1:] if a.isdigit()), 30)
since = int((datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=DAYS)).timestamp())


def q(sql):
    # no stdin (so wrangler can never sit waiting on a prompt), bytes decoded leniently (Windows console codepage), hard timeout
    env = {**os.environ, "CI": "1", "WRANGLER_SEND_METRICS": "false", "NO_COLOR": "1"}
    try:
        r = subprocess.run(f'npx --yes wrangler d1 execute icemanstudio-db --remote --json --command "{sql}"', shell=True,
                           capture_output=True, stdin=subprocess.DEVNULL, env=env, timeout=90)
    except subprocess.TimeoutExpired:
        sys.exit("wrangler did not answer in 90 s. Check your connection (WARP on?) and run `npx wrangler whoami`.")
    out = r.stdout.decode("utf-8", "replace")
    try:
        return json.loads(out[out.index("["):])[0]["results"]
    except (ValueError, KeyError, IndexError):
        sys.exit("wrangler failed: " + (out + r.stderr.decode("utf-8", "replace"))[-1500:])


W = f"WHERE ts >= {since}"
agg = "SUM(kind='view') AS views, SUM(kind='click') AS clicks"
by_src = q(f"SELECT src AS k, {agg} FROM promo_events {W} GROUP BY src ORDER BY clicks DESC, views DESC")
by_var = q(f"SELECT variant AS k, {agg} FROM promo_events {W} GROUP BY variant ORDER BY clicks DESC, views DESC")
by_day = q(f"SELECT date(ts,'unixepoch') AS k, {agg} FROM promo_events {W} GROUP BY k ORDER BY k")
by_cty = q(f"SELECT COALESCE(NULLIF(country,''),'?') AS k, {agg} FROM promo_events {W} GROUP BY k ORDER BY clicks DESC, views DESC LIMIT 15")
by_ref = q(f"SELECT COALESCE(NULLIF(referer,''),'(none)') AS k, {agg} FROM promo_events {W} GROUP BY k ORDER BY clicks DESC, views DESC LIMIT 20")
last = q(f"SELECT datetime(ts,'unixepoch') AS t, kind, src, variant, country, referer FROM promo_events {W} ORDER BY id DESC LIMIT 25")

tv = sum(r["views"] or 0 for r in by_src); tc = sum(r["clicks"] or 0 for r in by_src)
ctr = lambda v, c: f"{100 * c / v:.1f} %" if v else "–"
e = lambda s: html.escape(str(s if s is not None else ""))


def table(title, rows, label):
    mx = max([r["views"] or 0 for r in rows] + [1])
    body = "".join(
        f"<tr><td>{e(r['k'])}</td><td class=n>{r['views'] or 0}</td><td class=n>{r['clicks'] or 0}</td><td class=n>{ctr(r['views'] or 0, r['clicks'] or 0)}</td>"
        f"<td class=bar><span style='width:{100 * (r['views'] or 0) / mx:.0f}%'></span></td></tr>" for r in rows) or "<tr><td colspan=5 class=muted>No data yet</td></tr>"
    return f"<section><h2>{title}</h2><table><tr><th>{label}</th><th class=n>Views</th><th class=n>Clicks</th><th class=n>CTR</th><th></th></tr>{body}</table></section>"


days_html = ""
if by_day:
    mx = max(max(r["views"] or 0, r["clicks"] or 0) for r in by_day) or 1
    days_html = "<section><h2>Per day</h2><div class=days>" + "".join(
        f"<div class=day title='{e(r['k'])}: {r['views'] or 0} views, {r['clicks'] or 0} clicks'>"
        f"<i style='height:{100 * (r['views'] or 0) / mx:.0f}%'></i><b style='height:{100 * (r['clicks'] or 0) / mx:.0f}%'></b><small>{e(r['k'][5:])}</small></div>"
        for r in by_day) + "</div><p class=muted>Grey: views · Coral: clicks</p></section>"

last_html = "".join(f"<tr><td>{e(r['t'])}</td><td>{e(r['kind'])}</td><td>{e(r['src'])}</td><td>{e(r['variant'])}</td><td>{e(r['country'])}</td><td class=ref>{e(r['referer'])}</td></tr>" for r in last)

page = f"""<!doctype html><html lang=en><meta charset=utf-8><title>Banner stats</title>
<meta name=viewport content="width=device-width,initial-scale=1">
<style>
:root{{--bg:#131313;--bg2:#1b1b1b;--line:#2a2a2a;--text:#F8FAFC;--muted:#9AA3AD;--acc:#FF7A59}}
body{{margin:0;background:var(--bg);color:var(--text);font:14px/1.5 Inter,"Segoe UI",Arial,sans-serif;padding:28px 16px}}
main{{max-width:980px;margin:auto}} h1{{font-size:26px;font-weight:900;margin:0 0 4px}} h2{{font-size:16px;margin:0 0 10px}}
.muted{{color:var(--muted)}} section{{background:var(--bg2);border:1px solid var(--line);border-radius:6px;padding:16px;margin:16px 0;overflow-x:auto}}
.kpis{{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0}} .kpi{{background:var(--bg2);border:1px solid var(--line);border-radius:6px;padding:14px}}
.kpi b{{display:block;font-size:30px;font-weight:900}} .kpi.acc b{{color:var(--acc)}}
table{{width:100%;border-collapse:collapse}} th,td{{text-align:left;padding:6px 8px;border-bottom:1px solid var(--line);white-space:nowrap}} th{{color:var(--muted);font-weight:600}}
.n{{text-align:right;font-variant-numeric:tabular-nums}} .bar{{width:30%}} .bar span{{display:block;height:8px;background:var(--acc);border-radius:6px;opacity:.8}}
.ref{{max-width:320px;overflow:hidden;text-overflow:ellipsis}}
.days{{display:flex;gap:4px;align-items:flex-end;height:140px;padding-bottom:18px}} .day{{flex:1;position:relative;height:100%;display:flex;align-items:flex-end;gap:1px}}
.day i{{flex:1;background:#3a3a3a;border-radius:3px 3px 0 0}} .day b{{flex:1;background:var(--acc);border-radius:3px 3px 0 0}}
.day small{{position:absolute;bottom:-18px;left:0;right:0;text-align:center;font-size:10px;color:var(--muted)}}
</style><main>
<h1>Banner stats</h1><p class=muted>Last {DAYS} days · generated {datetime.datetime.now():%Y-%m-%d %H:%M} · local file, not published</p>
<div class=kpis><div class=kpi><span class=muted>Views</span><b>{tv}</b></div><div class=kpi><span class=muted>Clicks</span><b>{tc}</b></div><div class="kpi acc"><span class=muted>CTR</span><b>{ctr(tv, tc)}</b></div></div>
{days_html}
{table("By source (src)", by_src, "Source")}
{table("By banner", by_var, "Banner")}
{table("By country", by_cty, "Country")}
{table("By referring page", by_ref, "Referer")}
<section><h2>Latest events</h2><table><tr><th>Time (UTC)</th><th>Kind</th><th>Source</th><th>Banner</th><th>Country</th><th>Referer</th></tr>{last_html}</table></section>
</main></html>"""

os.makedirs("local", exist_ok=True)
out = os.path.abspath("local/promo-stats.html")
open(out, "w", encoding="utf-8").write(page)
print(out)
if "--no-open" not in sys.argv: webbrowser.open("file:///" + out.replace("\\", "/"))
