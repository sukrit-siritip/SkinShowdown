import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/admin";
import AdminItemList from "@/components/admin-item-list";
import AdminItemForm from "@/components/admin-item-form";

export const metadata = { title: "Content Management" };

export default async function AdminItemsPage({ searchParams }) {
  const role = await requireStaff();
  const { id, new: isNew } = await searchParams;
  const supabase = await createClient();

  const [{ data: items }, { data: passes }, { data: bases }] = await Promise.all([
    supabase
      .from("items")
      .select(
        "id, name, type, base, price, published, is_battle_pass, battle_pass_event_id, battle_pass_tier, is_dlc, dlc_name"
      )
      .order("name"),
    supabase
      .from("events")
      .select("id, title, total_tiers")
      .eq("type", "Battle Pass")
      .order("created_at", { ascending: false }),
    supabase.from("item_bases").select("type, name").order("name"),
  ]);

  const basesByType = {};
  for (const base of bases ?? []) (basesByType[base.type] ??= []).push(base.name);

  const selectedId = isNew ? null : id;
  const [{ data: selected }, { count: codesLeft }] = selectedId
    ? await Promise.all([
        supabase.from("items").select("*").eq("id", selectedId).maybeSingle(),
        supabase
          .from("item_codes")
          .select("id", { count: "exact", head: true })
          .eq("item_id", selectedId)
          .eq("status", "available"),
      ])
    : [{ data: null }, { count: null }];

  const takenTiers = {};
  for (const item of items ?? []) {
    if (item.battle_pass_event_id && item.id !== selected?.id) {
      (takenTiers[item.battle_pass_event_id] ??= []).push(item.battle_pass_tier);
    }
  }
  const dlcNames = [...new Set((items ?? []).map((i) => i.dlc_name).filter(Boolean))].sort();
  const showForm = Boolean(isNew || selected);

  return (
    <>
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5.5">
        <h1 className="font-bold text-[32px] m-0">Content Management</h1>
        {role === "admin" && (
          <Link
            href="/admin/items?new=1"
            className="inline-flex items-center gap-2 px-4.5 py-2.5 border border-gold bg-raised text-xs font-semibold tracking-[0.14em] text-foreground! transition-colors duration-300 hover:bg-gold hover:text-background!"
          >
            <span aria-hidden="true" className="text-lg leading-none font-normal">
              +
            </span>
            NEW SKIN
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.9fr)] gap-5 items-start">
        <AdminItemList items={items ?? []} selectedId={selected?.id} />
        {showForm ? (
          <AdminItemForm
            key={selected?.id ?? "new"}
            item={selected}
            codesLeft={codesLeft}
            passes={passes ?? []}
            takenTiers={takenTiers}
            dlcNames={dlcNames}
            basesByType={basesByType}
            readOnly={role !== "admin"}
          />
        ) : (
          <div className="border border-hairline bg-card p-8 text-center text-sm text-muted">
            {id ? "That skin no longer exists." : "Select a skin to edit it."}
          </div>
        )}
      </div>
    </>
  );
}
