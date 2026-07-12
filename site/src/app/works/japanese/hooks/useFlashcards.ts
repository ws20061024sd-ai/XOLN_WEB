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
        const state = saved?.[card.id] ?? getInitialState(card.id);
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

  const scoreCard = useCallback(async (score: 0 | 3 | 5) => {
    if (!currentCard) return;

    const oldState = cardStates.get(currentCard.id) ?? getInitialState(currentCard.id);
    const newState = review(oldState, score);
    const newStates = new Map(cardStates);
    newStates.set(currentCard.id, newState);
    setCardStates(newStates);

    // 保存到存储
    const obj: Record<string, CardState> = {};
    newStates.forEach((v, k) => { obj[k] = v; });
    await storage.set("card_states", obj);

    // 从队列移除当前卡片，如果是当天需复习的则插入后面
    const rest = queue.slice(1);
    if (score === 0) {
      rest.push(currentCard);  // 不会的马上再出现
    }
    setQueue(rest);
    setIsFlipped(false);
    setReviewedToday(n => n + 1);
  }, [currentCard, cardStates, queue]);

  return {
    currentCard,
    isFlipped,
    setIsFlipped,
    queueLength: queue.length,
    reviewedToday,
    scoreCard,
  };
}
