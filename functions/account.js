// Accounts without passwords: email + magic link. Library of purchases, profile (name, email), delete account.
import files from '../src/data/files.json';
import { bySlug } from '../src/data/products.js';
import { bundleBySlug } from '../src/data/bundles.js';
import { sign } from './lib/sign.js';
import { shell, esc } from './lib/page.js';
import { currentUser, createSession, destroySession, createLoginToken, consumeLoginToken, ordersFor, changeEmail, deleteAccount, setCookie, clearCookie, normEmail, validEmail } from './lib/db.js';

const ORIGIN = 'https://icemanstudio.com';
const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
const S = {
  en: { account: 'My account', loginTitle: 'Sign in', loginLead: 'No password. Enter the email you used to buy and we will send you a sign-in link. Your library lists every purchase made with that email, including past ones.', email: 'Email', send: 'Send me a link', sentTitle: 'Check your email', sentLead: 'We sent a sign-in link to', sentNote: 'It works for 15 minutes. If it does not arrive, check spam or try again.', tooMany: 'Too many requests for this email. Try again in 15 minutes.', badEmail: 'That email does not look right.', badLink: 'This link is invalid or has expired. Request a new one.', library: 'Your library', empty: 'No purchases yet with this email. If you bought with another email, sign in with that one, or change your email below.', bought: 'Bought', download: 'Download', missing: 'Files for this product will be added shortly.', profile: 'Profile', name: 'Display name', save: 'Save', saved: 'Saved.', changeEmail: 'Change email', newEmail: 'New email', changeNote: 'We will send a confirmation link to the new address. Your purchases move with you.', changeSent: 'Confirmation link sent to the new email. Open it to complete the change.', logout: 'Sign out', deleteTitle: 'Delete account', deleteNote: 'Deletes your profile and sign-in access. Order records are kept without your email, as required for accounting, and you lose access to the library.', deleteConfirm: 'Type DELETE to confirm', deleteBtn: 'Delete my account', deleted: 'Your account has been deleted.', signedInAs: 'Signed in as', store: 'Store', subject: 'Your sign-in link · IceMan Studio', mailHi: 'Hi,', mailBody: 'Click to sign in to your IceMan Studio library. The link works for 15 minutes.', mailBtn: 'Sign in', mailIgnore: 'If you did not request this, ignore this email.', subjectChange: 'Confirm your new email · IceMan Studio', mailChange: 'Click to confirm this as the new email for your IceMan Studio account.', mailChangeBtn: 'Confirm email' },
  es: { account: 'Mi cuenta', loginTitle: 'Entrar', loginLead: 'Sin contraseña. Escribe el correo con el que compraste y te enviamos un enlace de acceso. Tu biblioteca muestra todas las compras hechas con ese correo, también las anteriores.', email: 'Correo', send: 'Enviarme el enlace', sentTitle: 'Revisa tu correo', sentLead: 'Hemos enviado un enlace de acceso a', sentNote: 'Vale durante 15 minutos. Si no llega, mira en spam o vuelve a pedirlo.', tooMany: 'Demasiadas solicitudes para este correo. Prueba en 15 minutos.', badEmail: 'Ese correo no parece válido.', badLink: 'Este enlace no es válido o ha caducado. Pide uno nuevo.', library: 'Tu biblioteca', empty: 'Todavía no hay compras con este correo. Si compraste con otro, entra con ese, o cambia tu correo más abajo.', bought: 'Comprado', download: 'Descargar', missing: 'Los archivos de este producto se añadirán en breve.', profile: 'Perfil', name: 'Nombre para mostrar', save: 'Guardar', saved: 'Guardado.', changeEmail: 'Cambiar correo', newEmail: 'Correo nuevo', changeNote: 'Enviaremos un enlace de confirmación a la nueva dirección. Tus compras se mueven contigo.', changeSent: 'Enlace de confirmación enviado al correo nuevo. Ábrelo para completar el cambio.', logout: 'Salir', deleteTitle: 'Eliminar cuenta', deleteNote: 'Elimina tu perfil y el acceso. Los registros de pedido se conservan sin tu correo, como exige la contabilidad, y pierdes el acceso a la biblioteca.', deleteConfirm: 'Escribe ELIMINAR para confirmar', deleteBtn: 'Eliminar mi cuenta', deleted: 'Tu cuenta ha sido eliminada.', signedInAs: 'Has entrado como', store: 'Tienda', subject: 'Tu enlace de acceso · IceMan Studio', mailHi: 'Hola,', mailBody: 'Pulsa para entrar en tu biblioteca de IceMan Studio. El enlace vale durante 15 minutos.', mailBtn: 'Entrar', mailIgnore: 'Si no lo has pedido, ignora este correo.', subjectChange: 'Confirma tu nuevo correo · IceMan Studio', mailChange: 'Pulsa para confirmar este correo como el nuevo de tu cuenta de IceMan Studio.', mailChangeBtn: 'Confirmar correo' }
};
const langOf = (url) => url.pathname.startsWith('/es/') ? 'es' : 'en';
const baseOf = (lang) => (lang === 'es' ? '/es' : '');
const html = (lang, title, body, extra = {}) => new Response(shell({ lang, title, body }), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', ...(extra.headers || {}) }, status: extra.status || 200 });
const sameOrigin = (req) => { const o = req.headers.get('origin'); return !o || o === ORIGIN || o === 'https://www.icemanstudio.com'; };

async function sendMail(env, to, subject, heading, body, btn, link, ignore) {
  if (!env.RESEND_API_KEY) return;
  const h = `<div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:520px;color:#131313"><p>${heading}</p><p>${body}</p><p><a href="${link}" style="display:inline-block;background:#FF7A59;color:#0e0e0e;font-weight:700;padding:10px 16px;border-radius:6px;text-decoration:none">${btn}</a></p><p style="color:#777;font-size:13px">${ignore}<br>IceMan Studio · icemanstudio.com</p></div>`;
  await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'IceMan Studio <hello@icemanstudio.com>', to: [to], subject, html: h, text: `${heading}\n${body}\n${link}\n\n${ignore}` }) });
}

// ---------- pages ----------
export async function accountPage({ request, env }) {
  const url = new URL(request.url); const lang = langOf(url); const T = S[lang]; const base = baseOf(lang);
  const flash = url.searchParams.get('m') || '';
  const user = await currentUser(env, request);
  if (!user) {
    return html(lang, T.loginTitle, `<h1>${T.loginTitle}</h1><p class="lead">${T.loginLead}</p>${flash === 'badlink' ? `<p class="card" style="border-color:#FF7A59">${T.badLink}</p>` : ''}${flash === 'deleted' ? `<p class="card ok">${T.deleted}</p>` : ''}
      <form method="post" action="/api/auth/request" class="card"><input type="hidden" name="lang" value="${lang}"><label>${T.email}<input type="email" name="email" required autocomplete="email"></label><div><button class="btn" type="submit">${T.send}</button></div></form>`);
  }
  const orders = await ordersFor(env, user.email);
  const exp = Math.floor(Date.now() / 1000) + 86400;
  const seen = new Set(); const blocks = [];
  for (const o of orders) {
    const slugs = (o.items || '').split(',').filter(Boolean);
    const title = o.slug?.startsWith('bundle:') ? (bundleBySlug[o.slug.slice(7)]?.name || 'Bundle') : '';
    for (const slug of slugs) {
      if (seen.has(slug)) continue; seen.add(slug);
      const p = bySlug[slug]; const list = files[slug] || [];
      const links = [];
      for (const f of list) links.push(`<li><a class="btn" href="${ORIGIN}/dl/${await sign({ k: f.key, e: exp, m: user.email, o: o.id }, env.DOWNLOAD_SECRET)}">⬇ ${esc(f.name)}</a><span class="muted">${mb(f.size)}</span></li>`);
      blocks.push(`<section class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">${esc(p?.name || slug)}</h2><span class="tag">${T.bought} ${new Date(o.created * 1000).toISOString().slice(0, 10)}${title ? ` · ${esc(title)}` : ''}</span></div>${p ? `<p class="muted" style="margin:6px 0 12px">${esc(p.sub[lang])} · <a href="${base}/assets/${slug}/" style="color:#FFB199">${lang === 'es' ? 'ficha' : 'product page'}</a></p>` : ''}${links.length ? `<ul>${links.join('')}</ul>` : `<p class="muted">${T.missing}</p>`}</section>`);
    }
  }
  const msg = { saved: T.saved, changesent: T.changeSent, toomany: T.tooMany, bademail: T.badEmail, badlink: T.badLink }[flash];
  const body = `<h1>${T.library}</h1><p class="lead">${T.signedInAs} <strong>${esc(user.email)}</strong>${user.name ? ` (${esc(user.name)})` : ''} · <form method="post" action="/api/auth/logout" style="display:inline"><button class="btn ghost" type="submit" style="padding:4px 10px;font-size:13px">${T.logout}</button></form></p>
    ${msg ? `<p class="card ${flash === 'saved' || flash === 'changesent' ? 'ok' : ''}">${msg}</p>` : ''}
    ${blocks.length ? blocks.join('') : `<p class="card muted">${T.empty} <a href="${base}/assets/" style="color:#FFB199">${T.store} →</a></p>`}
    <h2 style="margin-top:32px">${T.profile}</h2>
    <form method="post" action="/api/account/name" class="card"><input type="hidden" name="lang" value="${lang}"><label>${T.name}<input name="name" maxlength="80" value="${esc(user.name)}"></label><div><button class="btn" type="submit">${T.save}</button></div></form>
    <form method="post" action="/api/account/email" class="card"><input type="hidden" name="lang" value="${lang}"><h2>${T.changeEmail}</h2><p class="muted" style="margin:0 0 6px">${T.changeNote}</p><label>${T.newEmail}<input type="email" name="email" required></label><div><button class="btn ghost" type="submit">${T.changeEmail}</button></div></form>
    <form method="post" action="/api/account/delete" class="card"><input type="hidden" name="lang" value="${lang}"><h2>${T.deleteTitle}</h2><p class="muted" style="margin:0 0 6px">${T.deleteNote}</p><label>${T.deleteConfirm}<input name="confirm" required autocomplete="off"></label><div><button class="btn danger" type="submit">${T.deleteBtn}</button></div></form>`;
  return html(lang, T.account, body);
}

// ---------- actions ----------
export async function authRequest({ request, env }) {
  const d = await request.formData(); const lang = d.get('lang') === 'es' ? 'es' : 'en'; const T = S[lang]; const base = baseOf(lang);
  const email = normEmail(d.get('email'));
  if (!validEmail(email)) return Response.redirect(`${ORIGIN}${base}/account/?m=bademail`, 303);
  const token = await createLoginToken(env, { email, purpose: 'login', lang });
  if (!token) return html(lang, T.loginTitle, `<h1>${T.loginTitle}</h1><p class="card" style="border-color:#FF7A59">${T.tooMany}</p>`, { status: 429 });
  await sendMail(env, email, T.subject, T.mailHi, T.mailBody, T.mailBtn, `${ORIGIN}/auth/verify?token=${token}`, T.mailIgnore);
  return html(lang, T.sentTitle, `<h1>${T.sentTitle}</h1><p class="lead">${T.sentLead} <strong>${esc(email)}</strong>.</p><p class="muted">${T.sentNote}</p>`);
}

export async function authVerify({ request, env }) {
  const url = new URL(request.url);
  const t = await consumeLoginToken(env, url.searchParams.get('token'));
  if (!t) return Response.redirect(`${ORIGIN}/account/?m=badlink`, 303);
  const base = baseOf(t.lang);
  let email = t.email;
  if (t.purpose === 'change-email' && t.new_email) { await changeEmail(env, t.email, t.new_email); email = t.new_email; }
  else await env.DB.prepare('INSERT OR IGNORE INTO users (email, name, lang, created) VALUES (?, ?, ?, ?)').bind(email, '', t.lang, Math.floor(Date.now() / 1000)).run();
  const session = await createSession(env, email);
  return new Response(null, { status: 303, headers: { Location: `${ORIGIN}${base}/account/${t.purpose === 'change-email' ? '?m=saved' : ''}`, 'Set-Cookie': setCookie(session) } });
}

export async function authLogout({ request, env }) {
  await destroySession(env, request);
  const lang = new URL(request.url).searchParams.get('lang') === 'es' ? 'es' : 'en';
  return new Response(null, { status: 303, headers: { Location: `${ORIGIN}${baseOf(lang)}/account/`, 'Set-Cookie': clearCookie() } });
}

export async function accountName({ request, env }) {
  if (!sameOrigin(request)) return new Response('forbidden', { status: 403 });
  const user = await currentUser(env, request); if (!user) return Response.redirect(`${ORIGIN}/account/`, 303);
  const d = await request.formData(); const lang = d.get('lang') === 'es' ? 'es' : 'en';
  const name = String(d.get('name') || '').trim().slice(0, 80);
  await env.DB.prepare('UPDATE users SET name = ?, lang = ? WHERE email = ?').bind(name, lang, user.email).run();
  return Response.redirect(`${ORIGIN}${baseOf(lang)}/account/?m=saved`, 303);
}

export async function accountEmail({ request, env }) {
  if (!sameOrigin(request)) return new Response('forbidden', { status: 403 });
  const user = await currentUser(env, request); if (!user) return Response.redirect(`${ORIGIN}/account/`, 303);
  const d = await request.formData(); const lang = d.get('lang') === 'es' ? 'es' : 'en'; const T = S[lang]; const base = baseOf(lang);
  const newEmail = normEmail(d.get('email'));
  if (!validEmail(newEmail) || newEmail === user.email) return Response.redirect(`${ORIGIN}${base}/account/?m=bademail`, 303);
  const token = await createLoginToken(env, { email: user.email, purpose: 'change-email', newEmail, lang });
  if (!token) return Response.redirect(`${ORIGIN}${base}/account/?m=toomany`, 303);
  await sendMail(env, newEmail, T.subjectChange, T.mailHi, T.mailChange, T.mailChangeBtn, `${ORIGIN}/auth/verify?token=${token}`, T.mailIgnore);
  return Response.redirect(`${ORIGIN}${base}/account/?m=changesent`, 303);
}

export async function accountDelete({ request, env }) {
  if (!sameOrigin(request)) return new Response('forbidden', { status: 403 });
  const user = await currentUser(env, request); if (!user) return Response.redirect(`${ORIGIN}/account/`, 303);
  const d = await request.formData(); const lang = d.get('lang') === 'es' ? 'es' : 'en'; const base = baseOf(lang);
  const c = String(d.get('confirm') || '').trim().toUpperCase();
  if (c !== 'DELETE' && c !== 'ELIMINAR') return Response.redirect(`${ORIGIN}${base}/account/`, 303);
  await deleteAccount(env, user.email);
  return new Response(null, { status: 303, headers: { Location: `${ORIGIN}${base}/account/?m=deleted`, 'Set-Cookie': clearCookie() } });
}
