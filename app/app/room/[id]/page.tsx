import { notFound } from "next/navigation";
import { getRoomById, rooms } from "@/data/rooms";
import { RoomFlow } from "@/components/room/RoomFlow";

export function generateStaticParams() {
  return rooms.map((room) => ({ id: room.id }));
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = getRoomById(id);
  if (!room) notFound();

  return <RoomFlow room={room} />;
}
