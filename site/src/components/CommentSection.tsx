"use client";

import { useEffect, useState } from "react";
import { fetchComments, postComment, type Comment } from "@/lib/api";

interface CommentSectionProps {
  slug: string;
  section: string;
}

export default function CommentSection({ slug, section }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchComments(slug).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [slug]);

  const submit = async () => {
    if (!author.trim() || !content.trim()) return;
    setSubmitting(true);
    setMsg("");
    const res = await postComment({ slug, section, author: author.trim(), content: content.trim() });
    if (res.ok) {
      setContent("");
      setMsg(res.msg || "已提交");
    } else {
      setMsg(res.error || "提交失败");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-16 border-t border-[var(--border)] pt-10">
      <h2 className="font-serif text-xl font-semibold">评论</h2>

      {/* 已有评论 */}
      {loading ? (
        <p className="mt-4 text-sm text-[var(--text-muted)]">加载中...</p>
      ) : comments.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--text-muted)]">暂无评论，来说两句。</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-sm text-[var(--text)]">
                  {c.author}
                </span>
                <span className="text-xs text-[var(--text-soft)]">
                  {c.created_at?.slice(0, 10)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 评论表单 */}
      <div className="mt-8 space-y-3">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="你的昵称"
          maxLength={50}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none transition-shadow placeholder:text-[var(--text-soft)] focus:border-[var(--accent)] focus:shadow-md"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写点想法..."
          maxLength={5000}
          rows={3}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none transition-shadow placeholder:text-[var(--text-soft)] focus:border-[var(--accent)] focus:shadow-md resize-y"
        />
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={submit}
            disabled={submitting || !author.trim() || !content.trim()}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-40"
          >
            {submitting ? "提交中..." : "提交"}
          </button>
          {msg && (
            <span className="text-sm text-[var(--text-muted)]">{msg}</span>
          )}
        </div>
      </div>
    </div>
  );
}
