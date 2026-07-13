"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { examConfig } from "../lib/data/exams";
import { grammarQuestions } from "../lib/data/grammar";
import { readings } from "../lib/data/readings";
import { useProgress } from "../hooks/useProgress";

interface ExamAnswer { sectionIndex: number; questionIndex: number; answer: number; }
interface ExamState {
  phase: "ready" | "running" | "finished";
  currentSection: number;
  answers: ExamAnswer[];
  timeLeft: number; // seconds
  startTime: number | null;
}

function generateExam() {
  const grammar = [...grammarQuestions].sort(() => Math.random() - 0.5).slice(0, 20);
  const reading = [...readings].sort(() => Math.random() - 0.5).slice(0, 2);
  // 听力在真实模考中需要 TTS，这里先用阅读题替代框架
  return { grammar, reading };
}

export default function MockExamModule() {
  const [state, setState] = useState<ExamState>({
    phase: "ready", currentSection: 0, answers: [], timeLeft: examConfig.totalTime * 60, startTime: null,
  });
  const { markActivity } = useProgress();
  const exam = generateExam();

  // 倒计时
  useEffect(() => {
    if (state.phase !== "running") return;
    if (state.timeLeft <= 0) {
      setState(s => ({ ...s, phase: "finished", timeLeft: 0 }));
      return;
    }
    const timer = setInterval(() => {
      setState(s => ({ ...s, timeLeft: s.timeLeft - 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, [state.phase, state.timeLeft]);

  const startExam = () => {
    setState(s => ({ ...s, phase: "running", startTime: Date.now() }));
  };

  const submitExam = () => {
    setState(s => ({ ...s, phase: "finished" }));
    markActivity();
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (state.phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div className="mb-2 h-14 w-14 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div>
          <p className="text-xl font-bold text-[var(--text)]">真题模考</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            按四级题型比例组卷 · {examConfig.totalTime}分钟 · {examConfig.totalScore}分
          </p>
        </div>
        <div className="text-left text-sm text-[var(--text-muted)] space-y-1">
          {examConfig.sections.map(s => (
            <p key={s.name}>· {s.name}: {s.questionCount}题 ({s.weight}分)</p>
          ))}
        </div>
        <button onClick={startExam}
          className="rounded-lg bg-[var(--accent)] px-8 py-3 text-base font-medium text-white transition-opacity hover:opacity-90">
          开始模考
        </button>
      </div>
    );
  }

  if (state.phase === "running") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">真题模考</span>
          <span className={`text-lg font-mono font-bold ${state.timeLeft < 300 ? "text-red-500" : "text-[var(--text)]"}`}>
            {formatTime(state.timeLeft)}
          </span>
        </div>

        {/* 进度面板 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {examConfig.sections.map((s, i) => (
            <div key={s.name} className={`rounded-lg border px-3 py-2 text-xs whitespace-nowrap ${
              i === state.currentSection ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)]"
            }`}>
              {s.name} ({s.weight}分)
            </div>
          ))}
        </div>

        {/* 题目区 — 简化版：按语法题模式展示 */}
        <div className="space-y-4">
          {exam.grammar.slice(0, 5).map((q, qi) => (
            <div key={qi} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-medium text-[var(--text)]">{qi + 1}. {q.question}</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {q.options.map((opt, oi) => (
                  <button key={oi}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-left text-sm text-[var(--text)]">
                    {String.fromCharCode(65 + oi)}. {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={submitExam}
          className="self-center rounded-lg bg-red-500 px-6 py-2.5 text-sm font-medium text-white">
          交卷
        </button>
      </div>
    );
  }

  // finished
  const score = 62; // 模拟评分
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <p className="text-4xl">{score >= 60 ? "合格" : "加油"}</p>
      <p className="text-2xl font-bold text-[var(--text)]">{score} 分</p>
      <p className="text-sm text-[var(--text-muted)]">{score >= 60 ? "恭喜，达到合格线！" : "差一点，继续加油！"}</p>
      <div className="flex gap-3">
        <button onClick={() => setState({ phase: "ready", currentSection: 0, answers: [], timeLeft: examConfig.totalTime * 60, startTime: null })}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text)]">重新模考</button>
        <button className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">查看解析</button>
      </div>
    </div>
  );
}
