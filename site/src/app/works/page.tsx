import { getContentList } from "@/lib/content";
import ContentList from "@/components/ContentList";

export default function WorksListPage() {
  const items = getContentList("works");
  return (
    <ContentList items={items} section="works" label="作品" emptyText="作品即将上线。" />
  );
}
