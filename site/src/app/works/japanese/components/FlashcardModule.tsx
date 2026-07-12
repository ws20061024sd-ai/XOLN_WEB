"use client";
import { motion, AnimatePresence } from "motion/react";
import { useFlashcards } from "../hooks/useFlashcards";
import { useProgress } from "../hooks/useProgress";

export default function FlashcardModule() {
  const { currentCard, isFlipped, setIsFlipped, queueLength, reviewedToday, scoreCard } = useFlashcards();
  const { markActivity } = useProgress();

  const handleScore = (score: 0 | 3 | 5) => {
    markActivity();
    scoreCard(score);
  };

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl">🎉</p>
        <p className="mt-4 text-lg font-medium text-[var(--text)]">今日任务完成！</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">已复习 {reviewedToday} 个单词，明天继续加油。</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
        <span>🔤 闪卡</span>
        <span>📊 待复习: {queueLength}</span>
        <span>今日: {reviewedToday}词</span>
      </div>

      {/* 卡片 */}
      <div
        className="relative w-full max-w-sm cursor-pointer perspective-500"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-10 shadow-sm"
          style={{ minHeight: "240px" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              <motion.div
                key="front"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4"
                style={{ minHeight: "200px" }}
              >
                <p className="text-3xl font-bold text-[var(--text)]">{currentCard.word}</p>
                <p className="text-lg text-[var(--text-muted)]">{currentCard.reading}</p>
                <p className="mt-4 text-xs text-[var(--text-soft)]">👆 点击翻转查看释义</p>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3"
                style={{ minHeight: "200px", transform: "rotateY(180deg)" }}
              >
                <p className="text-2xl font-bold text-[var(--accent)]">{currentCard.meaning}</p>
                <span className="rounded-full bg-[var(--border-light)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                  {currentCard.partOfSpeech} · {currentCard.jlptLevel}
                </span>
                <div className="mt-3 rounded-lg bg-[var(--border-light)] p-3 text-center">
                  <p className="text-sm text-[var(--text)]">{currentCard.example}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{currentCard.exampleMeaning}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 评分按钮 */}
      <div className="flex gap-3">
        <button
          onClick={() => handleScore(0)}
          className="rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
        >
          不会
        </button>
        <button
          onClick={() => handleScore(3)}
          className="rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-2.5 text-sm font-medium text-yellow-600 transition-colors hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
        >
          模糊
        </button>
        <button
          onClick={() => handleScore(5)}
          className="rounded-lg border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
        >
          会了
        </button>
      </div>
    </div>
  );
}
