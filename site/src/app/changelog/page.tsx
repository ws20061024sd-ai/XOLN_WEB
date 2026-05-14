import { getContentList } from "@/lib/content";
import ContentList from "@/components/ContentList";

export default function ChangelogListPage() {
  const items = getContentList("changelog");
  return (
    <ContentList items={items} section="changelog" label="更新日志" emptyText="暂无更新记录。" />
  );
}
