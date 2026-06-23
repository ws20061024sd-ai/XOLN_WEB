"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ContentItem } from "@/lib/types";
import { sectionLabels } from "@/lib/types";

function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower.includes(q)) return true;

  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

/** 从正文中提取搜索词首次出现的片段（前后各 30 字），含 <mark> 高亮 */
function extractSnippet(content: string, query: string): string | null {
  if (!content) return null;
  const lower = content.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) {
    // 逐字匹配定位
    let qi = 0, pos = -1;
    for (let i = 0; i < lower.length && qi < q.length; i++) {
      if (lower[i] === q[qi]) { if (qi === 0) pos = i; qi++; }
    }
    if (qi !== q.length) return null;
    if (pos === -1) return null;
    const start = Math.max(0, pos - 30);
    const end = Math.min(content.length, pos + q.length + 30);
    const before = content.slice(start, pos);
    const match = content.slice(pos, pos + q.length);
    const after = content.slice(pos + q.length, end);
    return `${start > 0 ? "..." : ""}${escapeHtml(before)}<mark>${escapeHtml(match)}</mark>${escapeHtml(after)}${end < content.length ? "..." : ""}`;
  }
  const start = Math.max(0, idx - 30);
  const end = Math.min(content.length, idx + q.length + 30);
  const before = content.slice(start, idx);
  const match = content.slice(idx, idx + q.length);
  const after = content.slice(idx + q.length, end);
  return `${start > 0 ? "..." : ""}${escapeHtml(before)}<mark>${escapeHtml(match)}</mark>${escapeHtml(after)}${end < content.length ? "..." : ""}`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
          (item.tags && item.tags.some((t) => fuzzyMatch(t, q))) ||
          fuzzyMatch(item.content || "", q)
      )
      .slice(0, 20)
      .map((item) => ({
        ...item,
        snippet: extractSnippet(item.content || "", q),
      }));
  }, [query, items]);

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章标题、描述、标签、正文..."
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
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-[var(--accent)]">
                  {sectionLabels[item.section] || item.section}
                </span>
                <h3 className="mt-0.5 font-semibold text-[var(--text)]">
                  {item.title}
                </h3>
                {item.snippet && (
                  <p
                    className="mt-1.5 text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: item.snippet }}
                  />
                )}
              </div>
              {item.date && (
                <span className="flex-shrink-0 text-xs text-[var(--text-soft)]">
                  {item.date.slice(0, 7)}
                </span>
              )}
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
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
