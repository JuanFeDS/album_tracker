import type { SupabaseClient }       from '@supabase/supabase-js'
import type { IStickerRepository }   from '@domain/repositories/IStickerRepository'
import type { Sticker }              from '@domain/entities/Sticker'
import type { StickerCode }          from '@domain/value-objects/StickerCode'
import type { Database }             from './database.types'
import { toSticker }                 from './mappers'

export class SupabaseStickerRepo implements IStickerRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  async findByAlbum(albumId: string): Promise<Sticker[]> {
    const { data, error } = await this.db
      .from('stickers')
      .select('*')
      .eq('album_id', albumId)
      .order('number')

    if (error) throw error
    return (data ?? []).map(toSticker)
  }

  async findById(id: string): Promise<Sticker | null> {
    const { data, error } = await this.db
      .from('stickers')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data ? toSticker(data) : null
  }

  async findByCode(albumId: string, code: StickerCode): Promise<Sticker | null> {
    const { data, error } = await this.db
      .from('stickers')
      .select('*')
      .eq('album_id', albumId)
      .eq('code', code.toString())
      .maybeSingle()

    if (error) throw error
    return data ? toSticker(data) : null
  }

  async findByTeamCode(albumId: string, teamCode: string): Promise<Sticker[]> {
    const { data, error } = await this.db
      .from('stickers')
      .select('*')
      .eq('album_id', albumId)
      .eq('team_code', teamCode)
      .order('number')

    if (error) throw error
    return (data ?? []).map(toSticker)
  }
}
