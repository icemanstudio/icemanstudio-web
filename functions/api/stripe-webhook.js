// Stripe webhook: on checkout.session.completed, email the customer signed download links for every file of every
// product in the order (a bundle expands to its items). Links are valid for 30 days and can be re-issued on request.
// Secrets: STRIPE_WEBHOOK_SECRET (from the Stripe webhook endpoint), DOWNLOAD_SECRET (random, signs the links),
// RESEND_API_KEY (email). Files live in R2 (binding FILES); the key list is src/data/files.json.
import { verifyStripe } from '../lib/sign.js';
import { orderGroups, orderTitle, mb } from '../lib/order.js';
import { recordOrder, createLoginToken, normEmail } from '../lib/db.js';

export async function onRequestPost({ request, env }) {
  const raw = await request.text();
  if (!env.STRIPE_WEBHOOK_SECRET || !(await verifyStripe(raw, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET))) return new Response('bad signature', { status: 400 });
  const event = JSON.parse(raw);
  if (event.type !== 'checkout.session.completed') return new Response('ignored', { status: 200 });
  const s = event.data.object;
  if (s.payment_status !== 'paid') return new Response('not paid', { status: 200 });
  const lang = (s.locale || 'en').startsWith('es') ? 'es' : 'en';
  if (env.DB) { try { await recordOrder(env, s); } catch (e) { console.log('order record failed', e); } }
  const { groups, email } = await orderGroups(s, env.DOWNLOAD_SECRET);
  const title = orderTitle(s);
  const page = `https://icemanstudio.com${lang === 'es' ? '/es' : ''}/download/?session_id=${s.id}`;
  let libraryLink = `https://icemanstudio.com${lang === 'es' ? '/es' : ''}/account/`;
  if (env.DB && email) { try { const tok = await createLoginToken(env, { email: normEmail(email), purpose: 'login', lang, ttl: 7 * 86400 }); if (tok) libraryLink = `https://icemanstudio.com/auth/verify?token=${tok}`; } catch (e) { console.log('login token failed', e); } }
  const T = lang === 'es'
    ? { subject: `Tu descarga de ${title} · IceMan Studio`, hi: 'Gracias por tu compra.', intro: 'Aquí tienes tus archivos. Los enlaces funcionan durante 30 días; si caducan, escríbenos y te enviamos otros.', missing: 'Este producto se entregará por correo en breve.', bye: 'Cualquier duda, responde a este correo.', size: 'MB' }
    : { subject: `Your ${title} download · IceMan Studio`, hi: 'Thanks for your purchase.', intro: 'Here are your files. Links work for 30 days; if they expire, reply and we will send new ones.', missing: 'This product will be delivered by email shortly.', bye: 'Any question, just reply to this email.', size: 'MB' };
  const html = `<div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:560px;color:#131313"><h2 style="margin:0 0 8px">${T.hi}</h2><p>${T.intro}</p>` +
    groups.map((g) => `<h3 style="margin:18px 0 6px">${g.name}</h3>` + (g.links.length ? '<ul style="padding-left:18px">' + g.links.map((l) => `<li><a href="${l.url}">${l.name}</a> <span style="color:#777">(${mb(l.size)})</span></li>`).join('') + '</ul>' : `<p style="color:#777">${T.missing}</p>`)).join('') +
    `<p style="margin-top:18px"><a href="${libraryLink}" style="display:inline-block;background:#FF7A59;color:#0e0e0e;font-weight:700;padding:10px 16px;border-radius:6px;text-decoration:none">${lang === 'es' ? 'Entrar en mi biblioteca' : 'Open my library'}</a></p><p style="color:#777;font-size:13px">${lang === 'es' ? 'Tu cuenta ya existe con este correo, sin contraseña. Este botón te deja dentro durante 7 días; después, pide un enlace nuevo en icemanstudio.com/account. En la biblioteca puedes descargar tus compras siempre.' : 'Your account already exists with this email, no password needed. This button signs you in for 7 days; after that, request a new link at icemanstudio.com/account. Your library lets you download your purchases at any time.'}</p><p><a href="${page}">${lang === 'es' ? 'Página de descarga del pedido' : 'Order download page'}</a></p><p style="margin-top:22px">${T.bye}<br>IceMan Studio · icemanstudio.com</p></div>`;
  const text = `${T.hi}\n${T.intro}\n\n` + groups.map((g) => `${g.name}\n` + (g.links.length ? g.links.map((l) => `  ${l.name}: ${l.url}`).join('\n') : `  ${T.missing}`)).join('\n\n') + `\n\n${lang === 'es' ? 'Página de descarga' : 'Download page'}: ${page}\n\n${T.bye}\nIceMan Studio · icemanstudio.com`;
  if (env.RESEND_API_KEY && email) {
    await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'IceMan Studio <hello@icemanstudio.com>', to: [email], bcc: env.CONTACT_TO ? [env.CONTACT_TO] : undefined, reply_to: 'hello@icemanstudio.com', subject: T.subject, html, text }) });
  }
  return new Response('ok', { status: 200 });
}
