"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于" },
  { href: "/beliefs", label: "观念" },
  { href: "/works", label: "作品" },
  { href: "/favorites", label: "喜爱" },
  { href: "/guestbook", label: "留言板" },
  { href: "/changelog", label: "更新" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-[var(--bg)]"
      }`}
    >
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[var(--text)] no-underline transition-opacity hover:opacity-70"
        >
          我的网站
        </Link>

        {/* 桌面导航 */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium no-underline transition-all ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--border-light)] hover:text-[var(--text)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <ThemeToggle />
          {/* 搜索图标 */}
          <Link
            href="/search"
            className={`ml-1 rounded-md p-1.5 no-underline transition-all ${
              pathname === "/search"
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:bg-[var(--border-light)] hover:text-[var(--text)]"
            }`}
            aria-label="搜索"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </Link>
        </div>

        {/* 移动端按钮 */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--border-light)] md:hidden"
          aria-label={open ? "关闭菜单" : "打开菜单"}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l8 8M13 5l-8 8" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5h12M3 9h12M3 13h12" />
            </svg>
          )}
        </button>
      </nav>

      {/* 移动端菜单 */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3 flex flex-col gap-1">
          {navItems.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--border-light)]"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="px-3 py-2">
            <ThemeToggle />
          </div>
          <Link
            href="/search"
            className={`rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors ${
              pathname === "/search"
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--text-muted)] hover:bg-[var(--border-light)]"
            }`}
          >
            搜索
          </Link>
        </div>
      </div>
    </header>
  );
}
