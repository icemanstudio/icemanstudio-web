import { onRequestPost as contact } from '../functions/api/contact.js';
import { onRequestPost as checkout } from '../functions/api/checkout.js';
import { onRequestPost as webhook } from '../functions/api/stripe-webhook.js';
import { onRequestGet as download } from '../functions/dl.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/') && url.pathname.endsWith('/')) url.pathname = url.pathname.replace(/\/+$/, '');
    if (url.pathname.startsWith('/dl/')) return request.method === 'GET' ? download({ request, env }) : new Response('method not allowed', { status: 405 });
    if (url.pathname === '/api/stripe-webhook') return request.method === 'POST' ? webhook({ request, env }) : new Response('ok', { status: 200 });
    if (url.pathname.startsWith('/api/') && request.method !== 'POST') {
      // A direct visit (back button, reload, typed URL): send people to the store instead of an error page.
      return Response.redirect(`${url.origin}/assets/`, 302);
    }
    if (url.pathname === '/api/contact') return contact({ request, env });
    if (url.pathname === '/api/checkout') return checkout({ request, env });
    return env.ASSETS.fetch(request);
  }
};
