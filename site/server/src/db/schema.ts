import initSqlJs, { type Database } from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "..", "data", "blog.db");
const dirPath = path.dirname(dbPath);

let db: Database | undefined;
let dbPromise: Promise<Database> | null = null;

async function initDb(): Promise<Database> {
  fs.mkdirSync(dirPath, { recursive: true });

  const SQL = await initSqlJs();
  let instance: Database;
  if (fs.existsSync(dbPath)) {
    const buf = fs.readFileSync(dbPath);
    instance = new SQL.Database(buf);
  } else {
    instance = new SQL.Database();
  }

  // 建表
  instance.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    section TEXT NOT NULL DEFAULT '',
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    approved INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT datetime('now', '+8 hours')
  )`);
  instance.run(`CREATE TABLE IF NOT EXISTS pageviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    ip TEXT,
    created_at DATETIME DEFAULT datetime('now', '+8 hours')
  )`);
  instance.run(`CREATE TABLE IF NOT EXISTS guestbook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    approved INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT datetime('now', '+8 hours')
  )`);
  instance.run(`CREATE TABLE IF NOT EXISTS community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT DEFAULT '',
    approved INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT datetime('now', '+8 hours')
  )`);
  instance.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    \`read\` INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT datetime('now', '+8 hours')
  )`);

  return instance;
}

export async function getDb(): Promise<Database> {
  // 复用同一个初始化 Promise，避免并发首次调用时创建多个数据库实例
  if (db) return db;
  if (!dbPromise) {
    dbPromise = initDb()
      .then((instance) => {
        db = instance;
        return instance;
      })
      .finally(() => {
        dbPromise = null;
      });
  }
  return dbPromise;
}

export function saveDb() {
  if (!db) return;
  const data = db.export();
  // 先写临时文件再原子替换，避免写一半崩溃导致数据库损坏
  const tmpPath = `${dbPath}.tmp`;
  fs.writeFileSync(tmpPath, Buffer.from(data));
  fs.renameSync(tmpPath, dbPath);
}
