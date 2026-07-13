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
  isCorrect: boolean
): CardState {
  const now = new Date();
  const totalReviews = state.totalReviews + 1;
  const totalCorrect = isCorrect ? state.totalCorrect + 1 : state.totalCorrect;

  if (!isCorrect) {
    return { wordId: state.wordId, level: 0, nextReview: now, totalReviews, totalCorrect };
  }

  const newLevel = Math.min(5, state.level + 1);
  const intervalDays = calculateInterval(newLevel);
  const nextReview = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return { wordId: state.wordId, level: newLevel, nextReview, totalReviews, totalCorrect };
}

function calculateInterval(level: number): number {
  if (level === 0) return 0.25;
  if (level === 1) return 1;
  if (level === 2) return 3;
  if (level === 3) return 7;
  if (level === 4) return 21;
  return 90;
}
