"use client";
import { useState, useEffect } from "react";
import { storage } from "../lib/supabase";
import { grammarQuestions } from "../lib/data/grammar";

export default function ErrorBookModule({ onBack }: { onBack: () => void }) {
  const [errors, setErrors] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const data = await storage.get<any[]>("grammar_errors") ?? [];
      setErrors(data);
    })();
  }, []);

  // 关联题目详情
  const enriched = errors.map(e => {
    const q = grammarQuestions.find(q => q.id === e.questionId);
    return { ...e, question: q };
  }).filter(e => e.question);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-sm text-[var(--text-muted)]">返回统计</button>
        <h3 className="text-lg font-bold text-[var(--text)]">错题本</h3>
      </div>

      {enriched.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] py-12">暂无错题，继续保持！</p>
      ) : (
        <div className="space-y-3">
          {enriched.map((err, i) => (
            <details key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <summary className="cursor-pointer text-sm font-medium text-[var(--text)]">
                {err.question!.question}
              </summary>
              <div className="mt-3 text-sm text-[var(--text)] leading-relaxed">
                <p className="text-[var(--text-muted)] mb-2">{err.question!.explanation}</p>
                <p className="text-xs text-[var(--text-soft)]">
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
