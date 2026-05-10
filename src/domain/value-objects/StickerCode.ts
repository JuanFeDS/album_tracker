// Formato válido: "00" | "FWC1"–"FWC19" | "ARG1"–"ARG20" (2–3 letras + 1–2 dígitos)
const VALID_CODE = /^(00|FWC\d{1,2}|[A-Z]{2,3}\d{1,2})$/

export class StickerCode {
  private constructor(readonly value: string) {}

  static create(raw: string): StickerCode {
    const normalized = raw.trim().toUpperCase()
    if (!VALID_CODE.test(normalized)) {
      throw new Error(`Código de lámina inválido: "${raw}"`)
    }
    return new StickerCode(normalized)
  }

  static isValid(raw: string): boolean {
    return VALID_CODE.test(raw.trim().toUpperCase())
  }

  equals(other: StickerCode): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
