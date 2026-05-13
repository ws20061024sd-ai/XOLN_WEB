import { getPageContent } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function WorksPage() {
  const { content } = getPageContent("works");

  return (
    <article className="prose">
      <MarkdownRenderer content={content} />
    </article>
  );
}
