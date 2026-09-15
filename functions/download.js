// GET /download/?session_id=cs_... (and /es/download/): verify the Checkout Session with Stripe and render the
// download page with signed links. The email sent by the webhook is the backup copy.
import { orderGroups, orderTitle, strings, mb } from './lib/order.js';
import { shell, esc } from './lib/page.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const lang = url.pathname.startsWith('/es/') ? 'es' : 'en';
  const T = strings[lang];
  const id = url.searchParams.get('session_id') || '';
  let session = null;
  if (/^cs_(test|live)_[A-Za-z0-9]+$/.test(id) && env.STRIPE_SECRET_KEY) {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${id}`, { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } });
    if (r.ok) session = await r.json();
  }
  let body;
  if (!session) body = `<h1>${T.title}</h1><p class="lead">${T.invalid}</p>`;
  else if (session.payment_status !== 'paid') body = `<h1>${T.title}</h1><p class="lead">${T.unpaid}</p>`;
  else {
    const { groups, email } = await orderGroups(session, env.DOWNLOAD_SECRET);
    body = `<h1>${T.thanks}</h1><p class="lead">${T.intro}</p>` +
      groups.map((g) => `<section class="card"><h2>${esc(g.name)}</h2>` + (g.links.length
        ? `<ul>${g.links.map((l) => `<li><a class="btn" href="${l.url}">⬇ ${esc(l.name)}</a><span class="muted">${mb(l.size)}</span></li>`).join('')}</ul>`
        : `<p class="muted">${T.missing}</p>`) + `</section>`).join('') +
      (email ? `<p class="muted">${T.mailed} <strong>${esc(email)}</strong>. ${T.bye}</p>` : `<p class="muted">${T.bye}</p>`) +
      `<p class="muted">${lang === 'es' ? 'Tu cuenta se ha creado sola con ese correo: en el correo del pedido tienes el botón para entrar en tu biblioteca y descargar siempre que quieras.' : 'Your account was created automatically with that email: the order email has a button to open your library and download whenever you want.'}</p>`;
  }
  return new Response(shell({ lang, title: T.title, body }), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store' } });
}
