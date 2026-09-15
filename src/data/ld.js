// JSON-LD builders (schema.org) for product, bundle and FAQ pages.
import { org, faq } from './geo.js';
import { categories } from './products.js';
import { priceInfo } from './offers.js';
import { bundleInfo } from './bundles.js';
import { config } from './config.js';

const U = org.url;
const seller = { '@type': 'Organization', '@id': `${U}/#org`, name: org.name };

export function productLd(p, lang = 'en') {
  const base = lang === 'es' ? '/es' : '';
  const url = `${U}${base}/assets/${p.slug}/`;
  const pi = priceInfo(p);
  const isExt = p.cat === 'aseprite';
  const offer = { '@type': 'Offer', url, priceCurrency: 'EUR', price: pi.final.toFixed(2), availability: 'https://schema.org/InStock', seller, itemCondition: 'https://schema.org/NewCondition' };
  if (pi.offer && pi.until) offer.priceValidUntil = pi.until;
  const item = {
    '@type': isExt ? 'SoftwareApplication' : 'Product', '@id': `${url}#product`, name: p.name, description: `${p.sub[lang]}. ${p.short[lang]}`,
    image: p.images.map((i) => U + i), url, brand: { '@type': 'Brand', name: org.name }, category: categories[p.cat][lang], offers: offer,
    ...(isExt ? { applicationCategory: 'DesignApplication', operatingSystem: 'Windows, macOS, Linux (Aseprite)', softwareRequirements: 'Aseprite' } : {}),
    ...(p.price === 0 ? { isAccessibleForFree: true } : {})
  };
  const crumbs = { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: lang === 'es' ? 'Tienda' : 'Store', item: `${U}${base}/assets/` },
    { '@type': 'ListItem', position: 2, name: categories[p.cat][lang], item: `${U}${base}/assets/#${p.cat}` },
    { '@type': 'ListItem', position: 3, name: p.name, item: url }
  ] };
  return { '@context': 'https://schema.org', '@graph': [item, crumbs] };
}

export function bundleLd(b, lang = 'en') {
  const base = lang === 'es' ? '/es' : '';
  const url = `${U}${base}/assets/bundle/${b.slug}/`;
  const bi = bundleInfo(b);
  return { '@context': 'https://schema.org', '@type': 'Product', '@id': `${url}#product`, name: b.name, description: b.short[lang], url, brand: { '@type': 'Brand', name: org.name },
    image: bi.items.map((i) => U + i.cover), isRelatedTo: bi.items.map((i) => ({ '@type': 'Product', name: i.name, url: `${U}${base}/assets/${i.slug}/` })),
    offers: { '@type': 'Offer', url, priceCurrency: 'EUR', price: b.price.toFixed(2), availability: config.stripeEnabled ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder', seller } };
}

export function faqLd(lang = 'en') {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq[lang].map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
}
