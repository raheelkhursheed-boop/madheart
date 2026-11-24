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
