import { getContentList } from "@/lib/content";
import ContentList from "@/components/ContentList";

export default function MiscListPage() {
  const items = getContentList("misc");
  return (
    <ContentList
      items={items}
      section="misc"
      label="杂项"
      emptyText="暂无杂项内容。"
    />
  );
}
