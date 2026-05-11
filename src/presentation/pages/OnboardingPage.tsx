import { useState, type FormEvent } from 'react'
import { useNavigate }               from 'react-router-dom'
import { Button }                    from '../components/ui/Button'
import { Input }                     from '../components/ui/Input'
import { useAuth }                   from '../hooks/useAuth'
import { ALBUMS }                    from '@/lib/constants'
import type { AlbumConfig }          from '@/lib/constants'

type Mode = 'enter' | 'create'
type Step = 'username' | 'albums'

function AlbumToggle({ album, selected, onToggle }: {
  album: AlbumConfig; selected: boolean; onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        flex items-center gap-3 rounded-xl border p-4 text-left w-full transition-all
        ${selected
          ? 'border-[#1e90ff] bg-[#0f1e38]'
          : 'border-[#1a3050] bg-[#0c1829] hover:border-[#1e90ff]/40'
        }
      `}
    >
      <div className={`
        flex h-10 w-10 flex-none items-center justify-center rounded-lg text-xl border
        ${selected ? 'border-[#1e90ff]/60 bg-[#060e1f]' : 'border-[#1a3050] bg-[#060e1f]'}
      `}>
        {album.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm leading-tight truncate">{album.name}</p>
        <p className="text-xs text-[#4a6580] mt-0.5">{album.description}</p>
      </div>
      <div className={`
        h-5 w-5 flex-none rounded-full border-2 flex items-center justify-center
        ${selected ? 'border-[#1e90ff] bg-[#1e90ff]' : 'border-[#1a3050]'}
      `}>
        {selected && <span className="text-[10px] font-bold text-white">✓</span>}
      </div>
    </button>
  )
}

export default function OnboardingPage() {
  const [mode, setMode]         = useState<Mode>('enter')
  const [step, setStep]         = useState<Step>('username')
  const [username, setUsername] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const { enter, create, setAlbums } = useAuth()
  const navigate = useNavigate()

  const toggleAlbum = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleEnter = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    setError('')
    setLoading(true)
    try {
      await enter(username)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameNext = (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    setStep('albums')
  }

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (selectedIds.length === 0) {
      setError('Selecciona al menos un álbum')
      return
    }
    setError('')
    setLoading(true)
    try {
      await create(username)
      setAlbums(selectedIds)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setStep('username')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setStep('username')
    setError('')
    setSelectedIds([])
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060e1f] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#1a3050] bg-[#0c1829] p-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">🏆 AlbumIQ</h1>
          <p className="mt-2 text-sm text-[#4a6580]">
            {mode === 'enter'
              ? 'Ingresa tu nombre para cargar tu colección'
              : step === 'username'
                ? 'Elige un nombre para tu colección'
                : 'Selecciona tus álbumes'}
          </p>
        </div>

        {/* ── ENTER ── */}
        {mode === 'enter' && (
          <form onSubmit={handleEnter} className="flex flex-col gap-4">
            <Input
              id="username"
              label="Tu nombre"
              placeholder="ej: juan_panini"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase())}
              autoFocus
              required
            />
            {error && <p className="text-sm text-[#e31837]">{error}</p>}
            <Button type="submit" loading={loading} size="lg" className="w-full">
              Cargar mi colección
            </Button>
          </form>
        )}

        {/* ── CREATE step 1: username ── */}
        {mode === 'create' && step === 'username' && (
          <form onSubmit={handleUsernameNext} className="flex flex-col gap-4">
            <Input
              id="username"
              label="Tu nombre"
              placeholder="ej: juan_panini"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase())}
              autoFocus
              required
            />
            {error && <p className="text-sm text-[#e31837]">{error}</p>}
            <Button type="submit" size="lg" className="w-full">
              Siguiente →
            </Button>
          </form>
        )}

        {/* ── CREATE step 2: album selection ── */}
        {mode === 'create' && step === 'albums' && (
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {ALBUMS.map(album => (
                <AlbumToggle
                  key={album.id}
                  album={album}
                  selected={selectedIds.includes(album.id)}
                  onToggle={() => toggleAlbum(album.id)}
                />
              ))}
            </div>
            {error && <p className="text-sm text-[#e31837]">{error}</p>}
            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="w-full"
              disabled={selectedIds.length === 0}
            >
              Crear colección
            </Button>
            <button
              type="button"
              onClick={() => setStep('username')}
              className="text-sm text-[#4a6580] hover:text-white transition-colors"
            >
              ← Cambiar nombre
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-[#4a6580]">
          {mode === 'enter' ? (
            <>
              ¿Primera vez?{' '}
              <button onClick={() => switchMode('create')} className="text-[#1e90ff] hover:underline">
                Crea tu colección
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes una?{' '}
              <button onClick={() => switchMode('enter')} className="text-[#1e90ff] hover:underline">
                Entrar
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
