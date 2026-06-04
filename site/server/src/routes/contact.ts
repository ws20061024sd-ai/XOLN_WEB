import { Hono } from "hono";
import { getDb, saveDb } from "../db/schema.js";

const contact = new Hono();

contact.post("/", async (c) => {
  const { name, email, content } = await c.req.json();
  if (!name || !email || !content) {
    return c.json({ ok: false, error: "请填写所有字段" }, 400);
  }
  if (content.length > 5000) {
    return c.json({ ok: false, error: "内容过长" }, 400);
  }
  const db = await getDb();
  db.run("INSERT INTO messages (name, email, content, created_at) VALUES (?, ?, ?, datetime('now', '+8 hours'))", [
    name,
    email,
    content,
  ]);
  saveDb();
  return c.json({ ok: true, msg: "消息已发送" }, 201);
});

export default contact;
