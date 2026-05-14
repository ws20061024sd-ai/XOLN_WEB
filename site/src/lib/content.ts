import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ContentMeta, ContentItem } from "./types";

export type { ContentMeta, ContentItem };

const contentRoot = path.join(process.cwd(), "content");

/** 读取单页 .md（如 about.md）——不需要 frontmatter */
export function getSinglePage(slug: string): { title: string; content: string } {
  const filePath = path.join(contentRoot, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return { title: slug, content: "内容尚未编写。" };
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");
  let title = slug;
  let contentStart = 0;
  if (lines[0]?.startsWith("# ")) {
    title = lines[0].slice(2).trim();
    contentStart = 1;
  }
  return { title, content: lines.slice(contentStart).join("\n").trim() };
}

/** 读取某个栏目下所有 .md 文件的元数据（按日期倒序） */
export function getContentList(section: string): ContentMeta[] {
  const dir = path.join(contentRoot, section);
  if (!fs.existsSync(dir)) return [];

  const items = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data } = matter(raw);
      return {
        slug: f.replace(/\.md$/, ""),
        title: data.title || f.replace(/\.md$/, ""),
        date: data.date || "",
        description: data.description || "",
        tags: data.tags || [],
        order: data.order as number | undefined,
      };
    });

  // 如果全部有 order，按 order 升序；否则按日期降序
  const allHaveOrder = items.every((x) => x.order != null);
  if (allHaveOrder) {
    items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  } else {
    items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }

  return items;
}

/** 读取栏目下某一篇 .md 的完整内容 */
export function getContentItem(section: string, slug: string): ContentItem | null {
  const filePath = path.join(contentRoot, section, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    description: data.description || "",
    tags: data.tags || [],
    content: content.trim(),
  };
}

/** 获取所有栏目下的全部内容（为搜索索引用） */
export function getAllContent(): ContentItem[] {
  const sections = fs
    .readdirSync(contentRoot)
    .filter((f) => fs.statSync(path.join(contentRoot, f)).isDirectory());

  return sections.flatMap((section) => {
    return fs
      .readdirSync(path.join(contentRoot, section))
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const slug = f.replace(/\.md$/, "");
        const item = getContentItem(section, slug);
        return { ...item!, section } as ContentItem & { section: string };
      });
  });
}

export const sections = ["beliefs", "works", "favorites", "changelog", "misc"] as const;

export const sectionLabels: Record<string, string> = {
  beliefs: "观念",
  works: "作品",
  favorites: "喜爱",
  changelog: "更新",
  misc: "杂项",
};
