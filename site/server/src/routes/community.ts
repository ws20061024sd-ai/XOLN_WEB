import { Hono } from "hono";
import { getDb, saveDb } from "../db/schema.js";

const community = new Hono();

// 获取已审核文章列表
community.get("/", async (c) => {
  const db = await getDb();
  const result = db.exec(
    "SELECT id, title, author, tags, created_at FROM community_posts WHERE approved = 1 ORDER BY created_at DESC LIMIT 50"
  );
  const cols = result[0]?.columns || [];
  const rows = (result[0]?.values || []).map((r: unknown[]) =>
    Object.fromEntries(cols.map((c: string, i: number) => [c, r[i]]))
  );
  return c.json(rows);
});

// 获取单篇文章详情
community.get("/:id", async (c) => {
  const db = await getDb();
  const id = c.req.param("id");
  const stmt = db.prepare(
    "SELECT id, title, author, content, tags, created_at FROM community_posts WHERE id = ? AND approved = 1"
  );
  stmt.bind([Number(id)]);
  if (!stmt.step()) return c.json({ error: "不存在" }, 404);
  const row = stmt.getAsObject();
  stmt.free();
  return c.json(row);
});

// 提交投稿
community.post("/", async (c) => {
  const { title, author, content, tags } = await c.req.json();
  if (!title || !author || !content) return c.json({ ok: false, error: "标题、作者和内容不能为空" }, 400);
  if (title.length > 100 || author.length > 50 || content.length > 50000)
    return c.json({ ok: false, error: "内容过长" }, 400);
  const db = await getDb();
  db.run("INSERT INTO community_posts (title, author, content, tags, created_at) VALUES (?, ?, ?, ?, datetime('now', '+8 hours'))",
    [title, author, content, tags || ""]);
  saveDb();
  return c.json({ ok: true, msg: "投稿已提交，审核后显示" }, 201);
});

export default community;
