import type { SectionDTO } from '@application/dtos/SectionDTO'

export interface ISectionRepository {
  findByAlbum(albumId: string): Promise<SectionDTO[]>
}
