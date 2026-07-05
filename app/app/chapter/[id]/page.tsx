import { notFound } from "next/navigation";
import { chapters, getChapterById } from "@/lib/lessons/chapters";
import { ChapterPlayer } from "@/components/chapter/ChapterPlayer";

export function generateStaticParams() {
  return chapters.map((chapter) => ({ id: chapter.id }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapter = getChapterById(id);
  if (!chapter) notFound();
  return <ChapterPlayer chapter={chapter} />;
}
