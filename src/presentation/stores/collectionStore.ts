import { create } from 'zustand'
import type { CollectionDTO } from '@application/dtos/CollectionDTO'
import type { StickerDTO }    from '@application/dtos/StickerDTO'

interface CollectionState {
  collection: CollectionDTO | null
  isLoading:  boolean
  error:      string | null

  setCollection: (c: CollectionDTO) => void
  // Actualiza una lámina individual sin recargar todo — usado en optimistic updates
  updateSticker:  (dto: StickerDTO) => void
  setLoading: (v: boolean) => void
  setError:   (e: string | null) => void
  reset:      () => void
}

export const useCollectionStore = create<CollectionState>(set => ({
  collection: null,
  isLoading:  false,
  error:      null,

  setCollection: c => set({ collection: c, error: null }),

  updateSticker: dto =>
    set(state => {
      if (!state.collection) return state
      const stickers = state.collection.stickers.map(s => s.id === dto.id ? dto : s)
      const owned    = stickers.filter(s => s.quantity > 0).length
      const missing  = stickers.filter(s => s.quantity === 0).length
      const duplicateCount = stickers.reduce((sum, s) => sum + Math.max(0, s.quantity - 1), 0)
      const percentage = Math.round((owned / stickers.length) * 100)
      return {
        collection: {
          ...state.collection,
          stickers,
          totalOwned: owned,
          missing,
          duplicateCount,
          percentage,
        },
      }
    }),

  setLoading: v => set({ isLoading: v }),
  setError:   e => set({ error: e }),
  reset:      () => set({ collection: null, error: null }),
}))
