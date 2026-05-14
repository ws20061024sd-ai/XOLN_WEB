import { getContentList } from "@/lib/content";
import ContentList from "@/components/ContentList";

export default function BeliefsListPage() {
  const items = getContentList("beliefs");

  return (
    <ContentList
      items={items}
      section="beliefs"
      label="观念"
      emptyText="观念的思考即将到来。"
    />
  );
}
