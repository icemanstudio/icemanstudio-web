// Stripe webhook: on checkout.session.completed, email the customer signed download links for every file of every
// product in the order (a bundle expands to its items). Links are valid for 30 days and can be re-issued on request.
// Secrets: STRIPE_WEBHOOK_SECRET (from the Stripe webhook endpoint), DOWNLOAD_SECRET (random, signs the links),
// RESEND_API_KEY (email). Files live in R2 (binding FILES); the key list is src/data/files.json.
import files from '../../src/data/files.json';
import { bySlug } from '../../src/data/products.js';
import { bundleBySlug } from '../../src/data/bundles.js';
import { sign, verifyStripe } from '../lib/sign.js';

const DAYS = 30;

export async function onRequestPost({ request, env }) {
  const raw = await request.text();
  if (!env.STRIPE_WEBHOOK_SECRET || !(await verifyStripe(raw, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET))) return new Response('bad signature', { status: 400 });
  const event = JSON.parse(raw);
  if (event.type !== 'checkout.session.completed') return new Response('ignored', { status: 200 });
  const s = event.data.object;
  if (s.payment_status !== 'paid') return new Response('not paid', { status: 200 });
  const email = s.customer_details?.email || s.customer_email;
  const lang = (s.locale || 'en').startsWith('es') ? 'es' : 'en';
  const meta = s.metadata || {};
  const slugs = meta.slug?.startsWith('bundle:') ? (meta.items || '').split(',').filter(Boolean) : [meta.slug].filter(Boolean);
  const exp = Math.floor(Date.now() / 1000) + DAYS * 86400;
  const origin = 'https://icemanstudio.com';
  const groups = [];
  for (const slug of slugs) {
    const p = bySlug[slug]; const list = files[slug] || [];
    const links = [];
    for (const f of list) {
      const token = await sign({ k: f.key, e: exp, m: email, o: s.id }, env.DOWNLOAD_SECRET);
      links.push({ name: f.name, url: `${origin}/dl/${token}`, size: f.size });
    }
    groups.push({ name: p?.name || slug, links });
  }
  const title = meta.slug?.startsWith('bundle:') ? (bundleBySlug[meta.slug.slice(7)]?.name || 'Bundle') : (bySlug[meta.slug]?.name || 'Order');
  const T = lang === 'es'
    ? { subject: `Tu descarga de ${title} · IceMan Studio`, hi: 'Gracias por tu compra.', intro: 'Aquí tienes tus archivos. Los enlaces funcionan durante 30 días; si caducan, escríbenos y te enviamos otros.', missing: 'Este producto se entregará por correo en breve.', bye: 'Cualquier duda, responde a este correo.', size: 'MB' }
    : { subject: `Your ${title} download · IceMan Studio`, hi: 'Thanks for your purchase.', intro: 'Here are your files. Links work for 30 days; if they expire, reply and we will send new ones.', missing: 'This product will be delivered by email shortly.', bye: 'Any question, just reply to this email.', size: 'MB' };
  const html = `<div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:560px;color:#131313"><h2 style="margin:0 0 8px">${T.hi}</h2><p>${T.intro}</p>` +
    groups.map((g) => `<h3 style="margin:18px 0 6px">${g.name}</h3>` + (g.links.length ? '<ul style="padding-left:18px">' + g.links.map((l) => `<li><a href="${l.url}">${l.name}</a> <span style="color:#777">(${(l.size / 1048576).toFixed(1)} ${T.size})</span></li>`).join('') + '</ul>' : `<p style="color:#777">${T.missing}</p>`)).join('') +
    `<p style="margin-top:22px">${T.bye}<br>IceMan Studio · icemanstudio.com</p></div>`;
  const text = `${T.hi}\n${T.intro}\n\n` + groups.map((g) => `${g.name}\n` + (g.links.length ? g.links.map((l) => `  ${l.name}: ${l.url}`).join('\n') : `  ${T.missing}`)).join('\n\n') + `\n\n${T.bye}\nIceMan Studio · icemanstudio.com`;
  if (env.RESEND_API_KEY && email) {
    await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'IceMan Studio <hello@icemanstudio.com>', to: [email], bcc: env.CONTACT_TO ? [env.CONTACT_TO] : undefined, reply_to: 'hello@icemanstudio.com', subject: T.subject, html, text }) });
  }
  return new Response('ok', { status: 200 });
}
