import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content", "pages");

export interface PageContent {
  title: string;
  content: string;
}

export function getPageContent(slug: string): PageContent {
  const filePath = path.join(contentDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return { title: slug, content: "内容尚未编写。" };
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  // 简单解析：第一行 # 标题作为 title，其余为 content
  const lines = raw.split("\n");
  let title = slug;
  let contentStart = 0;

  if (lines[0]?.startsWith("# ")) {
    title = lines[0].slice(2).trim();
    contentStart = 1;
  }

  const content = lines.slice(contentStart).join("\n").trim();

  return { title, content };
}
