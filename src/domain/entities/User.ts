export interface User {
  id:        string
  username:  string
  avatarUrl: string | null
  isPublic:  boolean
  createdAt: Date
}
