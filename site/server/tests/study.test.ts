import assert from "node:assert/strict";
import fs from "node:fs";
import { Hono } from "hono";
// Run in an isolated copy of server/ to keep the test database separate from real data.
assert.equal(process.env.STUDY_TEST_ISOLATED, "true", "Run this test only against an isolated server copy.");
const testDb = new URL("../data/blog.db", import.meta.url);
assert.ok(!fs.existsSync(testDb), "Refusing to touch an existing database.");
assert.ok(testDb.pathname.startsWith("/private/tmp/") || testDb.pathname.startsWith("/tmp/"), "Use a disposable copy under /tmp.");
const { default: study } = await import("../src/routes/study.js");
const app = new Hono().route("/api/study", study);
let result = await app.request("/api/study/status");
assert.equal((await result.json()).configured, false);
result = await app.request("/api/study/feedback", { method: "POST" }); assert.equal(result.status, 503);
process.env.STUDY_AI_KEY = "test-only-not-a-real-key";
process.env.STUDY_SUPABASE_URL = "https://auth.invalid";
process.env.STUDY_SUPABASE_ANON_KEY = "test-only";
process.env.STUDY_ALLOWED_USER_ID = "private-test-user";
let providerCalls = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = (async (url: string | URL | Request) => {
  if (String(url).includes("auth.invalid")) return new Response(JSON.stringify({ id: "private-test-user" }), { status: 200 });
  assert.equal(String(url), "https://api.deepseek.com/chat/completions");
  providerCalls++;
  return new Response(JSON.stringify({ choices: [{ message: { content: "这是一条受控测试反馈。" } }] }), { status: 200 });
}) as typeof fetch;
try {
  result = await app.request("/api/study/feedback", { method: "POST" }); assert.equal(result.status, 401);
  const id = crypto.randomUUID();
  const request = () => app.request("/api/study/feedback", { method: "POST", headers: { Authorization: "Bearer test-token", "Content-Type": "application/json" }, body: JSON.stringify({ taskId: "t-001", draft: "自己的译文", requestId: id }) });
  result = await request(); assert.equal(result.status, 200);
  result = await request(); assert.equal(result.status, 200); assert.equal((await result.json()).cached, true);
  assert.equal(providerCalls, 1, "an identical request must not spend twice");
  process.env.STUDY_ALLOWED_USER_ID = "someone-else";
  result = await request(); assert.equal(result.status, 403);
  process.env.STUDY_ALLOWED_USER_ID = "private-test-user";
  process.env.STUDY_AI_RESERVE_YUAN = "16";
  result = await app.request("/api/study/feedback", { method: "POST", headers: { Authorization: "Bearer test-token", "Content-Type": "application/json" }, body: JSON.stringify({ taskId: "t-001", draft: "另一份稿件", requestId: crypto.randomUUID() }) });
  assert.equal(result.status, 429);assert.equal(providerCalls, 1);
  console.log("PASS AI configuration, authentication, owner restriction, idempotency and budget guard");
} finally { globalThis.fetch = realFetch; fs.rmSync(new URL("../data/blog.db", import.meta.url), { force: true }); }
