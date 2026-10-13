"use client";
import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import TabBar from "./components/TabBar";
import BottomStatusBar from "./components/BottomStatusBar";
import ErrorBoundary from "./components/ErrorBoundary";
import FlashcardModule from "./components/FlashcardModule";
import GrammarModule from "./components/GrammarModule";
import ReadingModule from "./components/ReadingModule";
import ListeningModule from "./components/ListeningModule";
import TranslateModule from "./components/TranslateModule";
import StatsModule from "./components/StatsModule";
import TodayModule from "./components/TodayModule";
import ExamCenter from "./components/ExamCenter";
import { ProgressProvider, useProgress } from "./hooks/useProgress";

const MODULES: Record<string, React.ComponentType> = {
  flashcard: FlashcardModule,
  grammar: GrammarModule,
  reading: ReadingModule,
  listening: ListeningModule,
  translate: TranslateModule,
  stats: StatsModule,
};

function JapaneseContent() {
  const [activeTab, setActiveTab] = useState("today");
  const { stats } = useProgress();
  const Module = MODULES[activeTab];

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col">
      <div className="px-4 pt-8 pb-4">
        <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">CJT4 · 学习与复习</p>
        <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight sm:text-3xl">日语四级学习舱</h1>
      </div>
      <p className="px-4 pb-5 text-sm text-[var(--text-muted)]">为 2027 年 6 月准备 · 每天约一小时 · 先理解，再验证</p>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
          >
            <ErrorBoundary>
              {activeTab === "today" ? <TodayModule onNavigate={setActiveTab} /> : activeTab === "exam" ? <ExamCenter /> : <Module />}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomStatusBar stats={stats} />
    </div>
  );
}

const subscribe = () => () => {};

export default function JapanesePage() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  if (!hydrated) return <div className="mx-auto max-w-5xl px-4 py-12"><h1 className="font-serif text-2xl font-bold">日语四级学习舱</h1><p className="mt-4 text-sm text-[var(--text-muted)]">正在恢复本机学习记录…</p></div>;
  return <ProgressProvider><JapaneseContent /></ProgressProvider>;
}
