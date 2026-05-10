export interface Album {
  id:            string
  slug:          string        // "wc-2026", "tres-coronas-2026"
  name:          string
  description:   string | null
  totalStickers: number
  coverUrl:      string | null
  isActive:      boolean
  createdAt:     Date
}
