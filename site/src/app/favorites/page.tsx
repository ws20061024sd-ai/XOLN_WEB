import { getContentList } from "@/lib/content";
import ContentList from "@/components/ContentList";

export default function FavoritesListPage() {
  const items = getContentList("favorites");
  return (
    <ContentList items={items} section="favorites" label="喜爱" emptyText="喜爱的内容即将到来。" />
  );
}
