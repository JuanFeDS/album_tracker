import type { ICollectionRepository } from '@domain/repositories/ICollectionRepository'
import type { IStickerRepository }     from '@domain/repositories/IStickerRepository'
import { toStickerDTO, StickerDTO }    from '../../dtos/StickerDTO'

interface Input {
  userId:    string
  albumId:   string
  teamCode?: string   // opcional: filtra por equipo
}

export class GetMissingStickersUseCase {
  constructor(
    private readonly collectionRepo: ICollectionRepository,
    private readonly stickerRepo:    IStickerRepository,
  ) {}

  async execute({ userId, albumId, teamCode }: Input): Promise<StickerDTO[]> {
    const [collection, catalog] = await Promise.all([
      this.collectionRepo.findByUserAndAlbum(userId, albumId),
      teamCode
        ? this.stickerRepo.findByTeamCode(albumId, teamCode)
        : this.stickerRepo.findByAlbum(albumId),
    ])

    return collection
      .getMissing(catalog)
      .map(s => toStickerDTO(s, 0))
  }
}
