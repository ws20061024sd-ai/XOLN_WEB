"use client";
import type { DailyStats } from "@/app/works/japanese/hooks/useProgress";
import { StatsIcon, ClockIcon } from "./Icons";

export default function BottomStatusBar({ stats }: { stats: DailyStats }) {
  return (
    <div className="flex items-center justify-center gap-6 border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--text-muted)]">
      <span className="inline-flex items-center gap-1.5">
        <StatsIcon />
        今日 {stats.cardsReviewed} 词
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ClockIcon />
        累计 {Math.floor(stats.totalMinutes / 60)}h
      </span>
    </div>
  );
}
