// Contenedor de dependencias — la presentation importa desde aquí, nunca de infra directamente.
import { supabase }                  from './client'
import { SupabaseStickerRepo }       from './SupabaseStickerRepo'
import { SupabaseCollectionRepo }    from './SupabaseCollectionRepo'
import { SupabaseSectionRepo }       from './SupabaseSectionRepo'
import { SupabaseUserRepo }          from './SupabaseUserRepo'
import { SupabaseStorageService }    from '../storage/SupabaseStorageService'
import { GetCollectionUseCase }      from '@application/use-cases/collection/GetCollectionUseCase'
import { AddStickerUseCase }         from '@application/use-cases/collection/AddStickerUseCase'
import { RemoveStickerUseCase }      from '@application/use-cases/collection/RemoveStickerUseCase'
import { GetMissingStickersUseCase } from '@application/use-cases/collection/GetMissingStickersUseCase'
import { MarkMissingUseCase }        from '@application/use-cases/collection/MarkMissingUseCase'

const stickerRepo    = new SupabaseStickerRepo(supabase)
const collectionRepo = new SupabaseCollectionRepo(supabase)
const sectionRepo    = new SupabaseSectionRepo(supabase)

export const userRepo       = new SupabaseUserRepo(supabase)
export const storageService = new SupabaseStorageService(supabase)

export const getCollectionUseCase      = new GetCollectionUseCase(collectionRepo, stickerRepo, sectionRepo)
export const addStickerUseCase         = new AddStickerUseCase(collectionRepo, stickerRepo)
export const removeStickerUseCase      = new RemoveStickerUseCase(collectionRepo, stickerRepo)
export const getMissingStickersUseCase = new GetMissingStickersUseCase(collectionRepo, stickerRepo)
export const markMissingUseCase        = new MarkMissingUseCase(collectionRepo)
