-- ============================================================
-- 008_team_images_batch2.sql
-- Asigna player_image_url para el segundo lote de equipos.
-- Incluye fix de República Checa versus (007 usaba offset incorrecto).
-- Equipos de sección versus: italia, gales, polonia, albania, irlanda.
-- Suecia aparece en teams (263-278) Y versus (600-602) — mismo folder.
-- Egipto: solo la primera aparición (309-324); la segunda (424-430) queda sin imagen.
-- ============================================================

DO $$
DECLARE
  base  TEXT := 'https://raw.githubusercontent.com/JuanFeDS/images/refs/heads/main/apps/album_tracker/tres_reyes_2023/';
  album UUID := '00000000-0000-0000-0000-000000003026';
BEGIN

  -- ── Fix migración 007 ──────────────────────────────────────────────────────
  -- República Checa versus (E43-E45, números 627-629) — offset correcto: 626
  UPDATE stickers
  SET player_image_url = base || 'republica_checa/republica_checa-' || LPAD((number - 626)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'República Checa' AND section = 'versus';

  -- ── Sección teams ─────────────────────────────────────────────────────────

  -- Marruecos (125-140)
  UPDATE stickers
  SET player_image_url = base || 'marruecos/marruecos-' || LPAD((number - 124)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Marruecos';

  -- Escocia (141-147)
  UPDATE stickers
  SET player_image_url = base || 'escocia/escocia-' || LPAD((number - 140)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Escocia';

  -- Haití (148-154)
  UPDATE stickers
  SET player_image_url = base || 'haiti/haiti-' || LPAD((number - 147)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Haití';

  -- EE.UU. (155-170)
  UPDATE stickers
  SET player_image_url = base || 'eeuu/eeuu-' || LPAD((number - 154)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'EE.UU.';

  -- Paraguay (171-186)
  UPDATE stickers
  SET player_image_url = base || 'paraguay/paraguay-' || LPAD((number - 170)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Paraguay';

  -- Australia (187-193)
  UPDATE stickers
  SET player_image_url = base || 'australia/australia-' || LPAD((number - 186)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Australia';

  -- Alemania (201-216)
  UPDATE stickers
  SET player_image_url = base || 'alemania/alemania-' || LPAD((number - 200)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Alemania';

  -- Ecuador (217-232)
  UPDATE stickers
  SET player_image_url = base || 'ecuador/ecuador-' || LPAD((number - 216)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Ecuador';

  -- Costa de Marfil (233-239)
  UPDATE stickers
  SET player_image_url = base || 'costa_de_marfil/costa_de_marfil-' || LPAD((number - 232)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Costa de Marfil';

  -- Curazao (240-246)
  UPDATE stickers
  SET player_image_url = base || 'curazao/curazao-' || LPAD((number - 239)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Curazao';

  -- Países Bajos (247-262)
  UPDATE stickers
  SET player_image_url = base || 'paises_bajos/paises_bajos-' || LPAD((number - 246)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Países Bajos';

  -- Suecia teams (263-278)
  UPDATE stickers
  SET player_image_url = base || 'suecia/suecia-' || LPAD((number - 262)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Suecia' AND section = 'teams';

  -- Japón (279-285)
  UPDATE stickers
  SET player_image_url = base || 'japon/japon-' || LPAD((number - 278)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Japón';

  -- Bélgica (293-308)
  UPDATE stickers
  SET player_image_url = base || 'belgica/belgica-' || LPAD((number - 292)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Bélgica';

  -- Egipto primera aparición (309-324); segunda (424-430) queda sin imagen
  UPDATE stickers
  SET player_image_url = base || 'egipto/egipto-' || LPAD((number - 308)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Egipto' AND number BETWEEN 309 AND 324;

  -- ── Sección versus ────────────────────────────────────────────────────────

  -- Suecia versus (E16-E18, números 600-602) — reutiliza imágenes 01-03 del folder
  UPDATE stickers
  SET player_image_url = base || 'suecia/suecia-' || LPAD((number - 599)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Suecia' AND section = 'versus';

  -- Italia versus (E1-E3, números 585-587)
  UPDATE stickers
  SET player_image_url = base || 'italia/italia-' || LPAD((number - 584)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Italia' AND section = 'versus';

  -- Gales versus (E7-E9, números 591-593)
  UPDATE stickers
  SET player_image_url = base || 'gales/gales-' || LPAD((number - 590)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Gales' AND section = 'versus';

  -- Polonia versus (E19-E21, números 603-605)
  UPDATE stickers
  SET player_image_url = base || 'polonia/polonia-' || LPAD((number - 602)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Polonia' AND section = 'versus';

  -- Albania versus (E22-E24, números 606-608)
  UPDATE stickers
  SET player_image_url = base || 'albania/albania-' || LPAD((number - 605)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Albania' AND section = 'versus';

  -- Irlanda versus (E46-E48, números 630-632)
  UPDATE stickers
  SET player_image_url = base || 'irlanda/irlanda-' || LPAD((number - 629)::text, 2, '0') || '.png'
  WHERE album_id = album AND team = 'Irlanda' AND section = 'versus';

END $$;
