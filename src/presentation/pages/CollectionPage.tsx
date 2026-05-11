import { useEffect, useState, useMemo, type ReactNode } from 'react'
import { Link }                          from 'react-router-dom'
import { useCollection }                 from '../hooks/useCollection'
import { StickerCard }                   from '../components/stickers/StickerCard'
import { PageScanner }                   from '../components/collection/PageScanner'
import { Spinner }                       from '../components/ui/Spinner'
import type { StickerDTO }               from '@application/dtos/StickerDTO'
import type { SectionDTO }               from '@application/dtos/SectionDTO'

type Selection =
  | { type: 'intro' }
  | { type: 'museum' }
  | { type: 'team'; teamCode: string; team: string }

function progress(stickers: StickerDTO[]) {
  const owned = stickers.filter(s => s.quantity > 0).length
  return { owned, total: stickers.length, pct: stickers.length ? Math.round((owned / stickers.length) * 100) : 0 }
}

// ── Barra de progreso ─────────────────────────────────────────

function ProgressBar({ pct, gold }: { pct: number; gold?: boolean }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full transition-all duration-500 ${gold ? 'bg-[#f5a623]' : 'bg-[#1e90ff]'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ── Tarjeta especiales / estadios ────────────────────────────

function SpecialCard({ section, stickers, onClick }: {
  section: SectionDTO; stickers: StickerDTO[]; onClick: () => void
}) {
  const { owned, total, pct } = progress(stickers)
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-3 rounded-2xl border border-[#1a3050] bg-[#0c1829] p-4 text-left transition-all active:scale-[.98] hover:border-[#1e90ff]/50 hover:bg-[#0f1e38]"
    >
      <span className="text-3xl">{section.icon}</span>
      <div>
        <p className="font-semibold text-white">{section.label}</p>
        <p className="text-xs text-[#4a6580] mt-0.5">{owned}/{total} láminas</p>
      </div>
      <ProgressBar pct={pct} />
    </button>
  )
}

// ── Bandera ───────────────────────────────────────────────────

function FlagImg({ code, team }: { code: string | null; team: string }) {
  if (!code) return <span className="text-2xl leading-none">🏳️</span>
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={team}
      className="h-5 w-8 rounded-sm object-cover"
    />
  )
}

// ── Tarjeta de equipo ─────────────────────────────────────────

function TeamCard({ sticker, allStickers, onClick }: {
  sticker: StickerDTO; allStickers: StickerDTO[]; onClick: () => void
}) {
  const { owned, total, pct } = progress(allStickers)
  const complete = pct === 100

  return (
    <button
      onClick={onClick}
      className={`
        group flex flex-col items-center gap-2 rounded-xl border p-2.5 text-center
        transition-all active:scale-[.97]
        ${complete
          ? 'border-[#f5a623]/60 bg-[#1a1400] shadow-[0_0_10px_rgba(245,166,35,.15)]'
          : 'border-[#1a3050] bg-[#0c1829] hover:border-[#1e90ff]/40 hover:bg-[#0f1e38]'
        }
      `}
    >
      <FlagImg code={sticker.flagCode} team={sticker.team} />
      <span className="w-full truncate text-[11px] font-medium leading-tight text-white/90">
        {sticker.team}
      </span>
      <div className="w-full space-y-1">
        <ProgressBar pct={pct} gold={complete} />
        <span className="text-[10px] text-[#4a6580]">{owned}/{total}</span>
      </div>
    </button>
  )
}

// ── Grid de láminas ───────────────────────────────────────────

function StickerGrid({ stickers, onAdd, onRemove }: {
  stickers: StickerDTO[]; onAdd: (id: string) => void; onRemove: (id: string) => void
}) {
  const owned   = stickers.filter(s => s.quantity > 0).length
  const missing = stickers.filter(s => s.quantity === 0).length
  const dupes   = stickers.filter(s => s.quantity > 1).length

  return (
    <div>
      {/* Stats row */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-[#0c1829] py-2.5">
          <p className="text-lg font-bold text-[#1e90ff]">{owned}</p>
          <p className="text-[10px] text-[#4a6580] uppercase tracking-wider">Tenidas</p>
        </div>
        <div className="rounded-xl bg-[#0c1829] py-2.5">
          <p className="text-lg font-bold text-white/40">{missing}</p>
          <p className="text-[10px] text-[#4a6580] uppercase tracking-wider">Faltan</p>
        </div>
        <div className="rounded-xl bg-[#0c1829] py-2.5">
          <p className="text-lg font-bold text-[#f5a623]">{dupes}</p>
          <p className="text-[10px] text-[#4a6580] uppercase tracking-wider">Repetidas</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2">
        {stickers.map(s => (
          <StickerCard key={s.id} sticker={s} onAdd={onAdd} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────

export default function CollectionPage() {
  const { collection, isLoading, load, addSticker, removeSticker, syncFromScan } = useCollection()
  const [selection, setSelection]     = useState<Selection | null>(null)
  const [showScanner, setShowScanner] = useState(false)

  useEffect(() => { load() }, [load])

  const bySection = useMemo(() => {
    if (!collection) return { intro: [], museum: [], teams: new Map<string, StickerDTO[]>() }
    const intro:  StickerDTO[] = []
    const museum: StickerDTO[] = []
    const teams   = new Map<string, StickerDTO[]>()
    for (const s of collection.stickers) {
      if (s.section === 'intro')  { intro.push(s);  continue }
      if (s.section === 'museum') { museum.push(s); continue }
      const key = s.teamCode ?? s.team
      if (!teams.has(key)) teams.set(key, [])
      teams.get(key)!.push(s)
    }
    return { intro, museum, teams }
  }, [collection])

  if (isLoading || !collection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060e1f]">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Vista de láminas ──────────────────────────────────────────
  if (selection) {
    let label = ''
    let icon: ReactNode = null
    let stickers: StickerDTO[] = []

    if (selection.type === 'intro') {
      const sec = collection.sections.find(s => s.key === 'intro')
      label    = sec?.label ?? 'Especiales'
      icon     = <span className="text-xl">{sec?.icon ?? '⭐'}</span>
      stickers = bySection.intro
    } else if (selection.type === 'museum') {
      const sec = collection.sections.find(s => s.key === 'museum')
      label    = sec?.label ?? 'Estadios'
      icon     = <span className="text-xl">{sec?.icon ?? '🏟️'}</span>
      stickers = bySection.museum
    } else {
      const first = bySection.teams.get(selection.teamCode)?.[0]
      label    = selection.team
      icon     = <FlagImg code={first?.flagCode ?? null} team={selection.team} />
      stickers = bySection.teams.get(selection.teamCode) ?? []
    }

    const { owned, total, pct } = progress(stickers)

    return (
      <div className="min-h-screen bg-[#060e1f]">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 border-b border-[#1a3050] bg-[#060e1f]/95 backdrop-blur-sm px-4 py-3">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelection(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1a3050] bg-[#0c1829] text-white/60 hover:text-white transition-colors"
              >
                ←
              </button>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {icon}
                <h1 className="font-bold text-white truncate">{label}</h1>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-bold text-[#1e90ff]">{owned}</span>
                <span className="text-[#4a6580]">/</span>
                <span className="text-white/60">{total}</span>
              </div>
            </div>
            <div className="mt-2.5">
              <ProgressBar pct={pct} />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-4 pb-24">
          <StickerGrid stickers={stickers} onAdd={addSticker} onRemove={removeSticker} />
        </div>
      </div>
    )
  }

  // ── Vista de categorías ────────────────────────────────────────
  const teamEntries = Array.from(bySection.teams.entries())
  const globalPct   = collection.totalStickers
    ? Math.round((collection.totalOwned / collection.totalStickers) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#060e1f]">

      {/* Hero header */}
      <div className="bg-gradient-to-b from-[#0d1e38] to-[#060e1f] px-4 pb-6 pt-safe-top pt-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1a3050] bg-[#0c1829] text-white/60 hover:text-white transition-colors"
            >
              ←
            </Link>
            <div className="flex-1">
              <h1 className="font-bold text-white text-lg leading-none">Mi Colección</h1>
              <p className="text-xs text-[#4a6580] mt-0.5">FIFA World Cup 2026™</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">{globalPct}%</p>
              <p className="text-[10px] text-[#4a6580]">{collection.totalOwned}/{collection.totalStickers}</p>
            </div>
          </div>

          {/* Barra global */}
          <ProgressBar pct={globalPct} />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-24">

        {/* Categorías especiales */}
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4a6580]">
          Secciones especiales
        </p>
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
            ))}
        </div>

        {/* Equipos */}
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#4a6580]">
          Equipos — {teamEntries.length} selecciones
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

      {/* FAB escanear */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-3 bg-gradient-to-t from-[#060e1f] via-[#060e1f]/90 to-transparent pointer-events-none">
        <div className="mx-auto max-w-2xl flex justify-end pointer-events-auto">
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 rounded-full bg-[#e31837] px-5 py-3.5 font-semibold text-white shadow-[0_4px_20px_rgba(227,24,55,.4)] hover:bg-[#cc1530] active:scale-95 transition-all"
          >
            <span>📷</span>
            Escanear página
          </button>
        </div>
      </div>

      {showScanner && (
        <PageScanner
          stickers={collection.stickers}
          onSync={syncFromScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}
