// Phase 2 API 调用层
// 所有组件统一从这里取 API 地址，避免 AdminPanel/GuestbookClient 各自硬编码。

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://api.xolnxoln.cn";

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
  try {
    const res = await fetch(`${API_BASE}/api/comments/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error(`评论加载失败: ${res.status}`);
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
  try {
    const res = await fetch(`${API_BASE}/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return { ok: false, error: "网络异常，请稍后重试" };
  }
}

// ===== 统计 =====

export async function trackPageview(path: string) {
  try {
    fetch(`${API_BASE}/api/stats/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {});
  } catch {
    // 统计失败不影响浏览
  }
}

// ===== 联系表单 =====

export async function submitContact(data: {
  name: string;
  email: string;
  content: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return { ok: false, error: "网络异常，请稍后重试" };
  }
}

// ===== 共创投稿 =====

export interface CommunityPost {
  id: number;
  title: string;
  author: string;
  content?: string;
  tags: string;
  approved: number;
  created_at: string;
}

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const res = await fetch(`${API_BASE}/api/community`);
    if (!res.ok) throw new Error(`投稿加载失败: ${res.status}`);
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchCommunityPost(id: number): Promise<CommunityPost | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  try {
    const res = await fetch(`${API_BASE}/api/community/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function submitCommunityPost(data: {
  title: string;
  author: string;
  content: string;
  tags?: string;
}) {
  try {
    const res = await fetch(`${API_BASE}/api/community`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return { ok: false, error: "网络异常，请稍后重试" };
  }
}
