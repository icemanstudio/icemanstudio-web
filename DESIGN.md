# IceMan Studio · Design guide

This file is the source of truth for how the site looks and feels. Read it before changing any style, adding a component, or adding "juice". If a change breaks a rule here, update the rule first.

## 1. Brand

- Name: **IceMan Studio**. Never "Iceman" alone on a product. Product family prefix: **Frost** (FrostFeel, FrostInventory, FrostDialogue).
- Logo: "Frostline" wordmark (`public/brand/logo-header.svg` in the header, `logo-horizontal-dark.svg` / `-light.svg` elsewhere, `mark-square.svg` for icons, `favicon.svg`). Minimum clear space: the height of the letter I.
- Voice: short sentences, concrete numbers, no hype. English first, Spanish complete. Never claim numbers we cannot back (users, sales).

## 2. Color tokens (`src/styles/global.css`, `:root`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#131313` | Page background. The base of everything IceMan makes. |
| `--bg2` | `#1b1b1b` | Inputs, inset panels |
| `--card` | `#181818` | Cards |
| `--line` | `#2a2a2a` | Borders |
| `--text` | `#F8FAFC` | Primary text |
| `--muted` | `#9AA3AD` | Secondary text |
| `--ice2` | `#7DD3FC` | Light accent: links, labels |
| `--ice` | `#38BDF8` | Main accent: buttons, frost line, focus |
| `--ice3` | `#0EA5E9` | Deep accent, light backgrounds |

Rules: neutral dark base, one accent hue (sky blue, about 199 degrees). Never introduce a second accent hue. Never use pure black `#000` or navy backgrounds. Light mode is not supported on purpose.

## 3. Type and spacing

- Font: Inter (400 body, 600 labels, 800 headings, 900 hero). System fallback: Segoe UI, Arial.
- Sizes: hero `clamp(34px, 6vw, 60px)`, section h2 32px, card h3 20px, body 15 to 16px, small 13px.
- Radius: 14px cards, 10px buttons and inputs, 999px tags.
- Layout: `.wrap` max 1120px, 20px side padding, sections 48px vertical. Grid: `repeat(auto-fit, minmax(260px, 1fr))`, gap 18px.

## 4. Components

- `.btn` primary (ice on dark text), `.btn.ghost` secondary. One primary per block.
- `.card` for anything clickable or grouped. Cards that link are `<a class="card">`; cards that do not link are `<div class="card">`.
- `.tag` for price, engine, status. Max two tags per card.
- `.result` for calculator output; toggled with the `hidden` attribute (juice.js listens to that).
- Forms: `label > input` pattern, grid gap 12px, max width 640px.

## 5. Juice (motion): the rules

Motion exists to make the site feel like a game menu made by people who ship games. It must never slow reading down.

- Timing tokens: `--t-fast` 120ms (presses), `--t-mid` 260ms (hover, small reveals), `--t-slow` 600ms (entrances). Easings: `--ease-out` for movement, `--ease-bounce` only for presses and toasts.
- Entrances: hero children rise with an 80 to 280ms stagger. Everything else reveals on scroll once and never replays.
- Hover: cards lift 4px, ice border, glow, one diagonal shine sweep. Buttons glow. Nav links underline from the left.
- Press: buttons squash to 0.94. That is the only scale-down allowed.
- Ambient: the frost divider shimmers slowly (6s). Nothing else loops on screen by default. No background glow or gradient behind the page: the base is flat #131313.
- Numbers: calculator results count up in 500ms.
- Every animation is disabled under `prefers-reduced-motion`. Test it.
- No libraries. `public/juice.js` is vanilla, deferred, and the page works without it.

## 6. Gamer details (easter eggs and HUD)

Keep them discoverable, never in the way. Registry (all in `public/juice.js`):

| Trigger | Effect | Achievement |
|---|---|---|
| Visit the pixel art page | none | Pixel curious |
| Run any calculator | count-up | Number cruncher |
| Visit assets, pixel art, services, funding and tools | none | Explorer |
| Switch language | none | Bilingual |
| Konami code (up up down down left right left right B A) | snowfall overlay | Konami |
| Open the console | greeting | none |
| 404 page | "YOU DIED" with a Respawn button | none |
| Footer | `build vX.Y.Z` links to the patch notes (commit list) | none |

Achievements are a Steam-style toast (bottom right, 4.2s, slides in with bounce), stored in `localStorage` under `ims:*`. Adding one: `achieve(id, title, desc, emoji)` with strings in both languages in the `T` map. Max one toast at a time. Never trigger a toast on page load without a user action, except the section-based ones, which fire once per browser.

## 7. Content rules

- Every page exists in `/` (en) and `/es/`. Strings live in `src/data/t.js`; catalogue data in `src/data/itch.js`. Never hardcode copy in components.
- Funding copy must state geographic scope (Spain, EU and Creative Europe associated countries).
- Prices are shown exactly as on the store they link to.

## 8. Checklist before pushing

1. `npm run build` passes.
2. Home, pixel art and financing checked at desktop and 375px.
3. Reduced motion checked once (DevTools, Rendering, emulate).
4. No new color outside the token table.
5. Strings added in both languages.

## 9. Store

- Catalogue: `src/data/products.js` (prices in EUR are the source of truth), long descriptions and galleries imported from itch.io into `src/data/itch-import.json` and `public/itch/<slug>/` by `python scripts/import-itch.py`. Add a product: one entry in `products.js`, its slug in `scripts/itch-slugs.json`, run the importer.
- Offers: `src/data/offers.js`. A sale is one object with percent, dates and scope (`all`, `cat:<category>` or a list of slugs). Active offers show a banner on the store, a `-N%` sale tag on cards and a struck-through base price on the product page. Dates are evaluated at build time, so push once when a sale starts and once when it ends.
- Product page: gallery with thumbnails on the left, sticky buy box on the right, imported description below in `.prose`, three related products at the end.
- Buy box logic: free → "Download free" to itch; paid without `stripePrice` → "Buy on itch.io" plus a note that card checkout is coming; paid with `stripePrice` and Stripe configured → "Buy now" (Stripe Checkout with automatic tax and promotion codes) plus itch as secondary.
- Never show a price on the site that differs from the store it links to.
