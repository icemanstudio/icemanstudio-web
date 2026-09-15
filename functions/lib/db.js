// D1 helpers: sessions, login tokens, users, orders.
const now = () => Math.floor(Date.now() / 1000);
export const rand = (bytes = 32) => { const a = new Uint8Array(bytes); crypto.getRandomValues(a); return [...a].map((b) => b.toString(16).padStart(2, '0')).join(''); };
export const normEmail = (e) => String(e || '').trim().toLowerCase();
export const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 200;

export function cookie(req) {
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)ims_session=([a-f0-9]{64})/);
  return m ? m[1] : null;
}
export const setCookie = (token, days = 30) => `ims_session=${token}; Path=/; Max-Age=${days * 86400}; HttpOnly; Secure; SameSite=Lax`;
export const clearCookie = () => 'ims_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax';

export async function currentUser(env, req) {
  const t = cookie(req); if (!t) return null;
  const s = await env.DB.prepare('SELECT email, expires FROM sessions WHERE token = ?').bind(t).first();
  if (!s || s.expires < now()) return null;
  let u = await env.DB.prepare('SELECT email, name, lang, created FROM users WHERE email = ?').bind(s.email).first();
  if (!u) { u = { email: s.email, name: '', lang: 'en', created: now() }; await env.DB.prepare('INSERT OR IGNORE INTO users (email, name, lang, created) VALUES (?, ?, ?, ?)').bind(u.email, '', 'en', u.created).run(); }
  return u;
}

export async function createSession(env, email) {
  const token = rand(32);
  await env.DB.prepare('INSERT INTO sessions (token, email, expires) VALUES (?, ?, ?)').bind(token, email, now() + 30 * 86400).run();
  return token;
}

export async function destroySession(env, req) {
  const t = cookie(req); if (t) await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(t).run();
}

/** Creates a login/change-email token. Throttled: max 5 per email per 15 minutes. */
export async function createLoginToken(env, { email, purpose, newEmail = '', lang = 'en' }) {
  const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM login_tokens WHERE email = ? AND created > ?').bind(email, now() - 900).first();
  if (recent && recent.n >= 5) return null;
  const token = rand(32);
  await env.DB.prepare('INSERT INTO login_tokens (token, email, purpose, new_email, lang, expires, created) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(token, email, purpose, newEmail, lang, now() + 900, now()).run();
  return token;
}

export async function consumeLoginToken(env, token) {
  if (!/^[a-f0-9]{64}$/.test(token || '')) return null;
  const t = await env.DB.prepare('SELECT * FROM login_tokens WHERE token = ?').bind(token).first();
  await env.DB.prepare('DELETE FROM login_tokens WHERE token = ? OR expires < ?').bind(token, now()).run();
  if (!t || t.expires < now()) return null;
  return t;
}

export async function ordersFor(env, email) {
  const r = await env.DB.prepare('SELECT id, slug, items, amount, currency, livemode, created FROM orders WHERE email = ? ORDER BY created DESC').bind(email).all();
  return r.results || [];
}

export async function recordOrder(env, s) {
  const email = normEmail(s.customer_details?.email || s.customer_email);
  const meta = s.metadata || {};
  const items = meta.slug?.startsWith('bundle:') ? (meta.items || '') : (meta.slug || '');
  await env.DB.prepare('INSERT OR IGNORE INTO orders (id, email, slug, items, amount, currency, livemode, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(s.id, email, meta.slug || '', items, s.amount_total || 0, s.currency || 'eur', s.livemode ? 1 : 0, s.created || now()).run();
  await env.DB.prepare('INSERT OR IGNORE INTO users (email, name, lang, created) VALUES (?, ?, ?, ?)').bind(email, s.customer_details?.name || '', (s.locale || 'en').startsWith('es') ? 'es' : 'en', now()).run();
}

export async function changeEmail(env, oldEmail, newEmail) {
  await env.DB.batch([
    env.DB.prepare('UPDATE OR REPLACE users SET email = ? WHERE email = ?').bind(newEmail, oldEmail),
    env.DB.prepare('UPDATE orders SET email = ? WHERE email = ?').bind(newEmail, oldEmail),
    env.DB.prepare('UPDATE sessions SET email = ? WHERE email = ?').bind(newEmail, oldEmail)
  ]);
}

export async function deleteAccount(env, email) {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE email = ?').bind(email),
    env.DB.prepare('DELETE FROM login_tokens WHERE email = ?').bind(email),
    env.DB.prepare('DELETE FROM users WHERE email = ?').bind(email),
    env.DB.prepare("UPDATE orders SET email = 'deleted' WHERE email = ?").bind(email)
  ]);
}
