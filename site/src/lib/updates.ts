import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";

export interface ContentUpdateFile {
  title: string;      // 文章标题
  section: string;    // 栏目
  href: string;       // 跳转链接
  snippets: string[]; // 本次新增的内容摘录
}

export interface ContentUpdate {
  date: string;       // 提交日期 YYYY-MM-DD
  message: string;    // 提交说明
  files: ContentUpdateFile[];
}

// 内容动态不包含 changelog（那是技术方向，属于更新日志栏目）
const UPDATE_SECTIONS = ["beliefs", "works", "favorites", "misc"] as const;
const MAX_SNIPPETS = 3;   // 每个文件最多展示的新增摘录数
const SNIPPET_LEN = 45;   // 每条摘录最大字数

const contentRoot = path.join(process.cwd(), "content");

/** 过滤 markdown 格式噪音，只保留有实质内容的新增行 */
function cleanLine(line: string): string | null {
  const t = line.trim();
  if (!t) return null;
  // 只过滤结构性行：标题/引用/表格/代码/分割线/图片
  if (t.startsWith("#") || t.startsWith(">") || t.startsWith("|")
    || t.startsWith("```") || t.startsWith("---") || t.startsWith("![")) return null;
  // 去掉列表符号后仍无实质内容的
  let bare = t.replace(/^[-*]\s+/, "").replace(/\*\*/g, "").trim();
  if (!bare) return null;
  // 没有中英文或数字 = 纯符号行
  if (!/[一-龥A-Za-z0-9]/.test(bare)) return null;
  // 太短的行（标题式碎片）跳过
  if (bare.length < 8) return null;
  return bare.length > SNIPPET_LEN ? bare.slice(0, SNIPPET_LEN) + "…" : bare;
}

/** 用 git 提交历史扫描 content/ 下所有内容更新（按提交分组，带新增内容摘录） */
export function getContentUpdates(): ContentUpdate[] {
  const updates: ContentUpdate[] = [];
  const projectRoot = path.join(process.cwd(), "..");

  let log = "";
  try {
    log = execSync(
      `git log -p --format="%H|%ad|%s" --date=format:%Y-%m-%d -- site/content/`,
      { cwd: projectRoot, encoding: "utf-8", maxBuffer: 50 * 1024 * 1024 }
    );
  } catch {
    return []; // 不是 git 仓库时静默降级
  }

  // 逐行解析：commit 头（hash|date|message）→ diff 块（diff --git → +行）
  let current: ContentUpdate | null = null;
  let currentFile: ContentUpdateFile | null = null;

  const commitRe = /^([0-9a-f]{7,40})\|(\d{4}-\d{2}-\d{2})\|(.*)$/;
  const lines = log.split("\n");

  for (const line of lines) {
    const m = line.match(commitRe);
    if (m) {
      // 新提交开始：完成上一个
      if (current) updates.push(current);
      current = { date: m[2], message: m[3], files: [] };
      currentFile = null;
      continue;
    }

    if (!current) continue;

    const diffMatch = line.match(/^diff --git a\/site\/content\/(.+) b\//);
    if (diffMatch) {
      // 新文件开始
      currentFile = null;
      const rel = diffMatch[1];
      const [section, ...rest] = rel.split("/");
      if (!UPDATE_SECTIONS.includes(section as any)) continue;

      const slug = rest.join("/").replace(/\.md$/, "");
      // 跳过 _ 开头的元数据文件（如 _index.md）：它们不生成页面，链接会 404
      if (rest.some((seg) => seg.startsWith("_"))) continue;
      const filePath = path.join(contentRoot, section as string, `${slug}.md`);
      if (!fs.existsSync(filePath)) continue;

      let title = "";
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        title = data.title || "";
      } catch { /* 跳过损坏文件 */ }
      if (!title) continue; // 空模板跳过

      currentFile = {
        title,
        section: section as string,
        href: `/${section}/${slug}`,
        snippets: [],
      };
      current.files.push(currentFile);
      continue;
    }

    // 收集新增行（排除 +++ 文件头）
    if (currentFile && line.startsWith("+") && !line.startsWith("+++")) {
      if (currentFile.snippets.length >= MAX_SNIPPETS) continue;
      const cleaned = cleanLine(line.slice(1));
      if (cleaned) currentFile.snippets.push(cleaned);
    }
  }
  if (current) updates.push(current);

  // 去掉没有任何内容摘要的提交（纯删除/重命名等）
  return updates.filter((u) => u.files.length > 0);
}
