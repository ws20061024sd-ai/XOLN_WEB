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

      <div className="mt-8 flex flex-col gap-2">
        {visible.map((u, i) => (
          <Link
            key={`${u.href}-${u.date}-${i}`}
            href={u.href}
            className="group flex items-baseline justify-between gap-4 rounded-lg px-3 py-2.5 no-underline transition-colors hover:bg-[var(--border-light)]"
          >
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent)]">
                {sectionLabels[u.section] || u.section}
              </span>
              <span className="truncate text-sm text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
                {u.title}
              </span>
            </span>
            <span className="flex-shrink-0 text-xs text-[var(--text-soft)]">
              {u.date}
            </span>
          </Link>
        ))}
      </div>

      {updates.length > SHOW_COUNT && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full rounded-lg border border-[var(--border)] py-2 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {expanded ? "收起" : `查看全部 ${updates.length} 条更新`}
        </button>
      )}
    </div>
  );
}
