import { useEffect, useState, useMemo, type ReactNode } from 'react'
import { Link }                          from 'react-router-dom'
import { useCollection }                 from '../hooks/useCollection'
import { StickerCard }                   from '../components/stickers/StickerCard'
import { Spinner }                       from '../components/ui/Spinner'
import type { StickerDTO }               from '@application/dtos/StickerDTO'
import type { SectionDTO }               from '@application/dtos/SectionDTO'

type Selection =
  | { type: 'intro' }
  | { type: 'museum' }
  | { type: 'team'; teamCode: string; team: string }

// ── Vista de categorías ───────────────────────────────────────

function progress(stickers: StickerDTO[]) {
  const owned = stickers.filter(s => s.quantity > 0).length
  return { owned, total: stickers.length, pct: stickers.length ? Math.round((owned / stickers.length) * 100) : 0 }
}

function SpecialCard({ section, stickers, onClick }: {
  section: SectionDTO; stickers: StickerDTO[]; onClick: () => void
}) {
  const { owned, total, pct } = progress(stickers)
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 rounded-xl border border-gray-800 bg-gray-900 p-4 text-left hover:border-gray-600 transition-colors"
    >
      <span className="text-3xl">{section.icon}</span>
      <span className="font-semibold text-white">{section.label}</span>
      <span className="text-xs text-gray-400">{owned}/{total} láminas</span>
      <div className="h-1 w-full rounded-full bg-gray-800">
        <div className="h-1 rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </button>
  )
}

function FlagImg({ code, team }: { code: string | null; team: string }) {
  if (!code) return <span className="text-3xl leading-none">🏳️</span>
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={team}
      className="h-7 w-auto rounded-sm object-cover"
    />
  )
}

function TeamCard({ sticker, allStickers, onClick }: {
  sticker: StickerDTO; allStickers: StickerDTO[]; onClick: () => void
}) {
  const { owned, total, pct } = progress(allStickers)

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 p-3 hover:border-gray-600 transition-colors"
    >
      <FlagImg code={sticker.flagCode} team={sticker.team} />
      <span className="text-center text-xs font-medium text-white leading-tight line-clamp-2">
        {sticker.team}
      </span>
      <span className="text-[11px] text-gray-500">{owned}/{total}</span>
      <div className="h-1 w-full rounded-full bg-gray-800">
        <div
          className={`h-1 rounded-full transition-all ${pct === 100 ? 'bg-yellow-400' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  )
}

// ── Vista de láminas ──────────────────────────────────────────

function StickerGrid({ stickers, onAdd, onRemove }: {
  stickers: StickerDTO[]; onAdd: (id: string) => void; onRemove: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-1.5">
      {stickers.map(s => (
        <StickerCard key={s.id} sticker={s} onAdd={onAdd} onRemove={onRemove} />
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────

export default function CollectionPage() {
  const { collection, isLoading, load, addSticker, removeSticker } = useCollection()
  const [selection, setSelection] = useState<Selection | null>(null)

  useEffect(() => { load() }, [load])

  const bySection = useMemo(() => {
    if (!collection) return { intro: [], museum: [], teams: new Map<string, StickerDTO[]>() }

    const intro:  StickerDTO[] = []
    const museum: StickerDTO[] = []
    const teams   = new Map<string, StickerDTO[]>()

    for (const s of collection.stickers) {
      if (s.section === 'intro')  { intro.push(s); continue }
      if (s.section === 'museum') { museum.push(s); continue }
      // teams
      const key = s.teamCode ?? s.team
      if (!teams.has(key)) teams.set(key, [])
      teams.get(key)!.push(s)
    }

    return { intro, museum, teams }
  }, [collection])

  if (isLoading || !collection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Vista de láminas ────────────────────────────────────────
  if (selection) {
    let label = ''
    let icon: ReactNode = null
    let stickers: StickerDTO[] = []

    if (selection.type === 'intro') {
      const sec = collection.sections.find(s => s.key === 'intro')
      label = sec?.label ?? 'Especiales'
      icon  = <span>{sec?.icon ?? '⭐'}</span>
      stickers = bySection.intro
    } else if (selection.type === 'museum') {
      const sec = collection.sections.find(s => s.key === 'museum')
      label = sec?.label ?? 'Estadios'
      icon  = <span>{sec?.icon ?? '🏟️'}</span>
      stickers = bySection.museum
    } else {
      const first = bySection.teams.get(selection.teamCode)?.[0]
      label    = selection.team
      icon     = <FlagImg code={first?.flagCode ?? null} team={selection.team} />
      stickers = bySection.teams.get(selection.teamCode) ?? []
    }

    return (
      <div className="min-h-screen bg-gray-950 px-4 pb-16 pt-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <button onClick={() => setSelection(null)} className="text-gray-400 hover:text-white">←</button>
            {icon}
            <h1 className="font-bold text-white">{label}</h1>
            <span className="ml-auto text-sm text-gray-400">
              {stickers.filter(s => s.quantity > 0).length}/{stickers.length}
            </span>
          </div>
          <StickerGrid stickers={stickers} onAdd={addSticker} onRemove={removeSticker} />
        </div>
      </div>
    )
  }

  // ── Vista de categorías ─────────────────────────────────────
  const teamEntries = Array.from(bySection.teams.entries())

  return (
    <div className="min-h-screen bg-gray-950 px-4 pb-16 pt-6">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link to="/dashboard" className="text-gray-400 hover:text-white">←</Link>
          <h1 className="font-bold text-white">Mi Colección</h1>
          <span className="ml-auto text-sm text-gray-400">
            {collection.totalOwned}/{collection.totalStickers}
          </span>
        </div>

        {/* Categorías especiales — intro y museum desde la DB */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {collection.sections
            .filter(s => s.key !== 'teams')
            .map(section => (
              <SpecialCard
                key={section.key}
                section={section}
                stickers={section.key === 'intro' ? bySection.intro : bySection.museum}
                onClick={() => setSelection({ type: section.key as 'intro' | 'museum' })}
              />
            ))
          }
        </div>

        {/* Países */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Equipos
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {teamEntries.map(([teamCode, stickers]) => (
            <TeamCard
              key={teamCode}
              sticker={stickers[0]}
              allStickers={stickers}
              onClick={() => setSelection({ type: 'team', teamCode, team: stickers[0].team })}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
