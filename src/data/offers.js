// Offers and discounts. Three kinds, all evaluated at the moment of viewing (browser) and of paying (worker),
// so they start and end on their own without a rebuild.
//
//   range   one-off:  { kind: 'range',  from: 'YYYY-MM-DD', until: 'YYYY-MM-DD' }        (inclusive, UTC)
//   season  yearly:   { kind: 'season', start: 'MM-DD', end: 'MM-DD' }                     (wraps over new year if end < start)
//   launch  automatic:{ kind: 'launch', days: 7 }  → applies to any product whose `released` date is within `days`
//
// Common fields: id, name {en, es}, percent, products ('all' | 'cat:<category>' | [slugs]), code (optional Stripe promo code to show).
// When several apply to a product, the highest percent wins (they do not stack).

export const offers = [
  // ---- automatic launch discount for every new product ----
  { id: 'launch', kind: 'launch', days: 7, percent: 25, products: 'all', name: { en: 'Launch week', es: 'Semana de lanzamiento' } },

  // ---- seasons (every year) ----
  { id: 'spring', kind: 'season', start: '03-20', end: '03-27', percent: 20, products: 'all', name: { en: 'Spring sale', es: 'Rebajas de primavera' } },
  { id: 'summer', kind: 'season', start: '06-25', end: '07-09', percent: 25, products: 'all', name: { en: 'Summer sale', es: 'Rebajas de verano' } },
  { id: 'autumn', kind: 'season', start: '09-22', end: '09-29', percent: 20, products: 'all', name: { en: 'Autumn sale', es: 'Rebajas de otoño' } },
  { id: 'halloween', kind: 'season', start: '10-25', end: '11-01', percent: 30, products: 'cat:vfx', name: { en: 'Halloween', es: 'Halloween' } },
  { id: 'blackfriday', kind: 'blackfriday', percent: 30, products: 'all', name: { en: 'Black Friday', es: 'Black Friday' } }, // 4th Friday of November through the Monday after
  { id: 'winter', kind: 'season', start: '12-20', end: '01-03', percent: 25, products: 'all', name: { en: 'Winter sale', es: 'Rebajas de invierno' } },

  // ---- game jams (fill dates each year; inactive while empty) ----
  { id: 'ggj', kind: 'range', from: '', until: '', percent: 20, products: 'all', name: { en: 'Global Game Jam', es: 'Global Game Jam' } },
  { id: 'ludum', kind: 'range', from: '', until: '', percent: 20, products: 'all', name: { en: 'Ludum Dare', es: 'Ludum Dare' } },
  { id: 'gmtk', kind: 'range', from: '', until: '', percent: 20, products: 'all', name: { en: 'GMTK Game Jam', es: 'GMTK Game Jam' } }
];

const ymd = (d) => d.toISOString().slice(0, 10);
const md = (d) => ymd(d).slice(5);

function blackFridayWindow(year) {
  // Thanksgiving = 4th Thursday of November; Black Friday = next day; window ends the Monday after (Cyber Monday).
  const nov1 = new Date(Date.UTC(year, 10, 1));
  const firstThu = 1 + ((4 - nov1.getUTCDay() + 7) % 7);
  const bf = new Date(Date.UTC(year, 10, firstThu + 21 + 1));
  const end = new Date(bf); end.setUTCDate(bf.getUTCDate() + 3);
  return { from: ymd(bf), until: ymd(end) };
}

function isActive(o, now, product) {
  const today = ymd(now);
  if (o.kind === 'range') return !!o.from && !!o.until && o.from <= today && today <= o.until;
  if (o.kind === 'season') { const t = md(now); return o.start <= o.end ? (o.start <= t && t <= o.end) : (t >= o.start || t <= o.end); }
  if (o.kind === 'blackfriday') { const w = blackFridayWindow(now.getUTCFullYear()); return w.from <= today && today <= w.until; }
  if (o.kind === 'launch') {
    if (!product || !product.released) return false;
    const rel = new Date(product.released + 'T00:00:00Z'); const diff = (now - rel) / 86400000;
    return diff >= 0 && diff < o.days;
  }
  return false;
}

function applies(o, product) {
  if (!product) return true;
  return o.products === 'all' || (typeof o.products === 'string' && o.products === `cat:${product.cat}`) || (Array.isArray(o.products) && o.products.includes(product.slug));
}

/** Offers active right now for the store banner (product-independent kinds only). */
export function activeOffers(now = new Date()) {
  return offers.filter((o) => o.kind !== 'launch' && isActive(o, now));
}

/** End date of an offer for display, if it has one. */
export function offerUntil(o, now = new Date()) {
  if (o.kind === 'range') return o.until;
  if (o.kind === 'season') { const y = now.getUTCFullYear(); const wraps = o.start > o.end && md(now) >= o.start; return `${y + (wraps ? 1 : 0)}-${o.end}`; }
  if (o.kind === 'blackfriday') return blackFridayWindow(now.getUTCFullYear()).until;
  return '';
}

export function offerFor(product, now = new Date()) {
  return offers.filter((o) => applies(o, product) && isActive(o, now, product)).sort((a, b) => b.percent - a.percent)[0] || null;
}

export function priceInfo(product, now = new Date()) {
  const o = product.price > 0 ? offerFor(product, now) : null;
  const final = o ? Math.round(product.price * (100 - o.percent)) / 100 : product.price;
  return { base: product.price, final, offer: o, until: o ? (o.kind === 'launch' ? launchUntil(product, o) : offerUntil(o, now)) : '', free: product.price === 0 };
}

function launchUntil(product, o) { const d = new Date(product.released + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + o.days - 1); return ymd(d); }

export const fmt = (n, lang = 'en') => new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR' }).format(n);
