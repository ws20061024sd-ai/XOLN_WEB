import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (_client) return _client;
  if (supabaseUrl && supabaseKey) {
    _client = createClient(supabaseUrl, supabaseKey);
    return _client;
  }
  return null;
}

export const supabase = getClient();

// ===== 存储层：Supabase 优先 → localStorage 降级 =====
const STORAGE_PREFIX = "cjt4_";

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const client = getClient();
    if (client) {
      try {
        const { data, error } = await client
          .from("user_progress")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          const d = data as Record<string, unknown>;
          const restored: Record<string, unknown> = {
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
            },
          };
          return (restored as unknown) as T;
        }
      } catch {}
    }

    // localStorage 降级
    try {
      if (typeof window === "undefined") return null;
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    const client = getClient();
    const json = value as Record<string, unknown>;

    if (client && json.daily && json.modules) {
      try {
        const d = json.daily as Record<string, number>;
        const m = json.modules as Record<string, Record<string, number>>;
        await (client as any).from("user_progress").upsert(
          {
            id: "00000000-0000-0000-0000-000000000001",
            cards_reviewed: d.cardsReviewed ?? 0,
            streak_days: d.streakDays ?? 0,
            total_minutes: d.totalMinutes ?? 0,
            grammar_total: m.grammar?.total ?? 0,
            grammar_correct: m.grammar?.correct ?? 0,
            reading_total: m.reading?.total ?? 0,
            reading_correct: m.reading?.correct ?? 0,
            listening_total: m.listening?.total ?? 0,
            listening_correct: m.listening?.correct ?? 0,
            flashcard_total: m.flashcard?.total ?? 0,
            flashcard_correct: m.flashcard?.correct ?? 0,
            last_active: new Date().toISOString().split("T")[0],
          },
          { onConflict: "id" }
        );
      } catch {
        // Supabase 写失败时只写 localStorage
      }
    }

    // 始终写一份 localStorage 兜底
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      }
    } catch {}
  },
};

// ===== 闪卡状态专用的 Supabase 读写 =====
export const cardStorage = {
  async loadAll(): Promise<Record<string, unknown> | null> {
    const client = getClient();
    if (!client) return null;
    try {
      const { data } = await (client as any).from("card_progress").select("*");
      if (!data || data.length === 0) return null;
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
    } catch {
      return null;
    }
  },

  async save(wordId: string, state: Record<string, unknown>): Promise<void> {
    const client = getClient();
    if (!client) return;
    try {
      await (client as any).from("card_progress").upsert(
        {
          word_id: wordId,
          level: state.level ?? 0,
          next_review: state.nextReview instanceof Date ? state.nextReview.toISOString() : state.nextReview,
          total_reviews: state.totalReviews ?? 0,
          total_correct: state.totalCorrect ?? 0,
        },
        { onConflict: "word_id" }
      );
    } catch {}
  },
};

// ===== 错题记录专用的 Supabase 读写 =====
export const errorStorage = {
  async loadAll(): Promise<Record<string, unknown>[] | null> {
    const client = getClient();
    if (!client) return null;
    try {
      const { data } = await (client as any).from("error_records").select("*").order("created_at", { ascending: false });
      return data ?? [];
    } catch {
      return null;
    }
  },

  async add(record: { questionId: string; module: string; date: string }): Promise<void> {
    const client = getClient();
    if (!client) return;
    try {
      // 去重：先删旧记录再插入
      await (client as any).from("error_records").delete().eq("question_id", record.questionId);
      await (client as any).from("error_records").insert({
        question_id: record.questionId,
        module: record.module,
        date: record.date,
      });
    } catch {}
  },
};
