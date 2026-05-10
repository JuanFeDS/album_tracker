import { useEffect }     from 'react'
import { Link }          from 'react-router-dom'
import { useCollection } from '../hooks/useCollection'
import { useProgress }   from '../hooks/useProgress'
import { useAuth }       from '../hooks/useAuth'
import { ProgressRing }  from '../components/collection/ProgressRing'
import { Spinner }       from '../components/ui/Spinner'
import { Button }        from '../components/ui/Button'

export default function DashboardPage() {
  const { username, logout }        = useAuth()
  const { load, isLoading }         = useCollection()
  const progress                    = useProgress()

  useEffect(() => { load() }, [load])

  if (isLoading || !progress) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="mx-auto max-w-lg">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">🏆 AlbumIQ</h1>
            <p className="text-sm text-gray-500">@{username}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>Salir</Button>
        </div>

        <div className="mb-8 flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900 py-8">
          <ProgressRing percentage={progress.percentage} size={160} />
          <p className="mt-4 text-gray-400">
            <span className="font-semibold text-white">{progress.totalOwned}</span>
            {' de '}
            <span className="font-semibold text-white">{progress.totalStickers}</span>
            {' láminas'}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { label: 'Completas', value: progress.totalOwned,     color: 'text-emerald-400' },
            { label: 'Faltantes', value: progress.missing,        color: 'text-red-400'     },
            { label: 'Repetidas', value: progress.duplicateCount, color: 'text-yellow-400'  },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Equipos más avanzados
          </h2>
          <div className="flex flex-col gap-3">
            {progress.topTeams.map(t => (
              <div key={t.teamCode} className="flex items-center gap-3">
                <span className="w-24 truncate text-sm text-gray-300">{t.team}</span>
                <div className="h-2 flex-1 rounded-full bg-gray-800">
                  <div className="h-2 rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${t.percentage}%` }} />
                </div>
                <span className="w-10 text-right text-xs text-gray-400">{t.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/collection" className="flex-1">
            <Button size="lg" className="w-full">Ver colección</Button>
          </Link>
          <Link to={`/u/${username}`}>
            <Button size="lg" variant="secondary">Compartir</Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
