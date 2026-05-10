import type { Sticker }     from '../entities/Sticker'
import type { StickerCode } from '../value-objects/StickerCode'

export interface IStickerRepository {
  findByAlbum(albumId: string): Promise<Sticker[]>
  findById(id: string): Promise<Sticker | null>
  findByCode(albumId: string, code: StickerCode): Promise<Sticker | null>
  findByTeamCode(albumId: string, teamCode: string): Promise<Sticker[]>
}
