import type { SupabaseClient }          from '@supabase/supabase-js'
import type { ICollectionRepository }   from '@domain/repositories/ICollectionRepository'
import { Collection }                   from '@domain/entities/Collection'
import type { Database }                from './database.types'

export class SupabaseCollectionRepo implements ICollectionRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  async findByUserAndAlbum(userId: string, albumId: string): Promise<Collection> {
    // Inner join con stickers para filtrar solo las láminas del álbum pedido
    const { data, error } = await this.db
      .from('user_stickers')
      .select('sticker_id, quantity, stickers!inner(album_id)')
      .eq('user_id', userId)
      .eq('stickers.album_id', albumId)

    if (error) throw error

    const entries = (data ?? []).map(row => ({
      stickerId: row.sticker_id,
      quantity:  row.quantity,
    }))

    return Collection.fromEntries(userId, albumId, entries)
  }

  async save(collection: Collection): Promise<void> {
    const entries = collection.toEntries()
    if (entries.length === 0) return

    const { error } = await this.db.from('user_stickers').upsert(
      entries.map(e => ({
        user_id:    collection.userId,
        sticker_id: e.stickerId,
        quantity:   e.quantity,
      })),
    )

    if (error) throw error
  }

  async updateEntry(userId: string, stickerId: string, quantity: number): Promise<void> {
    if (quantity === 0) {
      const { error } = await this.db
        .from('user_stickers')
        .delete()
        .eq('user_id', userId)
        .eq('sticker_id', stickerId)

      if (error) throw error
      return
    }

    const { error } = await this.db.from('user_stickers').upsert({
      user_id:    userId,
      sticker_id: stickerId,
      quantity,
    })

    if (error) throw error
  }
}
