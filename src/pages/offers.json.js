// Live offer rules + product prices for the browser: public/offers.js re-evaluates them with the current date,
// so seasons, jams and launch weeks start and end without a rebuild. The worker does the same at checkout.
import { offers } from '../data/offers.js';
import { products } from '../data/products.js';
export function GET() {
  const body = { offers, products: products.filter((p) => p.price > 0).map((p) => ({ slug: p.slug, cat: p.cat, price: p.price, released: p.released || '' })) };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600' } });
}
