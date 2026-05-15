import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import comments from "./routes/comments.js";
import stats from "./routes/stats.js";
import contact from "./routes/contact.js";
import admin from "./routes/admin.js";

const app = new Hono();

// CORS：仅允许你的域名
app.use(
  "/api/*",
  cors({
    origin: [
      "https://xolnxoln.cn",
      "https://www.xolnxoln.cn",
      "http://localhost:3099",
      "http://localhost:3000",
    ],
    allowMethods: ["GET", "POST"],
  })
);

// 限流中间件（简易版：每 IP 每秒最多 5 次请求）
const rateLimit = new Map<string, { count: number; reset: number }>();
app.use("/api/*", async (c, next) => {
  const ip =
    c.req.header("x-real-ip") ||
    c.req.header("x-forwarded-for") ||
    "unknown";
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (entry && now < entry.reset) {
    if (entry.count >= 5) {
      return c.json({ error: "请求过于频繁" }, 429);
    }
    entry.count++;
  } else {
    rateLimit.set(ip, { count: 1, reset: now + 1000 });
  }

  await next();
});

// 路由挂载
app.route("/api/comments", comments);
app.route("/api/stats", stats);
app.route("/api/contact", contact);
app.route("/api/admin", admin);

// 健康检查
app.get("/api/health", (c) => c.json({ ok: true, time: new Date().toISOString() }));

const port = Number(process.env.PORT) || 3001;
console.log(`API 服务启动: http://0.0.0.0:${port}`);
serve({ fetch: app.fetch, port });
