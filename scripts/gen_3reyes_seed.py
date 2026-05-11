"""
gen_3reyes_seed.py
Generates supabase/migrations/003_3reyes_seed.sql from stickers.json
"""
import json, uuid, pathlib, sys

ALBUM_ID   = '00000000-0000-0000-0000-000000003026'
ALBUM_SLUG = '3reyes-wc-2026'
ALBUM_NAME = '3 Reyes del Mundial'
ALBUM_DESC = 'Álbum del Mundial FIFA 2026 - Editorial 3 Reyes (Navarrete)'

# (team_code, flag_code_iso2)
TEAM_INFO: dict[str, tuple[str, str | None]] = {
    'México':               ('MEX', 'mx'),
    'República Checa':      ('CZE', 'cz'),
    'Corea del Sur':        ('KOR', 'kr'),
    'Sudáfrica':            ('ZAF', 'za'),
    'Canadá':               ('CAN', 'ca'),
    'Bosnia y Herzegovina': ('BIH', 'ba'),
    'Suiza':                ('SUI', 'ch'),
    'Catar':                ('QAT', 'qa'),
    'Brasil':               ('BRA', 'br'),
    'Marruecos':            ('MAR', 'ma'),
    'Escocia':              ('SCO', 'gb-sct'),
    'Haití':                ('HAI', 'ht'),
    'EE.UU.':               ('USA', 'us'),
    'Paraguay':             ('PAR', 'py'),
    'Australia':            ('AUS', 'au'),
    'Turquía':              ('TUR', 'tr'),
    'Alemania':             ('GER', 'de'),
    'Ecuador':              ('ECU', 'ec'),
    'Costa de Marfil':      ('CIV', 'ci'),
    'Curazao':              ('CUW', 'cw'),
    'Países Bajos':         ('NED', 'nl'),
    # Sección sin nombre: 263-278 → asumimos Suecia (clasificó UEFA playoff B)
    'Sección sin nombre':   ('SWE', 'se'),
    'Japón':                ('JPN', 'jp'),
    'Túnez':                ('TUN', 'tn'),
    'Bélgica':              ('BEL', 'be'),
    'Egipto':               ('EGY', 'eg'),
    'Irán':                 ('IRN', 'ir'),
    'Nueva Zelanda':        ('NZL', 'nz'),
    'España':               ('ESP', 'es'),
    'Uruguay':              ('URU', 'uy'),
    'Cabo Verde':           ('CPV', 'cv'),
    'Arabia Saudita':       ('KSA', 'sa'),
    'Francia':              ('FRA', 'fr'),
    'Noruega':              ('NOR', 'no'),
    'Senegal':              ('SEN', 'sn'),
    'Argentina':            ('ARG', 'ar'),
    'Austria':              ('AUT', 'at'),
    'Jordania':             ('JOR', 'jo'),
    'Argelia':              ('ALG', 'dz'),
    'Portugal':             ('POR', 'pt'),
    'Colombia':             ('COL', 'co'),
    'Uzbekistán':           ('UZB', 'uz'),
    'R.D. Congo':           ('COD', 'cd'),
    'Inglaterra':           ('ENG', 'gb-eng'),
    'Croacia':              ('CRO', 'hr'),
    'Ghana':                ('GHA', 'gh'),
    'Panamá':               ('PAN', 'pa'),
}

def classify(pos: int, total: int) -> tuple[str, str]:
    """Returns (sticker_type, rarity) for a sticker at 0-based position in a team block."""
    if total == 1:
        return ('special', 'common')
    if pos == 0:
        return ('logo', 'foil')
    if pos == total - 1:
        return ('team_photo', 'common')
    return ('player', 'common')

def q(v: str | None) -> str:
    if v is None:
        return 'NULL'
    return "'" + v.replace("'", "''") + "'"

root = pathlib.Path(__file__).parent.parent
with open(root / 'stickers.json', encoding='utf-8') as f:
    data = json.load(f)

rows: list[dict] = []

for sec in data['sections']:
    cat  = sec['category']
    name = sec['name']

    # ── Estadios ─────────────────────────────────────────────────
    if cat == 'stadiums':
        # stickers.json uses "stickers": [16] meaning sticker #16 is the marker;
        # but since México starts at 17 the stadiums block is 1-16.
        for n in range(1, 17):
            rows.append(dict(
                number=n, code=str(n),
                team='Estadios', team_code=None, flag_code=None,
                player_name=f'Estadio {n}',
                sticker_type='special', rarity='common',
                section='museum',
            ))

    # ── Equipos (y sección desconocida = repechaje) ───────────────
    elif cat in ('team', 'unknown'):
        rng   = sec['range']
        start = int(rng['start'])
        end   = int(rng['end'])
        total = end - start + 1

        # Display name: rename "Sección sin nombre" → "Suecia" in output
        display_name = 'Suecia' if name == 'Sección sin nombre' else name
        team_code, flag_code = TEAM_INFO.get(name, (name[:3].upper(), None))

        for i, n in enumerate(range(start, end + 1)):
            stype, rarity = classify(i, total)
            rows.append(dict(
                number=n, code=str(n),
                team=display_name, team_code=team_code, flag_code=flag_code,
                player_name=None,
                sticker_type=stype, rarity=rarity,
                section='teams',
            ))

    # ── Especiales (Campeones, Primera vez) ───────────────────────
    elif cat == 'special':
        rng = sec['range']
        # Skip T1-T48 (Selecciones die-cuts — no sequential number)
        if isinstance(rng.get('start'), str):
            continue
        start = int(rng['start'])
        end   = int(rng['end'])
        for n in range(start, end + 1):
            rows.append(dict(
                number=n, code=str(n),
                team=name, team_code=None, flag_code=None,
                player_name=None,
                sticker_type='special', rarity='common',
                section='intro',
            ))

rows.sort(key=lambda r: r['number'])
total_stickers = len(rows)

# ── Build SQL ─────────────────────────────────────────────────────
out = root / 'supabase' / 'migrations' / '003_3reyes_seed.sql'
lines: list[str] = []

lines += [
    '-- ============================================================',
    '-- 003_3reyes_seed.sql',
    '-- Album: 3 Reyes del Mundial (Editorial Navarrete)',
    f'-- {total_stickers} stickers secuenciales (1-584)',
    '-- Sección 263-278 mapeada como "Suecia" (TBD — confirmar)',
    '-- Egipto aparece dos veces (split: antes y después del versus)',
    '-- ============================================================',
    '',
    '-- Álbum',
    'INSERT INTO albums (id, slug, name, description, total_stickers, is_active) VALUES',
    f"  ('{ALBUM_ID}', '{ALBUM_SLUG}', '{ALBUM_NAME}', '{ALBUM_DESC}', {total_stickers}, true)",
    'ON CONFLICT DO NOTHING;',
    '',
    '-- Secciones de navegación',
    'INSERT INTO sections (album_id, key, label, icon, display_order) VALUES',
    f"  ('{ALBUM_ID}', 'museum', 'Estadios',   '🏟️', 1),",
    f"  ('{ALBUM_ID}', 'teams',  'Equipos',    '🌍', 2),",
    f"  ('{ALBUM_ID}', 'intro',  'Especiales', '⭐',  3)",
    'ON CONFLICT DO NOTHING;',
    '',
    '-- Láminas',
    'INSERT INTO stickers',
    '  (id, album_id, code, number, team, team_code, player_name, sticker_type, rarity, section, flag_code)',
    'VALUES',
]

sticker_rows = []
for r in rows:
    uid = str(uuid.uuid4())
    sticker_rows.append(
        f"  ('{uid}', '{ALBUM_ID}', {q(r['code'])}, {r['number']}, "
        f"{q(r['team'])}, {q(r['team_code'])}, {q(r['player_name'])}, "
        f"'{r['sticker_type']}', '{r['rarity']}', '{r['section']}', {q(r['flag_code'])})"
    )

lines.append(',\n'.join(sticker_rows))
lines.append('ON CONFLICT DO NOTHING;')
lines.append('')

out.write_text('\n'.join(lines), encoding='utf-8')
print(f'Generated {out} — {total_stickers} stickers')
