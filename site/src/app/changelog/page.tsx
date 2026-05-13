import { getPageContent } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function ChangelogPage() {
  const { content } = getPageContent("changelog");

  return (
    <article className="prose">
      <MarkdownRenderer content={content} />
    </article>
  );
}
