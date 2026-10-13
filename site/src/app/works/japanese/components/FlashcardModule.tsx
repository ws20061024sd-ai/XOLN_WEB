"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFlashcards } from "../hooks/useFlashcards";
import { useProgress } from "../hooks/useProgress";

function FlashcardSession({ skill, difficulty }: { skill: "meaning" | "reading"; difficulty: "standard" | "foundation" }) {
  const { recordModuleAnswer } = useProgress();
  const { kind, totalWords, loading, correctAnswer, nextCard, currentCard, options, queueLength, reviewedToday, accuracy, lastResult, checkAnswer } = useFlashcards(recordModuleAnswer, skill, difficulty);

  const handleSelect = (meaning: string) => {
    if (lastResult !== null) return;
    checkAnswer(meaning);
  };

  if (loading) return <p className="py-16 text-center text-sm text-[var(--text-muted)]">正在准备复习队列…</p>;

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 h-12 w-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <p className="text-lg font-medium text-[var(--text)]">暂无可用词条</p>
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
        <span className="font-medium text-[var(--text)]">{skill === "meaning" ? "词义回忆" : "汉字读音"} · {totalWords} 卡</span>
        <span>本组剩余 {queueLength}</span>
        <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs text-[var(--accent)]">{kind}</span>
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
            {(skill === "meaning" || lastResult !== null) && <p className="mt-2 text-lg text-[var(--text-muted)]">{currentCard.reading}</p>}
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
              const isCorrectOption = meaning === correctAnswer;
              // 简化：lastResult为false时高亮正确答案，lastResult为true时高亮选中的
              let borderClass = "border-[var(--border)] hover:border-[var(--accent)]";
              let bgClass = "";
              const cursorClass = lastResult !== null ? "cursor-default" : "cursor-pointer";

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

          {lastResult !== null && <div className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4"><p className="text-sm font-medium">{currentCard.meaning}</p><p className="mt-3 text-sm leading-6">{currentCard.example}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{currentCard.exampleMeaning}</p><button onClick={nextCard} className="mt-4 w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm text-white">看懂了，下一词 →</button></div>}
          {/* 反馈 */}
          {lastResult !== null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm font-medium ${lastResult ? "text-green-600" : "text-red-500"}`}
            >
              {lastResult ? "正确" : `正确答案是「${correctAnswer}」`}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function FlashcardModule() {
  const [difficulty, setDifficulty] = useState<"standard" | "foundation">("standard");
  const [skill, setSkill] = useState<"meaning" | "reading">("meaning");
  return <div><label className="mb-4 flex items-center justify-end gap-2 text-xs text-[var(--text-muted)]">学习阶段<select aria-label="词汇学习阶段" value={difficulty} onChange={e=>setDifficulty(e.target.value as "standard" | "foundation")} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-2 text-[var(--text)]"><option value="standard">常用训练 · 基础已有一些</option><option value="foundation">基础恢复 · 想先补牢</option></select></label><div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4"><p className="text-sm font-medium">连续刷词 · 没有每日上限</p><p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">到期词与新词混合打散，到期词和薄弱词更容易出现；每组20词，刷完自动接下一组。没有到期词时可自由巩固，同一天反复答对不会延长复习间隔。</p><details className="mt-2 text-xs text-[var(--text-muted)]"><summary className="cursor-pointer">出现顺序是怎样安排的？</summary><p className="mt-2 leading-6">每次进入、每组结束都会重新随机打散；到期词和薄弱词提高抽中概率，但不固定排在前面。常用训练适当增加N4标签内容，基础恢复适当增加基础词，各阶段内容都有机会出现。答错的词回到本组末尾。独立答对后安排1、3、7、21、90天复习；词义与读音各自记录。难度标签用于学习组织，尚未逐词核验完整考纲覆盖。</p></details></div><div className="mb-6 flex justify-center gap-2">{([{key:"meaning",label:"词义"},{key:"reading",label:"汉字读音"}] as const).map(item=><button key={item.key} onClick={()=>setSkill(item.key)} className={`rounded-full border px-5 py-2 text-sm ${skill===item.key?"border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]":"border-[var(--border)]"}`}>{item.label}</button>)}</div><FlashcardSession key={`${skill}:${difficulty}`} skill={skill} difficulty={difficulty} /></div>;
}
