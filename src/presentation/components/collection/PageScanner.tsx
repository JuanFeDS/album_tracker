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

      // Los códigos visibles = slots vacíos = faltantes
      const matched = codes.flatMap(c => {
        const s = codeMap.get(c)
        return s ? [s] : []
      })

      const toMark        = matched.filter(s => s.quantity > 0)
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
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-800 px-4 py-4">
        <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">←</button>
        <h2 className="font-bold text-white">Escanear página del álbum</h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">

        {/* ── CAPTURE ── */}
        {phase.name === 'capture' && (
          <>
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-6xl">📷</span>
              <p className="text-gray-400 text-sm max-w-xs">
                Toma una foto de una página del álbum. Los slots vacíos (láminas que te faltan)
                muestran el código impreso — el OCR los detectará automáticamente.
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-400 transition-colors"
              >
                Tomar foto
              </button>
              <label className="cursor-pointer rounded-xl border border-gray-700 px-6 py-3 font-semibold text-gray-300 hover:border-gray-500 transition-colors">
                Subir imagen
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
              className="max-h-72 w-full rounded-xl object-contain border border-gray-800"
            />
            <div className="flex gap-3">
              <button
                onClick={handleScan}
                className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white hover:bg-emerald-400 transition-colors"
              >
                Escanear
              </button>
              <button
                onClick={() => { URL.revokeObjectURL(phase.previewUrl); setPhase({ name: 'capture' }) }}
                className="rounded-xl border border-gray-700 px-6 py-3 text-gray-300 hover:border-gray-500 transition-colors"
              >
                Cambiar foto
              </button>
            </div>
          </>
        )}

        {/* ── SCANNING ── */}
        {phase.name === 'scanning' && (
          <div className="flex w-full max-w-sm flex-col items-center gap-4">
            <span className="text-4xl animate-pulse">🔍</span>
            <p className="text-sm text-gray-400">{phase.progress.status}</p>
            <div className="h-2 w-full rounded-full bg-gray-800">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${phase.progress.pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">{phase.progress.pct}%</p>
          </div>
        )}

        {/* ── RESULTS ── */}
        {phase.name === 'results' && (
          <div className="flex w-full max-w-sm flex-col gap-4">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
              <p className="text-3xl font-bold text-white">
                {phase.toMark.length + phase.alreadyMissing.length}
              </p>
              <p className="text-sm text-gray-400">láminas faltantes detectadas</p>
            </div>

            {phase.toMark.length > 0 && (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-yellow-400">
                  {phase.toMark.length} marcadas como tenidas → se marcarán faltantes
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {phase.toMark.map(s => s.code).join(' · ')}
                </p>
              </div>
            )}

            {phase.alreadyMissing.length > 0 && (
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {phase.alreadyMissing.length} ya estaban marcadas faltantes
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {phase.alreadyMissing.map(s => s.code).join(' · ')}
                </p>
              </div>
            )}

            {phase.toMark.length === 0 && phase.alreadyMissing.length === 0 && (
              <p className="text-center text-sm text-gray-500">
                No se detectaron códigos válidos. Intenta con mejor iluminación o ángulo más recto.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              {phase.toMark.length > 0 && (
                <button
                  onClick={handleSync}
                  className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-400 transition-colors"
                >
                  Sincronizar {phase.toMark.length} láminas
                </button>
              )}
              <button
                onClick={() => setPhase({ name: 'capture' })}
                className="rounded-xl border border-gray-700 px-4 py-3 text-gray-300 hover:border-gray-500 transition-colors"
              >
                Nueva foto
              </button>
            </div>
          </div>
        )}

        {/* ── SYNCING ── */}
        {phase.name === 'syncing' && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-4xl animate-spin">⚙️</span>
            <p className="text-sm text-gray-400">Actualizando colección…</p>
          </div>
        )}

        {/* ── DONE ── */}
        {phase.name === 'done' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-5xl">✅</span>
            <p className="font-semibold text-white">¡Colección actualizada!</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPhase({ name: 'capture' })}
                className="rounded-xl border border-gray-700 px-5 py-2.5 text-gray-300 hover:border-gray-500 transition-colors"
              >
                Escanear otra página
              </button>
              <button
                onClick={onClose}
                className="rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-white hover:bg-emerald-400 transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
