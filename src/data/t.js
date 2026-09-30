export const t = {
  en: {
    lang: 'en', other: 'es', otherLabel: 'ES', base: '',
    store: { tryDemo: 'Try it free in your browser', title: 'Store', lead: 'Every asset we publish, in one place. Pay by card here or buy on itch.io; both give you the same files and updates.', all: 'All', buy: 'Buy now', free: 'Free', download: 'Download free', itch: 'Buy on itch.io', getItch: 'Get it on itch.io', soonCheckout: 'Direct card checkout is being set up. Until then, itch.io delivers the same files.', off: 'off', ends: 'Offer ends', code: 'Code', gallery: 'Gallery', about: 'About this product', back: 'Back to store', related: 'More in', vat: 'Prices in EUR. VAT is added at checkout where it applies.', secure: 'Card payments by Stripe. Use an email you can access: your download page, the order email and your library are tied to it.', frostSoon: 'Engine systems (Frost family) are in production; the first release, FrostFeel, lands in October 2026.', bundles: 'Bundles', bundlesLead: 'Several products, one price. Bundles are sold here only.', buyBundle: 'Buy the bundle', youSave: 'You save', included: 'Included in this bundle', filterLabel: 'Filter', allProducts: 'All', freeOnly: 'Free', items: 'items', view: 'View', perks: ['Instant download after payment', 'Commercial use, no attribution', 'Updates included', '14-day fix or refund'], perksFree: ['Free download on itch.io', 'Commercial use, no attribution'], tryFree: 'Try the free version first', alsoIn: 'Also in a bundle', bundleDeal: 'products for', save: 'Save', buyBar: 'Buy', paid: 'Payment received. Your download links are on their way to the email you used at checkout (check spam if they take more than a minute).' },
    nav: { account: 'My account', privacy: 'Privacy', terms: 'Terms', assets: 'Store', pixel: 'Pixel art', financing: 'Funding', tools: 'Free tools', about: 'About', contact: 'Contact' },
    pixel: { title: 'Aseprite extensions and pixel art packs', lead: 'Tools for Aseprite and animated VFX packs, sold and downloaded on itch.io. Free versions available to try before you buy.', cta: 'Open the itch.io store', free: 'Free', buy: 'View on itch.io →', view: 'View product →' },
    hero: {
      title: 'Tools and assets for indie game developers.',
      sub: 'IceMan Studio builds gameplay systems for Unreal, Unity and Godot, Aseprite extensions and pixel art VFX for indie developers.',
      cta1: 'Browse assets', cta2: 'Get in touch'
    },
    search: { placeholder: 'Search the store…  ( / )' },
    home: { soon: 'Coming soon', latest: 'New and popular', all: 'See the whole store',
      eyebrow: 'Aseprite extensions · Pixel art VFX · Low-poly 3D',
      title: 'Aseprite tools and pixel art VFX for indie games.',
      sub: 'Particles, vector drawing, inbetweens and node textures inside Aseprite. Animated effect packs in GIF, spritesheet and PNG frames for any engine. Made by one dev who uses them in his own game.',
      cta1: 'Browse the store', cta2: 'Get the free packs', featured: 'Featured', view: 'View', products: 'products', free: 'free',
      cats: 'Shop by category', catFree: 'Free downloads', catFreeSub: 'Try before you buy',
      bundles: 'Bundles', bundlesLead: 'Several products, one price. Sold only here.',
      freeTitle: 'Start free', freeLead: 'Free versions of the tools and packs. Try the workflow, then upgrade if it fits.',
      why: 'Buying here' },
    trust: [
      { t: 'Commercial use', d: 'Use it in games you sell. No attribution.' },
      { t: 'Instant download', d: 'Download page right after paying, plus a copy by email.' },
      { t: 'Yours to keep', d: 'Purchases stay in your account. Download again any time.' },
      { t: '14-day guarantee', d: 'Broken file or not as described: fixed or refunded.' }
    ],
    pillars: [
      { title: 'Store', text: 'Aseprite extensions, pixel art VFX, tilesets and low-poly packs. Buy by card here or on itch.io. Frost engine systems coming next.', href: '/assets' },
      { title: 'Pixel art', text: 'Aseprite extensions (FastFX, VeSprite, GhostFrames) and animated pixel art VFX packs, on itch.io.', href: '/pixel-art' },
    ],
    assets: {
      title: 'Assets', lead: 'Every product ships for Unreal Engine and Unity, with documentation, sample scenes and support within 24 hours. Buy on Fab, the Unity Asset Store, or directly here.',
      soon: 'First release: FrostFeel, a game-feel kit (hit-stop, camera shake, hit flashes, damage numbers, screen effects). In review, available October 2026.',
      products: [
        { name: 'FrostFeel', tag: 'Game feel', text: 'Hit-stop, camera shake, hit flashes, floating damage numbers and screen effects. Plug in, tune in the editor, ship.', status: 'October 2026', engines: 'Unreal · Unity' },
        { name: 'FrostInventory', tag: 'Gameplay system', text: 'Data-driven inventory and interaction: DataTables, drag and drop UI, stacking, save and load.', status: 'Q4 2026', engines: 'Unreal · Unity' },
        { name: 'FrostDialogue', tag: 'Narrative', text: 'Dialogue and quest system with a graph editor, conditions and localization hooks.', status: '2027', engines: 'Unreal · Unity · Godot' }
      ]
    },
    services: {
      title: 'Services', lead: 'Fixed prices, written scope, delivery you can verify.',
      items: [
        { name: 'Game localization with LQA', price: 'from €0.05 per word and language · minimum €300', text: 'Glossary, placeholders and variables verified, in-context QA on screenshots, delivery in your string format (CSV, PO, JSON, Unreal StringTables, Unity tables). Core pack: Simplified Chinese, Russian, Brazilian Portuguese, Spanish.' },
        { name: 'Engine migration', price: 'fixed price per project · from €2,000', text: 'Unity to Godot, Unity to Unreal, UE4 to UE5. Written audit first, then migration with a test build you play and approve before the balance.' },
        { name: 'Steam page and launch tools', price: 'free tools · paid data layer coming', text: 'Wishlist and revenue calculators, localization planner, store page checklist.' }
      ],
      calcTitle: 'Localization cost calculator', words: 'Source words', langs: 'Languages', rate: 'Rate per word (€)', estimate: 'Estimate', result: 'Estimated cost',
      quote: 'Request a quote'
    },
    financing: {
      title: 'Funding for game studios', lead: 'We write and manage public-funding applications for small studios based in Spain or in a Creative Europe country, and the pitch material any studio needs for a publisher or investor. Grants are only available to studios established in the EU or in countries associated with the programme.',
      items: [
        { name: 'Creative Europe MEDIA (EU and associated countries)', text: 'Up to €200,000 per project at 60 % for development (pre-production). For companies established in a Creative Europe participating country. Requires a commercially released title since 2023. Next call expected to open in autumn 2026, deadline early 2027.' },
        { name: 'Spain: Ministry of Culture', text: 'Up to €80,000–120,000 per project depending on score. 100-point scale, threshold 50. Annual call. Only for companies with tax residence in Spain.' },
        { name: 'Spain, regional: Madrid, Catalonia (ICEC) and others', text: '€25,000 grants in Madrid; repayable contributions in Catalonia; more regions on request. Require a registered office in the region.' },
        { name: 'Pitch decks and publisher lists (worldwide)', text: 'A concise, visual deck built around your hook, proof and ask, plus a curated list of publishers that match your genre and budget. Available to studios anywhere.' }
      ],
      pricing: 'Pricing: €400–800 upfront per application, plus 10 % on success, payable when the grant is paid to you. Pitch deck: €300–600 fixed.',
      preTitle: 'Free pre-evaluation', preLead: 'Answer eight questions and get an estimated score band for the main calls. No commitment.',
      q: ['Has your studio commercially released a game since January 2023?', 'Do you own the majority of the IP of the project?', 'Do you have a playable prototype, vertical slice or demo?', 'Is the project narrative-driven or does it have original gameplay (not puzzle, sports, racing, party, quiz)?', 'Do you have a written development plan with a schedule and budget?', 'Do you have a financing plan with identified partners or co-financing?', 'Do you have a localization and distribution strategy for international markets?', 'Do you have concrete sustainability and diversity measures?'],
      yes: 'Yes', no: 'No', evaluate: 'Evaluate', bands: ['Not eligible yet: the first two answers are hard requirements for Creative Europe. We can help you prepare for the national calls.', 'Below threshold: the project needs work on plan, financing or strategy before applying. We can build those pieces.', 'Competitive: with a well-written application you are in the range that gets funded. Let us talk.', 'Strong: this is a project we would take on success terms.']
    },
    tools: { title: 'Free tools', lead: 'Tools you can use right here, for free.',
      tb: { title: 'Tallboy demo', text: 'Model, paint and bake isometric pixel art buildings with rooms behind every window. The demo runs in your browser, nothing to install.', play: 'Open Tallboy', fs: 'Full screen', tab: 'Open in a new tab', full: 'Get Tallboy Full', fullNote: 'Windows app: 8 and 16 angles, sprite sheets, .aseprite files, light maps, engine atlases and batch export. Future updates included.' },
      wl: { title: 'Wishlists to first-week sales', wishlists: 'Wishlists at launch', conv: 'Launch-week conversion (%)', price: 'Price ($)', estimate: 'Estimate', res: 'Estimated first-week gross', note: 'Benchmarks: 10–25 % of wishlists convert in launch week; Steam keeps 30 %.' } },
    about: { faq: 'Frequently asked questions', machine: 'Machine-readable:', title: 'About', cta: 'Browse the store', free: 'Try the free packs',
      text: ['I am IceMan, a game developer from Spain. Everything I sell here, I use in my own game.',
        'These products have been on itch.io for a while, where you can read what other buyers say. Here you get the same files.',
        'Payments go through Stripe. I never see or store your card details. After paying you get an email with your download link, and the purchase stays in your account so you can download it again any time.',
        'If a file is broken or is not what the product page says, write to me within 14 days and I will fix it or refund you.',
        'You can use everything in commercial games, no attribution needed. And almost every line has a free version to try before you buy.'], },
    contact: { title: 'Contact', lead: 'Write to hello@icemanstudio.com or use the form. We answer within one business day.', name: 'Name', email: 'Email', topic: 'Topic', message: 'Message', send: 'Send', sent: 'Thanks. We will reply within one business day.', fail: 'The form could not be sent. Please email hello@icemanstudio.com.', topics: ['Assets', 'Funding', 'Other'] },
    footer: '© 2026 IceMan Studio · Spain · hello@icemanstudio.com', foot: { shop: 'Shop', studio: 'Studio', help: 'Help', tagline: 'Tools and assets for indie game developers. Made in Spain.' }
  },
  es: {
    lang: 'es', other: 'en', otherLabel: 'EN', base: '/es',
    store: { tryDemo: 'Pruébalo gratis en el navegador', title: 'Tienda', lead: 'Todos los assets que publicamos, en un solo sitio. Paga con tarjeta aquí o compra en itch.io; ambos dan los mismos archivos y actualizaciones.', all: 'Todo', buy: 'Comprar', free: 'Gratis', download: 'Descargar gratis', itch: 'Comprar en itch.io', getItch: 'Conseguir en itch.io', soonCheckout: 'El pago directo con tarjeta se está configurando. Mientras tanto, itch.io entrega los mismos archivos.', off: 'de descuento', ends: 'La oferta termina el', code: 'Código', gallery: 'Galería', about: 'Sobre este producto', back: 'Volver a la tienda', related: 'Más en', vat: 'Precios en EUR. El IVA se añade al pagar donde corresponda.', secure: 'Pago con tarjeta por Stripe. Usa un correo al que tengas acceso: la página de descarga, el correo del pedido y tu biblioteca van ligados a él.', frostSoon: 'Los sistemas para motores (familia Frost) están en producción; el primero, FrostFeel, sale en octubre de 2026.', bundles: 'Bundles', bundlesLead: 'Varios productos, un solo precio. Los bundles solo se venden aquí.', buyBundle: 'Comprar el bundle', youSave: 'Ahorras', included: 'Incluido en este bundle', filterLabel: 'Filtrar', allProducts: 'Todo', freeOnly: 'Gratis', items: 'productos', view: 'Ver', perks: ['Descarga inmediata tras el pago', 'Uso comercial, sin atribución', 'Actualizaciones incluidas', '14 días para arreglo o reembolso'], perksFree: ['Descarga gratis en itch.io', 'Uso comercial, sin atribución'], tryFree: 'Prueba antes la versión gratis', alsoIn: 'También en un bundle', bundleDeal: 'productos por', save: 'Ahorras', buyBar: 'Comprar', paid: 'Pago recibido. Los enlaces de descarga van de camino al correo que usaste al pagar (mira en spam si tardan más de un minuto).' },
    nav: { account: 'Mi cuenta', privacy: 'Privacidad', terms: 'Términos', assets: 'Tienda', pixel: 'Pixel art', financing: 'Financiación', tools: 'Herramientas', about: 'Sobre', contact: 'Contacto' },
    pixel: { title: 'Extensiones para Aseprite y packs de pixel art', lead: 'Herramientas para Aseprite y packs de VFX animados, a la venta y descarga en itch.io. Hay versiones gratuitas para probar antes de comprar.', cta: 'Abrir la tienda en itch.io', free: 'Gratis', buy: 'Ver en itch.io →', view: 'Ver producto →' },
    hero: {
      title: 'Herramientas y assets para desarrolladores indie.',
      sub: 'IceMan Studio construye sistemas de gameplay para Unreal, Unity y Godot, extensiones para Aseprite y VFX en pixel art para desarrolladores indie.',
      cta1: 'Ver assets', cta2: 'Contactar'
    },
    search: { placeholder: 'Buscar en la tienda…  ( / )' },
    home: { soon: 'Próximamente', latest: 'Novedades y más vendidos', all: 'Ver toda la tienda',
      eyebrow: 'Extensiones para Aseprite · VFX en pixel art · 3D low poly',
      title: 'Herramientas para Aseprite y VFX en pixel art para juegos indie.',
      sub: 'Partículas, dibujo vectorial, intercalados y texturas por nodos dentro de Aseprite. Packs de efectos animados en GIF, spritesheet y frames PNG para cualquier motor. Hecho por un dev que los usa en su propio juego.',
      cta1: 'Ver la tienda', cta2: 'Packs gratis', featured: 'Destacado', view: 'Ver', products: 'productos', free: 'gratis',
      cats: 'Comprar por categoría', catFree: 'Descargas gratis', catFreeSub: 'Prueba antes de comprar',
      bundles: 'Bundles', bundlesLead: 'Varios productos, un solo precio. Solo se venden aquí.',
      freeTitle: 'Empieza gratis', freeLead: 'Versiones gratuitas de las herramientas y los packs. Prueba el flujo y, si te encaja, da el salto.',
      why: 'Comprar aquí' },
    trust: [
      { t: 'Uso comercial', d: 'Úsalo en juegos que vendas. Sin atribución.' },
      { t: 'Descarga al momento', d: 'Página de descarga nada más pagar, y copia por correo.' },
      { t: 'Para siempre', d: 'Las compras quedan en tu cuenta. Descarga otra vez cuando quieras.' },
      { t: 'Garantía de 14 días', d: 'Archivo roto o distinto a la ficha: lo arreglo o te devuelvo el dinero.' }
    ],
    pillars: [
      { title: 'Tienda', text: 'Extensiones para Aseprite, VFX en pixel art, tilesets y packs low poly. Compra con tarjeta aquí o en itch.io. Sistemas Frost para motores, próximamente.', href: '/es/assets' },
      { title: 'Pixel art', text: 'Extensiones para Aseprite (FastFX, VeSprite, GhostFrames) y packs de VFX animados en pixel art, en itch.io.', href: '/es/pixel-art' },
    ],
    assets: {
      title: 'Assets', lead: 'Cada producto sale para Unreal Engine y Unity, con documentación, escenas de ejemplo y soporte en menos de 24 horas. Compra en Fab, en la Unity Asset Store o directamente aquí.',
      soon: 'Primer lanzamiento: FrostFeel, un kit de game feel (hit-stop, sacudida de cámara, destellos de impacto, números de daño, efectos de pantalla). En revisión, disponible en octubre de 2026.',
      products: [
        { name: 'FrostFeel', tag: 'Game feel', text: 'Hit-stop, sacudida de cámara, destellos de impacto, números de daño flotantes y efectos de pantalla. Conecta, ajusta en el editor, publica.', status: 'Octubre 2026', engines: 'Unreal · Unity' },
        { name: 'FrostInventory', tag: 'Sistema de gameplay', text: 'Inventario e interacción data-driven: DataTables, UI con arrastrar y soltar, apilado, guardado y carga.', status: 'Q4 2026', engines: 'Unreal · Unity' },
        { name: 'FrostDialogue', tag: 'Narrativa', text: 'Sistema de diálogos y misiones con editor de grafos, condiciones y ganchos de localización.', status: '2027', engines: 'Unreal · Unity · Godot' }
      ]
    },
    services: {
      title: 'Servicios', lead: 'Precios cerrados, alcance por escrito, entregas que puedes verificar.',
      items: [
        { name: 'Localización de juegos con LQA', price: 'desde 0,05 € por palabra e idioma · mínimo 300 €', text: 'Glosario, placeholders y variables verificados, QA en contexto sobre capturas, entrega en tu formato (CSV, PO, JSON, StringTables de Unreal, tablas de Unity). Pack base: chino simplificado, ruso, portugués de Brasil, inglés.' },
        { name: 'Migración de motor', price: 'precio cerrado por proyecto · desde 2.000 €', text: 'Unity a Godot, Unity a Unreal, UE4 a UE5. Primero auditoría escrita, después migración con build de prueba que juegas y apruebas antes del pago final.' },
        { name: 'Herramientas de página y lanzamiento en Steam', price: 'herramientas gratuitas · capa de datos de pago en camino', text: 'Calculadoras de wishlists e ingresos, planificador de localización, checklist de página de tienda.' }
      ],
      calcTitle: 'Calculadora de coste de localización', words: 'Palabras de origen', langs: 'Idiomas', rate: 'Tarifa por palabra (€)', estimate: 'Calcular', result: 'Coste estimado',
      quote: 'Pedir presupuesto'
    },
    financing: {
      title: 'Financiación para estudios', lead: 'Redactamos y gestionamos solicitudes de ayudas públicas para estudios pequeños con sede en España o en un país de Creative Europe, y el material que cualquier estudio necesita para un publisher o un inversor. Las ayudas solo están disponibles para empresas establecidas en la UE o en países asociados al programa.',
      items: [
        { name: 'Creative Europe MEDIA (UE y países asociados)', text: 'Hasta 200.000 € por proyecto al 60 % para desarrollo (preproducción). Para empresas establecidas en un país participante en Creative Europe. Exige un título publicado comercialmente desde 2023. Próxima convocatoria prevista para otoño de 2026, cierre a principios de 2027.' },
        { name: 'España: Ministerio de Cultura', text: 'Hasta 80.000–120.000 € por proyecto según puntuación. Baremo de 100 puntos, umbral 50. Convocatoria anual. Solo para empresas con residencia fiscal en España.' },
        { name: 'España, autonómicas: Madrid, ICEC Cataluña y otras', text: 'Ayudas de 25.000 € en Madrid; aportaciones reintegrables en Cataluña; otras comunidades bajo consulta. Exigen sede en la comunidad.' },
        { name: 'Pitch decks y listas de publishers (cualquier país)', text: 'Un deck breve y visual alrededor de tu gancho, tus pruebas y lo que pides, más una lista curada de publishers que encajan con tu género y presupuesto. Para estudios de cualquier país.' }
      ],
      pricing: 'Precios: 400–800 € de entrada por solicitud, más un 10 % a éxito, pagadero cuando cobres la ayuda. Pitch deck: 300–600 € cerrado.',
      preTitle: 'Pre-evaluación gratuita', preLead: 'Responde ocho preguntas y recibe una franja de puntuación estimada para las convocatorias principales. Sin compromiso.',
      q: ['¿Tu estudio ha publicado comercialmente un juego desde enero de 2023?', '¿Posees la mayoría de la propiedad intelectual del proyecto?', '¿Tienes un prototipo jugable, vertical slice o demo?', '¿El proyecto es narrativo o tiene gameplay original (no puzzle, deportes, carreras, party, quiz)?', '¿Tienes un plan de desarrollo escrito con calendario y presupuesto?', '¿Tienes un plan de financiación con socios identificados o cofinanciación?', '¿Tienes estrategia de localización y distribución internacional?', '¿Tienes medidas concretas de sostenibilidad y diversidad?'],
      yes: 'Sí', no: 'No', evaluate: 'Evaluar', bands: ['Todavía no elegible: las dos primeras respuestas son requisitos duros en Creative Europe. Podemos prepararte para las convocatorias nacionales.', 'Por debajo del umbral: el proyecto necesita trabajo en plan, financiación o estrategia antes de presentarse. Podemos construir esas piezas.', 'Competitivo: con una memoria bien escrita estás en el rango que se financia. Hablemos.', 'Fuerte: es un proyecto que llevaríamos a éxito.']
    },
    tools: { title: 'Herramientas gratuitas', lead: 'Herramientas que puedes usar aquí mismo, gratis.',
      tb: { title: 'Demo de Tallboy', text: 'Modela, pinta y hornea edificios isométricos en pixel art con habitaciones detrás de cada ventana. La demo funciona en el navegador, sin instalar nada.', play: 'Abrir Tallboy', fs: 'Pantalla completa', tab: 'Abrir en otra pestaña', full: 'Conseguir Tallboy Full', fullNote: 'App para Windows: 8 y 16 ángulos, hojas de sprites, archivos .aseprite, mapas de luz, atlas para motores y exportación por lotes. Actualizaciones futuras incluidas.' },
      wl: { title: 'De wishlists a ventas de la primera semana', wishlists: 'Wishlists al lanzar', conv: 'Conversión en semana de lanzamiento (%)', price: 'Precio ($)', estimate: 'Calcular', res: 'Ingreso bruto estimado en la primera semana', note: 'Referencias: convierte el 10–25 % de las wishlists en la semana de lanzamiento; Steam se queda el 30 %.' } },
    about: { faq: 'Preguntas frecuentes', machine: 'Legible por máquinas:', title: 'Sobre', cta: 'Ver la tienda', free: 'Probar los packs gratis',
      text: ['Soy IceMan, desarrollador de videojuegos en España. Todo lo que vendo aquí lo uso en mi propio juego.',
        'Los productos llevan tiempo publicados en itch.io, donde puedes leer los comentarios de otros compradores. Aquí tienes los mismos archivos.',
        'El pago lo gestiona Stripe. Yo no veo ni guardo los datos de tu tarjeta. Al pagar te llega un correo con el enlace de descarga, y la compra queda en tu cuenta para bajarla otra vez cuando quieras.',
        'Si un archivo llega roto o no es lo que dice la ficha, escríbeme en los 14 días siguientes y lo arreglo o te devuelvo el dinero.',
        'Puedes usarlo todo en juegos comerciales, sin atribución. Y casi todo tiene versión gratis para probar antes de comprar.'], },
    contact: { title: 'Contacto', lead: 'Escribe a hola@icemanstudio.com o usa el formulario. Respondemos en un día laborable.', name: 'Nombre', email: 'Correo', topic: 'Tema', message: 'Mensaje', send: 'Enviar', sent: 'Gracias. Respondemos en un día laborable.', fail: 'No se pudo enviar el formulario. Escríbenos a hola@icemanstudio.com.', topics: ['Assets', 'Financiación', 'Otro'] },
    footer: '© 2026 IceMan Studio · España · hola@icemanstudio.com', foot: { shop: 'Tienda', studio: 'Estudio', help: 'Ayuda', tagline: 'Herramientas y assets para desarrolladores indie. Hecho en España.' }
  }
};
