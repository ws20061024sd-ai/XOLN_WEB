import { notFound } from "next/navigation";
import { getContentItem, getContentList } from "@/lib/content";
import ContentDetail from "@/components/ContentDetail";

export function generateStaticParams() {
  return getContentList("works").map((item) => ({ slug: item.slug }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getContentItem("works", slug);
  if (!item) notFound();
  return <ContentDetail item={item} section="works" />;
}
