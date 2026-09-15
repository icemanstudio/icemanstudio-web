// Product feed for agents and aggregators. Prices are base prices in EUR; live discounts are in /offers.json.
import { org } from '../data/geo.js';
import { products, categories } from '../data/products.js';
import { bundles, bundleInfo } from '../data/bundles.js';
import { config } from '../data/config.js';

export function GET() {
  const U = org.url;
  const items = products.map((p) => ({
    id: p.slug, type: p.cat === 'aseprite' ? 'software_extension' : 'digital_asset', name: p.name, category: categories[p.cat].en,
    description: p.short.en, description_es: p.short.es,
    url: `${U}/assets/${p.slug}/`, url_es: `${U}/es/assets/${p.slug}/`, itch_url: p.itch,
    price: p.price, currency: 'EUR', free: p.price === 0, released: p.released || null,
    image: p.cover ? U + p.cover : null, images: p.images.map((i) => U + i),
    licence: org.license.en, seller: org.name, direct_checkout: config.stripeEnabled && p.price > 0
  }));
  const bundleItems = config.showBundles ? bundles.map((b) => { const bi = bundleInfo(b); return { id: 'bundle:' + b.slug, type: 'bundle', name: b.name, description: b.short.en, url: `${U}/assets/bundle/${b.slug}/`, price: b.price, currency: 'EUR', items_total: bi.sum, includes: b.items, seller: org.name }; }) : [];
  const body = { seller: { name: org.name, url: U, email: org.email, country: org.country, sameAs: org.sameAs }, updated: new Date().toISOString().slice(0, 10), offers_feed: `${U}/offers.json`, products: items, bundles: bundleItems };
  return new Response(JSON.stringify(body, null, 1), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*' } });
}
