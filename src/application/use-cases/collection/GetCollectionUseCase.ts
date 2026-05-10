import type { ICollectionRepository } from '@domain/repositories/ICollectionRepository'
import type { IStickerRepository }    from '@domain/repositories/IStickerRepository'
import type { ISectionRepository }    from '@domain/repositories/ISectionRepository'
import type { CollectionDTO }         from '../../dtos/CollectionDTO'
import { toStickerDTO }               from '../../dtos/StickerDTO'

interface Input {
  userId:  string
  albumId: string
}

export class GetCollectionUseCase {
  constructor(
    private readonly collectionRepo: ICollectionRepository,
    private readonly stickerRepo:    IStickerRepository,
    private readonly sectionRepo:    ISectionRepository,
  ) {}

  async execute({ userId, albumId }: Input): Promise<CollectionDTO> {
    const [collection, catalog, sections] = await Promise.all([
      this.collectionRepo.findByUserAndAlbum(userId, albumId),
      this.stickerRepo.findByAlbum(albumId),
      this.sectionRepo.findByAlbum(albumId),
    ])

    const progress = collection.getProgress(catalog)
    const stickers = catalog.map(s => toStickerDTO(s, collection.getQuantity(s.id)))

    return {
      userId,
      albumId,
      totalOwned:     progress.totalOwned,
      totalStickers:  progress.totalStickers,
      percentage:     progress.percentage,
      missing:        progress.missing,
      duplicateCount: progress.duplicateCount,
      byTeam:         progress.byTeam,
      stickers,
      sections,
    }
  }
}
