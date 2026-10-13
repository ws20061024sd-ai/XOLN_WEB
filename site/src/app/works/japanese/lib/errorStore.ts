import { storage, loadErrors, saveError } from "./supabase";

export const ERROR_KEY = "cjt4_errors";

export interface ErrorRecord {
  questionId: string;
  module: "grammar" | "reading" | "listening";
  date: string;  // 最近一次错误的日期
  count: number; // 累计错误次数
}

export async function addError(record: Omit<ErrorRecord, "count">): Promise<void> {
  return addErrors([record]);
}

export async function addErrors(records: Omit<ErrorRecord, "count">[]): Promise<void> {
  const all = storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
  for (const record of records) {
    const existing = all.find(e => e.questionId === record.questionId && e.module === record.module);
    if (existing) {
      existing.count += 1;
      existing.date = record.date;
    } else {
      all.push({ ...record, count: 1 });
    }
  }
  // Persist before network I/O so navigation or an offline request cannot lose mistakes.
  storage.set(ERROR_KEY, all);
  await Promise.all(records.map(record => saveError(record)));
}

export async function getAllErrors(): Promise<ErrorRecord[]> {
  const remote = await loadErrors();
  if (remote && remote.length > 0) {
    return remote;
  }
  return storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
}
