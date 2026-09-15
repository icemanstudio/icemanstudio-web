-- IceMan Studio accounts and orders (Cloudflare D1). Apply: npx wrangler d1 execute icemanstudio-db --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY,
  name TEXT DEFAULT '',
  lang TEXT DEFAULT 'en',
  created INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,            -- Stripe checkout session id
  email TEXT NOT NULL,
  slug TEXT NOT NULL,             -- product slug or bundle:<slug>
  items TEXT NOT NULL,            -- comma-separated product slugs delivered
  amount INTEGER NOT NULL,        -- cents
  currency TEXT NOT NULL,
  livemode INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS orders_email ON orders(email);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS login_tokens (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,            -- who requested / current email
  purpose TEXT NOT NULL,          -- login | change-email
  new_email TEXT DEFAULT '',
  lang TEXT DEFAULT 'en',
  expires INTEGER NOT NULL,
  created INTEGER NOT NULL
);
