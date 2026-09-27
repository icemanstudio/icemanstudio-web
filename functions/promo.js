// Promo banner for other sites (itch.io pages, forums, READMEs):
//   <a href="https://icemanstudio.com/go?src=itch"><img src="https://icemanstudio.com/promo.gif?src=itch" width="630" height="250"></a>
// Each request picks the banner for today: launch week of the featured product > seasonal sale > VFX bundle.
// Views and clicks are counted in D1 (promo_events). Banners are rendered by scripts/make-promo.py.
import { products } from '../src/data/products.js';
import { home } from '../src/data/home.js';
import { activeOffers, offerFor } from '../src/data/offers.js';
import variants from '../public/promo/variants.json';

function pick(now = new Date()) {
  const f = products.find((p) => p.slug === home.featured);
  const o = f && offerFor(f, now);
  if (o && o.id === 'launch' && variants.variants.includes(`launch-${f.slug}`)) return { v: `launch-${f.slug}`, to: `/assets/${f.slug}/` };
  const sale = activeOffers(now).filter((x) => x.id !== 'launch' && variants.variants.includes(`sale-${x.id}`)).sort((a, b) => b.percent - a.percent)[0];
  if (sale) return { v: `sale-${sale.id}`, to: '/assets/' };
  return { v: 'bundle-pixel-vfx-complete', to: '/assets/bundle/pixel-vfx-complete/' };
}

const src = (url) => (url.searchParams.get('src') || 'direct').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32) || 'direct';

function log(env, ctx, kind, source, variant, request) {
  if (!env.DB) return;
  const country = (request.cf && request.cf.country) || '';
  ctx.waitUntil(env.DB.prepare('INSERT INTO promo_events (ts, kind, src, variant, country) VALUES (?, ?, ?, ?, ?)')
    .bind(Math.floor(Date.now() / 1000), kind, source, variant, country).run().catch(() => {}));
}

export async function promoImage({ request, env, ctx }) {
  const url = new URL(request.url);
  const { v } = pick();
  log(env, ctx, 'view', src(url), v, request);
  const r = await env.ASSETS.fetch(new URL(`/promo/${v}.gif`, url));
  return new Response(r.body, { headers: { 'Content-Type': 'image/gif', 'Cache-Control': 'public, max-age=900', 'Access-Control-Allow-Origin': '*' } });
}

export async function promoClick({ request, env, ctx }) {
  const url = new URL(request.url);
  const { v, to } = pick();
  const s = src(url);
  log(env, ctx, 'click', s, v, request);
  const dest = new URL(to, url);
  dest.searchParams.set('ref', s);
  return Response.redirect(dest.toString(), 302);
}
