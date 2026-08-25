"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContentUpdate } from "@/lib/updates";
import { sectionLabels } from "@/lib/types";

const SHOW_COUNT = 5;

export default function ContentUpdates({ updates }: { updates: ContentUpdate[] }) {
  const [expanded, setExpanded] = useState(false);

  if (updates.length === 0) return null;

  const visible = expanded ? updates : updates.slice(0, SHOW_COUNT);

  return (
    <div className="mt-12">
      <div className="decorative-hr">
        <span className="text-xs font-medium tracking-widest uppercase">内容动态</span>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {visible.map((u, i) => (
          <div key={`${u.date}-${u.message}-${i}`} className="flex gap-4">
            {/* 时间线 */}
            <div className="flex flex-col items-center">
              <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              {i < visible.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-[var(--border)]" />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-2">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-semibold text-[var(--text)]">
                  {u.date}
                </span>
                <span className="truncate text-sm text-[var(--text-muted)]">
                  {u.message}
                </span>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                {u.files.map((f) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    className="group block rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] px-3 py-2 no-underline transition-colors hover:border-[var(--accent)]"
                  >
                    <span className="text-xs font-medium text-[var(--accent)]">
                      {sectionLabels[f.section] || f.section} · {f.title}
                    </span>
                    {f.snippets.length > 0 && (
                      <span className="mt-1 block text-xs leading-relaxed text-[var(--text-muted)]">
                        {f.snippets.join(" / ")}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {updates.length > SHOW_COUNT && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 w-full rounded-lg border border-[var(--border)] py-2 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {expanded ? "收起" : `查看全部 ${updates.length} 条更新`}
        </button>
      )}
    </div>
  );
}
