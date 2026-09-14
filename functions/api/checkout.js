// Direct card checkout via Stripe Checkout. Not active until STRIPE_SECRET_KEY is set in Cloudflare and
// products carry a `stripePrice` in src/data/products.js. Until then it answers 501 and the page falls back to itch.io.
//
// Setup (later): 1) create each product + price in Stripe (EUR, one-time); 2) paste Price IDs into products.js;
// 3) set secrets STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in the Worker; 4) enable Stripe Tax; 5) the webhook
// (functions/api/stripe-webhook.js) emails the download link on checkout.session.completed.
import { bySlug } from '../../src/data/products.js';

export async function onRequestPost({ request, env }) {
  const data = await request.formData();
  const slug = String(data.get('slug') || '');
  const lang = String(data.get('lang') || 'en') === 'es' ? 'es' : 'en';
  const p = bySlug[slug];
  if (!p || !p.stripePrice || !env.STRIPE_SECRET_KEY) return new Response('checkout not configured', { status: 501 });
  const origin = new URL(request.url).origin;
  const base = lang === 'es' ? '/es' : '';
  const body = new URLSearchParams({
    mode: 'payment',
    'line_items[0][price]': p.stripePrice,
    'line_items[0][quantity]': '1',
    'automatic_tax[enabled]': 'true',
    allow_promotion_codes: 'true',
    locale: lang,
    success_url: `${origin}${base}/assets/${slug}/?paid=1`,
    cancel_url: `${origin}${base}/assets/${slug}/`,
    'metadata[slug]': slug
  });
  const r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!r.ok) return new Response('stripe error', { status: 502 });
  const session = await r.json();
  return Response.redirect(session.url, 303);
}
