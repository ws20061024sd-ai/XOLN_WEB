"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async () => {
    if (!name.trim() || !email.trim() || !content.trim()) return;
    setSubmitting(true);
    setMsg("");
    const res = await submitContact({
      name: name.trim(),
      email: email.trim(),
      content: content.trim(),
    });
    setMsg(res.ok ? (res.msg || "已发送") : res.error || "发送失败");
    if (res.ok) { setName(""); setEmail(""); setContent(""); }
    setSubmitting(false);
  };

  return (
    <div className="mt-12 border-t border-[var(--border)] pt-10">
      <h2 className="font-serif text-xl font-semibold">联系我</h2>
      <div className="mt-6 space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的名字"
            maxLength={50}
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none transition-shadow placeholder:text-[var(--text-soft)] focus:border-[var(--accent)] focus:shadow-md"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            maxLength={200}
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none transition-shadow placeholder:text-[var(--text-soft)] focus:border-[var(--accent)] focus:shadow-md"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="想说的话..."
          maxLength={5000}
          rows={3}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none transition-shadow placeholder:text-[var(--text-soft)] focus:border-[var(--accent)] focus:shadow-md resize-y"
        />
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={submit}
            disabled={submitting || !name.trim() || !email.trim() || !content.trim()}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-40"
          >
            {submitting ? "发送中..." : "发送"}
          </button>
          {msg && (
            <span className="text-sm text-[var(--text-muted)]">{msg}</span>
          )}
        </div>
      </div>
    </div>
  );
}
