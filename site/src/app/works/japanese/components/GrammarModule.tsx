"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { grammarQuestions } from "../lib/data/grammar";
import { useProgress } from "../hooks/useProgress";
import { addError } from "../lib/errorStore";

export default function GrammarModule() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const { markActivity } = useProgress();

  const question = grammarQuestions[currentIndex % grammarQuestions.length];
  const isCorrect = selected === question.answer;

  const handleSelect = useCallback(async (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTotalAnswered(n => n + 1);
    if (index === question.answer) setCorrectCount(n => n + 1);
    markActivity();

    if (index !== question.answer) {
      await addError({
        questionId: question.id,
        module: "grammar",
        date: new Date().toISOString(),
      });
    }
  }, [selected, question, markActivity]);

  const handleShowExplain = () => setShowExplain(true);

  const nextQuestion = () => {
    setSelected(null);
    setShowExplain(false);
    setCurrentIndex(i => (i + 1) % grammarQuestions.length);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text)]">语法</span>
        <span>正确率 {totalAnswered > 0 ? Math.round(correctCount / totalAnswered * 100) : 0}%</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id + currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-5"
        >
          {/* 题目 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <p className="text-xs text-[var(--text-muted)] mb-2">{question.knowledgePoint} · {question.jlptLevel}</p>
            <p className="text-lg font-medium text-[var(--text)]">{question.question}</p>
          </div>

          {/* 选项 */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {question.options.map((opt, i) => {
              let borderClass = "border-[var(--border)]";
              if (showExplain) {
                // 展开解析后才高亮正确答案
                if (i === question.answer) borderClass = "border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-950";
                else if (i === selected && !isCorrect) borderClass = "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950";
              } else if (selected === i) {
                // 选中后但不展开解析：仅标记用户选择
                borderClass = isCorrect
                  ? "border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-950"
                  : "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${borderClass} ${
                    selected === null ? "hover:border-[var(--accent)] cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span className="text-[var(--text-muted)] mr-2">{String.fromCharCode(65 + i)}.</span>
                  <span className="text-[var(--text)]">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* 选中后反馈 */}
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5"
            >
              <p className={`font-semibold text-sm mb-2 ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                {isCorrect ? "正确" : "错误"}
              </p>

              {!showExplain ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleShowExplain}
                    className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-card)] transition-colors"
                  >
                    查看解析
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    下一题
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-green-600 mb-1">正确答案：{question.options[question.answer]}</p>
                  <p className="text-sm text-[var(--text)] leading-relaxed">{question.explanation}</p>
                  <button
                    onClick={nextQuestion}
                    className="mt-4 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    下一题
                  </button>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
