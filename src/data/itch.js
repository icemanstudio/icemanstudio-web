const U = 'https://icemaan.itch.io/';

export const itch = {
  store: U,
  soon: {
    title: { en: 'Coming soon', es: 'Próximamente' },
    lead: { en: 'Next up: Spaghetti as a standalone app.', es: 'Lo próximo: Spaghetti como aplicación independiente.' },
    items: [
      { name: 'Spaghetti Studio', sub: 'Standalone node-based texture editor · includes Spaghetti for Aseprite', price: '€15',
        en: 'A tiny Substance Designer for pixel art, as a standalone Windows app: build seamless textures and PBR materials from nodes, preview them in 3D and export to any engine at up to 4096×4096. Buying Studio includes the Aseprite extension.',
        es: 'Un Substance Designer pequeño para pixel art, como aplicación independiente para Windows: construye texturas sin costuras y materiales PBR con nodos, previsualízalos en 3D y expórtalos a cualquier motor hasta 4096×4096. Al comprar Studio, la extensión de Aseprite va incluida.' }
    ]
  },
  groups: [
    {
      id: 'aseprite',
      title: { en: 'Aseprite extensions', es: 'Extensiones para Aseprite' },
      lead: {
        en: 'Tools that add particle systems, vector drawing and automatic inbetweens to Aseprite. Sold on itch.io; lifetime updates.',
        es: 'Herramientas que añaden partículas, dibujo vectorial e intercalados automáticos a Aseprite. A la venta en itch.io; actualizaciones de por vida.'
      },
      items: [
        { name: 'Tallboy', sub: 'Isometric buildings with interiors', price: 'Free', url: U + 'tallboy-pixel-art-buildings-with-interiors', img: '/itch/tallboy-pixel-art-buildings-with-interiors.gif',
          en: 'A browser tool that models and bakes isometric pixel art buildings, rooms included.', es: 'Una herramienta de navegador que modela y hornea edificios isométricos en pixel art, con habitaciones.' },
        { name: 'FastFX', sub: 'Full particle system for Aseprite', price: '€11.99', url: U + 'fastfx-full-particle-system-for-aseprite', img: '/itch/fastfx-full-particle-system-for-aseprite.gif',
          en: 'Build looping particle animations with a live preview and bake them straight into your sprite frames. Presets for fire, smoke, sparks, rain and magic.',
          es: 'Crea animaciones de partículas en bucle con vista previa en vivo y hornéalas directamente en los frames del sprite. Presets de fuego, humo, chispas, lluvia y magia.' },
        { name: 'Spaghetti', sub: 'Node-based textures', price: '€7.99', url: U + 'spaghetti-node-based-textures-for-aseprite', img: '/itch/spaghetti-node-based-textures-for-aseprite.gif',
          en: 'Node graph textures for pixel art, over 200 nodes.', es: 'Texturas por nodos para pixel art, más de 200 nodos.' },
        { name: 'VeSprite', sub: 'Vector drawing for pixel art', price: '€5.99', url: U + 'vesprite-vector-drawing-for-pixel-art-inside-aseprite', img: '/itch/vesprite-vector-drawing-for-pixel-art-inside-aseprite.gif',
          en: 'Draw with bezier tools and get pixels back. Layers, blend modes, and gradients that dither to Bayer or blue noise.',
          es: 'Dibuja con curvas bézier y obtén píxeles. Capas, modos de fusión y degradados con dithering Bayer o blue noise.' },
        { name: 'GhostFrames', sub: 'Automatic inbetweens', price: '€9.97', url: U + 'ghostframe-aseprite-extension', img: '/itch/ghostframe-aseprite-extension.png',
          en: 'Pose estimation for pixel artists: automatic inbetween frames for Aseprite animations.',
          es: 'Estimación de pose para pixel artists: frames intermedios automáticos para animaciones en Aseprite.' },
        { name: 'FastFX Lite', sub: 'Free particle system', price: 'Free', url: U + 'lite-fastfx-full-particle-system-for-aseprite', img: '/itch/lite-fastfx-full-particle-system-for-aseprite.gif',
          en: 'The free version of FastFX. Try the workflow before buying the full presets and export options.',
          es: 'La versión gratuita de FastFX. Prueba el flujo de trabajo antes de comprar los presets y exportaciones completas.' },
        { name: 'Easy Interpolations', sub: 'Free tweening', price: 'Free', url: U + 'free-easy-interpolations-for-aseprite', img: '/itch/free-easy-interpolations-for-aseprite.gif',
          en: 'Generates inbetween frames: tween position, opacity, crossfade, rotation and scale.',
          es: 'Genera frames intermedios: posición, opacidad, fundido, rotación y escala.' }
      ]
    },
    {
      id: 'vfx',
      title: { en: 'Pixel art VFX packs', es: 'Packs de VFX en pixel art' },
      lead: {
        en: 'Animated effects for 2D games: PNG frames, GIFs and spritesheets, ready for any engine.',
        es: 'Efectos animados para juegos 2D: frames PNG, GIFs y spritesheets, listos para cualquier motor.'
      },
      items: [
        { name: '500 Pixel Art Effects', sub: 'RPG VFX mega pack', price: '€11.99', url: U + '500-rpg-vfx', img: '/itch/500-rpg-vfx.png',
          en: '500 animated effects for RPGs: fire, magic, hits, status, UI.', es: '500 efectos animados para RPG: fuego, magia, impactos, estados, UI.' },
        { name: 'Epic Explosions', sub: 'Stylized blasts', price: '€3.99', url: U + 'epic-explosions-pixel-vfx', img: '/itch/epic-explosions-pixel-vfx.gif',
          en: 'Stylized explosions for pixel art games.', es: 'Explosiones estilizadas para juegos en pixel art.' },
        { name: 'Blood Impacts', sub: 'Melee, ranged and gore', price: '€3.99', url: U + 'blood-impacts-vfx-pixel', img: '/itch/blood-impacts-vfx-pixel.gif',
          en: 'Blood hits for melee, ranged and gore.', es: 'Impactos de sangre para cuerpo a cuerpo, a distancia y gore.' },
        { name: 'Projectiles and Hits', sub: '25 + 25 effects', price: '€3.99', url: U + 'pixel-projectile-effects-and-hits', img: '/itch/pixel-projectile-effects-and-hits.gif',
          en: '25 projectiles and 25 matching hit effects.', es: '25 proyectiles y 25 impactos a juego.' },
        { name: '50 Fire Mage Spells', sub: '32×32 at 12 fps', price: '€3.99', url: U + '50-vfx-fire-mage-spells', img: '/itch/50-vfx-fire-mage-spells.gif',
          en: '50 fire spells: bolts, breaths, beams, casts, hits and status.', es: '50 hechizos de fuego: proyectiles, alientos, rayos, conjuros, impactos y estados.' },
        { name: '50 Ice and Frost Mage Spells', sub: '32×32 at 12 fps', price: '€3.99', url: U + 'ice-and-frost-mage', img: '/itch/ice-and-frost-mage.gif',
          en: '50 ice and frost spells: bolts, shatters, wards, breaths, pillars and weather.', es: '50 hechizos de hielo: proyectiles, roturas, escudos, alientos, pilares y clima.' },
        { name: 'Pixel VFX Essentials', sub: '150 effects, 32×32', price: 'Free', url: U + 'pixel-vfx-essentials', img: '/itch/pixel-vfx-essentials.gif',
          en: '150 animated effects on a 32×32 grid, all free.', es: '150 efectos animados en rejilla de 32×32, todos gratis.' },
        { name: '150 One-Bit VFX', sub: 'White on transparent', price: 'Free', url: U + 'pixel-vfx-1-bit-150-free-white-pixel-art-effects', img: '/itch/pixel-vfx-1-bit-150-free-white-pixel-art-effects.gif',
          en: '150 one-bit effects, 32×32 at 12 fps.', es: '150 efectos de un bit, 32×32 a 12 fps.' },
        { name: '160 Pixel Art Effects', sub: 'Free RPG sampler', price: 'Free', url: U + 'free-500-pixel-art-effects', img: '/itch/free-500-pixel-art-effects.png',
          en: 'A free selection from the 500-effect pack.', es: 'Una selección gratuita del pack de 500 efectos.' }
      ]
    },
    {
      id: 'more',
      title: { en: 'Tilesets and low-poly 3D', es: 'Tilesets y 3D low poly' },
      lead: { en: 'Smaller packs from the same workshop.', es: 'Packs más pequeños del mismo taller.' },
      items: [
        { name: 'Extended Dungeon Tileset', sub: 'Free', price: 'Free', url: U + 'extended-dungeon-tileset', img: '/itch/extended-dungeon-tileset.gif',
          en: 'A full tileset for extended dungeons with autotiles.', es: 'Tileset completo para mazmorras extensas con autotiles.' },
        { name: '11 Modular Big Swords', sub: 'Low poly, 8 textures', price: '€3.00', url: U + '11-modular-big-swords', img: '/itch/11-modular-big-swords.png',
          en: 'Modular two-handed swords with thousands of combinations.', es: 'Espadas a dos manos modulares con miles de combinaciones.' },
        { name: '11 Modular One-Hand Swords', sub: 'Low poly, 8 textures', price: '€3.00', url: U + '11-modular-swords', img: '/itch/11-modular-swords.gif',
          en: 'Modular one-handed swords with thousands of combinations.', es: 'Espadas a una mano modulares con miles de combinaciones.' },
        { name: 'Free Low Poly Cars', sub: 'Body kits, rims, spoilers', price: 'Free', url: U + 'free-low-poly-car-3-body-kits-4-rims', img: '/itch/free-low-poly-car-3-body-kits-4-rims.gif',
          en: 'Three free low-poly cars with interchangeable parts.', es: 'Tres coches low poly gratuitos con piezas intercambiables.' }
      ]
    }
  ]
};
