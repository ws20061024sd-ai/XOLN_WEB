"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import ScrollReveal from "@/components/ScrollReveal";
import { fetchCommunityPosts, fetchCommunityPost, submitCommunityPost, type CommunityPost } from "@/lib/api";
import CommentSection from "@/components/CommentSection";

function CommunityContent() {
  const searchParams = useSearchParams();
  const articleId = searchParams.get("id");

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [article, setArticle] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", content: "", tags: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const loadPosts = useCallback(async () => {
    const data = await fetchCommunityPosts();
    setPosts(data);
  }, []);

  const loadArticle = useCallback(async (id: number) => {
    setLoading(true);
    const data = await fetchCommunityPost(id);
    setArticle(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);
  useEffect(() => {
    if (articleId) loadArticle(Number(articleId));
    else setArticle(null);
  }, [articleId, loadArticle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.content) {
      setMsg("请填写标题、作者和内容");
      return;
    }
    setSubmitting(true);
    const res = await submitCommunityPost(form);
    setMsg(res.error || res.msg || (res.ok ? "投稿已提交，审核后显示" : "提交失败"));
    if (res.ok) { setForm({ title: "", author: "", content: "", tags: "" }); setShowForm(false); }
    setSubmitting(false);
  };

  // 详情视图
  if (articleId) {
    if (loading) return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-[var(--text-muted)]">加载中...</div>;
    if (!article) return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-[var(--text-muted)]">文章不存在</p>
        <Link href="/community" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">返回列表</Link>
      </div>
    );
    return (
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/community" className="mb-6 inline-flex items-center text-sm text-[var(--text-muted)] hover:text-[var(--accent)] no-underline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回列表
        </Link>
        <h1 className="font-serif text-3xl font-bold text-[var(--text)]">{article.title}</h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-[var(--text-muted)]">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.created_at}</span>
          {article.tags && <span className="rounded-full bg-[var(--border-light)] px-2 py-0.5 text-xs text-[var(--text-soft)]">{article.tags}</span>}
        </div>
        <div className="mt-10 prose">
          <MarkdownRenderer content={article.content || ""} />
        </div>
        <CommentSection slug={`community-${article.id}`} section="community" />
      </article>
    );
  }

  // 列表视图
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--text)]">共创</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">读者投稿——你也可以在这里发表文章。</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-[var(--accent-hover)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          {showForm ? "收起" : "我要投稿"}
        </button>
      </div>

      {/* 投稿表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">标题 *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                maxLength={100}
                placeholder="给你的文章取个标题"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">你的名字 *</label>
              <input
                type="text"
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                maxLength={50}
                placeholder="怎么称呼？"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">标签（可选，逗号分隔）</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="例如：哲学, 旅行, 书评"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">正文 *（Markdown 格式）</label>
              <details className="group relative">
                <summary className="cursor-pointer text-xs text-[var(--accent)] hover:underline">怎么写？</summary>
                <div className="absolute right-0 mt-2 w-72 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3 text-xs text-[var(--text-muted)] shadow-lg z-10">
                  <p className="font-medium text-[var(--text)] mb-2">Markdown 速查</p>
                  <code className="block"># 标题</code>
                  <code className="block">## 二级标题</code>
                  <code className="block">**加粗** *斜体*</code>
                  <code className="block">![图片描述](图片链接)</code>
                  <code className="block">[链接文字](链接)</code>
                  <code className="block">&gt; 引用文字</code>
                  <code className="block">空一行 = 新段落</code>
                  <code className="mt-1 block text-[var(--text-soft)]">支持图片/视频/B站/YouTube</code>
                </div>
              </details>
            </div>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              maxLength={50000}
              rows={12}
              placeholder={`在这里写你的文章，支持 Markdown 格式。\n\n## 二级标题\n正文内容...\n\n![图片描述](图片链接)\n\n> 引用文字`}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-sm outline-none focus:border-[var(--accent)] resize-y font-mono"
            />
          </div>
          {form.content && (
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
              <p className="mb-2 text-xs font-medium text-[var(--text-soft)]">预览</p>
              <div className="prose text-sm">
                <MarkdownRenderer content={form.content} />
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
            >
              {submitting ? "提交中..." : "提交投稿"}
            </button>
            {msg && <span className="text-sm text-[var(--text-soft)]">{msg}</span>}
          </div>
        </form>
      )}

      {/* 文章列表 */}
      <div className="mt-8 flex flex-col gap-4">
        {posts.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">暂无投稿，来做第一个投稿的人吧。</p>
        )}
        {posts.map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 40}>
            <Link
              href={`/community?id=${p.id}`}
              className="glass-card group block rounded-xl p-5 no-underline"
            >
              <h3 className="font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
                {p.title}
              </h3>
              <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-soft)]">
                <span>{p.author}</span>
                <span>·</span>
                <span>{p.created_at}</span>
                {p.tags && <span className="rounded-full bg-[var(--border-light)] px-2 py-0.5">{p.tags}</span>}
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-[var(--text-muted)]">加载中...</div>}>
      <CommunityContent />
    </Suspense>
  );
}
