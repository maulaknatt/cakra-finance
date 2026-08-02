import { EventRepository } from "@/repositories/eventRepository";
import { getSession } from "@/lib/auth";
import { EventListClient } from "@/components/events/EventListClient";
import { EventStatus } from "@prisma/client";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: EventStatus }>;
}) {
  const { search, status } = await searchParams;
  const session = await getSession();

  const events = await EventRepository.findAll(search, status);

  return (
    <EventListClient
      events={events}
      userRole={session?.role || "KETUA"}
      initialSearch={search || ""}
      initialStatus={status || ""}
    />
  );
}
