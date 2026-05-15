-- ============================================================
-- 005_fix_iraq.sql
-- Fix: stickers 424-430 del álbum 3 Reyes estaban asignados
--      a Egipto por error; corresponden a Iraq.
-- Egipto real: 309-324 (16 láminas). Iraq: 424-430 (7 láminas).
-- ============================================================

UPDATE stickers
SET
  team      = 'Iraq',
  team_code = 'IRQ',
  flag_code = 'iq'
WHERE
  album_id = '00000000-0000-0000-0000-000000003026'
  AND number BETWEEN 424 AND 430;
