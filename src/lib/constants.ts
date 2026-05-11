export const WC_2026_ALBUM_ID    = '00000000-0000-0000-0000-000000002026'
export const TRES_REYES_ALBUM_ID = '00000000-0000-0000-0000-000000003026'

export const DEFAULT_ALBUM_ID = WC_2026_ALBUM_ID

export const ALBUMS = [
  {
    id:            WC_2026_ALBUM_ID,
    slug:          'wc-2026',
    name:          'Panini FIFA World Cup 2026™',
    description:   'Álbum oficial Panini — 980 láminas',
    totalStickers: 980,
    emoji:         '🏆',
    publisher:     'Panini',
  },
  {
    id:            TRES_REYES_ALBUM_ID,
    slug:          '3reyes-wc-2026',
    name:          '3 Reyes del Mundial',
    description:   'Editorial 3 Reyes (Navarrete) — 584 láminas',
    totalStickers: 584,
    emoji:         '👑',
    publisher:     '3 Reyes',
  },
] as const

export type AlbumConfig = typeof ALBUMS[number]
