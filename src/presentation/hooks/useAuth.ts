import { useAuthStore }  from '../stores/authStore'
import { supabase }      from '@infrastructure/supabase/client'

export function useAuth() {
  const { userId, username, albumIds, setUser, setAlbums, clear } = useAuthStore()

  const enter = async (input: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', input.trim().toLowerCase())
      .maybeSingle()

    if (!data) throw new Error('Usuario no encontrado')
    setUser(data.id, data.username)
  }

  const create = async (input: string) => {
    const clean = input.trim().toLowerCase()
    const id    = crypto.randomUUID()

    const { error } = await supabase
      .from('profiles')
      .insert({ id, username: clean })

    if (error) {
      if (error.code === '23505') throw new Error('Ese nombre ya está en uso')
      throw new Error(error.message)
    }
    setUser(id, clean)
  }

  const logout = () => clear()

  return {
    userId,
    username,
    albumIds,
    isAuthenticated: !!userId,
    enter,
    create,
    setAlbums,
    logout,
  }
}
