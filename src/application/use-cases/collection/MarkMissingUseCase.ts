import type { ICollectionRepository } from '@domain/repositories/ICollectionRepository'

interface Input {
  userId:     string
  stickerIds: string[]
}

export class MarkMissingUseCase {
  constructor(private readonly collectionRepo: ICollectionRepository) {}

  async execute({ userId, stickerIds }: Input): Promise<void> {
    await Promise.all(
      stickerIds.map(id => this.collectionRepo.updateEntry(userId, id, 0)),
    )
  }
}
