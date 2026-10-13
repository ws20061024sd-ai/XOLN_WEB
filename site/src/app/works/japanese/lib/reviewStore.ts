import { storage } from "./supabase";
import { mixedOrder } from "./learningOrder";

export type ReviewModule = "grammar" | "reading" | "listening";
export interface ReviewState { nextReview: number; successes: number; attempts: number; lastCorrect: boolean; }
export interface Attempt { id: string; questionId: string; module: ReviewModule; correct: boolean; confident: boolean; time: number; }
const KEY = "reviews_v2";
const DAY = 86400000;

export function schedule(previous: ReviewState | undefined, correct: boolean, confident = true, now = Date.now()): ReviewState {
  const successes = correct && confident ? (previous?.successes ?? 0) + 1 : 0;
  const days = successes === 0 ? 0 : [1, 3, 7, 14, 30][Math.min(successes - 1, 4)];
  return { nextReview: now + days * DAY, successes, attempts: (previous?.attempts ?? 0) + 1, lastCorrect: correct };
}

export function recordReview(questionId: string, module: ReviewModule, correct: boolean, confident = true) {
  const states = storage.get<Record<string, ReviewState>>(KEY) ?? {};
  const key = `${module}:${questionId}`;
  const previous = states[key];
  states[key] = previous && previous.nextReview > Date.now() && correct && confident
    ? { ...previous, attempts: previous.attempts + 1, lastCorrect: true }
    : schedule(previous, correct, confident);
  storage.set(KEY, states);
  const events = storage.get<Attempt[]>("attempts_v2") ?? [];
  events.push({ id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, questionId, module, correct, confident, time: Date.now() });
  storage.set("attempts_v2", events.slice(-5000));
}

export function reviewQueue<T extends { id: string }>(items: T[], module: ReviewModule): T[] {
  const states = storage.get<Record<string, ReviewState>>(KEY) ?? {};
  const now = Date.now();
  const available = items.filter(item => !states[`${module}:${item.id}`] || states[`${module}:${item.id}`].nextReview <= now);
  return mixedOrder(available.length ? available : items, item => {
    const state = states[`${module}:${item.id}`];
    return state && state.nextReview <= now ? (state.successes === 0 ? 4 : 3) : 1;
  });
}

export function reviewOverview() {
  const states = storage.get<Record<string, ReviewState>>(KEY) ?? {};
  const now = Date.now();
  const due = Object.values(states).filter(s => s.nextReview <= now).length;
  const verified = Object.values(states).filter(s => s.successes >= 2).length;
  return { due, verified, reviewed: Object.keys(states).length };
}
