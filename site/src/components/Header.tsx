"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于" },
  { href: "/beliefs", label: "观念" },
  { href: "/works", label: "作品" },
  { href: "/favorites", label: "喜爱" },
  { href: "/changelog", label: "更新" },
  { href: "/misc", label: "杂项" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[var(--color-text)] no-underline"
        >
          我的网站
        </Link>

        {/* 桌面导航 */}
        <div className="hidden gap-6 md:flex">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm no-underline transition-colors ${
                pathname === href
                  ? "font-medium text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 移动端按钮 */}
        <button
          onClick={() => setOpen(!open)}
          className="text-sm text-[var(--color-text-muted)] md:hidden"
          aria-label="菜单"
        >
          {open ? "关闭" : "菜单"}
        </button>
      </nav>

      {/* 移动端菜单 */}
      {open && (
        <div className="border-t border-[var(--color-border)] md:hidden">
          <div className="mx-auto max-w-3xl px-4 py-3 flex flex-col gap-3">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`text-sm no-underline ${
                  pathname === href
                    ? "font-medium text-[var(--color-accent)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
