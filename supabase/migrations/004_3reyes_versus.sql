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
  ('c68149e0-dce4-4a29-9dd5-46ea8cb2838b', '00000000-0000-0000-0000-000000003026', 'E1', 585, 'Italia', 'ITA', NULL, 'logo', 'foil', 'versus', 'it'),
  ('78f5b8de-3b4a-4b16-b91f-62d9bf441215', '00000000-0000-0000-0000-000000003026', 'E2', 586, 'Italia', 'ITA', NULL, 'player', 'common', 'versus', 'it'),
  ('5ca67f1a-1f05-4ac3-844d-d66e3d86a2a6', '00000000-0000-0000-0000-000000003026', 'E3', 587, 'Italia', 'ITA', NULL, 'team_photo', 'common', 'versus', 'it'),
  ('66fd42fe-8ab8-4abb-afee-75fbda5ac77a', '00000000-0000-0000-0000-000000003026', 'E4', 588, 'Irlanda del Norte', 'NIR', NULL, 'logo', 'foil', 'versus', 'gb-nir'),
  ('20e61902-9b4f-4976-af66-689eda8addb6', '00000000-0000-0000-0000-000000003026', 'E5', 589, 'Irlanda del Norte', 'NIR', NULL, 'player', 'common', 'versus', 'gb-nir'),
  ('ca29d2bc-4656-440e-be86-9336bf1f5c82', '00000000-0000-0000-0000-000000003026', 'E6', 590, 'Irlanda del Norte', 'NIR', NULL, 'team_photo', 'common', 'versus', 'gb-nir'),
  ('01071286-1058-424a-a6d6-a04ea6ad79e2', '00000000-0000-0000-0000-000000003026', 'E7', 591, 'Gales', 'WAL', NULL, 'logo', 'foil', 'versus', 'gb-wls'),
  ('7a032f2d-576f-4ca6-927b-abdd2f3c120e', '00000000-0000-0000-0000-000000003026', 'E8', 592, 'Gales', 'WAL', NULL, 'player', 'common', 'versus', 'gb-wls'),
  ('3c066bc6-9e86-4e0e-b85e-8dd6b0fe949a', '00000000-0000-0000-0000-000000003026', 'E9', 593, 'Gales', 'WAL', NULL, 'team_photo', 'common', 'versus', 'gb-wls'),
  ('28f0a7f5-e824-4240-a42a-113c3e8f14cf', '00000000-0000-0000-0000-000000003026', 'E10', 594, 'Bosnia', 'BIH', NULL, 'logo', 'foil', 'versus', 'ba'),
  ('bc5b2551-66cc-4e30-9a39-ff3ee343343c', '00000000-0000-0000-0000-000000003026', 'E11', 595, 'Bosnia', 'BIH', NULL, 'player', 'common', 'versus', 'ba'),
  ('b057e5e1-f264-4bac-9683-337a29f3fecc', '00000000-0000-0000-0000-000000003026', 'E12', 596, 'Bosnia', 'BIH', NULL, 'team_photo', 'common', 'versus', 'ba'),
  ('aaf2f84f-f02f-4cac-8797-ba96ecb4f9b4', '00000000-0000-0000-0000-000000003026', 'E13', 597, 'Ucrania', 'UKR', NULL, 'logo', 'foil', 'versus', 'ua'),
  ('25f01281-51f2-4122-8cd8-492645230c20', '00000000-0000-0000-0000-000000003026', 'E14', 598, 'Ucrania', 'UKR', NULL, 'player', 'common', 'versus', 'ua'),
  ('729ffd0e-c078-48db-86a2-3d5dedd24d9c', '00000000-0000-0000-0000-000000003026', 'E15', 599, 'Ucrania', 'UKR', NULL, 'team_photo', 'common', 'versus', 'ua'),
  ('e093f9b5-a630-4508-973b-56cc26217db0', '00000000-0000-0000-0000-000000003026', 'E16', 600, 'Suecia', 'SWE', NULL, 'logo', 'foil', 'versus', 'se'),
  ('cdab134e-763e-433c-932f-4bcc4317244a', '00000000-0000-0000-0000-000000003026', 'E17', 601, 'Suecia', 'SWE', NULL, 'player', 'common', 'versus', 'se'),
  ('a1b58f8c-ad4c-4fc8-95b0-de944f357aff', '00000000-0000-0000-0000-000000003026', 'E18', 602, 'Suecia', 'SWE', NULL, 'team_photo', 'common', 'versus', 'se'),
  ('ee3da3f9-f2e4-4f9f-950a-40d01d197a1d', '00000000-0000-0000-0000-000000003026', 'E19', 603, 'Polonia', 'POL', NULL, 'logo', 'foil', 'versus', 'pl'),
  ('66e6ccfd-89ac-455f-91e9-6e1504f441f6', '00000000-0000-0000-0000-000000003026', 'E20', 604, 'Polonia', 'POL', NULL, 'player', 'common', 'versus', 'pl'),
  ('c3f8f8fd-ce57-496b-a1cb-049b9078cc50', '00000000-0000-0000-0000-000000003026', 'E21', 605, 'Polonia', 'POL', NULL, 'team_photo', 'common', 'versus', 'pl'),
  ('6b38b0bd-039b-4dca-89f8-2dcebaaabe29', '00000000-0000-0000-0000-000000003026', 'E22', 606, 'Albania', 'ALB', NULL, 'logo', 'foil', 'versus', 'al'),
  ('156d8e4e-0293-4624-b865-2dc21723454d', '00000000-0000-0000-0000-000000003026', 'E23', 607, 'Albania', 'ALB', NULL, 'player', 'common', 'versus', 'al'),
  ('bd97cf13-a330-497a-aee8-fb3aa7879a90', '00000000-0000-0000-0000-000000003026', 'E24', 608, 'Albania', 'ALB', NULL, 'team_photo', 'common', 'versus', 'al'),
  ('37aedaa0-98a7-499f-af9b-be9b800ecc67', '00000000-0000-0000-0000-000000003026', 'E25', 609, 'Turquía', 'TUR', NULL, 'logo', 'foil', 'versus', 'tr'),
  ('58853f38-c631-4240-8a5a-98a1afb224ed', '00000000-0000-0000-0000-000000003026', 'E26', 610, 'Turquía', 'TUR', NULL, 'player', 'common', 'versus', 'tr'),
  ('89ee3460-fd6e-46c5-8888-6280626e4a1a', '00000000-0000-0000-0000-000000003026', 'E27', 611, 'Turquía', 'TUR', NULL, 'team_photo', 'common', 'versus', 'tr'),
  ('8003abbf-5ec4-44d9-8b53-12e22ae5b0e6', '00000000-0000-0000-0000-000000003026', 'E28', 612, 'Rumania', 'ROU', NULL, 'logo', 'foil', 'versus', 'ro'),
  ('3fc32c11-22b1-4de5-8bc5-bf43dd58e1be', '00000000-0000-0000-0000-000000003026', 'E29', 613, 'Rumania', 'ROU', NULL, 'player', 'common', 'versus', 'ro'),
  ('6b7ea2f6-402c-49ba-9e94-b774e526d67f', '00000000-0000-0000-0000-000000003026', 'E30', 614, 'Rumania', 'ROU', NULL, 'team_photo', 'common', 'versus', 'ro'),
  ('281865de-7abf-4c82-a0e8-541c785a535f', '00000000-0000-0000-0000-000000003026', 'E31', 615, 'Eslovaquia', 'SVK', NULL, 'logo', 'foil', 'versus', 'sk'),
  ('6b04fdb2-8415-44bd-a47c-af1f4dcc90b5', '00000000-0000-0000-0000-000000003026', 'E32', 616, 'Eslovaquia', 'SVK', NULL, 'player', 'common', 'versus', 'sk'),
  ('2782e5bd-7ceb-40aa-8a4b-4a3c3d190f12', '00000000-0000-0000-0000-000000003026', 'E33', 617, 'Eslovaquia', 'SVK', NULL, 'team_photo', 'common', 'versus', 'sk'),
  ('15c1ae4c-bc28-4f7f-b96b-584331bab05f', '00000000-0000-0000-0000-000000003026', 'E34', 618, 'Kosovo', 'KOS', NULL, 'logo', 'foil', 'versus', 'xk'),
  ('19c3cd8f-899c-444b-aff6-53551227b0b8', '00000000-0000-0000-0000-000000003026', 'E35', 619, 'Kosovo', 'KOS', NULL, 'player', 'common', 'versus', 'xk'),
  ('4ac78f6e-5332-4abe-ae66-93a4bfb3151c', '00000000-0000-0000-0000-000000003026', 'E36', 620, 'Kosovo', 'KOS', NULL, 'team_photo', 'common', 'versus', 'xk'),
  ('5a3e2fe8-5349-46ef-8bc6-098c54f67444', '00000000-0000-0000-0000-000000003026', 'E37', 621, 'Dinamarca', 'DEN', NULL, 'logo', 'foil', 'versus', 'dk'),
  ('31886e94-b1c4-4d28-9e81-a429f41b3d31', '00000000-0000-0000-0000-000000003026', 'E38', 622, 'Dinamarca', 'DEN', NULL, 'player', 'common', 'versus', 'dk'),
  ('d36d61c1-ebb1-4ce3-aa04-24f46f151b46', '00000000-0000-0000-0000-000000003026', 'E39', 623, 'Dinamarca', 'DEN', NULL, 'team_photo', 'common', 'versus', 'dk'),
  ('9a27e5cc-2db6-4b70-950e-fea981139dfc', '00000000-0000-0000-0000-000000003026', 'E40', 624, 'Macedonia del Norte', 'MKD', NULL, 'logo', 'foil', 'versus', 'mk'),
  ('b63831c5-449f-4c6c-b9e3-6da4accc4a0c', '00000000-0000-0000-0000-000000003026', 'E41', 625, 'Macedonia del Norte', 'MKD', NULL, 'player', 'common', 'versus', 'mk'),
  ('aa979be3-4aea-45c6-b0dc-632ebaa88347', '00000000-0000-0000-0000-000000003026', 'E42', 626, 'Macedonia del Norte', 'MKD', NULL, 'team_photo', 'common', 'versus', 'mk'),
  ('5ee6eca1-e1be-4837-b26d-f7a0ccf12462', '00000000-0000-0000-0000-000000003026', 'E43', 627, 'República Checa', 'CZE', NULL, 'logo', 'foil', 'versus', 'cz'),
  ('613942f1-1371-49f9-bd9e-d682dbb69a8c', '00000000-0000-0000-0000-000000003026', 'E44', 628, 'República Checa', 'CZE', NULL, 'player', 'common', 'versus', 'cz'),
  ('69458a55-bf17-46a1-b859-96c7b2716965', '00000000-0000-0000-0000-000000003026', 'E45', 629, 'República Checa', 'CZE', NULL, 'team_photo', 'common', 'versus', 'cz'),
  ('0beef7c6-8930-4fd1-9591-6bfb288261cd', '00000000-0000-0000-0000-000000003026', 'E46', 630, 'Irlanda', 'IRL', NULL, 'logo', 'foil', 'versus', 'ie'),
  ('2291a754-44fd-4736-b2c2-3f995f90e264', '00000000-0000-0000-0000-000000003026', 'E47', 631, 'Irlanda', 'IRL', NULL, 'player', 'common', 'versus', 'ie'),
  ('acc93b76-8b4e-4e73-a321-b323e553a6cf', '00000000-0000-0000-0000-000000003026', 'E48', 632, 'Irlanda', 'IRL', NULL, 'team_photo', 'common', 'versus', 'ie'),
  ('8c1e7a43-880f-446d-9efa-3a8ffb015eb4', '00000000-0000-0000-0000-000000003026', 'E49', 633, 'Nueva Caledonia', 'NCL', NULL, 'logo', 'foil', 'versus', NULL),
  ('2c65b780-a994-433b-a275-72697095f032', '00000000-0000-0000-0000-000000003026', 'E50', 634, 'Nueva Caledonia', 'NCL', NULL, 'player', 'common', 'versus', NULL),
  ('1ace6510-19b7-49e3-a8ab-ce8d1d5cd6aa', '00000000-0000-0000-0000-000000003026', 'E51', 635, 'Nueva Caledonia', 'NCL', NULL, 'team_photo', 'common', 'versus', NULL),
  ('f62a0dae-38a8-4731-9b58-adfad5c44228', '00000000-0000-0000-0000-000000003026', 'E52', 636, 'Jamaica', 'JAM', NULL, 'logo', 'foil', 'versus', 'jm'),
  ('abb5fe71-6a4c-40cf-bfb4-d35b8fea6798', '00000000-0000-0000-0000-000000003026', 'E53', 637, 'Jamaica', 'JAM', NULL, 'player', 'common', 'versus', 'jm'),
  ('fd325778-413e-4a5b-8116-9a2410547f52', '00000000-0000-0000-0000-000000003026', 'E54', 638, 'Jamaica', 'JAM', NULL, 'team_photo', 'common', 'versus', 'jm'),
  ('0c738a25-0101-405f-89ed-37425711868c', '00000000-0000-0000-0000-000000003026', 'E55', 639, 'Bolivia', 'BOL', NULL, 'logo', 'foil', 'versus', 'bo'),
  ('311150ba-8c59-4d0c-8166-f2233addbbd4', '00000000-0000-0000-0000-000000003026', 'E56', 640, 'Bolivia', 'BOL', NULL, 'player', 'common', 'versus', 'bo'),
  ('bbea94a3-5cc6-41b8-a0aa-1a51ef369ee4', '00000000-0000-0000-0000-000000003026', 'E57', 641, 'Bolivia', 'BOL', NULL, 'team_photo', 'common', 'versus', 'bo'),
  ('880d5d33-0d0a-407f-9e77-e74886a03f4c', '00000000-0000-0000-0000-000000003026', 'E58', 642, 'Surinam', 'SUR', NULL, 'logo', 'foil', 'versus', 'sr'),
  ('3b16c25c-a4e6-4be7-ac3f-61d2b8aa0b60', '00000000-0000-0000-0000-000000003026', 'E59', 643, 'Surinam', 'SUR', NULL, 'player', 'common', 'versus', 'sr'),
  ('5d6765d9-fd06-474d-8ce0-7687b4bfc47f', '00000000-0000-0000-0000-000000003026', 'E60', 644, 'Surinam', 'SUR', NULL, 'team_photo', 'common', 'versus', 'sr'),
  ('76bf3448-4ff5-4d86-8da9-da0c9abc3b63', '00000000-0000-0000-0000-000000003026', 'E61', 645, 'R.D. Congo', 'COD', NULL, 'logo', 'foil', 'versus', 'cd'),
  ('2a587f8e-6fab-4b64-b434-f078960106bc', '00000000-0000-0000-0000-000000003026', 'E62', 646, 'R.D. Congo', 'COD', NULL, 'player', 'common', 'versus', 'cd'),
  ('8aa42936-96ff-4d01-a0e9-cdf6eb1992ff', '00000000-0000-0000-0000-000000003026', 'E63', 647, 'R.D. Congo', 'COD', NULL, 'team_photo', 'common', 'versus', 'cd'),
  ('8798bfd7-6cf7-4c87-ac9d-89d4adf6d5fc', '00000000-0000-0000-0000-000000003026', 'E64', 648, 'Iraq', 'IRQ', NULL, 'logo', 'foil', 'versus', 'iq'),
  ('3d505629-4379-4b23-a444-82ecbabcacc1', '00000000-0000-0000-0000-000000003026', 'E65', 649, 'Iraq', 'IRQ', NULL, 'player', 'common', 'versus', 'iq'),
  ('9f0c4009-dd61-4fe5-a64f-63eb7a88b1ab', '00000000-0000-0000-0000-000000003026', 'E66', 650, 'Iraq', 'IRQ', NULL, 'team_photo', 'common', 'versus', 'iq')
ON CONFLICT DO NOTHING;
