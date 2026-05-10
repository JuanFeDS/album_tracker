import type { Album } from '../entities/Album'

export interface IAlbumRepository {
  findAll(): Promise<Album[]>
  findById(id: string): Promise<Album | null>
  findBySlug(slug: string): Promise<Album | null>
}
