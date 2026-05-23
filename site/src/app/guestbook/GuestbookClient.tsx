"use client";

import { useEffect, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.xolnxoln.cn";

interface Msg {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

export default function GuestbookClient() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API}/api/guestbook`)
      .then(r => r.json())
      .then(setMsgs)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!author.trim() || !content.trim()) return;
    setSubmitting(true);
    setStatus("");
    const res = await fetch(`${API}/api/guestbook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: author.trim(), content: content.trim() }),
    });
    const data = await res.json();
    setStatus(data.ok ? data.msg : data.error);
    if (data.ok) { setContent(""); load(); }
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <ScrollReveal>
        <p className="text-sm font-medium tracking-wide text-[var(--accent)] uppercase">互动</p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">留言板</h1>
        <p className="mt-3 text-[var(--text-muted)]">想说点什么，来这里。</p>
      </ScrollReveal>

      {/* 留言表单 */}
      <ScrollReveal delay={100}>
        <div className="mt-10 space-y-3">
          <input
            type="text" value={author} onChange={e => setAuthor(e.target.value)}
            placeholder="你的昵称" maxLength={50}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none transition-shadow focus:border-[var(--accent)] focus:shadow-md"
          />
          <textarea
            value={content} onChange={e => setContent(e.target.value)}
            placeholder="写点什么..." maxLength={2000} rows={3}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none transition-shadow focus:border-[var(--accent)] focus:shadow-md resize-y"
          />
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={submit}
              disabled={submitting || !author.trim() || !content.trim()}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-40"
            >
              {submitting ? "提交中..." : "留言"}
            </button>
            {status && <span className="text-sm text-[var(--text-muted)]">{status}</span>}
          </div>
        </div>
      </ScrollReveal>

      {/* 留言列表 */}
      <div className="mt-12">
        {loading ? (
          <p className="text-sm text-[var(--text-muted)]">加载中...</p>
        ) : msgs.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">暂无留言，来当第一个。</p>
        ) : (
          <div className="flex flex-col gap-4">
            {msgs.map(m => (
              <div key={m.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-sm text-[var(--text)]">{m.author}</span>
                  <span className="text-xs text-[var(--text-soft)]">{m.created_at?.slice(0, 10)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
