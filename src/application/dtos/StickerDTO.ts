import type { Sticker } from '@domain/entities/Sticker'

export interface StickerDTO {
  id:             string
  albumId:        string
  code:           string
  number:         number
  team:           string
  teamCode:       string | null
  playerName:     string | null
  playerImageUrl: string | null
  stickerType:    string
  rarity:         string
  section:        string
  flagCode:      string | null
  // Estado en la colección del usuario
  quantity:    number
  isMissing:   boolean
  isDuplicate: boolean
}

export function toStickerDTO(sticker: Sticker, quantity: number): StickerDTO {
  return {
    id:             sticker.id,
    albumId:        sticker.albumId,
    code:           sticker.code,
    number:         sticker.number,
    team:           sticker.team,
    teamCode:       sticker.teamCode,
    playerName:     sticker.playerName,
    playerImageUrl: sticker.playerImageUrl,
    stickerType:    sticker.stickerType,
    rarity:         sticker.rarity,
    section:        sticker.section,
    flagCode:      sticker.flagCode,
    quantity,
    isMissing:   quantity === 0,
    isDuplicate: quantity > 1,
  }
}
