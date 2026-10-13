"use client";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { VocabCard } from "../lib/data/vocabulary";
import { vocabulary } from "../lib/data/vocabulary";
import type { CardState } from "../lib/cardScheduler";
import { getInitialState, review } from "../lib/cardScheduler";
import { storage, loadCardStates, saveCardState } from "../lib/supabase";

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
const NEW_WORDS_KEY = "flashcard_new_words";

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

export function useFlashcards(recordModuleAnswer?: (module: "flashcard" | "grammar" | "reading" | "listening", correct: boolean) => void, skill: "meaning" | "reading" = "meaning") {
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [cardStates, setCardStates] = useState<Map<string, CardState>>(new Map());
  const [dailies, setDailies] = useState(loadDaily);
  const [loading, setLoading] = useState(true);
  const [lastResult, setLastResult] = useState<boolean | null>(null);
  const answeredRef = useRef(false);


  const reviewedToday = dailies.reviewed;
  const correctToday = dailies.correct;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const saved = (skill === "meaning" ? await loadCardStates() : storage.get<Record<string, CardState>>("card_states_reading")) as Record<string, CardState> | null;
      if (cancelled) return;
      const states = new Map<string, CardState>();
      const now = new Date();

      const due: VocabCard[] = [];
      const fresh: VocabCard[] = [];

      for (const card of vocabulary.filter(card => skill === "meaning" || /[一-龯々]/.test(card.word))) {
        const raw = saved?.[card.id];
        const state: CardState = raw ? { ...raw, nextReview: new Date(raw.nextReview) } : getInitialState(card.id);
        states.set(card.id, state);

        if (state.nextReview <= now && state.totalReviews > 0) {
          due.push(card);
        } else if (state.totalReviews === 0) {
          fresh.push(card);
        }
      }

      const today = new Date().toDateString();
      const introduced = storage.get<{ date: string; ids: string[] }>(NEW_WORDS_KEY);
      const ids = introduced?.date === today ? introduced.ids : [];
      setCardStates(states);
      setQueue([...shuffle(due), ...shuffle(fresh.filter(card => ids.includes(card.id))), ...shuffle(fresh.filter(card => !ids.includes(card.id))).slice(0, Math.max(0, DAILY_NEW_LIMIT - ids.length))]);
      setLoading(false);
    };
    void load();
    return () => { cancelled = true; };
  }, [skill]);

  const currentCard = queue[0] ?? null;
  const correctAnswer = currentCard ? skill === "reading" ? currentCard.reading : currentCard.meaning : "";

  // 生成当前题目的4个选项（1正确 + 3干扰）
  const options = useMemo(() => {
    if (!currentCard) return [];
    const others = vocabulary.filter(c => c.id !== currentCard.id);
    const shuffledOthers = shuffle(others);
    const distractors = [...new Set(shuffledOthers.map(c => skill === "reading" ? c.reading : c.meaning))]
      .filter(meaning => meaning !== correctAnswer).slice(0, OPTION_COUNT - 1);
    return shuffle([correctAnswer, ...distractors]);
  }, [currentCard, correctAnswer, skill]);

  useEffect(() => {
    if (cardStates.size === 0) return;
    const obj: Record<string, CardState> = {};
    cardStates.forEach((v, k) => { obj[k] = v; });
    storage.set(skill === "reading" ? "card_states_reading" : "card_states", obj);
  }, [cardStates, skill]);

  const checkAnswer = useCallback((selectedMeaning: string) => {
    const card = currentCard;
    if (!card || answeredRef.current) return;
    answeredRef.current = true;

    const isCorrect = selectedMeaning === correctAnswer;
    setLastResult(isCorrect);

    const oldState = cardStates.get(card.id) ?? getInitialState(card.id);
    if (oldState.totalReviews === 0) {
      const date = new Date().toDateString();
      const saved = storage.get<{ date: string; ids: string[] }>(NEW_WORDS_KEY);
      const ids = saved?.date === date ? saved.ids : [];
      storage.set(NEW_WORDS_KEY, { date, ids: [...new Set([...ids, card.id])] });
    }
    const newState = review(oldState, isCorrect);
    const newStates = new Map(cardStates);
    newStates.set(card.id, newState);
    setCardStates(newStates);
    // Supabase 同步
    if (skill === "meaning") void saveCardState(card.id, newState);

    const next = { ...dailies, reviewed: dailies.reviewed + 1, correct: dailies.correct + (isCorrect ? 1 : 0) };
    setDailies(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(TODAY_COUNT_KEY, JSON.stringify({ reviewed: next.reviewed, correct: next.correct }));
    }
    recordModuleAnswer?.("flashcard", isCorrect);

  }, [currentCard, correctAnswer, cardStates, dailies, recordModuleAnswer, skill]);

  const nextCard = useCallback(() => {
    if (!answeredRef.current || !currentCard || lastResult === null) return;
    setQueue(prev => lastResult ? prev.slice(1) : [...prev.slice(1), currentCard]);
    answeredRef.current = false;
    setLastResult(null);
  }, [currentCard, lastResult]);

  const accuracy = reviewedToday > 0 ? Math.round(correctToday / reviewedToday * 100) : 0;

  return {
    loading,
    correctAnswer,
    nextCard,
    currentCard,
    options,
    queueLength: queue.length,
    reviewedToday,
    accuracy,
    lastResult,
    checkAnswer,
  };
}
