"use client";
import { useState, useEffect } from "react";
import { getAllErrors, type ErrorRecord } from "../lib/errorStore";
import { grammarQuestions } from "../lib/data/grammar";
import { readings } from "../lib/data/readings";
import { listeningScripts } from "../lib/data/listening";

const MODULE_LABELS: Record<string, string> = { grammar: "语法", reading: "阅读", listening: "听力" };

function getQuestionDetail(err: ErrorRecord): { question: string; explanation: string } | null {
  if (err.module === "grammar") {
    const q = grammarQuestions.find(g => g.id === err.questionId);
    return q ? { question: q.question, explanation: q.explanation } : null;
  }
  if (err.module === "reading") {
    for (const r of readings) {
      const q = r.questions.find((_, i) => `${r.id}-q${i}` === err.questionId);
      if (q) return { question: `${q.question}（${r.title}）`, explanation: `正确答案：${q.options[q.answer]}` };
    }
  }
  if (err.module === "listening") {
    for (const l of listeningScripts) {
      const q = l.questions.find((_, i) => `${l.id}-q${i}` === err.questionId);
      if (q) return { question: `${q.question}（${l.title}）`, explanation: `正确答案：${q.options[q.answer]}` };
    }
  }
  return null;
}

export default function ErrorBookModule({ onBack }: { onBack: () => void }) {
  const [errors, setErrors] = useState<ErrorRecord[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const data = await getAllErrors();
      setErrors(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    })();
  }, []);

  const enriched = errors
    .filter(e => filter === "all" || e.module === filter)
    .map(e => {
      const detail = getQuestionDetail(e);
      return { ...e, detail };
    })
    .filter(e => e.detail);

  const filters = ["all", "grammar", "reading", "listening"];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
          返回统计
        </button>
        <h3 className="text-lg font-bold text-[var(--text)]">错题本</h3>
        {errors.length > 0 && (
          <span className="text-xs text-[var(--text-muted)]">{errors.length} 条</span>
        )}
      </div>

      {/* 模块筛选 */}
      {errors.length > 0 && (
        <div className="flex gap-1.5">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {f === "all" ? "全部" : MODULE_LABELS[f]}
            </button>
          ))}
        </div>
      )}

      {enriched.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] py-12">
          {errors.length === 0 ? "暂无错题" : "该模块暂无错题"}
        </p>
      ) : (
        <div className="space-y-3">
          {enriched.map((err, i) => (
            <details key={err.questionId} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <summary className="flex cursor-pointer items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--text)]">{err.detail!.question}</span>
                <span className="flex-shrink-0 rounded-full bg-[var(--border-light)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                  {MODULE_LABELS[err.module]}
                </span>
              </summary>
              <div className="mt-3 text-sm text-[var(--text)] leading-relaxed border-t border-[var(--border)] pt-3">
                <p className="text-[var(--text-muted)]">{err.detail!.explanation}</p>
                <p className="mt-2 text-xs text-[var(--text-soft)]">
                  收录于 {new Date(err.date).toLocaleDateString("zh-CN")}
                </p>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
