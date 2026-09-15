// Shared order logic: expand a Checkout Session into product groups with signed download links.
import files from '../../src/data/files.json';
import { bySlug } from '../../src/data/products.js';
import { bundleBySlug } from '../../src/data/bundles.js';
import { sign } from './sign.js';

export const LINK_DAYS = 30;
const ORIGIN = 'https://icemanstudio.com';

export function orderTitle(session) {
  const slug = session.metadata?.slug || '';
  return slug.startsWith('bundle:') ? (bundleBySlug[slug.slice(7)]?.name || 'Bundle') : (bySlug[slug]?.name || 'Order');
}

export async function orderGroups(session, secret) {
  const meta = session.metadata || {};
  const slugs = meta.slug?.startsWith('bundle:') ? (meta.items || '').split(',').filter(Boolean) : [meta.slug].filter(Boolean);
  const email = session.customer_details?.email || session.customer_email || '';
  const exp = Math.floor(Date.now() / 1000) + LINK_DAYS * 86400;
  const groups = [];
  for (const slug of slugs) {
    const p = bySlug[slug]; const list = files[slug] || [];
    const links = [];
    for (const f of list) links.push({ name: f.name, size: f.size, url: `${ORIGIN}/dl/${await sign({ k: f.key, e: exp, m: email, o: session.id }, secret)}` });
    groups.push({ slug, name: p?.name || slug, links });
  }
  return { groups, email, exp };
}

export const strings = {
  en: { thanks: 'Thanks for your purchase.', intro: 'Your files are ready. Links work for 30 days; your library keeps them available for good.', mailed: 'A copy of these links has been emailed to', missing: 'This product will be delivered by email shortly.', bye: 'Any question, just reply to the order email.', back: 'Back to the store', title: 'Your download', unpaid: 'This payment has not been completed.', invalid: 'We could not find this order. If you paid, reply to your order email or write to hello@icemanstudio.com.' },
  es: { thanks: 'Gracias por tu compra.', intro: 'Tus archivos están listos. Los enlaces funcionan durante 30 días; en tu biblioteca los tienes siempre.', mailed: 'Te hemos enviado una copia de estos enlaces a', missing: 'Este producto se entregará por correo en breve.', bye: 'Cualquier duda, responde al correo del pedido.', back: 'Volver a la tienda', title: 'Tu descarga', unpaid: 'Este pago no se ha completado.', invalid: 'No encontramos este pedido. Si has pagado, responde al correo del pedido o escribe a hola@icemanstudio.com.' }
};

export const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
