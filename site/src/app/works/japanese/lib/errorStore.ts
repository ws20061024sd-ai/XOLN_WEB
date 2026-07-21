import { storage, loadErrors, saveError } from "./supabase";

export const ERROR_KEY = "cjt4_errors";

export interface ErrorRecord {
  questionId: string;
  module: "grammar" | "reading" | "listening";
  date: string;
}

export async function addError(record: ErrorRecord): Promise<void> {
  // Supabase 同步
  await saveError(record);
  // localStorage 兜底（带去重）
  const all = storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
  const filtered = all.filter(e => e.questionId !== record.questionId);
  filtered.push(record);
  storage.set(ERROR_KEY, filtered);
}

export async function addErrors(records: ErrorRecord[]): Promise<void> {
  // 批量写入（避免并发覆盖）
  for (const r of records) {
    await saveError(r);
  }
  const all = storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
  let changed = false;
  for (const r of records) {
    const idx = all.findIndex(e => e.questionId === r.questionId);
    if (idx >= 0) { all.splice(idx, 1); changed = true; }
  }
  all.push(...records);
  storage.set(ERROR_KEY, all);
}

export async function getAllErrors(): Promise<ErrorRecord[]> {
  const remote = await loadErrors();
  if (remote && remote.length > 0) {
    return remote as unknown as ErrorRecord[];
  }
  return storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
}

export async function removeError(questionId: string): Promise<void> {
  const all = await getAllErrors();
  storage.set(ERROR_KEY, all.filter(e => e.questionId !== questionId));
}
