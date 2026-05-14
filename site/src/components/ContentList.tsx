import Link from "next/link";
import type { ContentMeta } from "@/lib/types";
import ScrollReveal from "./ScrollReveal";

interface ContentListProps {
  items: ContentMeta[];
  section: string;
  label: string;
  emptyText?: string;
}

export default function ContentList({
  items,
  section,
  label,
  emptyText = "暂无内容。",
}: ContentListProps) {
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-[var(--text-muted)]">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <ScrollReveal>
        <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">
          {label}
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {label}
        </h1>
      </ScrollReveal>

      <div className="mt-10 flex flex-col gap-3">
        {items.map((item, i) => (
          <ScrollReveal key={item.slug} delay={i * 40}>
            <Link
              href={`/${section}/${item.slug}`}
              className="card-hover group block rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 no-underline shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.date && (
                  <span className="mt-0.5 flex-shrink-0 text-xs text-[var(--text-soft)]">
                    {item.date.slice(0, 7)}
                  </span>
                )}
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
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
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
