import { getPageContent } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function MiscPage() {
  const { content } = getPageContent("misc");

  return (
    <article className="prose">
      <MarkdownRenderer content={content} />
    </article>
  );
}
