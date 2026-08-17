#!/usr/bin/env node
/**
 * 将量化仪表盘静态文件上传到 COS 的 works/quant/ 前缀。
 *
 * 博客 /works/quant 页面通过 iframe 加载 /works/quant/index.html，
 * 因此量化项目生成 output 后，需要运行本脚本同步一次。
 *
 * 用法：
 *   node upload-quant.js
 *   QUANT_OUTPUT_DIR=/path/to/output node upload-quant.js
 *
 * 需要环境变量：COS_SECRET_ID、COS_SECRET_KEY
 */

const Cos = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const path = require("path");

const secretId = process.env.COS_SECRET_ID;
const secretKey = process.env.COS_SECRET_KEY;
const bucket = "xolnxoln-1431302682";
const region = "ap-guangzhou";
const remotePrefix = "works/quant/";
const concurrency = 10;

// 默认量化项目输出目录（博客与量化目录同级）
const quantOutDir =
  process.env.QUANT_OUTPUT_DIR ||
  path.resolve(__dirname, "..", "..", "量化", "web", "output");

if (!secretId || !secretKey) {
  console.error("请设置环境变量 COS_SECRET_ID 和 COS_SECRET_KEY");
  process.exit(1);
}

if (!fs.existsSync(quantOutDir)) {
  console.error(`量化仪表盘输出目录不存在: ${quantOutDir}`);
  console.error("请先在量化项目运行 web/generate.py，或通过 QUANT_OUTPUT_DIR 指定目录。");
  process.exit(1);
}

const cos = new Cos({ SecretId: secretId, SecretKey: secretKey });

const mimeMap = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeMap[ext] || "application/octet-stream";
}

function walk(dir, fileList = []) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function uploadFile(key, filePath, attempts = 3) {
  const contentType = getMimeType(filePath);
  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        cos.putObject(
          { Bucket: bucket, Region: region, Key: key, Body: fs.createReadStream(filePath), ContentType: contentType },
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      return;
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300 * (i + 1)));
      }
    }
  }
  throw lastErr;
}

async function main() {
  const files = walk(quantOutDir);
  const entries = files.map((filePath) => ({
    key: remotePrefix + path.relative(quantOutDir, filePath).split(path.sep).join("/"),
    filePath,
  }));

  if (entries.length === 0) {
    console.error("量化仪表盘输出目录为空，没有可上传的文件。");
    process.exit(1);
  }

  console.log(`准备上传 ${entries.length} 个文件到 COS 前缀 ${remotePrefix}`);

  let ok = 0;
  let fail = 0;
  let idx = 0;
  const failedKeys = [];

  async function worker() {
    while (idx < entries.length) {
      const i = idx++;
      const { key, filePath } = entries[i];
      try {
        await uploadFile(key, filePath);
        ok++;
      } catch (e) {
        fail++;
        failedKeys.push(key);
        console.error(`  ✗ ${key}: ${e.message}`);
      }
      const done = ok + fail;
      if (done % 50 === 0 || done === entries.length) {
        process.stdout.write(`  ${done}/${entries.length}\n`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, entries.length) }, () => worker())
  );

  console.log(`\n量化仪表盘上传完成: ${ok} 成功, ${fail} 失败`);
  if (fail > 0) {
    console.error("失败文件：\n  " + failedKeys.join("\n  "));
    process.exitCode = 1;
  } else {
    console.log("请到 CDN 控制台刷新缓存。");
  }
}

main().catch((err) => {
  console.error("上传中断:", err.message);
  process.exit(1);
});
