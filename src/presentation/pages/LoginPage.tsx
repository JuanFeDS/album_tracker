import { useState, type FormEvent } from 'react'
import { useNavigate }               from 'react-router-dom'
import { Button }                    from '../components/ui/Button'
import { Input }                     from '../components/ui/Input'
import { useAuth }                   from '../hooks/useAuth'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const [mode, setMode]         = useState<Mode>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const { login, register }     = useAuth()
  const navigate                = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, username)
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
          <h1 className="text-2xl font-bold text-white">AlbumIQ 🏆</h1>
          <p className="mt-1 text-sm text-gray-400">
            {mode === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <Input
              id="username" label="Usuario" placeholder="tu_nombre"
              value={username} onChange={e => setUsername(e.target.value)} required
            />
          )}
          <Input
            id="email" label="Correo" type="email" placeholder="correo@ejemplo.com"
            value={email} onChange={e => setEmail(e.target.value)} required
          />
          <Input
            id="password" label="Contraseña" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} required
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
            {mode === 'login' ? 'Entrar' : 'Registrarse'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-emerald-400 hover:underline"
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}
