import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import { Spinner }             from '../components/ui/Spinner'
import { ProgressRing }        from '../components/collection/ProgressRing'
import { getCollectionUseCase } from '@infrastructure/supabase/container'
import { supabase }             from '@infrastructure/supabase/client'
import type { CollectionDTO }   from '@application/dtos/CollectionDTO'
import { DEFAULT_ALBUM_ID }     from '@/lib/constants'

export default function PublicProfilePage() {
  const { username }                = useParams<{ username: string }>()
  const [collection, setCollection] = useState<CollectionDTO | null>(null)
  const [loading, setLoading]       = useState(true)
  const [notFound, setNotFound]     = useState(false)

  useEffect(() => {
    if (!username) return
    const load = async () => {
      // Resuelve userId desde username
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, is_public')
        .eq('username', username)
        .maybeSingle()

      if (!profile || !profile.is_public) { setNotFound(true); setLoading(false); return }

      const dto = await getCollectionUseCase.execute({
        userId:  profile.id,
        albumId: DEFAULT_ALBUM_ID,
      })
      setCollection(dto)
      setLoading(false)
    }
    load()
  }, [username])

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <Spinner size="lg" />
    </div>
  )

  if (notFound || !collection) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-950 text-gray-400">
      <p className="text-lg">Perfil no encontrado</p>
      <p className="text-sm">El usuario no existe o su perfil es privado</p>
    </div>
  )

  const pct = collection.percentage

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-sm">
        <h1 className="mb-1 text-center text-xl font-bold text-white">@{username}</h1>
        <p className="mb-8 text-center text-sm text-gray-500">Álbum Panini Mundial 2026</p>

        <div className="flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900 py-8">
          <ProgressRing percentage={pct} size={160} />
          <p className="mt-4 text-gray-400">
            <span className="font-semibold text-white">{collection.totalOwned}</span>
            {' / '}
            <span className="font-semibold text-white">{collection.totalStickers}</span>
            {' '}láminas
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
            <p className="text-xl font-bold text-red-400">{collection.missing}</p>
            <p className="text-xs text-gray-500">Faltantes</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
            <p className="text-xl font-bold text-yellow-400">{collection.duplicateCount}</p>
            <p className="text-xs text-gray-500">Repetidas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
