import type { ICollectionRepository } from '@domain/repositories/ICollectionRepository'
import type { IStickerRepository }     from '@domain/repositories/IStickerRepository'
import { toStickerDTO, StickerDTO }    from '../../dtos/StickerDTO'

interface Input {
  userId:    string
  albumId:   string
  stickerId: string
}

export class AddStickerUseCase {
  constructor(
    private readonly collectionRepo: ICollectionRepository,
    private readonly stickerRepo:    IStickerRepository,
  ) {}

  async execute({ userId, albumId, stickerId }: Input): Promise<StickerDTO> {
    const [collection, sticker] = await Promise.all([
      this.collectionRepo.findByUserAndAlbum(userId, albumId),
      this.stickerRepo.findById(stickerId),
    ])

    if (!sticker) throw new Error(`Lámina no encontrada: ${stickerId}`)

    const updated     = collection.addSticker(stickerId)
    const newQuantity = updated.getQuantity(stickerId)

    await this.collectionRepo.updateEntry(userId, stickerId, newQuantity)

    return toStickerDTO(sticker, newQuantity)
  }
}
