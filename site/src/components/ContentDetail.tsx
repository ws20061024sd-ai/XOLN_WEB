import Link from "next/link";
import type { ContentItem } from "@/lib/types";
import { sectionLabels } from "@/lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import ScrollReveal from "./ScrollReveal";

interface ContentDetailProps {
  item: ContentItem;
  section: string;
}

export default function ContentDetail({ item, section }: ContentDetailProps) {
  const label = sectionLabels[section] || section;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <ScrollReveal>
        <Link
          href={`/${section}`}
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--accent)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {label}
        </Link>

        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {item.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
          {item.date && <span>{item.date}</span>}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="prose mt-10">
          <MarkdownRenderer content={item.content} />
        </div>
      </ScrollReveal>

      <div className="mt-16">
        <Link
          href={`/${section}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] no-underline transition-colors hover:text-[var(--accent)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回{label}列表
        </Link>
      </div>
    </div>
  );
}
