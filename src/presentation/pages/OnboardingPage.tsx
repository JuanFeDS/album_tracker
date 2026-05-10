import { useState, type FormEvent } from 'react'
import { useNavigate }               from 'react-router-dom'
import { Button }                    from '../components/ui/Button'
import { Input }                     from '../components/ui/Input'
import { useAuth }                   from '../hooks/useAuth'

type Mode = 'enter' | 'create'

export default function OnboardingPage() {
  const [mode, setMode]       = useState<Mode>('enter')
  const [username, setUsername] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { enter, create } = useAuth()
  const navigate          = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    setError('')
    setLoading(true)
    try {
      if (mode === 'enter') {
        await enter(username)
      } else {
        await create(username)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">🏆 AlbumIQ</h1>
          <p className="mt-2 text-sm text-gray-400">
            {mode === 'enter'
              ? 'Ingresa tu nombre para cargar tu colección'
              : 'Elige un nombre para tu colección'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="username"
            label="Tu nombre"
            placeholder="ej: juan_panini"
            value={username}
            onChange={e => setUsername(e.target.value.toLowerCase())}
            autoFocus
            required
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" loading={loading} size="lg" className="w-full">
            {mode === 'enter' ? 'Cargar mi colección' : 'Crear colección'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {mode === 'enter' ? (
            <>
              ¿Primera vez?{' '}
              <button onClick={() => { setMode('create'); setError('') }}
                className="text-emerald-400 hover:underline">
                Crea tu colección
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes una?{' '}
              <button onClick={() => { setMode('enter'); setError('') }}
                className="text-emerald-400 hover:underline">
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
