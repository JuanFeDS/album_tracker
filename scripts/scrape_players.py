"""
Scrape Panini WC 2026 sticker checklist and generate SQL UPDATEs.
- Corrects team photo position (should be XXX13, not XXX20)
- Fills in all player names

Source: cartophilic-info-exch.blogspot.com
"""

import re
import sys
import requests
from bs4 import BeautifulSoup

URL = "https://cartophilic-info-exch.blogspot.com/2026/03/panini-fifa-world-cup-2026-mexusacan-09_030880692.html"
ALBUM_ID = "00000000-0000-0000-0000-000000002026"

# Sticker codes present in our seed
KNOWN_TEAM_CODES = {
    "ALG","ARG","AUS","AUT","BEL","BIH","BRA","CAN","CIV","COD","COL","CPV",
    "CRO","CUW","CZE","ECU","EGY","ENG","ESP","FRA","GER","GHA","HAI","IRN",
    "IRQ","JOR","JPN","KOR","KSA","MAR","MEX","NED","NOR","NZL","PAN","PAR",
    "POR","QAT","RSA","SCO","SEN","SUI","SWE","TUN","TUR","URU","USA","UZB",
}

def fetch_page(url: str) -> str:
    headers = {"User-Agent": "Mozilla/5.0 (compatible; research-bot/1.0)"}
    r = requests.get(url, headers=headers, timeout=30)
    r.raise_for_status()
    return r.content.decode("utf-8")

def parse_stickers(html: str) -> dict[str, str]:
    """
    Returns {normalized_code: player_name}.
    e.g. {"ALG2": "Alexis Guendouz", "ALG13": "Team Photo", ...}
    """
    soup = BeautifulSoup(html, "html.parser")
    post = (
        soup.find("div", class_="post-body")
        or soup.find("div", class_="entry-content")
        or soup.body
    )
    text = post.get_text(separator="\n")

    # Lines like: "ALG-2.\xa0 Alexis Guendouz (Algeria)"
    # or:         "ALG-2. Alexis Guendouz (Algeria)"
    pattern = re.compile(
        r'\b([A-Z]{2,4})-(\d{1,2})\.\s+(.+?)(?:\s+\([^)\n]+\))?\s*$',
        re.MULTILINE
    )

    seen: set[str] = set()  # deduplicate
    result: dict[str, str] = {}

    for m in pattern.finditer(text):
        team_prefix = m.group(1)
        num         = int(m.group(2))
        raw_name    = m.group(3).strip()

        if team_prefix not in KNOWN_TEAM_CODES:
            continue

        code = f"{team_prefix}{num}"
        if code in seen:
            continue
        seen.add(code)

        # Clean up encoding artifacts
        name = raw_name.encode("latin-1", errors="replace").decode("latin-1")
        # Keep unicode as-is from the parsed string
        name = raw_name

        result[code] = name

    return result

def load_seed_rows(seed_path: str) -> dict[str, dict]:
    """
    Parse seed.sql INSERT VALUES rows.
    Returns {code: {id, sticker_type, player_name}}
    """
    with open(seed_path, encoding="utf-8") as f:
        content = f.read()

    # Match each INSERT tuple
    pattern = re.compile(
        r"\('([0-9a-f-]{36})',\s*'[0-9a-f-]{36}',\s*'([^']+)',\s*\d+,\s*'[^']+',\s*(?:'[^']+'|NULL),\s*(?:'([^']+)'|NULL),\s*'([^']+)'",
        re.IGNORECASE,
    )
    rows = {}
    for m in pattern.finditer(content):
        rows[m.group(2)] = {
            "id":           m.group(1),
            "player_name":  m.group(3),   # None if NULL
            "sticker_type": m.group(4),
        }
    return rows

def esc(s: str) -> str:
    return s.replace("'", "''")

def main():
    seed_path = "supabase/seed.sql"

    print("Fetching page…", file=sys.stderr)
    html = fetch_page(URL)
    print(f"Page: {len(html):,} chars", file=sys.stderr)

    print("Parsing stickers…", file=sys.stderr)
    scraped = parse_stickers(html)
    print(f"Parsed {len(scraped)} entries", file=sys.stderr)

    # Debug: show a few
    for k in sorted(scraped)[:10]:
        print(f"  {k}: {scraped[k]!r}", file=sys.stderr)

    print("Loading seed rows…", file=sys.stderr)
    seed = load_seed_rows(seed_path)
    print(f"Seed: {len(seed)} rows", file=sys.stderr)

    updates: list[str] = []

    for code, name in sorted(scraped.items()):
        if code not in seed:
            print(f"  WARN: {code!r} not in seed", file=sys.stderr)
            continue

        row = seed[code]
        is_team_photo = (name.strip().lower() == "team photo")

        if is_team_photo:
            # Correct sticker_type to 'team_photo' and set descriptive name
            # Only update if currently wrong (seed has team_photo at pos 20, not 13)
            if row["sticker_type"] != "team_photo":
                updates.append(
                    f"UPDATE stickers SET sticker_type = 'team_photo', player_name = '{esc(name)}'"
                    f" WHERE code = '{code}' AND album_id = '{ALBUM_ID}';"
                )
        else:
            # Player — update name; also fix sticker_type if it was wrongly set to team_photo
            if row["sticker_type"] == "team_photo":
                updates.append(
                    f"UPDATE stickers SET sticker_type = 'player', player_name = '{esc(name)}'"
                    f" WHERE code = '{code}' AND album_id = '{ALBUM_ID}';"
                )
            elif row["player_name"] is None:
                updates.append(
                    f"UPDATE stickers SET player_name = '{esc(name)}'"
                    f" WHERE code = '{code}' AND album_id = '{ALBUM_ID}';"
                )
            # else already named (crest etc.) — skip

    print(f"\nGenerated {len(updates)} UPDATEs", file=sys.stderr)

    # Coverage check
    team_codes_covered = {re.match(r'([A-Z]+)', c).group(1) for c in scraped if re.match(r'([A-Z]+)', c)}
    missing_teams = KNOWN_TEAM_CODES - team_codes_covered
    if missing_teams:
        print(f"Teams NOT in scraped data: {sorted(missing_teams)}", file=sys.stderr)

    out_path = "supabase/migrations/002_player_names.sql"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"-- Auto-generated player names from Panini WC 2026 checklist\n")
        f.write(f"-- Source: {URL}\n")
        f.write(f"-- {len(updates)} statements covering {len(team_codes_covered)} teams\n\n")
        for stmt in updates:
            f.write(stmt + "\n")

    print(f"Written to {out_path}", file=sys.stderr)
    print(f"\nDone: {len(updates)} UPDATEs, {len(team_codes_covered)} teams", file=sys.stderr)

if __name__ == "__main__":
    main()
