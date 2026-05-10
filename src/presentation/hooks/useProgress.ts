import { useCollectionStore } from '../stores/collectionStore'

export function useProgress() {
  const collection = useCollectionStore(s => s.collection)

  if (!collection) return null

  return {
    percentage:     collection.percentage,
    totalOwned:     collection.totalOwned,
    totalStickers:  collection.totalStickers,
    missing:        collection.missing,
    duplicateCount: collection.duplicateCount,
    byTeam:         collection.byTeam,
    isComplete:     collection.percentage === 100,
    topTeams:       [...collection.byTeam]
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5),
  }
}
