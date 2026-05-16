-- ============================================================
-- 007_team_images.sql
-- Asigna player_image_url individuales a los stickers de los
-- equipos que ya tienen imágenes en el repo JuanFeDS/images.
-- Patrón: {carpeta}/{carpeta}-{índice_relativo_ZZ}.png
-- donde el índice es relativo al primer sticker del equipo (01).
-- ============================================================

DO $$
DECLARE
  base  TEXT := 'https://raw.githubusercontent.com/JuanFeDS/images/refs/heads/main/apps/album_tracker/tres_reyes_2023/';
  album UUID := '00000000-0000-0000-0000-000000003026';
BEGIN

  -- Estadios (1–16) — reemplaza el placeholder de la migración 006
  UPDATE stickers
  SET player_image_url = base || 'estadio/estadio-' || LPAD(number::text, 2, '0') || '.png'
  WHERE album_id = album AND section = 'museum';

  -- México (17–32)
  UPDATE stickers
  SET player_image_url = base || 'mexico/mexico-' || LPAD((number - 16)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'México';

  -- República Checa (33–48)
  UPDATE stickers
  SET player_image_url = base || 'republica_checa/republica_checa-' || LPAD((number - 32)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'República Checa';

  -- Corea del Sur (49–55)
  UPDATE stickers
  SET player_image_url = base || 'corea/corea-' || LPAD((number - 48)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Corea del Sur';

  -- Sudáfrica (56–62)
  UPDATE stickers
  SET player_image_url = base || 'sudafrica/sudafrica-' || LPAD((number - 55)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Sudáfrica';

  -- Canadá (63–78)
  UPDATE stickers
  SET player_image_url = base || 'canada/canada-' || LPAD((number - 62)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Canadá';

  -- Bosnia y Herzegovina (79–94)
  UPDATE stickers
  SET player_image_url = base || 'bosnia/bosnia-' || LPAD((number - 78)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Bosnia y Herzegovina';

  -- Suiza (95–101)
  UPDATE stickers
  SET player_image_url = base || 'suiza/suiza-' || LPAD((number - 94)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Suiza';

  -- Catar (102–108)
  UPDATE stickers
  SET player_image_url = base || 'qatar/qatar-' || LPAD((number - 101)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Catar';

  -- Brasil (109–124)
  UPDATE stickers
  SET player_image_url = base || 'brasil/brasil-' || LPAD((number - 108)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Brasil';

END $$;
