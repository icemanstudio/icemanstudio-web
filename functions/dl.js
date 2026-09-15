// GET /dl/<token>: verify the signed token and stream the file from R2.
import { verify } from './lib/sign.js';

export async function onRequestGet({ request, env }) {
  const token = new URL(request.url).pathname.slice('/dl/'.length);
  const p = env.DOWNLOAD_SECRET ? await verify(token, env.DOWNLOAD_SECRET) : null;
  if (!p || !p.k) return new Response('Invalid link', { status: 403 });
  if (p.e && p.e < Date.now() / 1000) return new Response('This link has expired. Reply to your order email and we will send a new one.', { status: 410 });
  const obj = await env.FILES.get(p.k);
  if (!obj) return new Response('File not found', { status: 404 });
  const name = p.k.split('/').pop();
  const h = new Headers();
  obj.writeHttpMetadata(h);
  h.set('etag', obj.httpEtag);
  h.set('Content-Disposition', `attachment; filename="${name.replace(/"/g, '')}"`);
  h.set('Content-Type', h.get('Content-Type') || 'application/octet-stream');
  h.set('Cache-Control', 'private, no-store');
  return new Response(obj.body, { headers: h });
}
