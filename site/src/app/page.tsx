import Link from "next/link";

const sections = [
  { href: "/about", title: "个人简介", desc: "关于我——经历、身份、在做的事。" },
  { href: "/beliefs", title: "观念", desc: "世界观、人生观、价值观，关于爱情、友情、亲情的思考。" },
  { href: "/works", title: "作品", desc: "文稿、设计作品，以及一些做过的东西。" },
  { href: "/favorites", title: "喜爱", desc: "电影、音乐、书籍、活动——塑造了我的那些事物。" },
  { href: "/changelog", title: "更新日志", desc: "这个网站的版本记录与改动。" },
  { href: "/misc", title: "杂项", desc: "暂时归不了类的内容。" },
];

export default function Home() {
  return (
    <div>
      <section className="mb-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          你好，我是{" "}
          <span className="text-[var(--color-accent)]">[你的名字]</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--color-text-muted)]">
          这里是我的个人网站。记录思考、作品和一切值得留下的东西。
        </p>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map(({ href, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 no-underline transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold text-[var(--color-text)]">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
