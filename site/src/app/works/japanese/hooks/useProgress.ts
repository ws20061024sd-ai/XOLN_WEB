"use client";
import { useState, useEffect, useCallback } from "react";

export interface DailyStats {
  cardsReviewed: number;
  streakDays: number;
  totalMinutes: number;
}

const STORAGE_KEY = "cjt4_progress";
const LAST_ACTIVE_KEY = "cjt4_last_active";

function loadStats(): DailyStats {
  if (typeof window === "undefined") return { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 };
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toDateString();
}

export function useProgress() {
  const [stats, setStats] = useState<DailyStats>(loadStats);

  // Sync stats to localStorage whenever they change (side effect outside setState)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  const markActivity = useCallback(() => {
    const today = new Date().toDateString();
    const yesterday = getYesterdayStr();
    const lastActive =
      typeof window !== "undefined" ? localStorage.getItem(LAST_ACTIVE_KEY) : null;

    setStats(prev => {
      let newStreak: number;
      if (lastActive === today) {
        // Same day: keep current streak
        newStreak = prev.streakDays;
      } else if (lastActive === yesterday) {
        // Consecutive day: increment streak
        newStreak = prev.streakDays + 1;
      } else {
        // Gap (skipped day or first time): reset to 1
        newStreak = 1;
      }

      return {
        cardsReviewed: prev.cardsReviewed + 1,
        streakDays: newStreak,
        totalMinutes: prev.totalMinutes + 1,
      };
    });

    // Record last active date outside setState (pure updater)
    if (typeof window !== "undefined") {
      localStorage.setItem(LAST_ACTIVE_KEY, today);
    }
  }, []);

  return { stats, markActivity };
}
