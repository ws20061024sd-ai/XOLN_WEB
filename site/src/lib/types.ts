export interface ContentMeta {
  slug: string;
  title: string;
  date?: string;
  description?: string;
  tags?: string[];
}

export interface ContentItem extends ContentMeta {
  content: string;
}

export const sectionLabels: Record<string, string> = {
  beliefs: "观念",
  works: "作品",
  favorites: "喜爱",
  changelog: "更新",
  misc: "杂项",
};
