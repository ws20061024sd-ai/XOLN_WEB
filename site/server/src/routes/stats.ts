import { Hono } from "hono";
import { db } from "../db/schema.js";

const stats = new Hono();

// 记录页面访问
stats.post("/pageview", async (c) => {
  const { path } = await c.req.json();
  if (!path) return c.json({ ok: false }, 400);

  db.prepare("INSERT INTO pageviews (path, ip) VALUES (?, ?)").run(
    path,
    c.req.header("x-real-ip") || ""
  );

  return c.json({ ok: true });
});

// Top 10 访问页面
stats.get("/top", (c) => {
  const rows = db
    .prepare(
      "SELECT path, COUNT(*) as count FROM pageviews GROUP BY path ORDER BY count DESC LIMIT 10"
    )
    .all();
  return c.json(rows);
});

// 总览
stats.get("/summary", (c) => {
  const total = db.prepare("SELECT COUNT(*) as pv FROM pageviews").get() as {
    pv: number;
  };
  const comments = db
    .prepare("SELECT COUNT(*) as count FROM comments WHERE approved = 1")
    .get() as { count: number };
  return c.json({ pv: total.pv, comments: comments.count });
});

export default stats;
