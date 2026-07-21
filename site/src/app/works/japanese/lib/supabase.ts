import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ===== localStorage 通用存储（始终可用，兜底方案） =====
const PREFIX = "cjt4_";

export const storage = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch { /* quota exceeded / private browsing */ }
  },
};

// ===== 用户进度：localStorage 优先，Supabase 补充 =====
export async function loadProgress(): Promise<Record<string, unknown> | null> {
  const local = storage.get("cjt4_progress") as Record<string, unknown> | null;
  if (!supabase) return local;
  if (!local) {
    try {
      const { data, error } = await (supabase as any)
        .from("user_progress").select("*").limit(1).maybeSingle();
      if (!error && data) {
        const d = data as Record<string, unknown>;
        return {
          daily: {
            cardsReviewed: (d.cards_reviewed as number) ?? 0,
            streakDays: (d.streak_days as number) ?? 0,
            totalMinutes: (d.total_minutes as number) ?? 0,
          },
          modules: {
            grammar: { total: (d.grammar_total as number) ?? 0, correct: (d.grammar_correct as number) ?? 0 },
            reading: { total: (d.reading_total as number) ?? 0, correct: (d.reading_correct as number) ?? 0 },
            listening: { total: (d.listening_total as number) ?? 0, correct: (d.listening_correct as number) ?? 0 },
            flashcard: { total: (d.flashcard_total as number) ?? 0, correct: (d.flashcard_correct as number) ?? 0 },
            translate: { total: 0, correct: 0 },
          },
        };
      }
    } catch { /* ignore */ }
  }
  return local;
}

export async function saveProgress(value: Record<string, unknown>): Promise<void> {
  const json = value as any;
  if (supabase && json.daily && json.modules) {
    try {
      await (supabase as any).from("user_progress").upsert({
        id: "00000000-0000-0000-0000-000000000001",
        cards_reviewed: json.daily.cardsReviewed ?? 0,
        streak_days: json.daily.streakDays ?? 0,
        total_minutes: json.daily.totalMinutes ?? 0,
        grammar_total: json.modules.grammar?.total ?? 0,
        grammar_correct: json.modules.grammar?.correct ?? 0,
        reading_total: json.modules.reading?.total ?? 0,
        reading_correct: json.modules.reading?.correct ?? 0,
        listening_total: json.modules.listening?.total ?? 0,
        listening_correct: json.modules.listening?.correct ?? 0,
        flashcard_total: json.modules.flashcard?.total ?? 0,
        flashcard_correct: json.modules.flashcard?.correct ?? 0,
        last_active: new Date().toISOString().split("T")[0],
      }, { onConflict: "id" });
    } catch { /* fall through to localStorage */ }
  }
  storage.set("cjt4_progress", value);
}

// ===== 闪卡状态：localStorage 优先，Supabase 补充 =====
export async function loadCardStates(): Promise<Record<string, unknown> | null> {
  // localStorage 是最新数据，始终优先
  const local = storage.get("card_states") as Record<string, unknown> | null;
  if (!supabase) return local;

  // Supabase 在后台静默同步（用于跨设备），不阻塞返回
  try {
    const { data } = await (supabase as any).from("card_progress").select("*");
    if (data && data.length > 0 && !local) {
      // 只有 localStorage 为空时才用 Supabase（如新设备首次打开）
      const result: Record<string, unknown> = {};
      for (const row of data as any[]) {
        result[row.word_id] = {
          wordId: row.word_id,
          level: row.level ?? 0,
          nextReview: row.next_review ?? new Date().toISOString(),
          totalReviews: row.total_reviews ?? 0,
          totalCorrect: row.total_correct ?? 0,
        };
      }
      return result;
    }
  } catch { /* ignore — localStorage is the source of truth */ }
  return local;
}

export async function saveCardState(wordId: string, state: { level: number; nextReview: Date | string; totalReviews: number; totalCorrect: number }): Promise<void> {
  if (supabase) {
    try {
      await (supabase as any).from("card_progress").upsert({
        word_id: wordId,
        level: state.level ?? 0,
        next_review: state.nextReview instanceof Date ? state.nextReview.toISOString() : state.nextReview,
        total_reviews: state.totalReviews ?? 0,
        total_correct: state.totalCorrect ?? 0,
      }, { onConflict: "word_id" });
    } catch { /* fall through to localStorage */ }
  }
}

// ===== 错题：localStorage 优先，Supabase 补充 =====
export async function loadErrors(): Promise<Record<string, unknown>[] | null> {
  const local = storage.get("cjt4_errors") as Record<string, unknown>[] | null;
  if (!supabase) return local;
  if (!local || local.length === 0) {
    try {
      const { data } = await (supabase as any)
        .from("error_records").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) return data as Record<string, unknown>[];
    } catch { /* ignore */ }
  }
  return local;
}

export async function saveError(record: { questionId: string; module: string; date: string }): Promise<void> {
  if (supabase) {
    try {
      await (supabase as any).from("error_records").delete().eq("question_id", record.questionId);
      await (supabase as any).from("error_records").insert({
        question_id: record.questionId,
        module: record.module,
        date: record.date,
      });
    } catch { /* fall through to localStorage */ }
  }
}
