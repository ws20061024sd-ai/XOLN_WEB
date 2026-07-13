"use client";
import { motion } from "motion/react";
import { FlashcardIcon, GrammarIcon, ReadingIcon, ListeningIcon, TranslateIcon, StatsIcon } from "./Icons";

const TABS = [
  { key: "flashcard", label: "闪卡", Icon: FlashcardIcon },
  { key: "grammar", label: "语法", Icon: GrammarIcon },
  { key: "reading", label: "阅读", Icon: ReadingIcon },
  { key: "listening", label: "听力", Icon: ListeningIcon },
  { key: "translate", label: "翻译", Icon: TranslateIcon },
  { key: "stats", label: "统计", Icon: StatsIcon },
];

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-[var(--border)] px-2">
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`relative flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.key
              ? "text-[var(--accent)]"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <tab.Icon />
          <span className="hidden sm:inline">{tab.label}</span>
          {activeTab === tab.key && (
            <motion.div
              layoutId="japanese-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--accent)]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
