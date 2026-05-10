import { useCallback } from 'react'
import { useCollectionStore } from '../stores/collectionStore'
import { useAuthStore }       from '../stores/authStore'
import {
  getCollectionUseCase,
  addStickerUseCase,
  removeStickerUseCase,
} from '@infrastructure/supabase/container'
import { DEFAULT_ALBUM_ID } from '@/lib/constants'

export function useCollection(albumId = DEFAULT_ALBUM_ID) {
  const { userId } = useAuthStore()
  const { collection, isLoading, error, setCollection, updateSticker, setLoading, setError } =
    useCollectionStore()

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const dto = await getCollectionUseCase.execute({ userId, albumId })
      setCollection(dto)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar la colección')
    } finally {
      setLoading(false)
    }
  }, [userId, albumId, setCollection, setLoading, setError])

  const addSticker = useCallback(async (stickerId: string) => {
    if (!userId) return
    const current = collection?.stickers.find(s => s.id === stickerId)
    if (current) updateSticker({ ...current, quantity: current.quantity + 1, isMissing: false })

    try {
      const updated = await addStickerUseCase.execute({ userId, albumId, stickerId })
      updateSticker(updated)
    } catch (e) {
      if (current) updateSticker(current)
      setError(e instanceof Error ? e.message : 'Error al agregar lámina')
    }
  }, [userId, albumId, collection, updateSticker, setError])

  const removeSticker = useCallback(async (stickerId: string) => {
    if (!userId) return
    const current = collection?.stickers.find(s => s.id === stickerId)
    if (!current || current.quantity === 0) return
    updateSticker({ ...current, quantity: current.quantity - 1, isMissing: current.quantity - 1 === 0 })

    try {
      const updated = await removeStickerUseCase.execute({ userId, albumId, stickerId })
      updateSticker(updated)
    } catch (e) {
      if (current) updateSticker(current)
      setError(e instanceof Error ? e.message : 'Error al quitar lámina')
    }
  }, [userId, albumId, collection, updateSticker, setError])

  return { collection, isLoading, error, load, addSticker, removeSticker }
}
