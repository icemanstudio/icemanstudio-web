// Product catalogue. Prices here are the source of truth for the store (EUR).
// Long descriptions and gallery come from src/data/itch-import.json (run scripts/import-itch.py to refresh).
// Stripe: fill `stripePrice` with the Price ID (price_...) once products exist in Stripe. Empty = direct checkout not available yet.
import imported from './itch-import.json';

const cats = {
  aseprite: { en: 'Aseprite extensions', es: 'Extensiones para Aseprite' },
  vfx: { en: 'Pixel art VFX', es: 'VFX en pixel art' },
  tileset: { en: 'Tilesets', es: 'Tilesets' },
  lowpoly: { en: 'Low-poly 3D', es: '3D low poly' },
  engine: { en: 'Engine systems (Frost)', es: 'Sistemas para motores (Frost)' }
};

const raw = [
  { slug: 'fastfx-full-particle-system-for-aseprite', name: 'FastFX', cat: 'aseprite', price: 11.99, stripePrice: '',
    sub: { en: 'Full particle system for Aseprite', es: 'Sistema de partículas completo para Aseprite' },
    short: { en: 'Build looping particle animations with a live preview and bake them straight into your sprite frames.', es: 'Crea animaciones de partículas en bucle con vista previa en vivo y hornéalas directamente en los frames del sprite.' } },
  { slug: 'vesprite-vector-drawing-for-pixel-art-inside-aseprite', name: 'VeSprite', cat: 'aseprite', price: 5.99, stripePrice: '',
    sub: { en: 'Vector drawing for pixel art, inside Aseprite', es: 'Dibujo vectorial para pixel art, dentro de Aseprite' },
    short: { en: 'Draw with bezier tools and get pixels back. Layers, blend modes, gradients that dither to Bayer or blue noise.', es: 'Dibuja con curvas bézier y obtén píxeles. Capas, modos de fusión y degradados con dithering Bayer o blue noise.' } },
  { slug: 'ghostframe-aseprite-extension', name: 'GhostFrames', cat: 'aseprite', price: 9.97, stripePrice: '',
    sub: { en: 'Automatic inbetweens for Aseprite', es: 'Intercalados automáticos para Aseprite' },
    short: { en: 'Pose estimation for pixel artists: automatic inbetween frames for Aseprite animations.', es: 'Estimación de pose para pixel artists: frames intermedios automáticos para animaciones en Aseprite.' } },
  { slug: 'lite-fastfx-full-particle-system-for-aseprite', name: 'FastFX Lite', cat: 'aseprite', price: 0, stripePrice: '',
    sub: { en: 'Free particle system for Aseprite', es: 'Sistema de partículas gratuito para Aseprite' },
    short: { en: 'The free version of FastFX. Try the workflow before buying the full presets and export options.', es: 'La versión gratuita de FastFX. Prueba el flujo de trabajo antes de comprar los presets y exportaciones completas.' } },
  { slug: 'free-easy-interpolations-for-aseprite', name: 'Easy Interpolations', cat: 'aseprite', price: 0, stripePrice: '',
    sub: { en: 'Free tweening for Aseprite', es: 'Interpolaciones gratuitas para Aseprite' },
    short: { en: 'Generates inbetween frames: tween position, opacity, crossfade, rotation and scale.', es: 'Genera frames intermedios: posición, opacidad, fundido, rotación y escala.' } },
  { slug: '500-rpg-vfx', name: '500 Pixel Art Effects', cat: 'vfx', price: 11.99, stripePrice: '',
    sub: { en: 'RPG VFX mega pack', es: 'Mega pack de VFX para RPG' },
    short: { en: '500 animated effects for RPGs: fire, magic, hits, status, UI. PNG frames, GIFs and spritesheets.', es: '500 efectos animados para RPG: fuego, magia, impactos, estados, UI. Frames PNG, GIFs y spritesheets.' } },
  { slug: 'epic-explosions-pixel-vfx', name: 'Epic Explosions', cat: 'vfx', price: 3.99, stripePrice: '',
    sub: { en: 'Stylized blasts for pixel art games', es: 'Explosiones estilizadas para juegos en pixel art' },
    short: { en: '25 explosions in five categories, four formats each, plus the editable FastFX presets.', es: '25 explosiones en cinco categorías, cuatro formatos cada una, más los presets editables de FastFX.' } },
  { slug: 'blood-impacts-vfx-pixel', name: 'Blood Impacts', cat: 'vfx', price: 3.99, stripePrice: '',
    sub: { en: 'Blood hits for melee, ranged and gore', es: 'Impactos de sangre para cuerpo a cuerpo, a distancia y gore' },
    short: { en: 'Blood hits for melee, ranged and gore, in GIF, spritesheet and PNG frames.', es: 'Impactos de sangre para cuerpo a cuerpo, a distancia y gore, en GIF, spritesheet y frames PNG.' } },
  { slug: 'pixel-projectile-effects-and-hits', name: 'Projectiles and Hits', cat: 'vfx', price: 3.99, stripePrice: '',
    sub: { en: '25 projectiles and 25 matching hits', es: '25 proyectiles y 25 impactos a juego' },
    short: { en: '25 projectiles, each with its own hit effect.', es: '25 proyectiles, cada uno con su efecto de impacto.' } },
  { slug: 'pixel-vfx-essentials', name: 'Pixel VFX Essentials', cat: 'vfx', price: 0, stripePrice: '',
    sub: { en: '150 free effects, 32×32', es: '150 efectos gratuitos, 32×32' },
    short: { en: '150 animated pixel art effects on a 32×32 grid, all free.', es: '150 efectos animados en rejilla de 32×32, todos gratis.' } },
  { slug: 'pixel-vfx-1-bit-150-free-white-pixel-art-effects', name: '150 One-Bit VFX', cat: 'vfx', price: 0, stripePrice: '',
    sub: { en: 'White on transparent, 32×32 at 12 fps', es: 'Blanco sobre transparente, 32×32 a 12 fps' },
    short: { en: '150 one-bit effects, ready to tint in any engine.', es: '150 efectos de un bit, listos para teñir en cualquier motor.' } },
  { slug: 'free-500-pixel-art-effects', name: '160 Pixel Art Effects', cat: 'vfx', price: 0, stripePrice: '',
    sub: { en: 'Free RPG sampler', es: 'Muestra gratuita para RPG' },
    short: { en: 'A free selection from the 500-effect pack: fire, magic, hits, status, UI.', es: 'Una selección gratuita del pack de 500 efectos: fuego, magia, impactos, estados, UI.' } },
  { slug: 'extended-dungeon-tileset', name: 'Extended Dungeon Tileset', cat: 'tileset', price: 0, stripePrice: '',
    sub: { en: 'Free tileset with autotiles', es: 'Tileset gratuito con autotiles' },
    short: { en: 'A full tileset for extended dungeons, with autotile sheet and room preview.', es: 'Tileset completo para mazmorras extensas, con hoja de autotile y vista previa de sala.' } },
  { slug: '11-modular-big-swords', name: '11 Modular Big Swords', cat: 'lowpoly', price: 3.00, stripePrice: '',
    sub: { en: 'Low poly, 8 textures', es: 'Low poly, 8 texturas' },
    short: { en: 'Modular two-handed swords with thousands of combinations.', es: 'Espadas a dos manos modulares con miles de combinaciones.' } },
  { slug: '11-modular-swords', name: '11 Modular One-Hand Swords', cat: 'lowpoly', price: 3.00, stripePrice: '',
    sub: { en: 'Low poly, 8 textures', es: 'Low poly, 8 texturas' },
    short: { en: 'Modular one-handed swords with thousands of combinations.', es: 'Espadas a una mano modulares con miles de combinaciones.' } },
  { slug: 'free-low-poly-car-3-body-kits-4-rims', name: 'Free Low Poly Cars', cat: 'lowpoly', price: 0, stripePrice: '',
    sub: { en: 'Body kits, rims, spoilers', es: 'Carrocerías, llantas, alerones' },
    short: { en: 'Free low-poly cars with interchangeable parts.', es: 'Coches low poly gratuitos con piezas intercambiables.' } }
];

export const categories = cats;

export const products = raw.map((p) => {
  const i = imported[p.slug] || {};
  return { ...p, itch: i.url || `https://icemaan.itch.io/${p.slug}`, images: i.images || [], cover: (i.images || [])[0] || `/itch/${p.slug}.png`, html: i.description_html || '' };
});

export const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
