import type { StickerDTO } from '@application/dtos/StickerDTO'

interface Props {
  sticker:  StickerDTO
  onAdd:    (id: string) => void
  onRemove: (id: string) => void
}

export function StickerCard({ sticker, onAdd, onRemove }: Props) {
  const { id, code, playerName, rarity, quantity, isMissing, isDuplicate } = sticker
  const isFoil = rarity === 'foil'

  if (isMissing) {
    return (
      <div
        onClick={() => onAdd(id)}
        className="relative flex aspect-[2/3] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-[#1a3050] bg-[#0a1525] px-1 py-2 select-none transition-colors active:bg-[#0f1e35]"
        title={`${code}${playerName ? ` — ${playerName}` : ''}`}
      >
        <span className="text-[11px] font-bold tracking-wide text-[#2a4f72]">{code}</span>
        {playerName && (
          <span className="w-full truncate text-center text-[9px] text-[#1e3d5c] leading-tight">
            {playerName}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={`
        relative flex aspect-[2/3] cursor-pointer flex-col overflow-hidden rounded-lg border select-none
        transition-all active:scale-95
        ${isDuplicate
          ? 'border-[#f5a623]/70 bg-[#1a1400] shadow-[0_0_8px_rgba(245,166,35,.25)]'
          : 'border-[#1e6fe0]/60 bg-[#0d1e38] shadow-[0_0_6px_rgba(30,112,224,.15)]'
        }
        ${isFoil ? 'foil-card' : ''}
      `}
      onClick={() => onAdd(id)}
      title={`${code}${playerName ? ` — ${playerName}` : ''}`}
    >
      {/* Top color bar */}
      <div className={`h-1 w-full flex-none ${isDuplicate ? 'bg-[#f5a623]' : 'bg-[#1e90ff]'}`} />

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5">
        <span className={`text-[11px] font-bold tracking-wide ${isDuplicate ? 'text-[#f5a623]' : 'text-white'}`}>
          {code}
        </span>
        {playerName && (
          <span className="w-full truncate text-center text-[9px] leading-tight text-white/60">
            {playerName}
          </span>
        )}
      </div>

      {/* Quantity badge */}
      {quantity > 1 && (
        <span className="absolute right-1 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#f5a623] text-[9px] font-bold text-black">
          {quantity}
        </span>
      )}

      {/* Remove button */}
      <button
        onClick={e => { e.stopPropagation(); onRemove(id) }}
        className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/60 text-[11px] font-bold hover:bg-[#e31837] hover:text-white active:bg-[#e31837] transition-colors"
        title="Quitar una"
      >
        −
      </button>
    </div>
  )
}
