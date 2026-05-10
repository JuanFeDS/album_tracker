import type { SupabaseClient }    from '@supabase/supabase-js'
import type { IUserRepository }  from '@domain/repositories/IUserRepository'
import type { User }             from '@domain/entities/User'
import type { Database }         from './database.types'
import { toUser }                from './mappers'

export class SupabaseUserRepo implements IUserRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.db
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data ? toUser(data) : null
  }

  async findByUsername(username: string): Promise<User | null> {
    const { data, error } = await this.db
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle()

    if (error) throw error
    return data ? toUser(data) : null
  }

  async save(user: User): Promise<void> {
    const { error } = await this.db.from('profiles').upsert({
      id:         user.id,
      username:   user.username,
      avatar_url: user.avatarUrl,
      is_public:  user.isPublic,
    })

    if (error) throw error
  }
}
