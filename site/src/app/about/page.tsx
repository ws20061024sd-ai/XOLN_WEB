import { getPageContent } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function AboutPage() {
  const { content } = getPageContent("about");

  return (
    <article className="prose">
      <MarkdownRenderer content={content} />
    </article>
  );
}
