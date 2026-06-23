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

/** 获取所有栏目下的全部内容（为搜索索引用，递归遍历子目录） */
export function getAllContent(): (ContentItem & { section: string })[] {
  const sections = fs
    .readdirSync(contentRoot)
    .filter((f) => fs.statSync(path.join(contentRoot, f)).isDirectory());

  const results: (ContentItem & { section: string })[] = [];

  function walk(dir: string, section: string, prefix: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory() && !entry.startsWith("_")) {
        walk(full, section, prefix ? `${prefix}/${entry}` : entry);
      } else if (entry.endsWith(".md")) {
        const slugBase = entry.replace(/\.md$/, "");
        const slug = prefix ? `${prefix}/${slugBase}` : slugBase;
        try {
          const raw = fs.readFileSync(full, "utf-8");
          const { data, content } = matter(raw);
          results.push({
            slug,
            section,
            title: data.title || slugBase,
            date: data.date || "",
            description: data.description || "",
            tags: data.tags || [],
            content: content.trim(),
          });
        } catch {
          // 跳过损坏的文件
        }
      }
    }
  }

  for (const section of sections) {
    walk(path.join(contentRoot, section), section, "");
  }

  return results;
}

// ===== 作品栏目：递归目录树（支持多级文件夹） =====

export interface WorksNode {
  type: "directory" | "file";
  name: string;       // 目录名或文件名（不含 .md）
  title: string;      // 显示标题
  order?: number;     // 排序用
  children?: WorksNode[];
  // 仅文件：
  date?: string;
  description?: string;
  tags?: string[];
  content?: string;
}

function readWorksDir(dir: string): WorksNode[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir);

  const nodes: WorksNode[] = [];

  for (const name of entries) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      // 跳过下划线开头的隐藏目录
      if (name.startsWith("_")) continue;
      const children = readWorksDir(full);
      // 目录名直接做标题，或者可以用一个 _index.md 来定义目录元数据
      nodes.push({
        type: "directory",
        name,
        title: name,
        children,
      });
    } else if (name.endsWith(".md")) {
      const slug = name.replace(/\.md$/, "");
      const raw = fs.readFileSync(full, "utf-8");
      const { data, content } = matter(raw);
      nodes.push({
        type: "file",
        name: slug,
        title: data.title || slug,
        date: data.date || "",
        description: data.description || "",
        tags: data.tags || [],
        order: data.order as number | undefined,
        content: content.trim(),
      });
    }
    // 忽略非 .md 文件
  }

  // 排序：目录在前，按名称排；文件在后，有 order 按 order，否则按日期降序
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    if (a.type === "directory") return a.name.localeCompare(b.name);
    // both files
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    return (b.date || "").localeCompare(a.date || "");
  });

  return nodes;
}

/** 获取作品根目录树（/works 页面用） */
export function getWorksRoot(): WorksNode[] {
  return readWorksDir(path.join(contentRoot, "works"));
}

/** 根据 URL 路径段定位节点（/works/[...path] 用） */
export function getWorksNode(
  pathSegments: string[]
): { type: "directory"; children: WorksNode[]; breadcrumb: { name: string; label: string }[] }
 | { type: "file"; node: WorksNode; breadcrumb: { name: string; label: string }[] }
 | null {
  const root = getWorksRoot();
  const breadcrumb: { name: string; label: string }[] = [{ name: "", label: "作品" }];

  if (pathSegments.length === 0) {
    return { type: "directory", children: root, breadcrumb };
  }

  let current = root;
  for (let i = 0; i < pathSegments.length; i++) {
    const seg = pathSegments[i];
    const found = current.find((n) => n.name === seg);
    if (!found) return null;

    if (found.type === "directory") {
      breadcrumb.push({ name: found.name, label: found.title });
      if (i === pathSegments.length - 1) {
        // 最后一段是目录 → 展示子目录列表
        return { type: "directory", children: found.children || [], breadcrumb };
      }
      // 不是最后一段 → 继续深入
      current = found.children || [];
    } else {
      // 找到了文件
      breadcrumb.push({ name: found.name, label: found.title });
      return { type: "file", node: found, breadcrumb };
    }
  }

  return null;
}

/** 递归收集所有路径段（给 generateStaticParams 用） */
export function getAllWorksPaths(): string[][] {
  const paths: string[][] = [];

  function walk(nodes: WorksNode[], prefix: string[]) {
    for (const node of nodes) {
      const current = [...prefix, node.name];
      if (node.type === "file") {
        paths.push(current);
      } else {
        // 目录本身也是一个列表页
        paths.push(current);
        walk(node.children || [], current);
      }
    }
  }

  walk(getWorksRoot(), []);
  return paths;
}

export const sections = ["beliefs", "works", "favorites", "changelog", "misc"] as const;

export const sectionLabels: Record<string, string> = {
  beliefs: "观念",
  works: "作品",
  favorites: "喜爱",
  changelog: "更新",
  misc: "杂项",
};
