"use client";
import { useState, useCallback, useEffect } from "react";
import type { VocabCard } from "../lib/data/vocabulary";
import { vocabulary } from "../lib/data/vocabulary";
import type { CardState } from "../lib/cardScheduler";
import { getInitialState, review } from "../lib/cardScheduler";
import { storage } from "../lib/supabase";

const DAILY_NEW_LIMIT = 10;

export function useFlashcards() {
  const [queue, setQueue] = useState<VocabCard[]>([]);
  const [cardStates, setCardStates] = useState<Map<string, CardState>>(new Map());
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedToday, setReviewedToday] = useState(0);

  // 初始化：加载词汇 + 状态
  useEffect(() => {
    const load = async () => {
      const saved = await storage.get<Record<string, CardState>>("card_states");
      const states = new Map<string, CardState>();
      const now = new Date();

      // 按 SM-2 排程：先出到期需要复习的，再出未学过的
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
      // 每日新词上限
      setQueue([...due, ...fresh.slice(0, Math.max(0, DAILY_NEW_LIMIT - due.length))]);
    };
    load();
  }, []);

  const currentCard = queue[0] ?? null;

  // 状态变更后自动持久化到存储
  useEffect(() => {
    if (cardStates.size === 0) return;
    const obj: Record<string, CardState> = {};
    cardStates.forEach((v, k) => { obj[k] = v; });
    storage.set("card_states", obj);
  }, [cardStates]);

  const scoreCard = useCallback((score: 0 | 3 | 5) => {
    const card = currentCard;  // snapshot current card to avoid it becoming null mid-call
    if (!card) return;

    const oldState = cardStates.get(card.id) ?? getInitialState(card.id);
    const newState = review(oldState, score);
    const newStates = new Map(cardStates);
    newStates.set(card.id, newState);
    setCardStates(newStates);

    // 使用 functional update 避免闭包捕获旧 queue
    setQueue(prev => {
      const rest = prev.slice(1);
      if (score === 0) {
        rest.push(card);  // 不会的马上再出现
      }
      return rest;
    });
    setIsFlipped(false);
    setReviewedToday(n => n + 1);
  }, [currentCard, cardStates]);

  return {
    currentCard,
    isFlipped,
    setIsFlipped,
    queueLength: queue.length,
    reviewedToday,
    scoreCard,
  };
}
