import { create } from 'zustand'

interface UserState {
  userId:   string | null
  username: string | null
  setUser:  (userId: string, username: string) => void
  clear:    () => void
}

const stored = {
  userId:   localStorage.getItem('albumiq_user_id'),
  username: localStorage.getItem('albumiq_username'),
}

export const useAuthStore = create<UserState>(set => ({
  userId:   stored.userId,
  username: stored.username,

  setUser: (userId, username) => {
    localStorage.setItem('albumiq_user_id', userId)
    localStorage.setItem('albumiq_username', username)
    set({ userId, username })
  },

  clear: () => {
    localStorage.removeItem('albumiq_user_id')
    localStorage.removeItem('albumiq_username')
    set({ userId: null, username: null })
  },
}))
