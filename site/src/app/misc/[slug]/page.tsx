import { notFound } from "next/navigation";
import { getContentItem, getContentList } from "@/lib/content";
import ContentDetail from "@/components/ContentDetail";

export function generateStaticParams() {
  return getContentList("misc").map((item) => ({ slug: item.slug }));
}

export default async function MiscDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContentItem("misc", slug);
  if (!item) notFound();
  return <ContentDetail item={item} section="misc" />;
}
