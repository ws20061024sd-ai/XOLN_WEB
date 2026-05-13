import { getPageContent } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function BeliefsPage() {
  const { content } = getPageContent("beliefs");

  return (
    <article className="prose">
      <MarkdownRenderer content={content} />
    </article>
  );
}
