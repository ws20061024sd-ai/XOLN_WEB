#!/usr/bin/env node
/**
 * 路名档案（大作业）→ COS 的 works/road/ 前缀。
 *
 * 和 upload-quant.js 同一套做法：**整个静态目录原样上传，不进博客构建、
 * 不建博客入口页**。上线地址：
 *
 *     https://xolnxoln.cn/works/road/index.html
 *
 * 用法：
 *   node upload-road.js            # 上传
 *   node upload-road.js --dry-run  # 只列清单和体积，不传
 *
 * 需要环境变量：COS_SECRET_ID、COS_SECRET_KEY（和 upload.js 一样）。
 * 可选：ROAD_OUT_DIR 覆盖源目录。
 *
 * ★ 为什么是白名单而不是整个目录：源目录里还有 `sketch/*.html`（约 20 个
 *   草图源文件）和几十张 PNG 截图，它们**不是页面的一部分**，传上去等于
 *   把工作稿公开了。这份清单是**用真实滚动抓出来的**（整页滚完请求哪些文件，
 *   就传哪些，零 404）—— **改了页面结构就要重抓**，否则新文件会漏传、
 *   页面线上 404。
 *
 *   ★ 2026-09-29 重抓：12 → **11** 个。删北京那一块之后，
 *     `sketch/sanjing-data.js`（大栅栏那九条路名的坐标）不再被请求。
 */

const Cos = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const path = require("path");

const secretId = process.env.COS_SECRET_ID;
const secretKey = process.env.COS_SECRET_KEY;
const bucket = "xolnxoln-1431302682";
const region = "ap-guangzhou";
const remotePrefix = "works/road/";
const concurrency = 4;

const outDir =
  process.env.ROAD_OUT_DIR ||
  "/Users/xoln/Desktop/陈枫图表设计实践/大作业/out/v2";

const FILES = [
  "index.html",
  "act.css",
  "data.js",
  "geom.js",
  "points-meta.js",
  "points.bin",
  "sketch/chaozong-data.js",
  "sketch/coverage-data.js",
  "sketch/crossnames-data.js",
  "sketch/gates-data.js",
  "sketch/tails-data.js",
];

const dryRun = process.argv.includes("--dry-run");

if (!dryRun && (!secretId || !secretKey)) {
  console.error(
    "请设置环境变量 COS_SECRET_ID 和 COS_SECRET_KEY（跑法同 upload.js）。"
  );
  process.exit(1);
}
if (!fs.existsSync(outDir)) {
  console.error(`源目录不存在: ${outDir}\n用 ROAD_OUT_DIR 指定别的位置。`);
  process.exit(1);
}

const cos = dryRun ? null : new Cos({ SecretId: secretId, SecretKey: secretKey });

const mimeMap = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".bin": "application/octet-stream",
};

function getMimeType(filePath) {
  return mimeMap[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

const entries = FILES.map((rel) => ({
  key: remotePrefix + rel,
  filePath: path.join(outDir, rel),
  rel,
}));

const missing = entries.filter((e) => !fs.existsSync(e.filePath));
if (missing.length) {
  console.error("这些文件在源目录里不存在，先重新构建：");
  missing.forEach((m) => console.error("  " + m.rel));
  process.exit(1);
}

const totalBytes = entries.reduce((n, e) => n + fs.statSync(e.filePath).size, 0);
console.log(
  `准备上传 ${entries.length} 个文件到 COS 前缀 ${remotePrefix}` +
    `（合计 ${(totalBytes / 1048576).toFixed(1)} MB）`
);
entries.forEach((e) =>
  console.log(
    `  ${(fs.statSync(e.filePath).size / 1024).toFixed(0).padStart(7)} KB  ${e.rel}`
  )
);

if (dryRun) {
  console.log("\n--dry-run：没有真的上传。");
  process.exit(0);
}

async function uploadFile(entry, attempts = 3) {
  const contentType = getMimeType(entry.filePath);
  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        cos.putObject(
          {
            Bucket: bucket,
            Region: region,
            Key: entry.key,
            Body: fs.createReadStream(entry.filePath),
            ContentType: contentType,
          },
          (err) => (err ? reject(err) : resolve())
        );
      });
      return;
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 300 * (i + 1)));
      }
    }
  }
  throw lastErr;
}

(async () => {
  let ok = 0;
  const failed = [];
  let idx = 0;
  async function worker() {
    while (idx < entries.length) {
      const e = entries[idx++];
      try {
        await uploadFile(e);
        ok++;
        console.log(`  ✓ ${e.key}`);
      } catch (err) {
        failed.push(e.key + " : " + err.message);
        console.error(`  ✗ ${e.key}: ${err.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  console.log(`\n上传完成: ${ok} 成功, ${failed.length} 失败`);
  if (failed.length) {
    console.error("失败文件：\n  " + failed.join("\n  "));
    process.exitCode = 1;
  } else {
    console.log("去 CDN 控制台刷新缓存，然后验证：");
    console.log("  curl -sI https://xolnxoln.cn/works/road/index.html");
    console.log("  curl -sI https://xolnxoln.cn/works/road/points.bin");
  }
})();
