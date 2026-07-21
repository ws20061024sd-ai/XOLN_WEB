"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { translateTasks, type TranslateTask } from "../lib/data/translate";
import { useProgress } from "../hooks/useProgress";

const TYPE_LABELS: Record<string, string> = { ja2zh: "日→中", zh2ja: "中→日", writing: "写作" };

export default function TranslateModule() {
  const [index, setIndex] = useState(0);
  const [subTab, setSubTab] = useState<"ja2zh" | "zh2ja" | "writing">("ja2zh");
  const [userInput, setUserInput] = useState("");
  const [showRef, setShowRef] = useState(false);
  const { recordModuleAnswer } = useProgress();

  const filtered = translateTasks.filter(t => t.type === subTab);
  const task: TranslateTask | undefined = filtered[index % Math.max(1, filtered.length)];

  const handleSubmit = () => {
    setShowRef(true);
    recordModuleAnswer("grammar", true); // 翻译写作暂归类到grammar统计
  };

  const nextTask = () => {
    setIndex(i => i + 1);
    setUserInput("");
    setShowRef(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
        <span className="font-medium text-[var(--text)]">翻译写作</span>
      </div>

      {/* 子标签 */}
      <div className="flex gap-2">
        {(["ja2zh", "zh2ja", "writing"] as const).map(t => (
          <button key={t} onClick={() => { setSubTab(t); setIndex(0); setUserInput(""); setShowRef(false); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              subTab === t ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] text-[var(--text-muted)]"
            }`}>
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {task && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
            <p className="text-sm text-[var(--text)] leading-relaxed">{task.prompt}</p>
            {task.hint && <p className="mt-2 text-xs text-[var(--text-soft)]">提示：{task.hint}</p>}
          </div>

          <textarea
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder={subTab === "writing" ? "在此输入你的作文..." : "在此输入你的翻译..."}
            rows={subTab === "writing" ? 8 : 3}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text)] resize-y focus:border-[var(--accent)] focus:outline-none"
          />

          {!showRef ? (
            <button onClick={handleSubmit} disabled={!userInput.trim()}
              className="self-center rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50">
              提交，查看参考译文
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="w-full rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-950">
                <p className="text-xs text-green-600 dark:text-green-400 mb-2 font-medium">参考译文/范文：</p>
                <p className="text-sm text-[var(--text)] leading-relaxed">{task.reference}</p>
              </motion.div>
              <button onClick={nextTask}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white">下一题</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
