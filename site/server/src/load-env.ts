import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 开发环境自动加载 server/.env（生产环境由 docker compose 注入环境变量）
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
const loadEnvFile = (process as unknown as { loadEnvFile?: (file: string) => void })
  .loadEnvFile;

if (existsSync(envPath) && typeof loadEnvFile === "function") {
  try {
    loadEnvFile(envPath);
  } catch (err) {
    console.warn(`[env] 读取 ${envPath} 失败:`, err);
  }
}
