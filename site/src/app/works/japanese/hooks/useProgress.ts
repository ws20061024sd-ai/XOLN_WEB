"use client";
import { useState, useEffect, useCallback } from "react";

export interface ModuleStats {
  grammar: { total: number; correct: number };
  reading: { total: number; correct: number };
  listening: { total: number; correct: number };
  flashcard: { total: number; correct: number };
  translate: { total: number; correct: number };
}

export interface DailyStats {
  cardsReviewed: number;
  streakDays: number;
  totalMinutes: number;
}

export interface DayLog {
  date: string; // "2026-07-13"
  cards: number;
  grammar: number;
  reading: number;
  listening: number;
  translate: number;
  total: number;
}

interface PersistedState {
  daily: DailyStats;
  modules: ModuleStats;
  dailyLog: DayLog[];
}

const STORAGE_KEY = "cjt4_progress";
const LAST_ACTIVE_KEY = "cjt4_last_active";

function getEmptyModuleStats(): ModuleStats {
  return {
    grammar: { total: 0, correct: 0 },
    reading: { total: 0, correct: 0 },
    listening: { total: 0, correct: 0 },
    flashcard: { total: 0, correct: 0 },
    translate: { total: 0, correct: 0 },
  };
}

function loadPersisted(): PersistedState {
  if (typeof window === "undefined") {
    return { daily: { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 }, modules: getEmptyModuleStats(), dailyLog: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        daily: parsed.daily ?? { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 },
        modules: { ...getEmptyModuleStats(), ...parsed.modules },
        dailyLog: parsed.dailyLog ?? [],
      };
    }
  } catch {}
  return { daily: { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 }, modules: getEmptyModuleStats(), dailyLog: [] };
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toDateString();
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

const MODULE_LOG_KEY: Record<string, keyof DayLog> = {
  grammar: "grammar",
  reading: "reading",
  listening: "listening",
  flashcard: "cards",
  translate: "translate",
};

export function useProgress() {
  const [persisted, setPersisted] = useState<PersistedState>(loadPersisted);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    }
  }, [persisted]);

  const markActivity = useCallback(() => {
    const today = new Date().toDateString();
    const yesterday = getYesterdayStr();
    const lastActive = typeof window !== "undefined" ? localStorage.getItem(LAST_ACTIVE_KEY) : null;

    setPersisted(prev => {
      let newStreak: number;
      if (lastActive === today) {
        newStreak = prev.daily.streakDays;
      } else if (lastActive === yesterday) {
        newStreak = prev.daily.streakDays + 1;
      } else {
        newStreak = 1;
      }
      return {
        ...prev,
        daily: {
          cardsReviewed: prev.daily.cardsReviewed + 1,
          streakDays: newStreak,
          totalMinutes: prev.daily.totalMinutes + 1,
        },
      };
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(LAST_ACTIVE_KEY, today);
    }
  }, []);

  const recordModuleAnswer = useCallback((module: keyof ModuleStats, correct: boolean) => {
    markActivity();
    const today = todayStr();
    const logKey = MODULE_LOG_KEY[module] ?? "total";

    setPersisted(prev => {
      // 更新每日日志
      const dailyLog = [...prev.dailyLog];
      const idx = dailyLog.findIndex(d => d.date === today);
      if (idx >= 0) {
        const entry = { ...dailyLog[idx] };
        (entry as any)[logKey] = ((entry as any)[logKey] ?? 0) + 1;
        entry.total = (entry.total ?? 0) + 1;
        dailyLog[idx] = entry;
      } else {
        const entry: DayLog = { date: today, cards: 0, grammar: 0, reading: 0, listening: 0, translate: 0, total: 0 };
        (entry as any)[logKey] = 1;
        entry.total = 1;
        dailyLog.push(entry);
      }
      // 只保留最近 90 天
      const trimmed = dailyLog.slice(-90);

      return {
        ...prev,
        modules: {
          ...prev.modules,
          [module]: {
            total: prev.modules[module].total + 1,
            correct: prev.modules[module].correct + (correct ? 1 : 0),
          },
        },
        dailyLog: trimmed,
      };
    });
  }, [markActivity]);

  // 最近 7 天趋势数据
  const getWeeklyTrend = useCallback((): number[] => {
    const days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      const found = persisted.dailyLog.find(l => l.date === ds);
      days.push(found?.total ?? 0);
    }
    return days;
  }, [persisted.dailyLog]);

  // 当月热力图数据
  const getMonthHeatmap = useCallback((): { date: string; count: number }[] => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: { date: string; count: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const found = persisted.dailyLog.find(l => l.date === ds);
      result.push({ date: ds, count: found?.total ?? 0 });
    }
    return result;
  }, [persisted.dailyLog]);

  // 今日各模块完成数
  const getTodayCounts = useCallback((): { cards: number; grammar: number; reading: number; listening: number; translate: number } => {
    const found = persisted.dailyLog.find(l => l.date === todayStr());
    return {
      cards: found?.cards ?? 0,
      grammar: found?.grammar ?? 0,
      reading: found?.reading ?? 0,
      listening: found?.listening ?? 0,
      translate: found?.translate ?? 0,
    };
  }, [persisted.dailyLog]);

  return {
    stats: persisted.daily,
    moduleStats: persisted.modules,
    dailyLog: persisted.dailyLog,
    markActivity,
    recordModuleAnswer,
    getWeeklyTrend,
    getMonthHeatmap,
    getTodayCounts,
  };
}
