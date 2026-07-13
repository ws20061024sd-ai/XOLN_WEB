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

export function useFlashcards() {
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [cardStates, setCardStates] = useState<Map<string, CardState>>(new Map());
  const [reviewedToday, setReviewedToday] = useState(0);
  const [correctToday, setCorrectToday] = useState(0);
  const [lastResult, setLastResult] = useState<boolean | null>(null); // null=未作答, true=对, false=错

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

    setReviewedToday(n => n + 1);
    if (isCorrect) setCorrectToday(n => n + 1);

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
