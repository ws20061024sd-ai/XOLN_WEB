import { getPageContent } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function FavoritesPage() {
  const { content } = getPageContent("favorites");

  return (
    <article className="prose">
      <MarkdownRenderer content={content} />
    </article>
  );
}
