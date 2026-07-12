"use client";
import type { DailyStats } from "@/app/works/japanese/hooks/useProgress";

export default function BottomStatusBar({ stats }: { stats: DailyStats }) {
  return (
    <div className="flex items-center justify-center gap-6 border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--text-muted)]">
      <span>📊 今日: {stats.cardsReviewed}词</span>
      <span>🔥 连续 {stats.streakDays} 天</span>
      <span>⏱ 累计 {Math.floor(stats.totalMinutes / 60)}h</span>
    </div>
  );
}
