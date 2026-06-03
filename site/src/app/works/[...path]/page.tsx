import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorksNode, getAllWorksPaths, type WorksNode } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import ScrollReveal from "@/components/ScrollReveal";
import CommentSection from "@/components/CommentSection";

function FolderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function Breadcrumb({ items }: { items: { name: string; label: string }[] }) {
  return (
    <nav className="mb-8 flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
          {i < items.length - 1 ? (
            <Link
              href={item.name === "" ? "/works" : `/works/${items.slice(1, i + 1).map(b => b.name).join("/")}`}
              className="hover:text-[var(--accent)] no-underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function WorksList({ nodes, basePath }: { nodes: WorksNode[]; basePath: string }) {
  if (nodes.length === 0) {
    return <p className="text-sm text-[var(--text-muted)]">此分类暂无内容。</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {nodes.map((node, i) => (
        <ScrollReveal key={node.name} delay={i * 40}>
          {node.type === "directory" ? (
            <Link
              href={`${basePath}/${node.name}`}
              className="card-hover group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 no-underline shadow-sm"
            >
              <span className="flex-shrink-0 rounded-lg bg-[var(--accent-soft)] p-2.5 text-[var(--accent)]">
                <FolderIcon />
              </span>
              <div>
                <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {node.title}
                </h3>
                <p className="mt-0.5 text-xs text-[var(--text-soft)]">
                  {node.children?.filter(c => c.type === "file").length || 0} 篇作品
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href={`${basePath}/${node.name}`}
              className="card-hover group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 no-underline shadow-sm"
            >
              <span className="flex-shrink-0 rounded-lg bg-[var(--border-light)] p-2.5 text-[var(--text-muted)]">
                <FileIcon />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {node.title}
                </h3>
                {node.description && (
                  <p className="mt-1 text-sm text-[var(--text-muted)] line-clamp-1">{node.description}</p>
                )}
              </div>
              {node.date && (
                <span className="flex-shrink-0 text-xs text-[var(--text-soft)]">{node.date.slice(0, 7)}</span>
              )}
            </Link>
          )}
        </ScrollReveal>
      ))}
    </div>
  );
}

export async function generateStaticParams() {
  const paths = getAllWorksPaths();
  return paths.map(p => ({ path: p }));
}

export default async function WorksNodePage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path: pathSegments } = await params;
  const result = getWorksNode(pathSegments);

  if (!result) notFound();

  if (result.type === "directory") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <Breadcrumb items={result.breadcrumb} />
        <ScrollReveal>
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            {result.breadcrumb[result.breadcrumb.length - 1].label}
          </h1>
        </ScrollReveal>
        <div className="mt-8">
          <WorksList nodes={result.children} basePath={`/works/${pathSegments.join("/")}`} />
        </div>
      </div>
    );
  }

  // 文章详情
  const { node, breadcrumb } = result;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumb items={breadcrumb} />
      <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
        {node.title}
      </h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-[var(--text-muted)]">
        {node.date && <span>{node.date}</span>}
        {node.tags && node.tags.length > 0 && (
          <div className="flex gap-1.5">
            {node.tags.map(tag => (
              <span key={tag} className="rounded-full bg-[var(--border-light)] px-2 py-0.5 text-xs text-[var(--text-soft)]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-10 prose">
        <MarkdownRenderer content={node.content || ""} />
      </div>
      <CommentSection slug={`works-${node.name}`} section="works" />
    </article>
  );
}
