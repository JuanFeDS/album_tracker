-- ============================================================
-- 006_stadium_images.sql
-- Prueba: asigna una imagen placeholder a todos los stickers
-- de la sección museum (estadios) del álbum 3 Reyes.
-- URL definitiva se ajustará por sticker más adelante.
-- ============================================================

UPDATE stickers
SET player_image_url = 'https://raw.githubusercontent.com/JuanFeDS/images/refs/heads/main/apps/album_tracker/tres_reyes_2023/estadio_201257.png'
WHERE
  album_id = '00000000-0000-0000-0000-000000003026'
  AND section = 'museum';
