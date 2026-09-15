import { onRequestPost as contact } from '../functions/api/contact.js';
import { onRequestPost as checkout } from '../functions/api/checkout.js';
import { onRequestPost as webhook } from '../functions/api/stripe-webhook.js';
import { onRequestGet as download } from '../functions/dl.js';
import { onRequestGet as downloadPage } from '../functions/download.js';
import { accountPage, authRequest, authVerify, authLogout, accountName, accountEmail, accountDelete } from '../functions/account.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/') && url.pathname.endsWith('/')) url.pathname = url.pathname.replace(/\/+$/, '');
    if (/^\/(es\/)?download\/?$/.test(url.pathname)) return downloadPage({ request, env });
    if (/^\/(es\/)?account\/?$/.test(url.pathname)) return accountPage({ request, env });
    if (url.pathname === '/auth/verify') return authVerify({ request, env });
    if (request.method === 'POST') {
      if (url.pathname === '/api/auth/request') return authRequest({ request, env });
      if (url.pathname === '/api/auth/logout') return authLogout({ request, env });
      if (url.pathname === '/api/account/name') return accountName({ request, env });
      if (url.pathname === '/api/account/email') return accountEmail({ request, env });
      if (url.pathname === '/api/account/delete') return accountDelete({ request, env });
    }
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
