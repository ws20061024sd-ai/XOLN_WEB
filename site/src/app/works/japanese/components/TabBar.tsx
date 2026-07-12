"use client";
import { motion } from "motion/react";

const TABS = [
  { key: "flashcard", label: "闪卡", icon: "🔤" },
  { key: "grammar", label: "语法", icon: "📝" },
  { key: "reading", label: "阅读", icon: "📖" },
  { key: "listening", label: "听力", icon: "🎧" },
  { key: "translate", label: "翻译", icon: "✍️" },
  { key: "stats", label: "统计", icon: "📊" },
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
          <span className="text-base">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
          {activeTab === tab.key && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--accent)]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
