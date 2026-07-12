// NOTE: This module uses browser-only APIs (localStorage) and will fail on the server side.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function createSupabaseClient() {
  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey);
  }
  return null;
}

export const supabase = createSupabaseClient();

// 降级存储：Supabase 不可用时使用 localStorage
const STORAGE_PREFIX = "cjt4_";

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    if (supabase) {
      // Supabase 可用时从数据库读（具体实现见 Task 8）
      return null;
    }
    // localStorage 降级
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // Silently ignore storage errors (quota exceeded, private browsing, etc.)
    }
  },
};
