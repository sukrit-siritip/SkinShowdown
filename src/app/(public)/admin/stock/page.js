import { requireStaff } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import StockItemList from "@/components/stock-item-list";
import AdminStockPanel from "@/components/admin-stock-panel";
import { RevealGroup, RevealItem } from "@/components/reveal";

export const metadata = { title: "Stock & Codes" };

export default async function AdminStockPage({ searchParams }) {
  const role = await requireStaff();
  const { item: itemParam } = await searchParams;
  const supabase = await createClient();

  const [{ data: items }, { data: availableCodes }] = await Promise.all([
    supabase.from("items").select("id, name, base").order("name"),
    supabase.from("item_codes").select("item_id").eq("status", "available"),
  ]);

  const leftByItem = {};
  for (const c of availableCodes ?? []) leftByItem[c.item_id] = (leftByItem[c.item_id] ?? 0) + 1;

  const itemsWithStock = (items ?? []).map((item) => ({
    ...item,
    codesLeft: leftByItem[item.id] ?? 0,
  }));

  const selectedId = itemParam ?? itemsWithStock[0]?.id ?? null;
  const selectedItem = itemsWithStock.find((item) => item.id === selectedId) ?? null;

  const { data: codes } = selectedItem
    ? await supabase
        .from("item_codes")
        .select("id, code, status")
        .eq("item_id", selectedItem.id)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <RevealGroup key={selectedItem?.id ?? "none"}>
      <RevealItem>
        <h1 className="font-bold text-[32px] m-0 mb-5.5">Stock &amp; Codes</h1>
      </RevealItem>

      <RevealItem
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(300px,1.2fr)] gap-5 items-start"
      >
        <StockItemList items={itemsWithStock} selectedId={selectedItem?.id} />
        <AdminStockPanel item={selectedItem} codes={codes ?? []} readOnly={role !== "admin"} />
      </RevealItem>
    </RevealGroup>
  );
}
