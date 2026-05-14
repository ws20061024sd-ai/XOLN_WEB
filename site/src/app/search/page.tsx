import { getAllContent, type ContentItem } from "@/lib/content";
import SearchClient from "./SearchClient";
import ScrollReveal from "@/components/ScrollReveal";

// 扩展类型包含 section
interface SearchItem extends ContentItem {
  section: string;
}

export default function SearchPage() {
  const items = getAllContent() as SearchItem[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <ScrollReveal>
        <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">
          搜索
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight">
          搜索内容
        </h1>
      </ScrollReveal>

      <div className="mt-8">
        <SearchClient items={items} />
      </div>
    </div>
  );
}
