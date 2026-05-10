import type { SupabaseClient }      from '@supabase/supabase-js'
import type { ISectionRepository }  from '@domain/repositories/ISectionRepository'
import type { SectionDTO }          from '@application/dtos/SectionDTO'
import type { Database }            from './database.types'

export class SupabaseSectionRepo implements ISectionRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  async findByAlbum(albumId: string): Promise<SectionDTO[]> {
    const { data, error } = await this.db
      .from('sections')
      .select('key, label, icon, display_order')
      .eq('album_id', albumId)
      .order('display_order')

    if (error) throw error
    return (data ?? []).map(row => ({
      key:          row.key,
      label:        row.label,
      icon:         row.icon,
      displayOrder: row.display_order,
    }))
  }
}
