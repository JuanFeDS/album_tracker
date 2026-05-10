export type StickerType = 'logo' | 'player' | 'team_photo' | 'special'
export type Rarity     = 'common' | 'foil'
export type Section    = 'teams' | 'intro' | 'museum'

export interface Sticker {
  id:             string
  albumId:        string
  code:           string
  number:         number
  team:           string
  teamCode:       string | null
  playerName:     string | null
  playerImageUrl: string | null
  stickerType:    StickerType
  rarity:         Rarity
  section:        Section
  flagCode:      string | null
}
