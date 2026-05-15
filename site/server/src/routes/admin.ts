import { Hono } from "hono";
import { getDb, saveDb } from "../db/schema.js";

const ADMIN_KEY = process.env.ADMIN_KEY || "admin123";

const admin = new Hono();

// 密钥校验中间件
admin.use("/api/admin/*", async (c, next) => {
  const key = c.req.header("x-admin-key");
  if (key !== ADMIN_KEY) {
    return c.json({ error: "未授权" }, 401);
  }
  await next();
});

// 所有评论（含未审核）
admin.get("/comments", async (c) => {
  const db = await getDb();
  const result = db.exec(
    "SELECT * FROM comments ORDER BY created_at DESC LIMIT 100"
  );
  const cols = result[0]?.columns || [];
  const rows = (result[0]?.values || []).map((r: unknown[]) =>
    Object.fromEntries(cols.map((c: string, i: number) => [c, r[i]]))
  );
  return c.json(rows);
});

// 切换审核状态
admin.patch("/comments/:id", async (c) => {
  const db = await getDb();
  const id = c.req.param("id");
  const { approved } = await c.req.json();
  db.run("UPDATE comments SET approved = ? WHERE id = ?", [approved ? 1 : 0, id]);
  saveDb();
  return c.json({ ok: true });
});

// 删除评论
admin.delete("/comments/:id", async (c) => {
  const db = await getDb();
  const id = c.req.param("id");
  db.run("DELETE FROM comments WHERE id = ?", [id]);
  saveDb();
  return c.json({ ok: true });
});

// 联系消息
admin.get("/messages", async (c) => {
  const db = await getDb();
  const result = db.exec(
    "SELECT * FROM messages ORDER BY created_at DESC LIMIT 100"
  );
  const cols = result[0]?.columns || [];
  const rows = (result[0]?.values || []).map((r: unknown[]) =>
    Object.fromEntries(cols.map((c: string, i: number) => [c, r[i]]))
  );
  return c.json(rows);
});

// 统计详情
admin.get("/stats", async (c) => {
  const db = await getDb();
  const topResult = db.exec(
    "SELECT path, COUNT(*) as count FROM pageviews GROUP BY path ORDER BY count DESC LIMIT 20"
  );
  const pvResult = db.exec("SELECT COUNT(*) as pv FROM pageviews");
  const todayResult = db.exec(
    "SELECT COUNT(*) as count FROM pageviews WHERE date(created_at) = date('now')"
  );
  const cols = topResult[0]?.columns || [];
  const top = (topResult[0]?.values || []).map((r: unknown[]) =>
    Object.fromEntries(cols.map((c: string, i: number) => [c, r[i]]))
  );
  return c.json({
    pv: Number(pvResult[0]?.values?.[0]?.[0] ?? 0),
    today: Number(todayResult[0]?.values?.[0]?.[0] ?? 0),
    top,
  });
});

export default admin;
