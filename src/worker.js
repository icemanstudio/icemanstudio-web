import { onRequestPost as contact } from '../functions/api/contact.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return new Response('method not allowed', { status: 405 });
      return contact({ request, env });
    }
    return env.ASSETS.fetch(request);
  }
};
