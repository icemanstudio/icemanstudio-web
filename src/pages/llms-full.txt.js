import { org, faq } from '../data/geo.js';
import { products, categories } from '../data/products.js';
import { bundles, bundleInfo } from '../data/bundles.js';
import { config } from '../data/config.js';

const strip = (h) => h.replace(/<img[^>]*>/g, '').replace(/<(br|p|h[1-6]|li|ul|ol|div)[^>]*>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\n{3,}/g, '\n\n').trim();

export function GET() {
  const U = org.url;
  const out = [`# ${org.name}: full catalogue`, '', org.summary.en, '', `Contact: ${org.email}. Store: ${U}/assets/ · itch.io: ${org.sameAs[0]}`, ''];
  for (const c of ['aseprite', 'vfx', 'tileset', 'lowpoly']) {
    out.push(`## ${categories[c].en}`, '');
    for (const p of products.filter((x) => x.cat === c)) {
      out.push(`### ${p.name} (${p.sub.en})`, '', `URL: ${U}/assets/${p.slug}/`, `Price: ${p.price > 0 ? `€${p.price.toFixed(2)}` : 'Free'} · itch.io: ${p.itch}`, '', p.short.en, '', strip(p.html), '');
    }
  }
  if (config.showBundles) { out.push('## Bundles', ''); for (const b of bundles) { const bi = bundleInfo(b); out.push(`### ${b.name}`, '', `URL: ${U}/assets/bundle/${b.slug}/`, `Price: €${b.price.toFixed(2)} (items separately: €${bi.sum.toFixed(2)})`, `Includes: ${bi.items.map((i) => i.name).join(', ')}`, '', b.short.en, ''); } }
  out.push('## Licence', '', org.license.en, '', '## FAQ', '', ...faq.en.flatMap((f) => [`**${f.q}**`, f.a, '']));
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
