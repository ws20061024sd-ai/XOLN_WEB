"use client";
import { motion, AnimatePresence } from "motion/react";
import { useFlashcards } from "../hooks/useFlashcards";
import { useProgress } from "../hooks/useProgress";

export default function FlashcardModule() {
  const { recordModuleAnswer } = useProgress();
  const { currentCard, options, queueLength, reviewedToday, accuracy, lastResult, checkAnswer } = useFlashcards(recordModuleAnswer);

  const handleSelect = (meaning: string) => {
    if (lastResult !== null) return;
    checkAnswer(meaning);
  };

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 h-12 w-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <p className="text-lg font-medium text-[var(--text)]">今日任务完成</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          已复习 {reviewedToday} 词，正确率 {accuracy}%
        </p>
      </div>
    );
  }

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text)]">词汇闪卡</span>
        <span>待复习 {queueLength}</span>
        <span>正确率 {accuracy}%</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="flex w-full max-w-sm flex-col items-center gap-6"
        >
          {/* 单词卡片 */}
          <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center shadow-sm">
            <p className="text-3xl font-bold text-[var(--text)]">{currentCard.word}</p>
            <p className="mt-2 text-lg text-[var(--text-muted)]">{currentCard.reading}</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="rounded-full bg-[var(--border-light)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]">
                {currentCard.partOfSpeech}
              </span>
              <span className="rounded-full bg-[var(--border-light)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]">
                {currentCard.jlptLevel}
              </span>
            </div>
          </div>

          {/* 选项 */}
          <div className="grid w-full max-w-sm grid-cols-1 gap-2.5">
            {options.map((meaning, i) => {
              const isCorrectOption = meaning === currentCard.meaning;
              // 简化：lastResult为false时高亮正确答案，lastResult为true时高亮选中的
              let borderClass = "border-[var(--border)] hover:border-[var(--accent)]";
              let bgClass = "";
              let cursorClass = lastResult !== null ? "cursor-default" : "cursor-pointer";

              if (lastResult !== null && isCorrectOption) {
                borderClass = "border-green-400";
                bgClass = "bg-green-50 dark:bg-green-950";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(meaning)}
                  disabled={lastResult !== null}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${borderClass} ${bgClass} ${cursorClass}`}
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-[var(--border-light)] text-xs font-medium text-[var(--text-muted)]">
                    {optionLabels[i]}
                  </span>
                  <span className="text-sm font-medium text-[var(--text)]">{meaning}</span>
                </button>
              );
            })}
          </div>

          {/* 反馈 */}
          {lastResult !== null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm font-medium ${lastResult ? "text-green-600" : "text-red-500"}`}
            >
              {lastResult ? "正确" : `错误，正确答案是「${currentCard.meaning}」`}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
