"use client";
import { useState, useEffect, useCallback } from "react";

export interface DailyStats {
  cardsReviewed: number;
  streakDays: number;
  totalMinutes: number;
}

const STORAGE_KEY = "cjt4_progress";

function loadStats(): DailyStats {
  if (typeof window === "undefined") return { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 };
}

function saveStats(stats: DailyStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function useProgress() {
  const [stats, setStats] = useState<DailyStats>(loadStats);

  const markActivity = useCallback(() => {
    setStats(prev => {
      const today = new Date().toDateString();
      const lastActive = localStorage.getItem("cjt4_last_active");
      const isNewDay = lastActive !== today;
      const next: DailyStats = {
        cardsReviewed: prev.cardsReviewed + 1,
        streakDays: isNewDay ? prev.streakDays + 1 : prev.streakDays,
        totalMinutes: prev.totalMinutes + 1,
      };
      saveStats(next);
      localStorage.setItem("cjt4_last_active", today);
      return next;
    });
  }, []);

  return { stats, markActivity };
}
