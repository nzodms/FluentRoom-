import { notFound } from "next/navigation";
import { getLessonById, lessons } from "@/data/lessons";
import { LessonFlow } from "@/components/lesson/LessonFlow";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ id: lesson.id }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLessonById(id);
  if (!lesson) notFound();

  return <LessonFlow lesson={lesson} />;
}
