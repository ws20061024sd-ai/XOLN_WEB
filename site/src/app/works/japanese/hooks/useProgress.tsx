"use client";
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { loadProgress, saveProgress } from "../lib/supabase";
import { formatLocalDate, todayLocalDate } from "../lib/date";

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
  lastActive?: string | null;
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
      const legacyActive = localStorage.getItem(LAST_ACTIVE_KEY);
      const legacyDate = legacyActive ? new Date(legacyActive) : null;
      return {
        lastActive: parsed.lastActive ?? (legacyDate && !Number.isNaN(legacyDate.getTime()) ? formatLocalDate(legacyDate) : null),
        daily: parsed.daily ?? { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 },
        modules: { ...getEmptyModuleStats(), ...parsed.modules },
        dailyLog: parsed.dailyLog ?? [],
      };
    }
  } catch {}
  return { daily: { cardsReviewed: 0, streakDays: 0, totalMinutes: 0 }, modules: getEmptyModuleStats(), dailyLog: [] };
}

function todayStr(): string {
  return todayLocalDate();
}

const MODULE_LOG_KEY: Record<keyof ModuleStats, "cards" | "grammar" | "reading" | "listening" | "translate"> = {
  grammar: "grammar",
  reading: "reading",
  listening: "listening",
  flashcard: "cards",
  translate: "translate",
};

function useProgressState() {
  // 渲染期快照：早于任何 effect 的本地写入，决定是否需要从云端拉取。
  // 不能在 effect 运行时再读 localStorage——持久化 effect 先跑会先写入空默认值，把"判空"污染成"非空"。
  const [hadLocalData] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !!localStorage.getItem(STORAGE_KEY) && localStorage.getItem("cjt4_progress_cloud_pending") !== "true";
    } catch {
      return false;
    }
  });
  const [persisted, setPersisted] = useState<PersistedState>(loadPersisted);
  // 本地原本有数据 → 直接允许落盘/云写（本地优先）；原本为空 → 先等云端拉取完成
  const [cloudReady, setCloudReady] = useState(hadLocalData);
  const [cloudWritable, setCloudWritable] = useState(hadLocalData);

  // 本地持久化 + 防抖云同步。
  // cloudReady 之前不落本地也不云写：初始空默认值不固化到 localStorage，
  // 也就不会让"新设备拉取"分支在下次挂载时被短路。
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!cloudReady) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted)); } catch { /* Storage may be unavailable. */ }
    const t = setTimeout(() => {
      if (cloudWritable) saveProgress(persisted).catch(() => {});
    }, 1000);
    return () => clearTimeout(t);
  }, [persisted, cloudReady, cloudWritable]);

  // 初始化：本地原本为空（新设备）→ 从 Supabase 拉取合并后放行落盘
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hadLocalData) return;
    let cancelled = false;
    loadProgress(true)
      .then(remote => {
        if (cancelled) return;
        if (remote) {
          setPersisted(prev => ({
            lastActive: prev.lastActive ?? remote.lastActive,
            daily: {
              cardsReviewed: remote.daily.cardsReviewed + prev.daily.cardsReviewed,
              streakDays: prev.lastActive === todayLocalDate()
                ? (remote.lastActive === todayLocalDate() ? remote.daily.streakDays : remote.lastActive === formatLocalDate(new Date(Date.now() - 86400000)) ? remote.daily.streakDays + 1 : prev.daily.streakDays)
                : remote.daily.streakDays,
              totalMinutes: remote.daily.totalMinutes + prev.daily.totalMinutes,
            },
            modules: Object.fromEntries((Object.keys(prev.modules) as (keyof ModuleStats)[]).map(key => [key, {
              total: remote.modules[key].total + prev.modules[key].total,
              correct: remote.modules[key].correct + prev.modules[key].correct,
            }])) as unknown as ModuleStats,
            dailyLog: prev.dailyLog,
          }));
        }
        try { localStorage.removeItem("cjt4_progress_cloud_pending"); } catch {}
        setCloudWritable(true);
        setCloudReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          // Retain local work, but do not upload a snapshot missing cloud history.
          try { localStorage.setItem("cjt4_progress_cloud_pending", "true"); } catch {}
          setCloudReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [hadLocalData]);

  // Count only time spent with the learning page visible; flush on hide/unmount.
  useEffect(() => {
    if (!cloudReady) return;
    let started = document.visibilityState === "visible" ? Date.now() : null;
    const flush = () => {
      const now = Date.now();
      if (started !== null) {
        const minutes = Math.max(0, now - started) / 60000;
        setPersisted(prev => ({ ...prev, daily: { ...prev.daily, totalMinutes: prev.daily.totalMinutes + minutes } }));
      }
      started = document.visibilityState === "visible" ? now : null;
    };
    const timer = setInterval(flush, 15000);
    document.addEventListener("visibilitychange", flush);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", flush); flush(); };
  }, [cloudReady]);

  const markActivity = useCallback(() => {
    const today = todayLocalDate();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = formatLocalDate(yesterdayDate);

    setPersisted(prev => {
      let lastActive = prev.lastActive;
      if (!lastActive && typeof window !== "undefined") {
        try {
          const legacy = localStorage.getItem(LAST_ACTIVE_KEY);
          if (legacy) { const date = new Date(legacy); if (!Number.isNaN(date.getTime())) lastActive = formatLocalDate(date); }
        } catch {}
      }
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
        lastActive: today,
        daily: {
          cardsReviewed: prev.daily.cardsReviewed + 1,
          streakDays: newStreak,
          totalMinutes: prev.daily.totalMinutes,
        },
      };
    });

  }, []);

  const recordModuleAnswer = useCallback((module: keyof ModuleStats, correct: boolean) => {
    markActivity();
    const today = todayStr();
    const logKey = MODULE_LOG_KEY[module];

    setPersisted(prev => {
      // 更新每日日志
      const dailyLog = [...prev.dailyLog];
      const idx = dailyLog.findIndex(d => d.date === today);
      if (idx >= 0) {
        const entry = { ...dailyLog[idx] };
        entry[logKey] = (entry[logKey] ?? 0) + 1;
        entry.total = (entry.total ?? 0) + 1;
        dailyLog[idx] = entry;
      } else {
        const entry: DayLog = { date: today, cards: 0, grammar: 0, reading: 0, listening: 0, translate: 0, total: 0 };
        entry[logKey] = 1;
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
      const ds = formatLocalDate(d);
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

const ProgressContext = createContext<ReturnType<typeof useProgressState> | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const progress = useProgressState();
  return <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const progress = useContext(ProgressContext);
  if (!progress) throw new Error("useProgress requires ProgressProvider");
  return progress;
}
