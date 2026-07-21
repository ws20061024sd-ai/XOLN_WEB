"use client";
import { useState } from "react";
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
import { useProgress } from "./hooks/useProgress";

const MODULES: Record<string, React.ComponentType> = {
  flashcard: FlashcardModule,
  grammar: GrammarModule,
  reading: ReadingModule,
  listening: ListeningModule,
  translate: TranslateModule,
  stats: StatsModule,
};

export default function JapanesePage() {
  const [activeTab, setActiveTab] = useState("flashcard");
  const { stats } = useProgress();
  const Module = MODULES[activeTab];

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
      <div className="px-4 pt-8 pb-4">
        <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">工具</p>
        <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight sm:text-3xl">日语四级学习舱</h1>
      </div>
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
              <Module />
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomStatusBar stats={stats} />
    </div>
  );
}
