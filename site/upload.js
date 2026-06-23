const Cos = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const secretId = process.env.COS_SECRET_ID;
const secretKey = process.env.COS_SECRET_KEY;
const bucket = "xolnxoln-1431302682";
const region = "ap-guangzhou";
const outDir = path.join(__dirname, "out");
const manifestKey = "upload-manifest.json";

const forceFull = process.argv.includes("--force");

if (!secretId || !secretKey) {
  console.error("请设置环境变量 COS_SECRET_ID 和 COS_SECRET_KEY");
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
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

/** 计算 out/ 下所有文件到 key → hash 的映射 */
function buildLocalManifest(files) {
  const map = {};
  for (const f of files) {
    const key = f.replace(outDir + "/", "");
    map[key] = hashFile(f);
  }
  return map;
}

/** 从 COS 下载旧 manifest */
async function fetchRemoteManifest() {
  return new Promise((resolve) => {
    cos.getObject({ Bucket: bucket, Region: region, Key: manifestKey }, (err, data) => {
      if (err) return resolve(null); // 不存在或读不到，当首次上传
      try {
        resolve(JSON.parse(data.Body.toString()));
      } catch {
        resolve(null);
      }
    });
  });
}

/** 上传单个文件 */
async function uploadFile(key, filePath) {
  const contentType = getMimeType(filePath);
  return new Promise((resolve, reject) => {
    cos.putObject(
      { Bucket: bucket, Region: region, Key: key, Body: fs.createReadStream(filePath), ContentType: contentType },
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/** 上传 manifest JSON */
async function uploadManifest(manifest) {
  const body = JSON.stringify(manifest);
  return new Promise((resolve, reject) => {
    cos.putObject(
      { Bucket: bucket, Region: region, Key: manifestKey, Body: Buffer.from(body), ContentType: "application/json" },
      (err) => resolve() // manifest 上传失败不阻塞
    );
  });
}

/** 批量删除 COS 文件 */
async function deleteFiles(keys) {
  if (keys.length === 0) return;
  // 每批最多 500 个
  for (let i = 0; i < keys.length; i += 500) {
    const batch = keys.slice(i, i + 500).map(k => ({ Key: k }));
    await new Promise((resolve) => {
      cos.deleteMultipleObject({ Bucket: bucket, Region: region, Objects: batch }, () => resolve());
    });
  }
}

async function main() {
  const localFiles = walk(outDir);
  const localManifest = buildLocalManifest(localFiles);
  const localKeys = Object.keys(localManifest);

  let remoteManifest = null;
  if (!forceFull) {
    process.stdout.write("检查 COS 差异... ");
    remoteManifest = await fetchRemoteManifest();
    console.log(remoteManifest ? "找到旧 manifest" : "首次上传（全量）");
  } else {
    console.log("--force 模式：全量上传");
  }

  // 计算差异
  let toUpload = [];
  let toDelete = [];
  let skipped = 0;

  if (remoteManifest && !forceFull) {
    const remoteKeys = new Set(Object.keys(remoteManifest));

    for (const key of localKeys) {
      if (!remoteKeys.has(key) || remoteManifest[key] !== localManifest[key]) {
        toUpload.push(key);
      } else {
        skipped++;
      }
    }

    // 本地已删但 COS 还有的
    for (const key of remoteKeys) {
      if (!localManifest[key] && key !== manifestKey) {
        toDelete.push(key);
      }
    }
  } else {
    toUpload = localKeys;
  }

  console.log(`新增/变更: ${toUpload.length}  跳过: ${skipped}  待删除: ${toDelete.length}`);

  // 删除
  if (toDelete.length > 0) {
    process.stdout.write("清理旧文件... ");
    await deleteFiles(toDelete);
    console.log("done");
  }

  // 上传
  if (toUpload.length === 0) {
    console.log("\n无需上传，所有文件已是最新。");
    return;
  }

  console.log("");
  let ok = 0, fail = 0, idx = 0;
  const concurrency = 10; // 并发数

  async function worker() {
    while (idx < toUpload.length) {
      const i = idx++;
      const key = toUpload[i];
      const filePath = path.join(outDir, key);
      try {
        await uploadFile(key, filePath);
        ok++;
      } catch (e) {
        fail++;
        console.error(`  ✗ ${key}: ${e.message}`);
      }
      const done = ok + fail;
      if (done % 50 === 0 || done === toUpload.length) process.stdout.write(`  ${done}/${toUpload.length}\n`);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, toUpload.length) }, () => worker());
  await Promise.all(workers);
  console.log(`\n上传完成: ${ok} 成功, ${fail} 失败, ${skipped} 跳过`);

  // 更新 manifest
  await uploadManifest(localManifest);
  console.log("manifest 已更新");
  console.log("请到 CDN 控制台刷新缓存。");
}

main().catch((err) => {
  console.error("上传中断:", err.message);
  process.exit(1);
});
