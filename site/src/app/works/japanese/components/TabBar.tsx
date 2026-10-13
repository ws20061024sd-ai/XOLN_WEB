"use client";
import { motion } from "motion/react";
import { FlashcardIcon, GrammarIcon, ReadingIcon, ListeningIcon, TranslateIcon, StatsIcon } from "./Icons";

const TABS = [
  { key: "today", label: "今日", Icon: StatsIcon },
  { key: "flashcard", label: "词汇", Icon: FlashcardIcon },
  { key: "grammar", label: "语法", Icon: GrammarIcon },
  { key: "reading", label: "阅读", Icon: ReadingIcon },
  { key: "listening", label: "听力", Icon: ListeningIcon },
  { key: "translate", label: "翻译", Icon: TranslateIcon },
  { key: "exam", label: "测评", Icon: ReadingIcon },
  { key: "stats", label: "记录", Icon: StatsIcon },
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
          aria-current={activeTab === tab.key ? "page" : undefined}
          onClick={() => onTabChange(tab.key)}
          className={`relative flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.key
              ? "text-[var(--accent)]"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <tab.Icon />
          <span>{tab.label}</span>
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
