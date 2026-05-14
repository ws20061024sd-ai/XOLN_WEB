"use client";

import { useEffect, useState } from "react";

interface CountdownItem {
  title: string;
  date: string;
  type: "since" | "until";
}

function calc(target: Date, now: Date) {
  const diffMs = target.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);
  const totalDays = Math.floor(absMs / 86400000);
  const hours = Math.floor((absMs % 86400000) / 3600000);
  const minutes = Math.floor((absMs % 3600000) / 60000);
  const seconds = Math.floor((absMs % 60000) / 1000);
  return { totalDays, hours, minutes, seconds, isPast: diffMs <= 0 };
}

export default function CountdownClient({ items }: { items: CountdownItem[] }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => {
        const target = new Date(item.date);
        const { totalDays, hours, minutes, seconds, isPast } = calc(target, now);
        const isSince = item.type === "since";
        const label = isSince ? "距今" : "还有";

        // 进度条：对于 until 类型，如果日期在未来
        const startOfYear = new Date(target.getFullYear(), 0, 1);
        const yearDays = 365;
        const elapsedDays = isSince
          ? totalDays
          : yearDays - totalDays;

        return (
          <div
            key={item.title}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h3 className="font-semibold text-[var(--text)]">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                  {item.date}
                </p>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isSince
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {isSince ? "距今" : "倒计时"}
              </span>
            </div>

            {/* 数字显示 */}
            <div className="mt-4 font-mono tabular-nums">
              <span className="text-4xl font-bold text-[var(--text)]">
                {totalDays.toLocaleString()}
              </span>
              <span className="ml-2 text-lg text-[var(--text-muted)]">天</span>
              <span className="ml-4 text-xl text-[var(--text-muted)]">
                {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>

            {/* 说明文字 */}
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {label}{" "}
              <strong className="text-[var(--text)]">{totalDays.toLocaleString()} 天</strong>
              {isSince && isPast ? "，已过去" : ""}
              {!isSince && target > now ? "，即将到来" : ""}
              {!isSince && target <= now ? "，已经过了" : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}
