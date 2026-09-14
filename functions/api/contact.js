export async function onRequestPost({ request, env }) {
  const data = await request.formData();
  if (data.get('website')) return new Response('ok', { status: 200 });
  const name = String(data.get('name') || '').slice(0, 200);
  const email = String(data.get('email') || '').slice(0, 200);
  const topic = String(data.get('topic') || '').slice(0, 100);
  const message = String(data.get('message') || '').slice(0, 5000);
  if (!name || !email || !message) return new Response('missing fields', { status: 400 });
  if (!env.RESEND_API_KEY) return new Response('mail not configured', { status: 500 });
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'IceMan Studio <hello@icemanstudio.com>',
      to: [env.CONTACT_TO || 'hello@icemanstudio.com'],
      reply_to: email,
      subject: `[Web] ${topic} · ${name}`,
      text: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`
    })
  });
  return new Response(r.ok ? 'sent' : 'error', { status: r.ok ? 200 : 502 });
}
