# icemanstudio-web

Astro 5 static site for IceMan Studio, deployed as a Cloudflare Worker with static assets (`wrangler.jsonc`). Every push to `main` deploys automatically.

- Read `DESIGN.md` before touching styles, components or motion. It is the contract.
- Read `DECISIONS.md` for why things are the way they are; append a new entry when you make a lasting decision.
- Copy lives in `src/data/t.js` (en/es). Catalogue in `src/data/itch.js`. Components in `src/components/`, thin pages in `src/pages/` and `src/pages/es/`.
- Contact endpoint: `functions/api/contact.js`, routed by `src/worker.js`. Needs `RESEND_API_KEY` (secret) and `CONTACT_TO` set in Cloudflare; never commit keys.
- Commands: `npm run build`, `npm run preview` (port 4321).
