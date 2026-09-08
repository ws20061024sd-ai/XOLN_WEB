import { createClient } from "@supabase/supabase-js";
import { todayLocalDate } from "./date";

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

// 进度统计快照（云端 user_progress 表字段与此对应，不含本地 dailyLog）
export interface ProgressSnapshot {
  daily: { cardsReviewed: number; streakDays: number; totalMinutes: number };
  modules: {
    grammar: { total: number; correct: number };
    reading: { total: number; correct: number };
    listening: { total: number; correct: number };
    flashcard: { total: number; correct: number };
    translate: { total: number; correct: number };
  };
}

// ===== 用户进度：localStorage 优先，Supabase 补充 =====
// 注意：storage 自带 "cjt4_" 前缀，key 只传短名，避免双前缀
// （useProgress.ts 直接用裸 key "cjt4_progress" 读写，二者必须一致）
export async function loadProgress(): Promise<ProgressSnapshot | null> {
  const local = storage.get<ProgressSnapshot>("progress");
  if (!supabase) return local;
  if (!local) {
    try {
      const { data, error } = await supabase
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

export async function saveProgress(value: ProgressSnapshot): Promise<void> {
  if (supabase) {
    try {
      await supabase.from("user_progress").upsert({
        id: "00000000-0000-0000-0000-000000000001",
        cards_reviewed: value.daily.cardsReviewed,
        streak_days: value.daily.streakDays,
        total_minutes: value.daily.totalMinutes,
        grammar_total: value.modules.grammar.total,
        grammar_correct: value.modules.grammar.correct,
        reading_total: value.modules.reading.total,
        reading_correct: value.modules.reading.correct,
        listening_total: value.modules.listening.total,
        listening_correct: value.modules.listening.correct,
        flashcard_total: value.modules.flashcard.total,
        flashcard_correct: value.modules.flashcard.correct,
        last_active: todayLocalDate(),
      }, { onConflict: "id" });
    } catch { /* 云写失败静默，本地数据不受影响 */ }
  }
  // 本地落盘由 useProgress 的 effect 统一负责，这里不再重复写
}

// ===== 闪卡状态：localStorage 优先，Supabase 补充 =====
export async function loadCardStates(): Promise<Record<string, unknown> | null> {
  // localStorage 是最新数据，始终优先
  const local = storage.get<Record<string, unknown>>("card_states");
  if (!supabase) return local;

  // Supabase 在后台静默同步（用于跨设备），不阻塞返回
  try {
    const { data } = await supabase.from("card_progress").select("*");
    if (data && data.length > 0 && !local) {
      // 只有 localStorage 为空时才用 Supabase（如新设备首次打开）
      const result: Record<string, unknown> = {};
      for (const row of data) {
        const r = row as Record<string, unknown>;
        result[String(r.word_id)] = {
          wordId: r.word_id,
          level: r.level ?? 0,
          nextReview: r.next_review ?? new Date().toISOString(),
          totalReviews: r.total_reviews ?? 0,
          totalCorrect: r.total_correct ?? 0,
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
      await supabase.from("card_progress").upsert({
        word_id: wordId,
        level: state.level ?? 0,
        next_review: state.nextReview instanceof Date ? state.nextReview.toISOString() : state.nextReview,
        total_reviews: state.totalReviews ?? 0,
        total_correct: state.totalCorrect ?? 0,
      }, { onConflict: "word_id" });
    } catch { /* fall through to localStorage */ }
  }
}

// 错题记录（云端行转 camelCase 后与本地 ErrorRecord 结构一致）
export interface ErrorRow {
  questionId: string;
  module: "grammar" | "reading" | "listening";
  date: string;
  count: number;
}

// ===== 错题：localStorage 优先，Supabase 补充 =====
export async function loadErrors(): Promise<ErrorRow[] | null> {
  const local = storage.get<ErrorRow[]>("cjt4_errors");
  if (!supabase) return local;
  if (!local || local.length === 0) {
    try {
      const { data } = await supabase
        .from("error_records").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        // 云端列为 snake_case（question_id），统一转成前端结构，否则错题本按 questionId 查不到题
        return (data as Record<string, unknown>[]).map(d => ({
          questionId: String(d.question_id ?? ""),
          module: d.module as ErrorRow["module"],
          date: String(d.date ?? ""),
          count: 1,
        }));
      }
    } catch { /* ignore */ }
  }
  return local;
}

export async function saveError(record: { questionId: string; module: string; date: string; count?: number }): Promise<void> {
  if (supabase) {
    try {
      await supabase.from("error_records").delete().eq("question_id", record.questionId);
      await supabase.from("error_records").insert({
        question_id: record.questionId,
        module: record.module,
        date: record.date,
      });
    } catch { /* fall through to localStorage */ }
  }
}
