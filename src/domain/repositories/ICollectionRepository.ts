import type { Collection } from '../entities/Collection'

export interface ICollectionRepository {
  findByUserAndAlbum(userId: string, albumId: string): Promise<Collection>
  save(collection: Collection): Promise<void>
  updateEntry(userId: string, stickerId: string, quantity: number): Promise<void>
}
