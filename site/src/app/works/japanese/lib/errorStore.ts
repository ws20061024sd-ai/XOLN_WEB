import { storage, loadErrors, saveError } from "./supabase";

export const ERROR_KEY = "cjt4_errors";

export interface ErrorRecord {
  questionId: string;
  module: "grammar" | "reading" | "listening";
  date: string;  // 最近一次错误的日期
  count: number; // 累计错误次数
}

export async function addError(record: Omit<ErrorRecord, "count">): Promise<void> {
  await saveError({ ...record, count: 1 });
  const all = storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
  const idx = all.findIndex(e => e.questionId === record.questionId);
  if (idx >= 0) {
    all[idx].count += 1;
    all[idx].date = record.date;
  } else {
    all.push({ ...record, count: 1 });
  }
  storage.set(ERROR_KEY, all);
}

export async function addErrors(records: Omit<ErrorRecord, "count">[]): Promise<void> {
  for (const r of records) {
    await saveError({ ...r, count: 1 });
  }
  const all = storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
  for (const r of records) {
    const idx = all.findIndex(e => e.questionId === r.questionId);
    if (idx >= 0) {
      all[idx].count += 1;
      all[idx].date = r.date;
    } else {
      all.push({ ...r, count: 1 });
    }
  }
  storage.set(ERROR_KEY, all);
}

export async function getAllErrors(): Promise<ErrorRecord[]> {
  const remote = await loadErrors();
  if (remote && remote.length > 0) {
    return (remote as unknown as ErrorRecord[]).map((r: any) => ({
      ...r,
      count: r.count ?? 1,
    }));
  }
  return storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
}

export async function removeError(questionId: string): Promise<void> {
  const all = storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
  storage.set(ERROR_KEY, all.filter(e => e.questionId !== questionId));
}
