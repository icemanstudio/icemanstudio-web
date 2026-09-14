# DECISIONS.md — icemanstudio-web

Registro de decisiones duraderas. Añadir al final; no reescribir las anteriores.

## 2026-09-14 · Stack: Astro estático en Cloudflare Workers
- **Decisión:** Astro 5 sin framework de UI, desplegado como Worker con assets estáticos (`wrangler.jsonc`), no como Cloudflare Pages.
- **Por qué:** coste cero, despliegue automático desde GitHub, y el panel de Cloudflare empuja el flujo de Workers por defecto. Un pequeño `src/worker.js` sirve los assets y enruta `/api/contact`.
- **Alternativas descartadas:** Next.js (innecesario para contenido estático), Cloudflare Pages (flujo ya no prioritario en el panel).

## 2026-09-14 · Bilingüe por rutas, textos centralizados
- **Decisión:** `/` inglés por defecto, `/es/` español completo. Todos los textos en `src/data/t.js`; catálogo en `src/data/itch.js`.
- **Por qué:** clientes internacionales para assets y servicios; clientes españoles para financiación. Un solo sitio de edición evita desincronizar idiomas.

## 2026-09-14 · Correo del formulario con Resend
- **Decisión:** el formulario envía a `/api/contact`; el worker manda el correo por Resend usando `RESEND_API_KEY` y `CONTACT_TO` desde secretos de Cloudflare.
- **Por qué:** gratis hasta 3.000 correos al mes, sin servidor propio; la clave nunca entra en el repositorio.

## 2026-09-14 · Marca: base #131313, un solo acento azul hielo
- **Decisión:** fondo `#131313` en web y logos, acento único en el hue ~199° (`#38BDF8` y variantes). Sin modo claro.
- **Por qué:** #131313 es el color base de todo lo que hace IceMan (Aseprite, itch, vídeos); el azul es el rasgo del logo Frostline. Un acento único mantiene la identidad reconocible a tamaño pequeño.

## 2026-09-14 · Juice y detalles gamer
- **Decisión:** animaciones de entrada, hover, pulsación y reveal con tokens de tiempo fijos; logros tipo Steam, Konami con nevada, 404 "YOU DIED", versión de build en el pie. Todo vanilla en `public/juice.js`, con `prefers-reduced-motion` respetado.
- **Por qué:** la web es la demo de un estudio de juegos; tiene que sentirse como un menú de juego bien hecho sin estorbar la lectura ni requerir librerías. Reglas completas en `DESIGN.md` §5 y §6.

## 2026-09-14 · Ventas de assets: tiendas primero, Stripe para servicios
- **Decisión:** los assets se venden en Fab, Unity Asset Store e itch.io (ellos liquidan impuestos); servicios y financiación se cobran por Stripe. Compra directa de assets con Stripe Tax solo cuando haya catálogo propio.
- **Por qué:** evita gestionar el IVA de la UE por descargas digitales desde el primer día.

## 2026-09-14 · Tienda propia con catálogo importado de itch y Stripe diferido
- **Decisión:** la web tiene tienda propia con ficha por producto (`/assets/<slug>/`), importando textos e imágenes de itch.io con `scripts/import-itch.py`. Precios y ofertas viven en `src/data/products.js` y `src/data/offers.js`. El pago directo usa Stripe Checkout (`functions/api/checkout.js`) y solo se activa cuando existan `STRIPE_SECRET_KEY` y los Price IDs; hasta entonces la ficha manda a itch.io.
- **Por qué:** una sola casa para todo el catálogo sin depender del diseño de itch, ofertas controladas desde un archivo, y poder encender Stripe sin tocar las páginas. Se posponen la entrega de archivos y el webhook de Stripe hasta configurar la cuenta.
- **Pendiente:** almacenamiento de archivos (R2) y webhook `checkout.session.completed` que envíe el enlace de descarga por Resend; Stripe Tax activado; traducción al español de las descripciones largas (hoy en inglés en ambos idiomas).

## 2026-09-14 · Riesgo: bloqueos de Cloudflare en España (LaLiga)
- **Hecho:** el 14 de septiembre de 2026 la web en workers.dev no cargaba desde Vodafone fijo ni móvil por IPv4 (rangos 188.114.96/97 y 172.67 de Cloudflare bloqueados), sí desde el móvil por IPv6 y desde el PC con WARP. Es el bloqueo judicial de LaLiga sobre IPs compartidas de Cloudflare en días de partido.
- **Decisión:** mover producción a un servidor con IP propia (Hetzner CX22, Ubuntu, Caddy para la web estática y un servicio Node pequeño para `/api/*`), con Cloudflare solo como DNS sin proxy. La copia en workers.dev queda como espejo.
- **Por qué:** clientes españoles de financiación y el propio equipo quedan fuera en horario de fútbol; una IP propia no está en las listas. Vercel y Netlify también han sufrido estos bloqueos, así que no sirven como alternativa.

## 2026-09-14 · Paleta C "Ascua": coral sobre carbón, verde agua secundario
- **Decisión:** el acento pasa del azul cielo al coral `#FF7A59` (claro `#FFB199`, profundo `#E85D3F`), con verde agua `#2DD4BF` solo en etiquetas de oferta y barra de logros. Tokens renombrados a `--acc`, `--acc2`, `--acc3`, `--acc-b`. Logos, favicon y guía de marca actualizados.
- **Por qué:** el azul era genérico; el coral es reconocible, vivo y encaja con FastFX y los packs de explosiones, manteniendo la base #131313 sobria.
