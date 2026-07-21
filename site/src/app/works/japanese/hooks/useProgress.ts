"use client";
import { useState, useEffect, useCallback } from "react";

export interface ModuleStats {
  grammar: { total: number; correct: number };
  reading: { total: number; correct: number };
  listening: { total: number; correct: number };
  flashcard: { total: number; correct: number };
}

export interface DailyStats {
  cardsReviewed: number;
  streakDays: number;
  totalMinutes: number;
}

interface PersistedState {
  daily: DailyStats;
  modules: ModuleStats;
}

const STORAGE_KEY = "cjt4_progress";
const LAST_ACTIVE_KEY = "cjt4_last_active";

function getEmptyModuleStats(): ModuleStats {
  return {
    grammar: { total: 0, correct: 0 },
    reading: { total: 0, correct: 0 },
    listening: { total: 0, correct: 0 },
    flashcard: { total: 0, correct: 0 },
  };
}

function loadPersisted(): PersistedState {
  if (typeof window === "undefined") {
    return { daily: { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 }, modules: getEmptyModuleStats() };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        daily: parsed.daily ?? { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 },
        modules: { ...getEmptyModuleStats(), ...parsed.modules },
      };
    }
  } catch {}
  return { daily: { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 }, modules: getEmptyModuleStats() };
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toDateString();
}

export function useProgress() {
  const [persisted, setPersisted] = useState<PersistedState>(loadPersisted);

  // Auto-save
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
    setPersisted(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [module]: {
          total: prev.modules[module].total + 1,
          correct: prev.modules[module].correct + (correct ? 1 : 0),
        },
      },
    }));
  }, [markActivity]);

  return {
    stats: persisted.daily,
    moduleStats: persisted.modules,
    markActivity,
    recordModuleAnswer,
  };
}
