import type { StickerDTO }  from './StickerDTO'
import type { SectionDTO }  from './SectionDTO'
import type { TeamProgress } from '@domain/value-objects/Progress'

export interface CollectionDTO {
  userId:         string
  albumId:        string
  totalOwned:     number
  totalStickers:  number
  percentage:     number
  missing:        number
  duplicateCount: number
  byTeam:         TeamProgress[]
  stickers:       StickerDTO[]
  sections:       SectionDTO[]
}
