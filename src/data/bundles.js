// Bundles: several products for one fixed price. Sold only through our checkout (itch has no per-product bundles).
// Add one: an object here. Shown in the store and on /assets/bundle/<slug>/ when config.showBundles is true.
// Percentage offers do NOT apply to bundles unless a bundle slug is listed explicitly in an offer's `products`.
import { bySlug } from './products.js';

export const bundles = [
  { slug: 'aseprite-complete', name: 'Aseprite Complete', price: 21.99,
    items: ['fastfx-full-particle-system-for-aseprite', 'vesprite-vector-drawing-for-pixel-art-inside-aseprite', 'ghostframe-aseprite-extension'],
    sub: { en: 'FastFX + VeSprite + GhostFrames', es: 'FastFX + VeSprite + GhostFrames' },
    short: { en: 'Every IceMan extension for Aseprite in one purchase: particles, vector drawing and automatic inbetweens.', es: 'Todas las extensiones IceMan para Aseprite en una compra: partículas, dibujo vectorial e intercalados automáticos.' } },
  { slug: 'pixel-vfx-complete', name: 'Pixel VFX Complete', price: 17.99,
    items: ['500-rpg-vfx', 'epic-explosions-pixel-vfx', 'blood-impacts-vfx-pixel', 'pixel-projectile-effects-and-hits'],
    sub: { en: '500 effects + Explosions + Blood + Projectiles', es: '500 efectos + Explosiones + Sangre + Proyectiles' },
    short: { en: 'All the paid pixel art VFX packs together: RPG effects, explosions, blood impacts, projectiles and hits.', es: 'Todos los packs de VFX en pixel art de pago juntos: efectos RPG, explosiones, impactos de sangre, proyectiles e impactos.' } }
];

export function bundleInfo(b) {
  const items = b.items.map((s) => bySlug[s]).filter(Boolean);
  const sum = Math.round(items.reduce((a, p) => a + p.price, 0) * 100) / 100;
  const save = Math.round((sum - b.price) * 100) / 100;
  const percent = sum > 0 ? Math.round((save / sum) * 100) : 0;
  return { items, sum, save, percent, cover: items[0]?.cover || '' };
}

export const bundleBySlug = Object.fromEntries(bundles.map((b) => [b.slug, b]));
