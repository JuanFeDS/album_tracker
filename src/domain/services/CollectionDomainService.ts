import type { Collection } from '../entities/Collection'
import type { Sticker }    from '../entities/Sticker'
import { Progress }        from '../value-objects/Progress'

export class CollectionDomainService {
  static calculateProgress(collection: Collection, catalog: Sticker[]): Progress {
    return Progress.calculate(collection, catalog)
  }

  static canTrade(
    owner: Collection,
    requester: Collection,
    catalog: Sticker[],
  ): { offerable: Sticker[]; requestable: Sticker[] } {
    const offerable  = catalog.filter(s => owner.getQuantity(s.id) > 1)
    const requestable = catalog.filter(
      s => !requester.hasSticker(s.id) && owner.hasSticker(s.id),
    )
    return { offerable, requestable }
  }
}
