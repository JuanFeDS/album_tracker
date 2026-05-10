import type { StickerDTO } from '@application/dtos/StickerDTO'
import { StickerCard }      from '../stickers/StickerCard'

interface Props {
  team:     string
  stickers: StickerDTO[]
  onAdd:    (id: string) => void
  onRemove: (id: string) => void
}

export function TeamSection({ team, stickers, onAdd, onRemove }: Props) {
  const owned   = stickers.filter(s => s.quantity > 0).length
  const total   = stickers.length
  const pct     = Math.round((owned / total) * 100)

  return (
    <section className="flex flex-col gap-3">
      {/* Header del equipo */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">{team}</h3>
        <span className="text-sm text-gray-400">
          {owned}/{total}
          <span className={`ml-2 font-medium ${pct === 100 ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {pct}%
          </span>
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="h-1 w-full rounded-full bg-gray-800">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${pct === 100 ? 'bg-yellow-400' : 'bg-emerald-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Grid de láminas */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(56px,1fr))] gap-1.5">
        {stickers.map(s => (
          <StickerCard key={s.id} sticker={s} onAdd={onAdd} onRemove={onRemove} />
        ))}
      </div>
    </section>
  )
}
