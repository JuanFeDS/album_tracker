import { useRef, useState } from 'react'
import { extractStickerCodes, type OcrProgress } from '@/lib/ocr'
import type { StickerDTO } from '@application/dtos/StickerDTO'

interface Props {
  stickers:  StickerDTO[]
  onSync:    (ids: string[]) => Promise<void>
  onClose:   () => void
}

type Phase =
  | { name: 'capture' }
  | { name: 'preview';  file: File; previewUrl: string }
  | { name: 'scanning'; progress: OcrProgress }
  | { name: 'results';  toMark: StickerDTO[]; alreadyMissing: StickerDTO[] }
  | { name: 'syncing' }
  | { name: 'done' }

export function PageScanner({ stickers, onSync, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>({ name: 'capture' })
  const inputRef = useRef<HTMLInputElement>(null)

  const codeMap = new Map(stickers.map(s => [s.code.toUpperCase(), s]))

  const handleFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file)
    setPhase({ name: 'preview', file, previewUrl })
  }

  const handleScan = async () => {
    if (phase.name !== 'preview') return
    const { file } = phase
    setPhase({ name: 'scanning', progress: { pct: 0, status: 'Iniciando…' } })
    try {
      const codes = await extractStickerCodes(file, progress =>
        setPhase({ name: 'scanning', progress }),
      )
      const matched        = codes.flatMap(c => { const s = codeMap.get(c); return s ? [s] : [] })
      const toMark         = matched.filter(s => s.quantity > 0)
      const alreadyMissing = matched.filter(s => s.quantity === 0)
      setPhase({ name: 'results', toMark, alreadyMissing })
    } catch (err) {
      alert(`Error al escanear: ${err instanceof Error ? err.message : 'desconocido'}`)
      setPhase({ name: 'capture' })
    }
  }

  const handleSync = async () => {
    if (phase.name !== 'results') return
    const ids = phase.toMark.map(s => s.id)
    setPhase({ name: 'syncing' })
    await onSync(ids)
    setPhase({ name: 'done' })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#060e1f]">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#1a3050] bg-[#0c1829] px-4 py-4">
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1a3050] bg-[#060e1f] text-white/60 hover:text-white transition-colors"
        >
          ←
        </button>
        <h2 className="font-bold text-white">Escanear página del álbum</h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">

        {/* ── CAPTURE ── */}
        {phase.name === 'capture' && (
          <>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0c1829] border border-[#1a3050]">
                <span className="text-4xl">📷</span>
              </div>
              <div>
                <p className="font-semibold text-white">Escanear láminas faltantes</p>
                <p className="mt-1 text-sm text-[#4a6580] max-w-xs">
                  Fotografía una página del álbum. Los slots vacíos muestran el código — el OCR los detectará.
                </p>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
            <div className="flex w-full max-w-xs flex-col gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                className="rounded-2xl bg-[#e31837] px-6 py-4 font-semibold text-white shadow-[0_4px_16px_rgba(227,24,55,.35)] hover:bg-[#cc1530] active:scale-95 transition-all"
              >
                📷  Tomar foto
              </button>
              <label className="cursor-pointer rounded-2xl border border-[#1a3050] bg-[#0c1829] px-6 py-4 text-center font-medium text-white/60 hover:border-[#1e90ff]/40 hover:text-white transition-colors">
                Subir desde galería
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                />
              </label>
            </div>
          </>
        )}

        {/* ── PREVIEW ── */}
        {phase.name === 'preview' && (
          <>
            <img
              src={phase.previewUrl}
              alt="Vista previa"
              className="max-h-72 w-full rounded-2xl object-contain border border-[#1a3050]"
            />
            <div className="flex w-full max-w-xs flex-col gap-3">
              <button
                onClick={handleScan}
                className="rounded-2xl bg-[#e31837] px-6 py-4 font-semibold text-white shadow-[0_4px_16px_rgba(227,24,55,.35)] hover:bg-[#cc1530] active:scale-95 transition-all"
              >
                🔍  Escanear
              </button>
              <button
                onClick={() => { URL.revokeObjectURL(phase.previewUrl); setPhase({ name: 'capture' }) }}
                className="rounded-2xl border border-[#1a3050] bg-[#0c1829] px-6 py-4 text-white/60 hover:text-white transition-colors"
              >
                Cambiar foto
              </button>
            </div>
          </>
        )}

        {/* ── SCANNING ── */}
        {phase.name === 'scanning' && (
          <div className="flex w-full max-w-sm flex-col items-center gap-5">
            <span className="text-5xl animate-pulse">🔍</span>
            <div className="w-full text-center">
              <p className="text-sm font-medium text-white mb-1">{phase.progress.status}</p>
              <p className="text-xs text-[#4a6580]">{phase.progress.pct}%</p>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#0c1829]">
              <div
                className="h-full rounded-full bg-[#1e90ff] transition-all duration-300"
                style={{ width: `${phase.progress.pct}%` }}
              />
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {phase.name === 'results' && (
          <div className="flex w-full max-w-sm flex-col gap-4">
            {/* Total detectadas */}
            <div className="rounded-2xl border border-[#1a3050] bg-[#0c1829] p-5 text-center">
              <p className="text-4xl font-bold text-white">
                {phase.toMark.length + phase.alreadyMissing.length}
              </p>
              <p className="mt-1 text-sm text-[#4a6580]">láminas faltantes detectadas</p>
            </div>

            {phase.toMark.length > 0 && (
              <div className="rounded-2xl border border-[#f5a623]/30 bg-[#1a1400] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#f5a623]">
                  {phase.toMark.length} se marcarán como faltantes
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  {phase.toMark.map(s => s.code).join(' · ')}
                </p>
              </div>
            )}

            {phase.alreadyMissing.length > 0 && (
              <div className="rounded-2xl border border-[#1a3050] bg-[#0c1829] p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#4a6580]">
                  {phase.alreadyMissing.length} ya estaban marcadas
                </p>
                <p className="text-xs text-[#2a4f72] leading-relaxed">
                  {phase.alreadyMissing.map(s => s.code).join(' · ')}
                </p>
              </div>
            )}

            {phase.toMark.length === 0 && phase.alreadyMissing.length === 0 && (
              <p className="text-center text-sm text-[#4a6580]">
                No se detectaron códigos. Intenta con mejor iluminación o ángulo más recto.
              </p>
            )}

            <div className="flex gap-3 pt-1">
              {phase.toMark.length > 0 && (
                <button
                  onClick={handleSync}
                  className="flex-1 rounded-2xl bg-[#e31837] py-4 font-semibold text-white shadow-[0_4px_16px_rgba(227,24,55,.3)] hover:bg-[#cc1530] active:scale-95 transition-all"
                >
                  Sincronizar {phase.toMark.length}
                </button>
              )}
              <button
                onClick={() => setPhase({ name: 'capture' })}
                className="rounded-2xl border border-[#1a3050] bg-[#0c1829] px-5 py-4 text-white/60 hover:text-white transition-colors"
              >
                Nueva foto
              </button>
            </div>
          </div>
        )}

        {/* ── SYNCING ── */}
        {phase.name === 'syncing' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0c1829] border border-[#1a3050]">
              <span className="text-3xl animate-spin">⚙️</span>
            </div>
            <p className="text-sm text-[#4a6580]">Actualizando colección…</p>
          </div>
        )}

        {/* ── DONE ── */}
        {phase.name === 'done' && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0c1829] border-2 border-[#1e90ff]/40">
              <span className="text-4xl">✅</span>
            </div>
            <div>
              <p className="text-lg font-bold text-white">¡Listo!</p>
              <p className="text-sm text-[#4a6580] mt-1">Colección actualizada</p>
            </div>
            <div className="flex w-full max-w-xs flex-col gap-3">
              <button
                onClick={onClose}
                className="rounded-2xl bg-[#1e90ff] px-6 py-4 font-semibold text-white hover:bg-[#1a7de0] active:scale-95 transition-all"
              >
                Volver a mi colección
              </button>
              <button
                onClick={() => setPhase({ name: 'capture' })}
                className="rounded-2xl border border-[#1a3050] bg-[#0c1829] px-6 py-4 text-white/60 hover:text-white transition-colors"
              >
                Escanear otra página
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
