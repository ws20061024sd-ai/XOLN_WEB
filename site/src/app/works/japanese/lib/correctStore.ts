import { reviewQueue, recordReview, type ReviewModule } from "./reviewStore";

// Legacy cjt4_correct remains untouched. A historical correct answer is not proof of lasting recall.
export function getAvailable<T extends { id: string }>(items: T[], module: ReviewModule): T[] {
  return reviewQueue(items, module);
}
export function markCorrect(id: string, module: ReviewModule) {
  recordReview(id, module, true);
}
