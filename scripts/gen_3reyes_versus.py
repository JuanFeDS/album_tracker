"""
gen_3reyes_versus.py
Generates supabase/migrations/004_3reyes_versus.sql
E1-E66: 11 versus matchups × 6 stickers (3 per team)
"""
import uuid, pathlib

ALBUM_ID = '00000000-0000-0000-0000-000000003026'

# (code_a, name_a, flag_a, code_b, name_b, flag_b)
MATCHUPS = [
    ('ITA', 'Italia',            'it',     'NIR', 'Irlanda del Norte', 'gb-nir'),
    ('WAL', 'Gales',             'gb-wls', 'BIH', 'Bosnia',            'ba'),
    ('UKR', 'Ucrania',           'ua',     'SWE', 'Suecia',            'se'),
    ('POL', 'Polonia',           'pl',     'ALB', 'Albania',           'al'),
    ('TUR', 'Turquía',           'tr',     'ROU', 'Rumania',           'ro'),
    ('SVK', 'Eslovaquia',        'sk',     'KOS', 'Kosovo',            'xk'),
    ('DEN', 'Dinamarca',         'dk',     'MKD', 'Macedonia del Norte','mk'),
    ('CZE', 'República Checa',   'cz',     'IRL', 'Irlanda',           'ie'),
    ('NCL', 'Nueva Caledonia',   None,     'JAM', 'Jamaica',           'jm'),
    ('BOL', 'Bolivia',           'bo',     'SUR', 'Surinam',           'sr'),
    ('COD', 'R.D. Congo',        'cd',     'IRQ', 'Iraq',              'iq'),
]

def classify(pos: int) -> tuple[str, str]:
    """(sticker_type, rarity) for pos 0-2 within a 3-sticker team block."""
    if pos == 0: return ('logo', 'foil')
    if pos == 2: return ('team_photo', 'common')
    return ('player', 'common')

def q(v: str | None) -> str:
    if v is None: return 'NULL'
    return "'" + v.replace("'", "''") + "'"

root   = pathlib.Path(__file__).parent.parent
out    = root / 'supabase' / 'migrations' / '004_3reyes_versus.sql'
lines  = []

lines += [
    '-- ============================================================',
    '-- 004_3reyes_versus.sql',
    '-- Versus section for 3 Reyes: E1-E66 (11 matchups × 6 stickers)',
    '-- ============================================================',
    '',
    "-- Allow 'versus' as a valid section value",
    'ALTER TABLE stickers DROP CONSTRAINT IF EXISTS stickers_section_check;',
    "ALTER TABLE stickers ADD CONSTRAINT stickers_section_check",
    "  CHECK (section IN ('teams','intro','museum','versus'));",
    '',
    '-- Navigation section for 3 Reyes',
    'INSERT INTO sections (album_id, key, label, icon, display_order) VALUES',
    f"  ('{ALBUM_ID}', 'versus', 'Versus', '⚔️', 4)",
    'ON CONFLICT DO NOTHING;',
    '',
    '-- Update total sticker count (584 + 66)',
    f"UPDATE albums SET total_stickers = 650 WHERE id = '{ALBUM_ID}';",
    '',
    '-- Versus stickers E1-E66',
    'INSERT INTO stickers',
    '  (id, album_id, code, number, team, team_code, player_name, sticker_type, rarity, section, flag_code)',
    'VALUES',
]

rows = []
e_num = 1
db_num = 585  # continues after the 584 sequential stickers

for code_a, name_a, flag_a, code_b, name_b, flag_b in MATCHUPS:
    for team_code, team_name, flag_code in [(code_a, name_a, flag_a), (code_b, name_b, flag_b)]:
        for pos in range(3):
            stype, rarity = classify(pos)
            code  = f'E{e_num}'
            uid   = str(uuid.uuid4())
            rows.append(
                f"  ('{uid}', '{ALBUM_ID}', '{code}', {db_num}, "
                f"{q(team_name)}, {q(team_code)}, NULL, "
                f"'{stype}', '{rarity}', 'versus', {q(flag_code)})"
            )
            e_num  += 1
            db_num += 1

lines.append(',\n'.join(rows))
lines.append('ON CONFLICT DO NOTHING;')
lines.append('')

out.write_text('\n'.join(lines), encoding='utf-8')
print(f'Generated {out} — {e_num - 1} versus stickers (E1-E{e_num-1})')
