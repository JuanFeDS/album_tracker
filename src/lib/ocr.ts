// Regex que cubre todos los códigos del álbum WC 2026
const CODE_RE = /\b(00|FWC\d{1,2}|MUS\d{1,2}|[A-Z]{2,3}\d{1,2})\b/g

export type OcrProgress = { pct: number; status: string }

export async function extractStickerCodes(
  file: File,
  onProgress: (p: OcrProgress) => void,
): Promise<string[]> {
  onProgress({ pct: 5, status: 'Preparando imagen…' })
  const blob = await preprocessImage(file)

  onProgress({ pct: 15, status: 'Cargando motor OCR…' })
  // Lazy-load: ~2 MB, solo cuando el usuario lo necesita
  const { createWorker } = await import('tesseract.js')

  const worker = await createWorker('eng', 1, {
    logger: ({ status, progress }: { status: string; progress: number }) => {
      if (status === 'recognizing text') {
        onProgress({ pct: 20 + Math.round(progress * 75), status: 'Reconociendo texto…' })
      }
    },
  })

  // Solo letras mayúsculas y dígitos → menos ruido
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  })

  const { data: { text } } = await worker.recognize(blob)
  await worker.terminate()

  onProgress({ pct: 98, status: 'Procesando resultados…' })

  const codes = [...new Set([...text.matchAll(CODE_RE)].map(m => m[0].toUpperCase()))]
  return codes
}

// Escala la imagen a máx 2 000 px y aplica escala de grises + estiramiento de histograma
async function preprocessImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)

      const MAX = 2000
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX }
      if (h > MAX) { w = Math.round(w * MAX / h); h = MAX }

      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)

      const id = ctx.getImageData(0, 0, w, h)
      const d  = id.data

      // Primera pasada: calcular min/max del canal gris
      let min = 255, max = 0
      for (let i = 0; i < d.length; i += 4) {
        const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
        if (g < min) min = g
        if (g > max) max = g
      }
      const range = max - min || 1

      // Segunda pasada: escala de grises + estiramiento de contraste
      for (let i = 0; i < d.length; i += 4) {
        const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
        const v = Math.round(((g - min) / range) * 255)
        d[i] = d[i + 1] = d[i + 2] = v
      }

      ctx.putImageData(id, 0, 0)
      canvas.toBlob(
        b => (b ? resolve(b) : reject(new Error('toBlob failed'))),
        'image/png',
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo cargar la imagen')) }
    img.src = url
  })
}
