-- silkroute.art catalogue (D1: silkroute-catalog). Prices are whole US dollars.
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT, country TEXT, website TEXT, instagram TEXT, bio TEXT,
  token TEXT NOT NULL UNIQUE,            -- the artist's private status link
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS works (
  id TEXT PRIMARY KEY,
  artist_id TEXT NOT NULL REFERENCES artists(id),
  title TEXT NOT NULL,
  year INTEGER, medium TEXT,
  height_cm REAL, width_cm REAL, depth_cm REAL,
  framed INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  asking_price_usd INTEGER,               -- what the artist asked for
  price_usd INTEGER,                      -- public price, set by the curator
  ship_india_usd INTEGER, ship_intl_usd INTEGER,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN
    ('submitted','changes_requested','approved','published','declined','held','sold','shipped','delivered')),
  note_to_artist TEXT,                    -- shown on the artist's status page
  admin_note TEXT,                        -- private
  sort INTEGER NOT NULL DEFAULT 0,
  human_made INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  reviewed_at TEXT, published_at TEXT
);
CREATE INDEX IF NOT EXISTS works_status ON works(status);
CREATE INDEX IF NOT EXISTS works_artist ON works(artist_id);
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  work_id TEXT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, bytes INTEGER NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS photos_work ON photos(work_id);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  work_id TEXT, action TEXT NOT NULL, detail TEXT, actor TEXT, at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS events_work ON events(work_id);

-- Accounts (custodians, and artists who sign in). Sign-in is by emailed code; no passwords.
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,             -- lower-case
  name TEXT, country TEXT,
  interest TEXT,                          -- first-work | a-few | collector
  status TEXT NOT NULL DEFAULT 'waitlist' CHECK (status IN ('waitlist','approved','paused')),
  updates_ok INTEGER NOT NULL DEFAULT 0,  -- agreed to the monthly letter
  source TEXT,                            -- join | waitlist-import | sign-in
  admin_note TEXT,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  verified_at TEXT,                       -- first time they entered a code
  approved_at TEXT, last_seen_at TEXT
);
CREATE INDEX IF NOT EXISTS members_status ON members(status);
CREATE TABLE IF NOT EXISTS login_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  tries INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL, expires_at TEXT NOT NULL, used_at TEXT
);
CREATE INDEX IF NOT EXISTS login_codes_email ON login_codes(email, created_at);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,                    -- SHA-256 of the cookie value
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL, expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_member ON sessions(member_id);
