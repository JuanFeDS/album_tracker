import type { StickerDTO } from '@application/dtos/StickerDTO'

interface Props {
  sticker:  StickerDTO
  onAdd:    (id: string) => void
  onRemove: (id: string) => void
}

export function StickerCard({ sticker, onAdd, onRemove }: Props) {
  const { id, code, playerName, rarity, quantity, isMissing, isDuplicate } = sticker

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center rounded-lg border p-2
        text-xs font-medium transition-all select-none aspect-[2/3] cursor-pointer
        ${isMissing
          ? 'border-gray-700 bg-gray-800/60 text-gray-500 hover:border-gray-500'
          : isDuplicate
            ? 'border-yellow-500/60 bg-yellow-900/30 text-yellow-300 hover:border-yellow-400'
            : 'border-emerald-500/60 bg-emerald-900/30 text-emerald-300 hover:border-emerald-400'
        }
        ${rarity === 'foil' ? 'ring-1 ring-yellow-400/40' : ''}
      `}
      onClick={() => onAdd(id)}
      title={`${code}${playerName ? ` — ${playerName}` : ''}`}
    >
      <span className="font-bold">{code}</span>
      {playerName && (
        <span className="mt-0.5 w-full truncate text-center opacity-70">{playerName}</span>
      )}

      {/* Badge cantidad */}
      {quantity > 1 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-black">
          {quantity}
        </span>
      )}

      {/* Botón quitar — visible solo cuando hay al menos 1 */}
      {quantity > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onRemove(id) }}
          className="absolute -bottom-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-white text-[11px] font-bold hover:bg-red-500 transition-colors"
          title="Quitar una"
        >
          −
        </button>
      )}
    </div>
  )
}
