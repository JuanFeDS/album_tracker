import type { SupabaseClient }     from '@supabase/supabase-js'
import type { IStorageService }    from '@application/ports/IStorageService'
import type { Database }           from '../supabase/database.types'

export class SupabaseStorageService implements IStorageService {
  constructor(private readonly db: SupabaseClient<Database>) {}

  async upload(bucket: string, path: string, file: File): Promise<string> {
    const { error } = await this.db.storage.from(bucket).upload(path, file, {
      upsert: true,
    })
    if (error) throw error
    return this.getPublicUrl(bucket, path)
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.db.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async remove(bucket: string, path: string): Promise<void> {
    const { error } = await this.db.storage.from(bucket).remove([path])
    if (error) throw error
  }
}
