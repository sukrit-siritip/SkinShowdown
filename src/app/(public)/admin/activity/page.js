import { requireStaff } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import HistoryFilters from "@/components/history-filters-loader";
import ActivityChangeCell from "@/components/activity-change-cell";
import { RevealGroup, RevealItem } from "@/components/reveal";

export const metadata = { title: "Activity" };

const IGNORED_FIELDS = new Set(["updated_at", "created_at"]);
const MAX_CHANGES_SHOWN = 3;

function recordLabel(row) {
  const r = row.after ?? row.before ?? {};
  return r.name ?? r.code ?? row.record_id;
}

function changedFields(before, after) {
  if (!before || !after) return [];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changes = [];
  for (const key of keys) {
    if (IGNORED_FIELDS.has(key)) continue;
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changes.push({ key, from: before[key], to: after[key] });
    }
  }
  return changes;
}

function formatValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  const text = String(value);
  return text.length > 40 ? `${text.slice(0, 40)}…` : text;
}

function changeSummary(row) {
  if (row.action === "insert") return "Created";
  if (row.action === "delete") return "Deleted";
  const changes = changedFields(row.before, row.after);
  if (changes.length === 0) return "No field changes";
  const shown = changes
    .slice(0, MAX_CHANGES_SHOWN)
    .map((c) => `${c.key}: ${formatValue(c.from)} → ${formatValue(c.to)}`)
    .join(", ");
  const extra = changes.length - MAX_CHANGES_SHOWN;
  return extra > 0 ? `${shown}, +${extra} more` : shown;
}

const COLUMNS = "1fr 0.7fr 1.3fr 2.2fr 0.9fr";

export default async function AdminActivityPage({ searchParams }) {
  await requireStaff();
  const { from, to } = await searchParams;

  const admin = createAdminClient();
  let logsQuery = admin
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (from) logsQuery = logsQuery.gte("created_at", from);
  if (to) logsQuery = logsQuery.lte("created_at", `${to}T23:59:59`);

  const { data: logs } = await logsQuery;
  const rows = logs ?? [];

  const actorIds = [...new Set(rows.map((r) => r.actor_id).filter(Boolean))];
  const { data: profiles } = actorIds.length
    ? await admin.from("profiles").select("id, display_name").in("id", actorIds)
    : { data: [] };
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return (
    <RevealGroup key={`${from ?? ""}-${to ?? ""}`}>
      <RevealItem>
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5.5">
          <h1 className="font-bold text-[32px] m-0">Activity</h1>
        </div>
        <p className="text-sm text-muted mb-5.5">
          Every insert, update, and delete made by staff — newest first, capped at 200 rows.
        </p>
      </RevealItem>

      <RevealItem>
        <HistoryFilters />
      </RevealItem>

      <RevealItem>
        {rows.length === 0 ? (
          <div className="border border-hairline bg-card py-12 px-6 text-center text-sm text-muted">
            No activity yet.
          </div>
        ) : (
          <div className="border border-hairline bg-card overflow-x-auto">
            <div
              className="grid gap-3 px-4 py-3 border-b border-hairline text-[10px] tracking-[0.16em] text-tan min-w-[800px]"
              style={{ gridTemplateColumns: COLUMNS }}
            >
              <span>ACTOR</span>
              <span>ACTION</span>
              <span>RECORD</span>
              <span>CHANGES</span>
              <span className="text-right">DATE</span>
            </div>
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid gap-3 px-4 py-3.5 border-b border-divider last:border-b-0 items-center min-w-[800px] transition-colors duration-250 hover:bg-hover"
                style={{ gridTemplateColumns: COLUMNS }}
              >
                <div className="text-sm truncate">
                  {nameById.get(row.actor_id) ?? "Unknown"}
                </div>
                <div>
                  <span
                    className={`inline-flex items-center leading-none text-[9px] tracking-[0.1em] px-1.5 py-0.5 border ${
                      row.action === "insert"
                        ? "border-success text-success"
                        : row.action === "delete"
                          ? "border-danger text-danger"
                          : "border-gold-dim text-gold"
                    }`}
                  >
                    {row.action.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm truncate">{recordLabel(row)}</div>
                  <div className="text-[10px] text-muted">{row.table_name}</div>
                </div>
                <ActivityChangeCell text={changeSummary(row)} />
                <div className="text-xs text-tan text-right whitespace-nowrap">
                  {new Date(row.created_at).toLocaleString(undefined, {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </RevealItem>
    </RevealGroup>
  );
}
