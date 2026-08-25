import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import matter from "gray-matter";

export interface ContentUpdate {
  title: string;      // 文章标题
  section: string;    // 栏目（beliefs/works/favorites/misc）
  href: string;       // 跳转链接
  date: string;       // 提交日期 YYYY-MM-DD
}

// 内容动态不包含 changelog（那是技术方向，属于更新日志栏目）
const UPDATE_SECTIONS = ["beliefs", "works", "favorites", "misc"] as const;

const contentRoot = path.join(process.cwd(), "content");

/** 用 git 提交历史扫描 content/ 下所有内容更新（每次提交一条） */
export function getContentUpdates(): ContentUpdate[] {
  const updates: ContentUpdate[] = [];
  const projectRoot = path.join(process.cwd(), "..");

  let log = "";
  try {
    log = execSync(
      `git log --date=format:%Y-%m-%d --format=%ad --name-only -- site/content/`,
      { cwd: projectRoot, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 }
    );
  } catch {
    return []; // 不是 git 仓库时静默降级
  }

  // 解析：每段 = 日期行 + 空行 + 文件名列表
  const blocks = log.split("\n\n");
  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);
    if (lines.length < 2) continue;
    const date = lines[0].trim();

    for (const file of lines.slice(1)) {
      if (!file.endsWith(".md")) continue;
      const rel = file.replace("site/content/", "");
      const [section, ...rest] = rel.split("/");
      if (!UPDATE_SECTIONS.includes(section as any)) continue;

      const slug = rest.join("/").replace(/\.md$/, "");
      const filePath = path.join(contentRoot, section as string, `${slug}.md`);
      if (!fs.existsSync(filePath)) continue;

      let title = "";
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        title = data.title || "";
      } catch {
        continue;
      }
      if (!title) continue; // 空模板跳过

      updates.push({
        title,
        section: section as string,
        href: `/${section}/${slug}`,
        date,
      });
    }
  }

  // 按日期倒序（新的在前）
  updates.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return updates;
}
