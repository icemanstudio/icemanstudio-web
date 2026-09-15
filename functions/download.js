// GET /download/?session_id=cs_... (and /es/download/): verify the Checkout Session with Stripe and render the
// download page with signed links. The email sent by the webhook is the backup copy.
import { orderGroups, orderTitle, strings, mb } from './lib/order.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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
      (email ? `<p class="muted">${T.mailed} <strong>${esc(email)}</strong>. ${T.bye}</p>` : `<p class="muted">${T.bye}</p>`);
  }
  const base = lang === 'es' ? '/es' : '';
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${T.title} · IceMan Studio</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
<style>body{margin:0;background:#131313;color:#F8FAFC;font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.55}.wrap{max-width:760px;margin:0 auto;padding:28px 20px 60px}header{display:flex;justify-content:space-between;align-items:center;margin-bottom:36px}header img{height:40px}header a{color:#FFB199;text-decoration:none;font-size:14px}h1{font-size:32px;margin:0 0 8px;font-weight:900}.lead{color:#9AA3AD;font-size:17px;margin:0 0 24px}.card{background:#181818;border:1px solid #2a2a2a;border-radius:6px;padding:20px 22px;margin-bottom:16px}.card h2{margin:0 0 12px;font-size:20px}ul{list-style:none;padding:0;margin:0;display:grid;gap:10px}li{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.btn{display:inline-block;background:#FF7A59;color:#0e0e0e;font-weight:700;padding:10px 16px;border-radius:6px;text-decoration:none;transition:transform 120ms cubic-bezier(.34,1.56,.64,1)}.btn:hover{background:#FFB199}.btn:active{transform:scale(.94)}.muted{color:#9AA3AD;font-size:14px}</style></head>
<body><div class="wrap"><header><a href="${base}/"><img src="/brand/logo-header.svg" alt="IceMan Studio"></a><a href="${base}/assets/">${T.back} →</a></header>${body}</div></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store' } });
}
