import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

const sections = [
  {
    href: "/about",
    title: "个人简介",
    desc: "经历、身份、在做的事。",
    color: "#2563eb",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: "/beliefs",
    title: "观念",
    desc: "世界观、人生观、价值观——关于爱情、友情、亲情的思考。",
    color: "#7c3aed",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    href: "/works",
    title: "作品",
    desc: "文稿、设计作品，以及一些做过的东西。",
    color: "#059669",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" /><path d="M12 17v4" />
      </svg>
    ),
  },
  {
    href: "/favorites",
    title: "喜爱",
    desc: "电影、音乐、书籍、活动——塑造了我的那些事物。",
    color: "#d97706",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    href: "/changelog",
    title: "更新日志",
    desc: "这个网站的版本记录与改动。",
    color: "#dc2626",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/misc",
    title: "杂项",
    desc: "暂时归不了类的内容。",
    color: "#0891b2",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative mx-auto max-w-3xl overflow-hidden px-4 pb-16 pt-16 sm:pt-28 sm:pb-20">
        {/* 几何装饰 */}
        <div className="geo-blob absolute -top-20 -left-20 h-72 w-72 bg-blue-200 sm:h-96 sm:w-96" />
        <div className="geo-blob absolute top-20 -right-16 h-56 w-56 bg-purple-200 sm:top-10 sm:h-80 sm:w-80" style={{ opacity: 0.10 }} />
        <div className="geo-blob absolute bottom-0 left-1/3 h-40 w-40 bg-amber-100 sm:h-56 sm:w-56" style={{ opacity: 0.08 }} />
        <div className="geo-grid absolute inset-0" />

        <div className="slide-up relative">
          <p className="text-sm font-medium tracking-widest text-[var(--accent)] uppercase">
            Personal Website
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl sm:leading-tight">
            你好，我是{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                [你的名字]
              </span>
              <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-[var(--accent-soft)] opacity-60" />
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]">
            这里是我的数字花园。记录思考，展示作品，整理一切塑造了我的事物。
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/about"
              className="btn-ripple inline-flex items-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white no-underline transition-all hover:bg-[var(--accent-hover)] hover:shadow-lg"
            >
              了解更多
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/works"
              className="btn-ripple inline-flex items-center rounded-lg border border-[var(--border)] bg-white/80 px-5 py-2.5 text-sm font-medium text-[var(--text)] no-underline backdrop-blur transition-all hover:border-[var(--accent)] hover:shadow-md"
            >
              查看作品
            </Link>
          </div>
        </div>
      </section>

      {/* 栏目卡片 */}
      <section className="relative mx-auto max-w-3xl px-4 pb-24">
        <div className="decorative-hr">
          <span className="text-xs font-medium tracking-widest uppercase">探索</span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {sections.map(({ href, title, desc, color, icon }, i) => (
            <ScrollReveal key={href} delay={i * 60}>
              <Link
                href={href}
                className="glass-card group relative flex items-start gap-4 rounded-xl p-5 no-underline"
                style={{ "--card-color": color } as React.CSSProperties}
              >
                {/* 彩色微光 */}
                <span
                  className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${color}08 0%, transparent 60%)`,
                  }}
                />
                <span
                  className="icon-bounce relative mt-0.5 flex-shrink-0 rounded-lg p-2.5 text-white transition-colors"
                  style={{ backgroundColor: color }}
                >
                  {icon}
                </span>
                <div className="relative">
                  <h3 className="font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
                    {desc}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
