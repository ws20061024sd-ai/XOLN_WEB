"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useProgress } from "../hooks/useProgress";
import { storage } from "../lib/supabase";
import { GrammarIcon, ReadingIcon, ListeningIcon, TranslateIcon, StatsIcon } from "./Icons";
import ErrorBookModule from "./ErrorBookModule";
import MockExamModule from "./MockExamModule";

interface ModuleStats {
  grammar: { total: number; correct: number };
  reading: { total: number; correct: number };
  listening: { total: number; correct: number };
}

export default function StatsModule() {
  const { stats } = useProgress();
  const [moduleStats, setModuleStats] = useState<ModuleStats>({
    grammar: { total: 0, correct: 0 },
    reading: { total: 0, correct: 0 },
    listening: { total: 0, correct: 0 },
  });
  const [view, setView] = useState<"dashboard" | "errors" | "exam">("dashboard");

  useEffect(() => {
    (async () => {
      const gErrors = await storage.get<any[]>("grammar_errors") ?? [];
      setModuleStats(s => ({ ...s, grammar: { total: gErrors.length + 10, correct: 10 } }));
    })();
  }, []);

  if (view === "errors") return <ErrorBookModule onBack={() => setView("dashboard")} />;
  if (view === "exam") return <MockExamModule />;

  const pct = (c: number, t: number) => t > 0 ? Math.round(c / t * 100) : 0;

  const MODULE_LIST = [
    { label: "语法", Icon: GrammarIcon, rate: pct(moduleStats.grammar.correct, moduleStats.grammar.total) },
    { label: "阅读", Icon: ReadingIcon, rate: pct(moduleStats.reading.correct, moduleStats.reading.total) },
    { label: "听力", Icon: ListeningIcon, rate: pct(moduleStats.listening.correct, moduleStats.listening.total) },
    { label: "翻译", Icon: TranslateIcon, rate: 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-bold text-[var(--text)]">学习统计</h3>

      {/* 概览卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--accent)]">{stats.streakDays}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">连续打卡</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--text)]">{Math.floor(stats.totalMinutes / 60)}h</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">累计学习</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--text)]">{stats.cardsReviewed}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">刷词量</p>
        </div>
      </div>

      {/* 各模块正确率 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MODULE_LIST.map(({ label, Icon, rate }) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Icon />{label}
            </p>
            <p className={`text-xl font-bold mt-1 ${rate >= 60 ? "text-green-500" : "text-orange-500"}`}>
              {rate > 0 ? `${rate}%` : "--"}
            </p>
          </div>
        ))}
      </div>

      {/* 简易趋势 */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <p className="text-sm font-medium text-[var(--text)] mb-3">本周正确率趋势</p>
        <div className="flex items-end gap-2 h-20">
          {[40, 55, 62, 58, 70, 65, 72].map((v, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${v}%` }}
              className="flex-1 rounded-t bg-[var(--accent)] opacity-70" />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
          <span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span>土</span><span>日</span>
        </div>
      </div>

      {/* 入口按钮 */}
      <div className="flex gap-3">
        <button onClick={() => setView("exam")}
          className="flex-1 rounded-lg bg-[var(--accent)] py-3 text-sm font-medium text-white">
          真题模考
        </button>
        <button onClick={() => setView("errors")}
          className="flex-1 rounded-lg border border-[var(--border)] py-3 text-sm font-medium text-[var(--text)]">
          错题本
        </button>
      </div>
    </div>
  );
}
