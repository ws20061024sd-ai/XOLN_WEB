const Cos = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const path = require("path");

const secretId = process.env.COS_SECRET_ID;
const secretKey = process.env.COS_SECRET_KEY;
const bucket = "xolnxoln-1431302682";
const region = "ap-guangzhou";
const outDir = path.join(__dirname, "out");

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

async function upload() {
  const files = walk(outDir);
  console.log(`共 ${files.length} 个文件待上传\n`);

  for (const filePath of files) {
    const key = filePath.replace(outDir + "/", "");
    const contentType = getMimeType(filePath);

    await new Promise((resolve, reject) => {
      cos.putObject(
        {
          Bucket: bucket,
          Region: region,
          Key: key,
          Body: fs.createReadStream(filePath),
          ContentType: contentType,
        },
        (err, data) => {
          if (err) {
            console.error(`  ✗ ${key} 上传失败: ${err.message}`);
            reject(err);
          } else {
            console.log(`  ✓ ${key} (${contentType})`);
            resolve(data);
          }
        }
      );
    });
  }

  console.log(`\n上传完成。请到 CDN 控制台刷新缓存。`);
}

upload().catch((err) => {
  console.error("上传中断:", err.message);
  process.exit(1);
});
