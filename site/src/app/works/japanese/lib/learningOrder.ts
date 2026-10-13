// Weighted sampling without replacement: every item can appear, and a batch has no duplicates.
export function mixedOrder<T>(items: T[], weight: (item: T) => number = () => 1, random: () => number = Math.random): T[] {
  return items.map(item => ({ item, score: -Math.log(Math.max(Number.EPSILON, Math.min(1 - Number.EPSILON, random()))) / Math.max(0.01, weight(item)) }))
    .sort((a, b) => a.score - b.score).map(entry => entry.item);
}
