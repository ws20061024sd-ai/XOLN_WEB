import { getSinglePage } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import ScrollReveal from "@/components/ScrollReveal";
import ContactForm from "@/components/ContactForm";

export default function AboutPage() {
  const { title, content } = getSinglePage("about");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <ScrollReveal>
        <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">
          关于
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <div className="prose mt-10">
          <MarkdownRenderer content={content} />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <ContactForm />
      </ScrollReveal>
    </div>
  );
}
