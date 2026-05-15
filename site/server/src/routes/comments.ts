import { Hono } from "hono";
import { db } from "../db/schema.js";

const comments = new Hono();

// 获取某篇的评论（仅已审核的）
comments.get("/:slug", (c) => {
  const slug = c.req.param("slug");
  const rows = db
    .prepare(
      "SELECT id, slug, section, author, content, created_at FROM comments WHERE slug = ? AND approved = 1 ORDER BY created_at DESC"
    )
    .all(slug);
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
  db.prepare(
    "INSERT INTO comments (slug, section, author, content) VALUES (?, ?, ?, ?)"
  ).run(slug, section || "", author, content);
  return c.json({ ok: true, msg: "评论已提交，审核后显示" }, 201);
});

export default comments;
