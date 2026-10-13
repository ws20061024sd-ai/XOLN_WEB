import type { VocabCard } from "./data/vocabulary";
import type { CardState } from "./cardScheduler";
import { mixedOrder } from "./learningOrder";

export const GROUP_SIZE = 20;
export function vocabularyQueue(cards: VocabCard[], states: Map<string, CardState>, now = Date.now(), difficulty: "standard" | "foundation" = "standard", random: () => number = Math.random): VocabCard[] {
  const available = cards.filter(card => !states.get(card.id)?.totalReviews || states.get(card.id)!.nextReview.getTime() <= now);
  const pool = available.length ? available : cards;
  return mixedOrder(pool, card => {
    const state = states.get(card.id);
    const preferred = difficulty === "foundation" ? ["基础", "N5"].includes(card.jlptLevel) : card.jlptLevel === "N4";
    const reviewWeight = state?.totalReviews && state.nextReview.getTime() <= now ? (state.level === 0 ? 4 : 3) : 1;
    return reviewWeight * (preferred ? 1.5 : 1);
  }, random).slice(0, GROUP_SIZE);
}
