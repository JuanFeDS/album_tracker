import { Link }              from 'react-router-dom'
import { useAuth }           from '../hooks/useAuth'
import { Button }            from '../components/ui/Button'
import { ALBUMS }            from '@/lib/constants'
import type { AlbumConfig }  from '@/lib/constants'

function AlbumCard({ album }: { album: AlbumConfig }) {
  return (
    <Link
      to={`/collection/${album.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-[#1a3050] bg-[#0c1829] p-5 transition-all active:scale-[.98] hover:border-[#1e90ff]/50 hover:bg-[#0f1e38]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-[#060e1f] text-2xl border border-[#1a3050]">
          {album.emoji}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-white leading-tight">{album.name}</p>
          <p className="text-xs text-[#4a6580] mt-0.5">{album.publisher}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-[#4a6580]">{album.totalStickers} láminas</span>
        <span className="text-[#1e90ff] font-medium group-hover:text-white transition-colors">
          Ver colección →
        </span>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const { username, albumIds, setAlbums, logout } = useAuth()
  const myAlbums = ALBUMS.filter(a => albumIds.includes(a.id))
  const otherAlbums = ALBUMS.filter(a => !albumIds.includes(a.id))

  const addAlbum = (id: string) => setAlbums([...albumIds, id])
  const removeAlbum = (id: string) => {
    if (albumIds.length <= 1) return
    setAlbums(albumIds.filter(x => x !== id))
  }

  return (
    <div className="min-h-screen bg-[#060e1f]">
      <div className="mx-auto max-w-lg px-4 pb-12 pt-safe-top pt-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">🏆 AlbumIQ</h1>
            <p className="text-sm text-[#4a6580]">@{username}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>Salir</Button>
        </div>

        {/* My Albums */}
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4a6580]">
          Mis álbumes
        </p>
        <div className="flex flex-col gap-3">
          {myAlbums.map(album => (
            <div key={album.id} className="relative">
              <AlbumCard album={album} />
              {albumIds.length > 1 && (
                <button
                  onClick={() => removeAlbum(album.id)}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/40 text-xs hover:bg-[#e31837]/80 hover:text-white transition-colors"
                  title="Quitar álbum"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add other albums */}
        {otherAlbums.length > 0 && (
          <>
            <p className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-widest text-[#4a6580]">
              Agregar álbum
            </p>
            <div className="flex flex-col gap-2">
              {otherAlbums.map(album => (
                <button
                  key={album.id}
                  onClick={() => addAlbum(album.id)}
                  className="flex items-center gap-3 rounded-xl border border-dashed border-[#1a3050] bg-[#0c1829]/50 px-4 py-3 text-left transition-all hover:border-[#1e90ff]/50 hover:bg-[#0f1e38]"
                >
                  <span className="text-xl">{album.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/70 truncate">{album.name}</p>
                    <p className="text-xs text-[#4a6580]">{album.description}</p>
                  </div>
                  <span className="text-[#1e90ff] text-sm">+ Agregar</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Compartir */}
        <div className="mt-6">
          <Link to={`/u/${username}`}>
            <Button size="lg" variant="secondary" className="w-full">
              Compartir perfil
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
