-- ============================================================
-- 004_3reyes_versus.sql
-- Versus section for 3 Reyes: E1-E66 (11 matchups × 6 stickers)
-- ============================================================

-- Allow 'versus' as a valid section value
ALTER TABLE stickers DROP CONSTRAINT IF EXISTS stickers_section_check;
ALTER TABLE stickers ADD CONSTRAINT stickers_section_check
  CHECK (section IN ('teams','intro','museum','versus'));

-- Navigation section for 3 Reyes
INSERT INTO sections (album_id, key, label, icon, display_order) VALUES
  ('00000000-0000-0000-0000-000000003026', 'versus', 'Versus', '⚔️', 4)
ON CONFLICT DO NOTHING;

-- Update total sticker count (584 + 66)
UPDATE albums SET total_stickers = 650 WHERE id = '00000000-0000-0000-0000-000000003026';

-- Versus stickers E1-E66
INSERT INTO stickers
  (id, album_id, code, number, team, team_code, player_name, sticker_type, rarity, section, flag_code)
VALUES
  ('1cf76bd1-97e5-4e8a-8116-0c3f9be5197a', '00000000-0000-0000-0000-000000003026', 'E1', 585, 'Italia', 'ITA', 'Italia', 'logo', 'foil', 'versus', 'it'),
  ('2fe4de0a-9bd5-400a-b5a9-332369964727', '00000000-0000-0000-0000-000000003026', 'E2', 586, 'Italia', 'ITA', 'Italia', 'player', 'common', 'versus', 'it'),
  ('3821f842-a30b-4bc3-8ad4-b92b52d6b3a1', '00000000-0000-0000-0000-000000003026', 'E3', 587, 'Italia', 'ITA', 'Italia', 'team_photo', 'common', 'versus', 'it'),
  ('8f25d19f-cd6b-4def-8e90-9830b7e13e82', '00000000-0000-0000-0000-000000003026', 'E4', 588, 'Irlanda del Norte', 'NIR', 'Irlanda del Norte', 'logo', 'foil', 'versus', 'gb-nir'),
  ('6083d508-5af1-4afc-b32d-c57aa71573a6', '00000000-0000-0000-0000-000000003026', 'E5', 589, 'Irlanda del Norte', 'NIR', 'Irlanda del Norte', 'player', 'common', 'versus', 'gb-nir'),
  ('92d27e77-4d7f-42b4-b543-bbf900fa7596', '00000000-0000-0000-0000-000000003026', 'E6', 590, 'Irlanda del Norte', 'NIR', 'Irlanda del Norte', 'team_photo', 'common', 'versus', 'gb-nir'),
  ('a69d7677-7b4c-44a6-bc34-b785329846a1', '00000000-0000-0000-0000-000000003026', 'E7', 591, 'Gales', 'WAL', 'Gales', 'logo', 'foil', 'versus', 'gb-wls'),
  ('f883e851-3bde-4006-999c-a050e49cbc0e', '00000000-0000-0000-0000-000000003026', 'E8', 592, 'Gales', 'WAL', 'Gales', 'player', 'common', 'versus', 'gb-wls'),
  ('14a8d3f0-6127-4364-8b0a-7b6320088e98', '00000000-0000-0000-0000-000000003026', 'E9', 593, 'Gales', 'WAL', 'Gales', 'team_photo', 'common', 'versus', 'gb-wls'),
  ('58433a6a-3c88-46eb-b380-3122fdc1f45a', '00000000-0000-0000-0000-000000003026', 'E10', 594, 'Bosnia', 'BIH', 'Bosnia', 'logo', 'foil', 'versus', 'ba'),
  ('d3aa5de4-e150-4fdb-a143-225385f51ed2', '00000000-0000-0000-0000-000000003026', 'E11', 595, 'Bosnia', 'BIH', 'Bosnia', 'player', 'common', 'versus', 'ba'),
  ('b49c3585-8815-48e0-85ac-0cdf3552f75a', '00000000-0000-0000-0000-000000003026', 'E12', 596, 'Bosnia', 'BIH', 'Bosnia', 'team_photo', 'common', 'versus', 'ba'),
  ('b808cc6e-dd1a-4144-960a-2ace8f63051a', '00000000-0000-0000-0000-000000003026', 'E13', 597, 'Ucrania', 'UKR', 'Ucrania', 'logo', 'foil', 'versus', 'ua'),
  ('804d13f7-c6ff-46a1-9cde-38febd9f9510', '00000000-0000-0000-0000-000000003026', 'E14', 598, 'Ucrania', 'UKR', 'Ucrania', 'player', 'common', 'versus', 'ua'),
  ('d3b4f83b-566e-4185-9628-6acd2078b86d', '00000000-0000-0000-0000-000000003026', 'E15', 599, 'Ucrania', 'UKR', 'Ucrania', 'team_photo', 'common', 'versus', 'ua'),
  ('9f2f5981-a218-4d21-884a-511f567366fb', '00000000-0000-0000-0000-000000003026', 'E16', 600, 'Suecia', 'SWE', 'Suecia', 'logo', 'foil', 'versus', 'se'),
  ('8d147a81-e2a0-4b0f-9cad-028b22eee0ff', '00000000-0000-0000-0000-000000003026', 'E17', 601, 'Suecia', 'SWE', 'Suecia', 'player', 'common', 'versus', 'se'),
  ('789b51f0-5013-470c-a7d0-d8cf1bf142e9', '00000000-0000-0000-0000-000000003026', 'E18', 602, 'Suecia', 'SWE', 'Suecia', 'team_photo', 'common', 'versus', 'se'),
  ('ede893c0-f5a5-42ff-921e-08513cbdd458', '00000000-0000-0000-0000-000000003026', 'E19', 603, 'Polonia', 'POL', 'Polonia', 'logo', 'foil', 'versus', 'pl'),
  ('5c926884-fb23-404b-8f9a-3270556d258c', '00000000-0000-0000-0000-000000003026', 'E20', 604, 'Polonia', 'POL', 'Polonia', 'player', 'common', 'versus', 'pl'),
  ('eeee642c-1368-4cdb-aadb-6070b8432f95', '00000000-0000-0000-0000-000000003026', 'E21', 605, 'Polonia', 'POL', 'Polonia', 'team_photo', 'common', 'versus', 'pl'),
  ('110d9647-1ea5-4980-9781-eb71f2f1f534', '00000000-0000-0000-0000-000000003026', 'E22', 606, 'Albania', 'ALB', 'Albania', 'logo', 'foil', 'versus', 'al'),
  ('cdb71cc2-2d36-4035-a1f9-b9453f8a6d5d', '00000000-0000-0000-0000-000000003026', 'E23', 607, 'Albania', 'ALB', 'Albania', 'player', 'common', 'versus', 'al'),
  ('22ffed1b-d35b-4f9c-90d1-23ae179a74ea', '00000000-0000-0000-0000-000000003026', 'E24', 608, 'Albania', 'ALB', 'Albania', 'team_photo', 'common', 'versus', 'al'),
  ('4a5bdaf9-ffeb-46d5-b567-4fc01193b49a', '00000000-0000-0000-0000-000000003026', 'E25', 609, 'Turquía', 'TUR', 'Turquía', 'logo', 'foil', 'versus', 'tr'),
  ('1e854679-2815-4caa-bb2f-6078ab4c127d', '00000000-0000-0000-0000-000000003026', 'E26', 610, 'Turquía', 'TUR', 'Turquía', 'player', 'common', 'versus', 'tr'),
  ('be89bea8-9c89-4f49-a48d-08ba1752e5fe', '00000000-0000-0000-0000-000000003026', 'E27', 611, 'Turquía', 'TUR', 'Turquía', 'team_photo', 'common', 'versus', 'tr'),
  ('2d86d8e2-0752-4d28-b411-15da86c9ed10', '00000000-0000-0000-0000-000000003026', 'E28', 612, 'Rumania', 'ROU', 'Rumania', 'logo', 'foil', 'versus', 'ro'),
  ('15846a2d-fbad-4573-9883-b233596ddf16', '00000000-0000-0000-0000-000000003026', 'E29', 613, 'Rumania', 'ROU', 'Rumania', 'player', 'common', 'versus', 'ro'),
  ('79edc931-f624-4b46-a2c4-1d9477c4da11', '00000000-0000-0000-0000-000000003026', 'E30', 614, 'Rumania', 'ROU', 'Rumania', 'team_photo', 'common', 'versus', 'ro'),
  ('e67f6231-6781-47a1-8ce2-5955959d71f0', '00000000-0000-0000-0000-000000003026', 'E31', 615, 'Eslovaquia', 'SVK', 'Eslovaquia', 'logo', 'foil', 'versus', 'sk'),
  ('cdad2860-50ba-4c2d-8a10-857aec7027dd', '00000000-0000-0000-0000-000000003026', 'E32', 616, 'Eslovaquia', 'SVK', 'Eslovaquia', 'player', 'common', 'versus', 'sk'),
  ('6b3f6c7c-83e3-4c16-9879-a491dd711582', '00000000-0000-0000-0000-000000003026', 'E33', 617, 'Eslovaquia', 'SVK', 'Eslovaquia', 'team_photo', 'common', 'versus', 'sk'),
  ('0aa2a3f5-ee03-4ad8-8ac0-d4b58bd4064f', '00000000-0000-0000-0000-000000003026', 'E34', 618, 'Kosovo', 'KOS', 'Kosovo', 'logo', 'foil', 'versus', 'xk'),
  ('ac0d1c69-a1fa-4a90-97de-c4b910eabdf4', '00000000-0000-0000-0000-000000003026', 'E35', 619, 'Kosovo', 'KOS', 'Kosovo', 'player', 'common', 'versus', 'xk'),
  ('1f80b2d4-9ba3-4bda-b56e-087d04ca7a57', '00000000-0000-0000-0000-000000003026', 'E36', 620, 'Kosovo', 'KOS', 'Kosovo', 'team_photo', 'common', 'versus', 'xk'),
  ('fe39ad69-61cf-47a4-9a70-c6c76ccc415c', '00000000-0000-0000-0000-000000003026', 'E37', 621, 'Dinamarca', 'DEN', 'Dinamarca', 'logo', 'foil', 'versus', 'dk'),
  ('20279046-2f9a-448e-a04d-743e3394e988', '00000000-0000-0000-0000-000000003026', 'E38', 622, 'Dinamarca', 'DEN', 'Dinamarca', 'player', 'common', 'versus', 'dk'),
  ('03cdef5f-f3e6-4e6f-a46f-0cac76f4e98e', '00000000-0000-0000-0000-000000003026', 'E39', 623, 'Dinamarca', 'DEN', 'Dinamarca', 'team_photo', 'common', 'versus', 'dk'),
  ('73a18379-4c6a-4dd2-a6e3-0a4228f78991', '00000000-0000-0000-0000-000000003026', 'E40', 624, 'Macedonia del Norte', 'MKD', 'Macedonia del Norte', 'logo', 'foil', 'versus', 'mk'),
  ('a9b9ef04-8949-4508-9bcb-e1e6fc3562da', '00000000-0000-0000-0000-000000003026', 'E41', 625, 'Macedonia del Norte', 'MKD', 'Macedonia del Norte', 'player', 'common', 'versus', 'mk'),
  ('682800dd-1f22-49eb-82a4-517dfdff3ba3', '00000000-0000-0000-0000-000000003026', 'E42', 626, 'Macedonia del Norte', 'MKD', 'Macedonia del Norte', 'team_photo', 'common', 'versus', 'mk'),
  ('22c42fa5-ecdf-4b63-98cd-5eb93b4ff9d9', '00000000-0000-0000-0000-000000003026', 'E43', 627, 'República Checa', 'CZE', 'República Checa', 'logo', 'foil', 'versus', 'cz'),
  ('5a5dd142-13c1-4eea-8d71-6bfa75358f1e', '00000000-0000-0000-0000-000000003026', 'E44', 628, 'República Checa', 'CZE', 'República Checa', 'player', 'common', 'versus', 'cz'),
  ('d4c0d076-2c74-4e22-a5c3-8cc70369f5cb', '00000000-0000-0000-0000-000000003026', 'E45', 629, 'República Checa', 'CZE', 'República Checa', 'team_photo', 'common', 'versus', 'cz'),
  ('e55282d6-3d4b-414c-a566-6b5fe507b1d9', '00000000-0000-0000-0000-000000003026', 'E46', 630, 'Irlanda', 'IRL', 'Irlanda', 'logo', 'foil', 'versus', 'ie'),
  ('3371ad3a-0e53-46c6-9e42-5b58daf0b24b', '00000000-0000-0000-0000-000000003026', 'E47', 631, 'Irlanda', 'IRL', 'Irlanda', 'player', 'common', 'versus', 'ie'),
  ('a412c6b1-213d-44d4-b4a0-9e525af78a96', '00000000-0000-0000-0000-000000003026', 'E48', 632, 'Irlanda', 'IRL', 'Irlanda', 'team_photo', 'common', 'versus', 'ie'),
  ('5b30b0eb-3462-4db5-a505-bd8c1526a31e', '00000000-0000-0000-0000-000000003026', 'E49', 633, 'Nueva Caledonia', 'NCL', 'Nueva Caledonia', 'logo', 'foil', 'versus', NULL),
  ('cb1f44ee-95fd-4ce1-a666-76dc0d591047', '00000000-0000-0000-0000-000000003026', 'E50', 634, 'Nueva Caledonia', 'NCL', 'Nueva Caledonia', 'player', 'common', 'versus', NULL),
  ('77b5ef71-9c9c-400f-82da-a14489c4dbe8', '00000000-0000-0000-0000-000000003026', 'E51', 635, 'Nueva Caledonia', 'NCL', 'Nueva Caledonia', 'team_photo', 'common', 'versus', NULL),
  ('be1ea6c1-5faa-445c-b571-18ef566dfecb', '00000000-0000-0000-0000-000000003026', 'E52', 636, 'Jamaica', 'JAM', 'Jamaica', 'logo', 'foil', 'versus', 'jm'),
  ('d9e5c76c-0d04-4427-a1d9-10a82d56b073', '00000000-0000-0000-0000-000000003026', 'E53', 637, 'Jamaica', 'JAM', 'Jamaica', 'player', 'common', 'versus', 'jm'),
  ('bb03b51a-599d-49a7-a40f-20fca7706105', '00000000-0000-0000-0000-000000003026', 'E54', 638, 'Jamaica', 'JAM', 'Jamaica', 'team_photo', 'common', 'versus', 'jm'),
  ('330f7119-fb66-4adc-868f-8d16e638390f', '00000000-0000-0000-0000-000000003026', 'E55', 639, 'Bolivia', 'BOL', 'Bolivia', 'logo', 'foil', 'versus', 'bo'),
  ('581dd134-da67-4915-8fce-4c7d5bab9eaa', '00000000-0000-0000-0000-000000003026', 'E56', 640, 'Bolivia', 'BOL', 'Bolivia', 'player', 'common', 'versus', 'bo'),
  ('c194d74c-139d-48a3-9c80-81e3a75630a5', '00000000-0000-0000-0000-000000003026', 'E57', 641, 'Bolivia', 'BOL', 'Bolivia', 'team_photo', 'common', 'versus', 'bo'),
  ('4f6bbb62-dfba-44cf-9d5e-f85de4400943', '00000000-0000-0000-0000-000000003026', 'E58', 642, 'Surinam', 'SUR', 'Surinam', 'logo', 'foil', 'versus', 'sr'),
  ('a25b3e2b-7fe8-4b20-a37d-13f69bf8f0c6', '00000000-0000-0000-0000-000000003026', 'E59', 643, 'Surinam', 'SUR', 'Surinam', 'player', 'common', 'versus', 'sr'),
  ('0d411eb3-a2a0-4f02-9a80-f8d776649cdb', '00000000-0000-0000-0000-000000003026', 'E60', 644, 'Surinam', 'SUR', 'Surinam', 'team_photo', 'common', 'versus', 'sr'),
  ('290eee1f-ca15-4de5-a84c-82f0166f2ae0', '00000000-0000-0000-0000-000000003026', 'E61', 645, 'R.D. Congo', 'COD', 'R.D. Congo', 'logo', 'foil', 'versus', 'cd'),
  ('2d8043a4-82f9-4b68-9d79-2c388a96d5cc', '00000000-0000-0000-0000-000000003026', 'E62', 646, 'R.D. Congo', 'COD', 'R.D. Congo', 'player', 'common', 'versus', 'cd'),
  ('c7766c71-8ea0-41d5-8484-58af601ee054', '00000000-0000-0000-0000-000000003026', 'E63', 647, 'R.D. Congo', 'COD', 'R.D. Congo', 'team_photo', 'common', 'versus', 'cd'),
  ('10069c81-ee4a-4fda-a7cc-d83af797f288', '00000000-0000-0000-0000-000000003026', 'E64', 648, 'Iraq', 'IRQ', 'Iraq', 'logo', 'foil', 'versus', 'iq'),
  ('20b881e1-3c27-4e1d-912f-7a9a7d82ae9d', '00000000-0000-0000-0000-000000003026', 'E65', 649, 'Iraq', 'IRQ', 'Iraq', 'player', 'common', 'versus', 'iq'),
  ('f6deff65-5d54-4bf8-8913-1758d588196c', '00000000-0000-0000-0000-000000003026', 'E66', 650, 'Iraq', 'IRQ', 'Iraq', 'team_photo', 'common', 'versus', 'iq')
ON CONFLICT DO NOTHING;
