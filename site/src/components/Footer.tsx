"use client";

import { useEffect, useState } from "react";

const quotes = [
  "我们是我们反复做的事。优秀不是一种行为，而是一种习惯。 —— 亚里士多德",
  "认识你自己。 —— 苏格拉底",
  "我思故我在。 —— 笛卡尔",
  "未经审视的人生不值得过。 —— 苏格拉底",
  "成为你想要的改变。 —— 甘地",
  "生活不是等待暴风雨过去，而是学会在雨中起舞。",
  "少则得，多则惑。 —— 老子",
  "知之为知之，不知为不知，是知也。 —— 孔子",
  "千里之行，始于足下。 —— 老子",
  "想象力比知识更重要。 —— 爱因斯坦",
  "简洁是终极的复杂。 —— 达芬奇",
  "世界以痛吻我，要我报之以歌。 —— 泰戈尔",
  "你必须成为你希望在世界上看到的那种改变。 —— 甘地",
  "人生如逆旅，我亦是行人。 —— 苏轼",
];

export default function Footer() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const idx = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[idx]);
  }, []);

  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        {quote && (
          <p className="mb-6 text-sm italic leading-relaxed text-[var(--text-soft)] transition-opacity duration-1000">
            {quote}
          </p>
        )}
        <p className="text-xs text-[var(--text-soft)]">
          &copy; {new Date().getFullYear()} 我的网站
        </p>
      </div>
    </footer>
  );
}
