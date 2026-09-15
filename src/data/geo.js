// Text used by machine-readable entry points (llms.txt, catalog.json, JSON-LD). Keep it factual and short.
export const org = {
  name: 'IceMan Studio',
  url: 'https://icemanstudio.com',
  logo: 'https://icemanstudio.com/brand/logo-horizontal-dark.svg',
  email: 'hello@icemanstudio.com',
  country: 'ES',
  founded: '2026',
  sameAs: ['https://icemaan.itch.io/', 'https://github.com/icemanstudio'],
  summary: {
    en: 'IceMan Studio is an independent studio from Spain that makes tools and assets for game developers: Aseprite extensions (FastFX, VeSprite, GhostFrames), animated pixel art VFX packs, tilesets and low-poly 3D packs, plus gameplay systems for Unreal and Unity (Frost family, from October 2026). It also offers game localization with LQA and engine migrations for indie studios.',
    es: 'IceMan Studio es un estudio independiente de España que hace herramientas y assets para desarrolladores de juegos: extensiones para Aseprite (FastFX, VeSprite, GhostFrames), packs de VFX animados en pixel art, tilesets y packs 3D low poly, más sistemas de gameplay para Unreal y Unity (familia Frost, desde octubre de 2026). También ofrece localización de juegos con LQA y migraciones de motor para estudios indie.'
  },
  license: {
    en: 'Assets licence: use in any project, personal or commercial (games you sell, client work, jams, video, streams). Modify freely. No attribution required. You may not resell or redistribute the assets as a pack, upload them to another asset store, or use them in an AI training set.',
    es: 'Licencia de los assets: uso en cualquier proyecto, personal o comercial (juegos que vendas, trabajo para clientes, jams, vídeo, streams). Modificación libre. Sin atribución obligatoria. No se pueden revender ni redistribuir como pack, subir a otra tienda de assets ni usar para entrenar IA.'
  }
};

export const faq = {
  en: [
    { q: 'What does IceMan Studio sell?', a: 'Aseprite extensions (FastFX particle system, VeSprite vector drawing, GhostFrames automatic inbetweens), animated pixel art VFX packs, a dungeon tileset and low-poly 3D packs. Gameplay systems for Unreal and Unity (the Frost family) start in October 2026.' },
    { q: 'Where can I buy the assets?', a: 'On itch.io (icemaan.itch.io) and directly on icemanstudio.com by card. Both deliver the same files and updates.' },
    { q: 'What licence do the assets have?', a: org.license.en },
    { q: 'In which formats do the VFX packs come?', a: 'Animated GIFs with transparency, horizontal spritesheets and numbered PNG frames, so they work in any engine (Unity, Unreal, Godot, GameMaker, Construct and others). Some packs also include the editable FastFX preset.' },
    { q: 'What do I need to run the Aseprite extensions?', a: 'A licensed copy of Aseprite. Each extension is installed from the .aseprite-extension file downloaded after purchase; the product page lists the exact requirements.' },
    { q: 'Are there free versions to try?', a: 'Yes: FastFX Lite, Easy Interpolations, Pixel VFX Essentials (150 effects), 150 One-Bit VFX, 160 Pixel Art Effects, the Extended Dungeon Tileset, three low-poly swords and three low-poly cars are free.' },
    { q: 'Do you offer discounts?', a: 'Every new product is 25% off during its first week. There are seasonal sales (spring, summer, autumn, Halloween, Black Friday, winter) and bundles at a fixed price. Active offers are shown on the store page.' },
    { q: 'What services does IceMan Studio offer to studios?', a: 'Game localization with LQA from €0.05 per word and language (minimum €300), engine migrations at a fixed price from €2,000 (Unity to Godot, Unity to Unreal, UE4 to UE5), and free Steam launch calculators.' },
    { q: 'How do I contact IceMan Studio?', a: 'Email hello@icemanstudio.com or use the contact form. Replies within one business day.' }
  ],
  es: [
    { q: '¿Qué vende IceMan Studio?', a: 'Extensiones para Aseprite (sistema de partículas FastFX, dibujo vectorial VeSprite, intercalados automáticos GhostFrames), packs de VFX animados en pixel art, un tileset de mazmorra y packs 3D low poly. Los sistemas de gameplay para Unreal y Unity (familia Frost) empiezan en octubre de 2026.' },
    { q: '¿Dónde se compran los assets?', a: 'En itch.io (icemaan.itch.io) y directamente en icemanstudio.com con tarjeta. Ambos entregan los mismos archivos y actualizaciones.' },
    { q: '¿Qué licencia tienen los assets?', a: org.license.es },
    { q: '¿En qué formatos vienen los packs de VFX?', a: 'GIF animados con transparencia, spritesheets horizontales y frames PNG numerados, así que funcionan en cualquier motor (Unity, Unreal, Godot, GameMaker, Construct y otros). Algunos packs incluyen además el preset editable de FastFX.' },
    { q: '¿Qué necesito para usar las extensiones de Aseprite?', a: 'Una copia con licencia de Aseprite. Cada extensión se instala desde el archivo .aseprite-extension que se descarga tras la compra; la ficha del producto indica los requisitos exactos.' },
    { q: '¿Hay versiones gratuitas para probar?', a: 'Sí: FastFX Lite, Easy Interpolations, Pixel VFX Essentials (150 efectos), 150 One-Bit VFX, 160 Pixel Art Effects, el Extended Dungeon Tileset, tres espadas low poly y tres coches low poly son gratuitos.' },
    { q: '¿Hay descuentos?', a: 'Cada producto nuevo tiene un 25 % de descuento durante su primera semana. Hay rebajas de temporada (primavera, verano, otoño, Halloween, Black Friday, invierno) y bundles a precio cerrado. Las ofertas activas se muestran en la tienda.' },
    { q: '¿Qué servicios ofrece IceMan Studio a estudios?', a: 'Localización de juegos con LQA desde 0,05 € por palabra e idioma (mínimo 300 €), migraciones de motor a precio cerrado desde 2.000 € (Unity a Godot, Unity a Unreal, UE4 a UE5), y calculadoras gratuitas para lanzamientos en Steam.' },
    { q: '¿Cómo contacto con IceMan Studio?', a: 'Por correo a hola@icemanstudio.com o con el formulario de contacto. Respuesta en un día laborable.' }
  ]
};
