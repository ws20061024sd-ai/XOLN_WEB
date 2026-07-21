import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

interface AppEntry {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const apps: AppEntry[] = [
  {
    name: "日语四级学习舱",
    description: "词汇闪卡 · 语法练习 · 阅读听力 · 真题模考 · 学习统计",
    href: "/works/japanese",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
];

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <ScrollReveal>
        <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">Apps</p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">程序</h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          这里放我自己做的小程序，会越来越多。
        </p>
      </ScrollReveal>

      <div className="mt-10 flex flex-col gap-4">
        {apps.map((app, i) => (
          <ScrollReveal key={app.href} delay={i * 60}>
            <Link
              href={app.href}
              className="card-hover group flex items-center gap-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 no-underline shadow-sm transition-colors hover:border-[var(--accent)]"
            >
              <span className="flex-shrink-0 rounded-xl bg-[var(--accent-soft)] p-3.5 text-[var(--accent)]">
                {app.icon}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
                  {app.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{app.description}</p>
              </div>
              <span className="flex-shrink-0 text-[var(--text-soft)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      {apps.length === 0 && (
        <p className="mt-10 text-center text-sm text-[var(--text-muted)]">还没有程序，敬请期待。</p>
      )}
    </div>
  );
}
