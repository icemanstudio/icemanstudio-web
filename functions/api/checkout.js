// Direct card checkout via Stripe Checkout with ad-hoc prices.
// The amount comes from src/data/products.js + src/data/offers.js at request time, so a sale is an edit in offers.js.
// Nothing needs to exist in Stripe except the account: no products, no price IDs. Promotion codes created in the
// Stripe dashboard still work (allow_promotion_codes). Requires secret STRIPE_SECRET_KEY in the Worker and
// `stripeEnabled: true` in src/data/config.js (so product pages render the Buy button).
import { bySlug } from '../../src/data/products.js';
import { priceInfo } from '../../src/data/offers.js';
import { bundleBySlug, bundleInfo } from '../../src/data/bundles.js';

const TAX_CODE = 'txcd_10202000'; // Stripe Tax: downloadable software / digital goods

export async function onRequestPost({ request, env }) {
  const data = await request.formData();
  const slug = String(data.get('slug') || '');
  const lang = String(data.get('lang') || 'en') === 'es' ? 'es' : 'en';
  const bundleSlug = String(data.get('bundle') || '');
  if (!env.STRIPE_SECRET_KEY) return new Response('checkout not configured', { status: 501 });
  let p, pi, itemsMeta = '';
  if (bundleSlug) {
    const b = bundleBySlug[bundleSlug]; if (!b) return new Response('unknown bundle', { status: 404 });
    const bi = bundleInfo(b);
    p = { slug: 'bundle:' + b.slug, name: b.name, sub: b.sub, itch: '' }; pi = { final: b.price, free: false, offer: { percent: bi.percent, id: 'bundle' } }; itemsMeta = b.items.join(',');
  } else {
    p = bySlug[slug];
    if (!p) return new Response('unknown product', { status: 404 });
    pi = priceInfo(p);
    if (pi.free) return Response.redirect(p.itch, 303);
  }
  const origin = new URL(request.url).origin;
  const base = lang === 'es' ? '/es' : '';
  const body = new URLSearchParams({
    mode: 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'eur',
    'line_items[0][price_data][unit_amount]': String(Math.round(pi.final * 100)),
    'line_items[0][price_data][tax_behavior]': 'exclusive',
    'line_items[0][price_data][product_data][name]': p.name + (pi.offer && pi.offer.id !== 'bundle' ? ` (-${pi.offer.percent}%)` : ''),
    'line_items[0][price_data][product_data][description]': p.sub[lang],
    'line_items[0][price_data][product_data][tax_code]': TAX_CODE,
    'line_items[0][price_data][product_data][metadata][slug]': p.slug,
    'metadata[items]': itemsMeta,
    'automatic_tax[enabled]': 'true',
    allow_promotion_codes: 'true',
    locale: lang,
    success_url: `${origin}${base}/assets/${bundleSlug ? 'bundle/' + bundleSlug : slug}/?paid=1`,
    cancel_url: `${origin}${base}/assets/${bundleSlug ? 'bundle/' + bundleSlug : slug}/`,
    'metadata[slug]': p.slug,
    'metadata[offer]': pi.offer ? pi.offer.id : ''
  });
  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!r.ok) return new Response('stripe error: ' + (await r.text()).slice(0, 300), { status: 502 });
  const session = await r.json();
  return Response.redirect(session.url, 303);
}
