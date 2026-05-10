-- ============================================================
-- 001_initial_schema.sql
-- Schema inicial de AlbumIQ — multi-álbum, sin Supabase Auth
-- Idempotente: seguro de correr varias veces
-- ============================================================

CREATE TABLE IF NOT EXISTS albums (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug           TEXT UNIQUE NOT NULL,
    name           TEXT NOT NULL,
    description    TEXT,
    total_stickers INTEGER NOT NULL DEFAULT 0,
    cover_url      TEXT,
    is_active      BOOLEAN NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stickers (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id         UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    code             TEXT NOT NULL,
    number           INTEGER NOT NULL,
    team             TEXT NOT NULL,
    team_code        TEXT,
    player_name      TEXT,
    player_image_url TEXT,
    sticker_type     TEXT NOT NULL
                     CHECK (sticker_type IN ('logo','player','team_photo','special')),
    rarity           TEXT NOT NULL DEFAULT 'common'
                     CHECK (rarity IN ('common','foil')),
    section          TEXT NOT NULL
                     CHECK (section IN ('teams','intro','museum')),
    UNIQUE (album_id, code)
);

CREATE INDEX IF NOT EXISTS idx_stickers_album     ON stickers(album_id);
CREATE INDEX IF NOT EXISTS idx_stickers_team_code ON stickers(album_id, team_code);

-- Sin FK a auth.users — el id lo genera el cliente con crypto.randomUUID()
-- Elimina la FK a auth.users si quedó de una versión anterior del schema
ALTER TABLE IF EXISTS profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

CREATE TABLE IF NOT EXISTS profiles (
    id         UUID PRIMARY KEY,
    username   TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    is_public  BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_stickers (
    user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sticker_id UUID NOT NULL REFERENCES stickers(id),
    quantity   INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, sticker_id)
);

CREATE INDEX IF NOT EXISTS idx_user_stickers_user ON user_stickers(user_id);

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE albums        ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;

-- Catálogo: solo lectura pública
DROP POLICY IF EXISTS "albums_read"   ON albums;
DROP POLICY IF EXISTS "stickers_read" ON stickers;
CREATE POLICY "albums_read"   ON albums   FOR SELECT USING (true);
CREATE POLICY "stickers_read" ON stickers FOR SELECT USING (true);

-- Perfiles: lectura pública de perfiles públicos
DROP POLICY IF EXISTS "profiles_read"   ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_read"   ON profiles FOR SELECT USING (is_public = true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (true);

-- user_stickers: abierta para MVP sin auth (agregar JWT propio en producción)
DROP POLICY IF EXISTS "user_stickers_all" ON user_stickers;
CREATE POLICY "user_stickers_all" ON user_stickers FOR ALL USING (true) WITH CHECK (true);

-- Secciones del álbum (categorías de navegación con icono)
CREATE TABLE IF NOT EXISTS sections (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id      UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    key           TEXT NOT NULL,
    label         TEXT NOT NULL,
    icon          TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE (album_id, key)
);

-- Renombra flag_emoji → flag_code si viene de una versión anterior
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='stickers' AND column_name='flag_emoji') THEN
    ALTER TABLE stickers RENAME COLUMN flag_emoji TO flag_code;
  END IF;
END $$;
ALTER TABLE stickers ADD COLUMN IF NOT EXISTS flag_code TEXT;

CREATE INDEX IF NOT EXISTS idx_sections_album ON sections(album_id);

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sections_read" ON sections;
CREATE POLICY "sections_read" ON sections FOR SELECT USING (true);

-- ── Trigger updated_at ───────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_stickers_updated_at ON user_stickers;
CREATE TRIGGER trg_user_stickers_updated_at
    BEFORE UPDATE ON user_stickers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
