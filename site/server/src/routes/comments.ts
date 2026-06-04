import { Hono } from "hono";
import { getDb, saveDb } from "../db/schema.js";

const comments = new Hono();

// 获取某篇的评论
comments.get("/:slug", async (c) => {
  const db = await getDb();
  const slug = c.req.param("slug");
  const stmt = db.prepare(
    "SELECT id, slug, section, author, content, created_at FROM comments WHERE slug = ? AND approved = 1 ORDER BY created_at DESC"
  );
  stmt.bind([slug]);
  const rows: unknown[] = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return c.json(rows);
});

// 提交评论
comments.post("/", async (c) => {
  const { slug, section, author, content } = await c.req.json();
  if (!slug || !author || !content) {
    return c.json({ ok: false, error: "请填写所有字段" }, 400);
  }
  if (author.length > 50 || content.length > 5000) {
    return c.json({ ok: false, error: "内容过长" }, 400);
  }
  const db = await getDb();
  db.run("INSERT INTO comments (slug, section, author, content, approved, created_at) VALUES (?, ?, ?, ?, 1, datetime('now', '+8 hours'))", [
    slug,
    section || "",
    author,
    content,
  ]);
  saveDb();
  return c.json({ ok: true, msg: "评论已提交" }, 201);
});

export default comments;
