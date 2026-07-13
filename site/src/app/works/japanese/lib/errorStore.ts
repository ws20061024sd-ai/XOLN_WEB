import { storage } from "./supabase";

export const ERROR_KEY = "cjt4_errors";

export interface ErrorRecord {
  questionId: string;
  module: "grammar" | "reading" | "listening";
  date: string; // ISO
}

export async function addError(record: ErrorRecord): Promise<void> {
  const all = await storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
  // 去重：同一题目只保留最新一条
  const filtered = all.filter(e => e.questionId !== record.questionId);
  filtered.push(record);
  await storage.set(ERROR_KEY, filtered);
}

export async function getAllErrors(): Promise<ErrorRecord[]> {
  return await storage.get<ErrorRecord[]>(ERROR_KEY) ?? [];
}

export async function getErrorsByModule(module: string): Promise<ErrorRecord[]> {
  const all = await getAllErrors();
  return all.filter(e => e.module === module);
}

export async function removeError(questionId: string): Promise<void> {
  const all = await getAllErrors();
  await storage.set(ERROR_KEY, all.filter(e => e.questionId !== questionId));
}
