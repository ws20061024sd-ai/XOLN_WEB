import { Hono } from "hono";
import { getDb, saveDb } from "../db/schema.js";

const guestbook = new Hono();

// 获取留言列表
guestbook.get("/", async (c) => {
  const db = await getDb();
  const result = db.exec(
    "SELECT id, author, content, created_at FROM guestbook WHERE approved = 1 ORDER BY created_at DESC LIMIT 100"
  );
  const cols = result[0]?.columns || [];
  const rows = (result[0]?.values || []).map((r: unknown[]) =>
    Object.fromEntries(cols.map((c: string, i: number) => [c, r[i]]))
  );
  return c.json(rows);
});

// 提交留言
guestbook.post("/", async (c) => {
  const { author, content } = await c.req.json();
  if (!author || !content) return c.json({ ok: false, error: "请填写昵称和内容" }, 400);
  if (author.length > 50 || content.length > 2000) return c.json({ ok: false, error: "内容过长" }, 400);
  const db = await getDb();
  db.run("INSERT INTO guestbook (author, content, created_at) VALUES (?, ?, datetime('now', '+8 hours'))", [author, content]);
  saveDb();
  return c.json({ ok: true, msg: "留言成功" }, 201);
});

export default guestbook;
