import Link from "next/link";
import { getWorksRoot, type WorksNode } from "@/lib/content";
import ScrollReveal from "@/components/ScrollReveal";

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
                <h3 className="font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
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
                <h3 className="font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
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

export default function WorksPage() {
  const nodes = getWorksRoot();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <ScrollReveal>
        <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">作品</p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">作品</h1>
      </ScrollReveal>
      {/* 日语四级学习舱入口 */}
      <ScrollReveal>
        <Link
          href="/works/japanese"
          className="card-hover group mb-6 flex items-center gap-4 rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-soft)]/30 p-5 no-underline shadow-sm"
        >
          <span className="flex-shrink-0 rounded-lg bg-[var(--accent)] p-3 text-2xl">🇯🇵</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
              日语四级学习舱
            </h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              词汇闪卡 · 语法练习 · 阅读听力 · 真题模考
            </p>
          </div>
          <span className="flex-shrink-0 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-white">
            工具
          </span>
        </Link>
      </ScrollReveal>
      <div className="mt-10">
        <WorksList nodes={nodes} basePath="/works" />
      </div>
    </div>
  );
}
