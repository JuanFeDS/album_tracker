import type { Sticker } from '@domain/entities/Sticker'
import type { User }    from '@domain/entities/User'
import type { Album }   from '@domain/entities/Album'
import type { Database } from './database.types'

type StickerRow = Database['public']['Tables']['stickers']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type AlbumRow   = Database['public']['Tables']['albums']['Row']

export function toSticker(row: StickerRow): Sticker {
  return {
    id:             row.id,
    albumId:        row.album_id,
    code:           row.code,
    number:         row.number,
    team:           row.team,
    teamCode:       row.team_code,
    playerName:     row.player_name,
    playerImageUrl: row.player_image_url,
    stickerType:    row.sticker_type,
    rarity:         row.rarity,
    section:        row.section,
    flagCode:      row.flag_code,
  }
}

export function toUser(row: ProfileRow): User {
  return {
    id:        row.id,
    username:  row.username,
    avatarUrl: row.avatar_url,
    isPublic:  row.is_public,
    createdAt: new Date(row.created_at),
  }
}

export function toAlbum(row: AlbumRow): Album {
  return {
    id:            row.id,
    slug:          row.slug,
    name:          row.name,
    description:   row.description,
    totalStickers: row.total_stickers,
    coverUrl:      row.cover_url,
    isActive:      row.is_active,
    createdAt:     new Date(row.created_at),
  }
}
