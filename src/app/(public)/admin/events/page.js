import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/admin";
import AdminEventList from "@/components/admin-event-list";
import AdminEventForm from "@/components/admin-event-form";
import { RevealGroup, RevealItem } from "@/components/reveal";

export const metadata = { title: "Events" };

export default async function AdminEventsPage({ searchParams }) {
  const role = await requireStaff();
  const { id, new: isNew } = await searchParams;
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, tag, active")
    .order("sort_order");

  const selectedId = isNew ? null : id;
  const { data: selected } = selectedId
    ? await supabase.from("events").select("*").eq("id", selectedId).maybeSingle()
    : { data: null };

  const showForm = Boolean(isNew || selected);

  return (
    <RevealGroup key={selected?.id ?? (isNew ? "new" : "none")}>
      <RevealItem>
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5.5">
          <h1 className="font-bold text-[32px] m-0">Events</h1>
          {role === "admin" && (
            <Link
              href="/admin/events?new=1"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 border border-gold bg-raised text-xs font-semibold tracking-[0.14em] text-foreground! transition-colors duration-300 hover:bg-gold hover:text-background!"
            >
              <span aria-hidden="true" className="text-lg leading-none font-normal">
                +
              </span>
              NEW EVENT
            </Link>
          )}
        </div>
      </RevealItem>

      <RevealItem className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.9fr)] gap-5 items-start">
        <AdminEventList events={events ?? []} selectedId={selected?.id} />
        {showForm ? (
          <AdminEventForm key={selected?.id ?? "new"} event={selected} readOnly={role !== "admin"} />
        ) : (
          <div className="border border-hairline bg-card p-8 text-center text-sm text-muted">
            {id ? "That event no longer exists." : "Select an event to edit it."}
          </div>
        )}
      </RevealItem>
    </RevealGroup>
  );
}
