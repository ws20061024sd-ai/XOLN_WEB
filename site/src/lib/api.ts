// Phase 2 API 调用层
// 设置 NEXT_PUBLIC_API_URL 后生效，为空时静默降级

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// ===== 评论 =====

export interface Comment {
  id: number;
  slug: string;
  section: string;
  author: string;
  content: string;
  created_at: string;
}

export async function fetchComments(
  slug: string
): Promise<Comment[]> {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/api/comments/${slug}`);
    return res.json();
  } catch {
    return [];
  }
}

export async function postComment(data: {
  slug: string;
  section: string;
  author: string;
  content: string;
}) {
  if (!API_BASE) return { ok: false, error: "评论暂未开放" };
  const res = await fetch(`${API_BASE}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ===== 统计 =====

export async function trackPageview(path: string) {
  if (!API_BASE) return;
  fetch(`${API_BASE}/api/stats/pageview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  }).catch(() => {});
}

// ===== 联系表单 =====

export async function submitContact(data: {
  name: string;
  email: string;
  content: string;
}) {
  if (!API_BASE) return { ok: false, error: "联系功能暂未开放" };
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
