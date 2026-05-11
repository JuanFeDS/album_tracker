import { create } from 'zustand'
import { DEFAULT_ALBUM_ID } from '@/lib/constants'

interface UserState {
  userId:    string | null
  username:  string | null
  albumIds:  string[]
  setUser:   (userId: string, username: string) => void
  setAlbums: (ids: string[]) => void
  clear:     () => void
}

function loadAlbumIds(): string[] {
  try {
    const raw = localStorage.getItem('albumiq_album_ids')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return [DEFAULT_ALBUM_ID]
}

const stored = {
  userId:   localStorage.getItem('albumiq_user_id'),
  username: localStorage.getItem('albumiq_username'),
  albumIds: loadAlbumIds(),
}

export const useAuthStore = create<UserState>(set => ({
  userId:   stored.userId,
  username: stored.username,
  albumIds: stored.albumIds,

  setUser: (userId, username) => {
    localStorage.setItem('albumiq_user_id', userId)
    localStorage.setItem('albumiq_username', username)
    set({ userId, username })
  },

  setAlbums: (ids) => {
    localStorage.setItem('albumiq_album_ids', JSON.stringify(ids))
    set({ albumIds: ids })
  },

  clear: () => {
    localStorage.removeItem('albumiq_user_id')
    localStorage.removeItem('albumiq_username')
    localStorage.removeItem('albumiq_album_ids')
    set({ userId: null, username: null, albumIds: [DEFAULT_ALBUM_ID] })
  },
}))
