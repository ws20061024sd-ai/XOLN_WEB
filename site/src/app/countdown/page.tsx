import fs from "fs";
import path from "path";
import CountdownClient from "./CountdownClient";
import ScrollReveal from "@/components/ScrollReveal";

interface CountdownItem {
  title: string;
  date: string;
  type: "since" | "until";
}

function getCountdowns(): CountdownItem[] {
  const filePath = path.join(process.cwd(), "content", "countdowns.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default function CountdownPage() {
  const items = getCountdowns();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <ScrollReveal>
        <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">
          时间
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          倒计时
        </h1>
        <p className="mt-3 text-[var(--text-muted)]">
          所有数字实时更新，每秒刷新。
        </p>
      </ScrollReveal>

      <div className="mt-10">
        <CountdownClient items={items} />
      </div>
    </div>
  );
}
