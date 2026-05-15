"use client";

import { useEffect, useState } from "react";

const API = "http://api.xolnxoln.cn";

interface Comment {
  id: number; slug: string; section: string; author: string;
  content: string; approved: number; created_at: string;
}
interface Message {
  id: number; name: string; email: string; content: string;
  read: number; created_at: string;
}
interface Stats { pv: number; today: number; top: { path: string; count: number }[] }

export default function AdminPanel() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"comments" | "messages" | "stats">("comments");
  const [comments, setComments] = useState<Comment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_key");
    if (saved) { setKey(saved); setAuthed(true); }
  }, []);

  const login = () => {
    setErr("");
    fetch(`${API}/api/admin/comments`, { headers: { "x-admin-key": key } })
      .then(r => r.ok ? (sessionStorage.setItem("admin_key", key), setAuthed(true)) : setErr("密钥错误"))
      .catch(() => setErr("无法连接"));
  };

  const load = (type: string) => {
    setLoading(true);
    const headers = { "x-admin-key": key };
    fetch(`${API}/api/admin/${type}`, { headers })
      .then(r => r.json())
      .then(data => {
        if (type === "comments") setComments(data);
        if (type === "messages") setMessages(data);
        if (type === "stats") setStats(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (authed) load("comments"); }, [authed]);
  useEffect(() => { if (authed && tab === "messages") load("messages"); }, [authed, tab]);
  useEffect(() => { if (authed && tab === "stats") load("stats"); }, [authed, tab]);

  const toggleApprove = (id: number, approved: number) => {
    fetch(`${API}/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ approved: approved ? 0 : 1 }),
    }).then(() => load("comments"));
  };

  const deleteComment = (id: number) => {
    if (!confirm("确定删除？")) return;
    fetch(`${API}/api/admin/comments/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": key },
    }).then(() => load("comments"));
  };

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold">管理面板</h1>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="输入管理密钥"
          className="mt-6 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          onClick={login}
          className="mt-3 w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          登录
        </button>
        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">管理面板</h1>
        <button
          onClick={() => { sessionStorage.removeItem("admin_key"); setAuthed(false); }}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
        >
          退出
        </button>
      </div>

      {/* Tab 栏 */}
      <div className="mt-6 flex gap-2">
        {(["comments", "messages", "stats"] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); load(t); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--border-light)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            {t === "comments" ? "评论" : t === "messages" ? "消息" : "统计"}
          </button>
        ))}
      </div>

      {loading && <p className="mt-6 text-sm text-[var(--text-muted)]">加载中...</p>}

      {/* 评论 */}
      {tab === "comments" && !loading && (
        <div className="mt-6 flex flex-col gap-3">
          {comments.length === 0 && <p className="text-sm text-[var(--text-muted)]">暂无评论</p>}
          {comments.map(c => (
            <div key={c.id} className={`rounded-lg border p-4 ${c.approved ? "border-[var(--border)] bg-[var(--bg-card)]" : "border-amber-200 bg-amber-50"}`}>
              <div className="flex items-center justify-between text-xs text-[var(--text-soft)]">
                <span><strong className="text-[var(--text)]">{c.author}</strong> · {c.section}/{c.slug}</span>
                <span>{c.created_at}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--text)] whitespace-pre-wrap">{c.content}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => toggleApprove(c.id, c.approved)} className="text-xs text-[var(--accent)] hover:underline">
                  {c.approved ? "隐藏" : "显示"}
                </button>
                <button onClick={() => deleteComment(c.id)} className="text-xs text-red-500 hover:underline">删除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 消息 */}
      {tab === "messages" && !loading && (
        <div className="mt-6 flex flex-col gap-3">
          {messages.length === 0 && <p className="text-sm text-[var(--text-muted)]">暂无消息</p>}
          {messages.map(m => (
            <div key={m.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center justify-between text-xs text-[var(--text-soft)]">
                <span><strong className="text-[var(--text)]">{m.name}</strong> · {m.email}</span>
                <span>{m.created_at}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--text)] whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* 统计 */}
      {tab === "stats" && stats && !loading && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center">
              <p className="text-3xl font-bold text-[var(--accent)]">{stats.pv}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">历史总访问量（PV）</p>
              <p className="text-[10px] text-[var(--text-soft)] mt-1">每次打开页面 +1</p>
            </div>
            <div className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center">
              <p className="text-3xl font-bold text-[var(--accent)]">{stats.today}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">今日访问量（PV）</p>
              <p className="text-[10px] text-[var(--text-soft)] mt-1">今天 0 点到现在</p>
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <h3 className="text-sm font-semibold mb-1">被访问最多的页面</h3>
            <p className="text-[10px] text-[var(--text-soft)] mb-3">数字 = 这个页面被打开过多少次</p>
            {stats.top.length === 0 && <p className="text-sm text-[var(--text-muted)]">暂无数据</p>}
            {stats.top.map((t, i) => (
              <div key={t.path} className="flex items-center justify-between py-2 text-sm border-b border-[var(--border-light)] last:border-0">
                <span className="text-[var(--text)]">
                  <span className="text-[var(--text-soft)] mr-2">{i + 1}.</span>
                  {t.path === "/" ? "首页 ( / )" : t.path}
                </span>
                <span className="rounded bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">{t.count} 次</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
