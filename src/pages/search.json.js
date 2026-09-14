import { products, categories } from '../data/products.js';
import { priceInfo } from '../data/offers.js';
export function GET() {
  const rows = products.map((p) => {
    const pi = priceInfo(p);
    return { slug: p.slug, name: p.name, cat: p.cat, catName: categories[p.cat], sub: p.sub, short: p.short, cover: p.cover, price: pi.free ? 0 : pi.final };
  });
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' } });
}
