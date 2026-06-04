import { Hono } from "hono";
import { getDb, saveDb } from "../db/schema.js";

const stats = new Hono();

stats.post("/pageview", async (c) => {
  const { path } = await c.req.json();
  if (!path) return c.json({ ok: false }, 400);
  const db = await getDb();
  db.run("INSERT INTO pageviews (path, ip, created_at) VALUES (?, ?, datetime('now', '+8 hours'))", [
    path,
    c.req.header("x-real-ip") || "",
  ]);
  saveDb();
  return c.json({ ok: true });
});

stats.get("/top", async (c) => {
  const db = await getDb();
  const results = db.exec(
    "SELECT path, COUNT(*) as count FROM pageviews GROUP BY path ORDER BY count DESC LIMIT 10"
  );
  const columns = results[0]?.columns || [];
  const values = results[0]?.values || [];
  const rows = values.map((row: any[]) =>
    Object.fromEntries(columns.map((col: string, i: number) => [col, row[i]]))
  );
  return c.json(rows);
});

stats.get("/summary", async (c) => {
  const db = await getDb();
  const pvResult = db.exec("SELECT COUNT(*) as pv FROM pageviews");
  const commentResult = db.exec(
    "SELECT COUNT(*) as count FROM comments WHERE approved = 1"
  );
  const pv =
    pvResult[0]?.values?.[0]?.[0] ?? 0;
  const commentCount =
    commentResult[0]?.values?.[0]?.[0] ?? 0;
  return c.json({ pv: Number(pv), comments: Number(commentCount) });
});

export default stats;
