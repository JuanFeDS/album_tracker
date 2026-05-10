import type { Sticker } from './Sticker'
import { Progress }     from '../value-objects/Progress'

export class Collection {
  readonly userId:  string
  readonly albumId: string
  private readonly entries: ReadonlyMap<string, number> // stickerId → quantity

  constructor(userId: string, albumId: string, entries: Map<string, number>) {
    this.userId  = userId
    this.albumId = albumId
    this.entries = entries
  }

  // ── Queries ──────────────────────────────────────────────────

  getQuantity(stickerId: string): number {
    return this.entries.get(stickerId) ?? 0
  }

  hasSticker(stickerId: string): boolean {
    return this.getQuantity(stickerId) > 0
  }

  getMissing(catalog: Sticker[]): Sticker[] {
    return catalog.filter(s => this.getQuantity(s.id) === 0)
  }

  getDuplicates(catalog: Sticker[]): Array<{ sticker: Sticker; extras: number }> {
    return catalog
      .filter(s => this.getQuantity(s.id) > 1)
      .map(s => ({ sticker: s, extras: this.getQuantity(s.id) - 1 }))
  }

  getProgress(catalog: Sticker[]): Progress {
    return Progress.calculate(this, catalog)
  }

  // ── Commands (retornan nueva instancia — inmutabilidad) ──────

  addSticker(stickerId: string): Collection {
    const next = new Map(this.entries)
    next.set(stickerId, (next.get(stickerId) ?? 0) + 1)
    return new Collection(this.userId, this.albumId, next)
  }

  removeSticker(stickerId: string): Collection {
    const current = this.entries.get(stickerId) ?? 0
    if (current === 0) return this
    const next = new Map(this.entries)
    current === 1 ? next.delete(stickerId) : next.set(stickerId, current - 1)
    return new Collection(this.userId, this.albumId, next)
  }

  // ── Serialización ────────────────────────────────────────────

  toEntries(): Array<{ stickerId: string; quantity: number }> {
    return Array.from(this.entries.entries()).map(([stickerId, quantity]) => ({
      stickerId,
      quantity,
    }))
  }

  static empty(userId: string, albumId: string): Collection {
    return new Collection(userId, albumId, new Map())
  }

  static fromEntries(
    userId: string,
    albumId: string,
    entries: Array<{ stickerId: string; quantity: number }>,
  ): Collection {
    return new Collection(userId, albumId, new Map(entries.map(e => [e.stickerId, e.quantity])))
  }
}
