// Offers and discounts. Edit this file to launch a sale; push; the site rebuilds.
// Fields: id, name (en/es), percent, from/until (ISO dates, inclusive, UTC), products ('all' | 'cat:<category>' | [slugs]), code (optional Stripe promotion code, shown on the product page).
// Stripe: when direct checkout is live, the same percent must exist as a Coupon in Stripe; `code` is the customer-facing promotion code.

export const offers = [
  // Example (inactive, dated in the past):
  { id: 'launch-2026', name: { en: 'Launch week', es: 'Semana de lanzamiento' }, percent: 25, from: '2026-09-01', until: '2026-09-07', products: 'cat:aseprite', code: '' }
];

export function activeOffers(now = new Date()) {
  const d = now.toISOString().slice(0, 10);
  return offers.filter((o) => o.from <= d && d <= o.until);
}

export function offerFor(product, now = new Date()) {
  return activeOffers(now)
    .filter((o) => o.products === 'all' || (typeof o.products === 'string' && o.products === `cat:${product.cat}`) || (Array.isArray(o.products) && o.products.includes(product.slug)))
    .sort((a, b) => b.percent - a.percent)[0] || null;
}

export function priceInfo(product, now = new Date()) {
  const o = product.price > 0 ? offerFor(product, now) : null;
  const final = o ? Math.round(product.price * (100 - o.percent)) / 100 : product.price;
  return { base: product.price, final, offer: o, free: product.price === 0 };
}

export const fmt = (n, lang = 'en') => new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' }).format(n);
