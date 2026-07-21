"use client";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useProgress } from "../hooks/useProgress";
import { GrammarIcon, ReadingIcon, ListeningIcon, TranslateIcon } from "./Icons";
import ErrorBookModule from "./ErrorBookModule";
import MockExamModule from "./MockExamModule";

const DAILY_GOAL = 15; // 每日目标：15 次答题

export default function StatsModule() {
  const {
    stats, moduleStats, getWeeklyTrend, getMonthHeatmap, getTodayCount,
  } = useProgress();
  const [view, setView] = useState<"dashboard" | "errors" | "exam">("dashboard");

  const weeklyTrend = useMemo(() => getWeeklyTrend(), [getWeeklyTrend]);
  const heatmap = useMemo(() => getMonthHeatmap(), [getMonthHeatmap]);
  const todayCount = useMemo(() => getTodayCount(), [getTodayCount]);
  const maxTrend = Math.max(...weeklyTrend, 1);

  if (view === "errors") return <ErrorBookModule onBack={() => setView("dashboard")} />;
  if (view === "exam") return <MockExamModule />;

  const pct = (c: number, t: number) => (t > 0 ? Math.round((c / t) * 100) : 0);

  const MODULE_LIST = [
    { label: "语法", Icon: GrammarIcon, stats: moduleStats.grammar },
    { label: "阅读", Icon: ReadingIcon, stats: moduleStats.reading },
    { label: "听力", Icon: ListeningIcon, stats: moduleStats.listening },
    { label: "翻译", Icon: TranslateIcon, stats: moduleStats.translate },
  ];

  const DAY_LABELS = ["一","二","三","四","五","六","日"];

  return (
    <div className="flex flex-col gap-6">
      {/* 今日目标 */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-[var(--text)]">今日目标</p>
          <p className="text-xs text-[var(--text-muted)]">{todayCount} / {DAILY_GOAL}</p>
        </div>
        <div className="h-2 w-full rounded-full bg-[var(--border-light)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (todayCount / DAILY_GOAL) * 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

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
          <p className="text-xs text-[var(--text-muted)] mt-1">刷题量</p>
        </div>
      </div>

      {/* 各模块正确率 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MODULE_LIST.map(({ label, Icon, stats: s }) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Icon />{label}
            </p>
            {label === "翻译" ? (
              <p className="text-xl font-bold mt-1 text-[var(--text)]">
                {s.total > 0 ? `${s.total}次` : "--"}
              </p>
            ) : (
              <p className={`text-xl font-bold mt-1 ${pct(s.correct, s.total) >= 60 ? "text-green-500" : "text-orange-500"}`}>
                {s.total > 0 ? `${pct(s.correct, s.total)}%` : "--"}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 本周趋势 */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <p className="text-sm font-medium text-[var(--text)] mb-3">最近 7 天</p>
        <div className="flex items-end gap-2 h-20">
          {weeklyTrend.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${v > 0 ? Math.max(8, (v / maxTrend) * 100) : 4}%` }}
                className={`w-full rounded-t ${v > 0 ? "bg-[var(--accent)] opacity-70" : "bg-[var(--border-light)]"}`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
          {weeklyTrend.map((v, i) => (
            <span key={i} className={v > 0 ? "text-[var(--text)] font-medium" : ""}>{v}</span>
          ))}
        </div>
      </div>

      {/* 学习日历 */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
        <p className="text-sm font-medium text-[var(--text)] mb-3">
          {new Date().getMonth() + 1}月学习日历
        </p>
        <div className="flex gap-1 mb-1">
          {DAY_LABELS.map(d => (
            <span key={d} className="flex-1 text-center text-[10px] text-[var(--text-muted)]">{d}</span>
          ))}
        </div>
        {/* 填充空白天到每月1号的星期位置 */}
        <div className="grid grid-cols-7 gap-1">
          {(() => {
            const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
            const blanks = firstDay === 0 ? 6 : firstDay - 1; // 周一开始
            const cells: React.ReactNode[] = [];
            for (let i = 0; i < blanks; i++) {
              cells.push(<div key={`b-${i}`} className="aspect-square" />);
            }
            for (const day of heatmap) {
              const d = parseInt(day.date.split("-")[2], 10);
              const hasActivity = day.count > 0;
              const level = day.count === 0 ? 0 : day.count < 5 ? 1 : day.count < 15 ? 2 : 3;
              const colors = [
                "bg-[var(--border-light)]",
                "bg-green-200 dark:bg-green-900",
                "bg-green-400 dark:bg-green-700",
                "bg-green-600 dark:bg-green-500",
              ];
              cells.push(
                <div
                  key={d}
                  title={`${day.date}: ${day.count} 题`}
                  className={`aspect-square rounded-sm ${colors[level]} ${new Date().getDate() === d ? "ring-1 ring-[var(--accent)]" : ""}`}
                />
              );
            }
            return cells;
          })()}
        </div>
        <div className="flex items-center justify-end gap-2 mt-2 text-[10px] text-[var(--text-muted)]">
          <span>少</span>
          <span className="h-3 w-3 rounded-sm bg-[var(--border-light)]" />
          <span className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <span className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <span className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-500" />
          <span>多</span>
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
