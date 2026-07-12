export interface CardState {
  wordId: string;
  level: number;        // 0-5
  nextReview: Date;
  totalReviews: number;
  totalCorrect: number;
}

export function getInitialState(wordId: string): CardState {
  return {
    wordId,
    level: 0,
    nextReview: new Date(),
    totalReviews: 0,
    totalCorrect: 0,
  };
}

export function review(
  state: CardState,
  score: 0 | 3 | 5
): CardState {
  const now = new Date();
  const totalReviews = state.totalReviews + 1;
  const totalCorrect = score > 0 ? state.totalCorrect + 1 : state.totalCorrect;

  if (score === 0) {
    // 完全不会：重置，当天重新出现
    return { wordId: state.wordId, level: 0, nextReview: now, totalReviews, totalCorrect };
  }

  const newLevel = score === 5 ? Math.min(5, state.level + 2) : Math.min(5, state.level + 1);
  const intervalDays = calculateInterval(newLevel);
  const nextReview = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return { wordId: state.wordId, level: newLevel, nextReview, totalReviews, totalCorrect };
}

function calculateInterval(level: number): number {
  if (level === 0) return 0.25;   // 6小时
  if (level === 1) return 1;
  if (level === 2) return 3;
  if (level === 3) return 7;
  if (level === 4) return 21;
  return 90;                       // level 5: 3个月
}
