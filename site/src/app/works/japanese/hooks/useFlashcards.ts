"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import type { VocabCard } from "../lib/data/vocabulary";
import { vocabulary } from "../lib/data/vocabulary";
import type { CardState } from "../lib/cardScheduler";
import { getInitialState, review } from "../lib/cardScheduler";
import { storage } from "../lib/supabase";

const DAILY_NEW_LIMIT = 10;
const OPTION_COUNT = 4;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TODAY_KEY = "cjt4_flashcard_today";
const TODAY_COUNT_KEY = "cjt4_flashcard_count";

function loadDaily(): { date: string; reviewed: number; correct: number } {
  if (typeof window === "undefined") return { date: "", reviewed: 0, correct: 0 };
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(TODAY_KEY);
  if (savedDate !== today) {
    localStorage.setItem(TODAY_KEY, today);
    localStorage.setItem(TODAY_COUNT_KEY, JSON.stringify({ reviewed: 0, correct: 0 }));
    return { date: today, reviewed: 0, correct: 0 };
  }
  try {
    const raw = localStorage.getItem(TODAY_COUNT_KEY);
    if (raw) { const p = JSON.parse(raw); return { date: today, reviewed: p.reviewed ?? 0, correct: p.correct ?? 0 }; }
  } catch {}
  return { date: today, reviewed: 0, correct: 0 };
}

export function useFlashcards(recordModuleAnswer?: (module: "flashcard" | "grammar" | "reading" | "listening", correct: boolean) => void) {
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [cardStates, setCardStates] = useState<Map<string, CardState>>(new Map());
  const [dailies, setDailies] = useState(loadDaily);
  const [lastResult, setLastResult] = useState<boolean | null>(null);

  const reviewedToday = dailies.reviewed;
  const correctToday = dailies.correct;

  useEffect(() => {
    const load = async () => {
      const saved = await storage.get<Record<string, CardState>>("card_states");
      const states = new Map<string, CardState>();
      const now = new Date();

      const due: VocabCard[] = [];
      const fresh: VocabCard[] = [];

      for (const card of vocabulary) {
        const raw = saved?.[card.id];
        const state: CardState = raw ? { ...raw, nextReview: new Date(raw.nextReview) } : getInitialState(card.id);
        states.set(card.id, state);

        if (state.nextReview <= now && state.totalReviews > 0) {
          due.push(card);
        } else if (state.totalReviews === 0) {
          fresh.push(card);
        }
      }

      setCardStates(states);
      setQueue(shuffle([...due, ...fresh.slice(0, Math.max(0, DAILY_NEW_LIMIT - due.length))]));
    };
    load();
  }, []);

  const currentCard = queue[0] ?? null;

  // 生成当前题目的4个选项（1正确 + 3干扰）
  const options = useMemo(() => {
    if (!currentCard) return [];
    const others = vocabulary.filter(c => c.id !== currentCard.id);
    const shuffledOthers = shuffle(others);
    const distractors = shuffledOthers.slice(0, OPTION_COUNT - 1).map(c => c.meaning);
    return shuffle([currentCard.meaning, ...distractors]);
  }, [currentCard]);

  useEffect(() => {
    if (cardStates.size === 0) return;
    const obj: Record<string, CardState> = {};
    cardStates.forEach((v, k) => { obj[k] = v; });
    storage.set("card_states", obj);
  }, [cardStates]);

  const checkAnswer = useCallback((selectedMeaning: string) => {
    const card = currentCard;
    if (!card) return;

    const isCorrect = selectedMeaning === card.meaning;
    setLastResult(isCorrect);

    const oldState = cardStates.get(card.id) ?? getInitialState(card.id);
    const newState = review(oldState, isCorrect);
    const newStates = new Map(cardStates);
    newStates.set(card.id, newState);
    setCardStates(newStates);

    const next = { ...dailies, reviewed: dailies.reviewed + 1, correct: dailies.correct + (isCorrect ? 1 : 0) };
    setDailies(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(TODAY_COUNT_KEY, JSON.stringify({ reviewed: next.reviewed, correct: next.correct }));
    }
    recordModuleAnswer?.("flashcard", isCorrect);

    // 延迟切换下一题，让用户看到反馈
    setTimeout(() => {
      setQueue(prev => {
        const rest = prev.slice(1);
        if (!isCorrect) rest.push(card);
        return rest;
      });
      setLastResult(null);
    }, isCorrect ? 600 : 1200);
  }, [currentCard, cardStates]);

  const accuracy = reviewedToday > 0 ? Math.round(correctToday / reviewedToday * 100) : 0;

  return {
    currentCard,
    options,
    queueLength: queue.length,
    reviewedToday,
    accuracy,
    lastResult,
    checkAnswer,
  };
}
