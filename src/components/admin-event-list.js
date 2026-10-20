"use client";

import Link from "next/link";

export default function AdminEventList({ events, selectedId }) {
  return (
    <div className="border border-hairline bg-card min-w-0">
      <div className="flex justify-between px-4 py-3 border-b border-hairline text-[10px] tracking-[0.16em] text-tan">
        <span>EVENT</span>
        <span>STATE</span>
      </div>
      <div className="max-h-[640px] overflow-y-auto scrollbar-thin">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/admin/events?id=${event.id}`}
            scroll={false}
            aria-current={event.id === selectedId ? "true" : undefined}
            className={`flex items-center justify-between gap-3 px-4 py-3 border-b border-divider text-foreground! transition-colors duration-300 hover:bg-selected ${
              event.id === selectedId ? "bg-selected" : ""
            }`}
          >
            <div className="min-w-0">
              <div className="text-base truncate">{event.title}</div>
              <div className="text-[10px] text-muted truncate">{event.tag}</div>
            </div>
            <span
              className={`shrink-0 inline-flex items-center leading-none text-[10px] px-2 py-0.75 border ${
                event.active ? "border-line text-tan" : "border-hairline text-muted"
              }`}
            >
              {event.active ? "LIVE" : "DRAFT"}
            </span>
          </Link>
        ))}
        {events.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-muted">No events yet.</div>
        )}
      </div>
    </div>
  );
}
