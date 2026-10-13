"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { grammarQuestions } from "../lib/data/grammar";
import { useProgress } from "../hooks/useProgress";
import { addError } from "../lib/errorStore";
import { getAvailable } from "../lib/correctStore";
import { recordReview } from "../lib/reviewStore";
import { todayLocalDate } from "../lib/date";

export default function GrammarModule() {
  const [queue, setQueue] = useState(() =>
    getAvailable(grammarQuestions, "grammar"),
  );
  const [confident, setConfident] = useState(true);
  const [topic, setTopic] = useState("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const { recordModuleAnswer, moduleStats } = useProgress();
  const grammarStats = moduleStats.grammar;

  // 当前题固定在队首：答题与反馈期间队列不变，点"下一题"才结算
  const question = queue[0] ?? null;
  const isCorrect = selected === question?.answer;

  const handleSelect = useCallback(async (index: number) => {
    if (selected !== null || !question) return;
    setSelected(index);
    const correct = index === question.answer;
    recordModuleAnswer("grammar", correct);

    recordReview(question.id, "grammar", correct, confident);
    if (!correct) {
      await addError({
        questionId: question.id,
        module: "grammar",
        date: todayLocalDate(),
      });
    }
  }, [selected, question, recordModuleAnswer, confident]);

  const handleShowExplain = () => setShowExplain(true);

  const nextQuestion = () => {
    if (!question) return;
    const wasCorrect = selected === question.answer && confident;
    setSelected(null);
    setConfident(true);
    setShowExplain(false);
    if (wasCorrect) {
      // 本轮答对后出队，后续仍可按复习间隔再练。
      setQueue(prev => prev.slice(1));
    } else {
      // 答错：移到队尾，本会话内稍后可再遇
      setQueue(prev => [...prev.slice(1), prev[0]]);
    }
  };

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 h-12 w-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent)]">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <p className="text-lg font-medium text-[var(--text)]">本轮语法练习已完成</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">可以继续随机练一轮；提前巩固不会延长已安排的复习间隔。</p>
        <button onClick={() => setQueue(getAvailable(grammarQuestions.filter(q => topic === "all" || q.knowledgePoint === topic), "grammar"))} className="mt-4 rounded-lg border border-[var(--border)] px-4 py-2 text-sm">打散再练一轮</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text)]">语法</span>
        {question.source && <span className="text-xs">{question.source}</span>}
        <span>正确率 {grammarStats.total > 0 ? Math.round(grammarStats.correct / grammarStats.total * 100) : 0}%</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] p-4">
        <label className="text-xs text-[var(--text-muted)]">考点 <select aria-label="语法考点" value={topic} onChange={e => { const value = e.target.value; setTopic(value); setQueue(getAvailable(grammarQuestions.filter(q => value === "all" || q.knowledgePoint === value), "grammar")); setSelected(null); setShowExplain(false); setConfident(true); }} className="ml-2 max-w-[220px] rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text)]"><option value="all">全部考点 · 随机混合</option>{[...new Set(grammarQuestions.map(q=>q.knowledgePoint))].sort().map(t=><option key={t} value={t}>{t}</option>)}</select></label>
        <span className="text-xs text-[var(--text-muted)]">本次队列 {queue.length} 题</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs"><span className="text-[var(--text-muted)]">这道题：</span>{[{value:true,label:"我有把握"},{value:false,label:"不确定 / 可能猜"}].map(item=><button key={item.label} disabled={selected !== null} onClick={()=>setConfident(item.value)} className={`rounded-full border px-3 py-2 ${confident === item.value ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)]"}`}>{item.label}</button>)}<span className="ml-auto text-[var(--text-soft)]">猜对会进入补练，不计为独立掌握</span></div>
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-5"
        >
          {/* 题目 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
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
                {isCorrect ? confident ? "正确 · 已安排明日复习" : "答案正确 · 不确定，稍后再练" : "需要再练一次"}
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
                  <p className="text-xs text-[var(--text-soft)] mb-2">{question.knowledgePoint} · {question.jlptLevel}</p>
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
