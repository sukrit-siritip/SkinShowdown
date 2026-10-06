import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import HistoryFilters from "@/components/history-filters-loader";

export default async function HistoryPage({ searchParams }) {
  const { from, to } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let ordersQuery = supabase
    .from("orders")
    .select("id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (from) ordersQuery = ordersQuery.gte("created_at", from);
  if (to) ordersQuery = ordersQuery.lte("created_at", `${to}T23:59:59`);

  const { data: orders } = await ordersQuery;
  const orderIds = (orders ?? []).map((order) => order.id);
  const orderDateById = new Map((orders ?? []).map((order) => [order.id, order.created_at]));

  let rows = [];
  if (orderIds.length > 0) {
    const admin = createAdminClient();
    const { data: orderItems } = await admin
      .from("order_items")
      .select("id, order_id, name_snapshot, price_snapshot, item_codes(code), items(base)")
      .in("order_id", orderIds);

    rows = (orderItems ?? [])
      .map((oi) => ({
        id: oi.id,
        name: oi.name_snapshot,
        meta: oi.items?.base?.toUpperCase() ?? "",
        date: orderDateById.get(oi.order_id),
        code: oi.item_codes?.code ?? "—",
        paid: Number(oi.price_snapshot),
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const orderTotal = rows.reduce((sum, row) => sum + row.paid, 0);

  return (
    <main className="flex-1 max-w-[1100px] mx-auto px-6 pt-9 pb-24 w-full">
      <div className="text-[11px] tracking-[0.2em] text-tan mb-1.5">ACCOUNT</div>
      <h1 className="font-bold text-4xl m-0 mb-2">Purchase History</h1>
      <p className="text-[15px] text-muted mb-7">
        Redeem codes are shown once revealed. Keep them somewhere safe.
      </p>

      <HistoryFilters />

      {rows.length === 0 ? (
        <div className="border border-hairline bg-card py-12 px-6 text-center text-sm text-muted">
          No orders yet.
        </div>
      ) : (
        <div className="border border-hairline bg-card">
          <div
            className="grid gap-3 px-4 py-3 border-b border-hairline text-[10px] tracking-[0.16em] text-tan"
            style={{ gridTemplateColumns: "1.6fr 1fr 1.2fr 0.8fr" }}
          >
            <span>ITEM</span>
            <span>DATE</span>
            <span>CODE</span>
            <span className="text-right">PAID</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid gap-3 px-4 py-3.5 border-b border-divider last:border-b-0 items-center transition-colors duration-250 hover:bg-hover"
              style={{ gridTemplateColumns: "1.6fr 1fr 1.2fr 0.8fr" }}
            >
              <div>
                <div className="text-base">{row.name}</div>
                <div className="text-[10px] text-muted">{row.meta}</div>
              </div>
              <div className="text-xs text-tan">
                {new Date(row.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </div>
              <div className="text-xs text-gold-light tracking-[0.06em]">{row.code}</div>
              <div className="text-[13px] text-right">${row.paid.toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3.5 text-xs text-muted">
            <span>
              {rows.length} ORDER{rows.length === 1 ? "" : "S"}
            </span>
            <span className="text-foreground">TOTAL ${orderTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </main>
  );
}
