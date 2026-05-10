import type { Collection } from '../entities/Collection'
import type { Sticker }    from '../entities/Sticker'

export interface TeamProgress {
  team:       string
  teamCode:   string
  owned:      number
  total:      number
  percentage: number
}

export class Progress {
  readonly totalOwned:    number
  readonly totalStickers: number
  readonly percentage:    number
  readonly missing:       number
  readonly duplicateCount: number
  readonly byTeam:        TeamProgress[]

  private constructor(data: {
    totalOwned:    number
    totalStickers: number
    missing:       number
    duplicateCount: number
    byTeam:        TeamProgress[]
  }) {
    this.totalOwned    = data.totalOwned
    this.totalStickers = data.totalStickers
    this.percentage    = data.totalStickers === 0
      ? 0
      : Math.round((data.totalOwned / data.totalStickers) * 100)
    this.missing       = data.missing
    this.duplicateCount = data.duplicateCount
    this.byTeam        = data.byTeam
  }

  isComplete(): boolean {
    return this.totalOwned === this.totalStickers
  }

  static calculate(collection: Collection, catalog: Sticker[]): Progress {
    const teamStickers = catalog.filter(s => s.section === 'teams')

    // Progreso por equipo
    const teamMap = new Map<string, { team: string; teamCode: string; stickers: Sticker[] }>()
    for (const s of teamStickers) {
      if (!s.teamCode) continue
      if (!teamMap.has(s.teamCode)) {
        teamMap.set(s.teamCode, { team: s.team, teamCode: s.teamCode, stickers: [] })
      }
      teamMap.get(s.teamCode)!.stickers.push(s)
    }

    const byTeam: TeamProgress[] = Array.from(teamMap.values()).map(({ team, teamCode, stickers }) => {
      const owned = stickers.filter(s => collection.hasSticker(s.id)).length
      return {
        team,
        teamCode,
        owned,
        total: stickers.length,
        percentage: Math.round((owned / stickers.length) * 100),
      }
    })

    const totalOwned    = catalog.filter(s => collection.hasSticker(s.id)).length
    const missing       = catalog.filter(s => !collection.hasSticker(s.id)).length
    const duplicateCount = collection
      .getDuplicates(catalog)
      .reduce((sum, d) => sum + d.extras, 0)

    return new Progress({
      totalOwned,
      totalStickers: catalog.length,
      missing,
      duplicateCount,
      byTeam,
    })
  }
}
