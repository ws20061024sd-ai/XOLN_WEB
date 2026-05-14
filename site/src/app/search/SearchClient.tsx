"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ContentItem } from "@/lib/types";
import { sectionLabels } from "@/lib/types";

// 简易模糊搜索，不依赖 Fuse.js 额外安装
function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower.includes(q)) return true;

  // 逐字匹配
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

interface SearchItem extends ContentItem {
  section: string;
}

export default function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim();
    return items
      .filter(
        (item) =>
          fuzzyMatch(item.title, q) ||
          fuzzyMatch(item.description || "", q) ||
          (item.tags && item.tags.some((t) => fuzzyMatch(t, q)))
      )
      .slice(0, 20);
  }, [query, items]);

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章标题、描述、标签..."
          autoFocus
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-base outline-none transition-shadow placeholder:text-[var(--text-soft)] focus:border-[var(--accent)] focus:shadow-md"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-soft)] hover:text-[var(--text)]"
          >
            清除
          </button>
        )}
      </div>

      <div className="mt-2 text-xs text-[var(--text-soft)]">
        {query
          ? `${results.length} 个结果`
          : `共 ${items.length} 篇文章可搜索`}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {results.map((item) => (
          <Link
            key={`${item.section}/${item.slug}`}
            href={`/${item.section}/${item.slug}`}
            className="card-hover block rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 no-underline shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-[var(--accent)]">
                  {sectionLabels[item.section] || item.section}
                </span>
                <h3 className="mt-0.5 font-semibold text-[var(--text)]">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-sm text-[var(--text-muted)] line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
              {item.date && (
                <span className="flex-shrink-0 text-xs text-[var(--text-soft)]">
                  {item.date.slice(0, 7)}
                </span>
              )}
            </div>
          </Link>
        ))}

        {query && results.length === 0 && (
          <p className="py-8 text-center text-[var(--text-muted)]">
            未找到匹配的内容
          </p>
        )}
      </div>
    </div>
  );
}
