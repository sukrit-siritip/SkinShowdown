import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CheckoutSuccessBadge from "@/components/checkout-success-badge";
import { RevealGroup, RevealItem } from "@/components/reveal";

export const metadata = { title: "Order Confirmed" };

export default async function CheckoutSuccessPage({ searchParams }) {
  const { order: orderId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!orderId) notFound();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  const admin = createAdminClient();
  const { data: orderItems } = await admin
    .from("order_items")
    .select("id, name_snapshot, price_snapshot, item_codes(code)")
    .eq("order_id", orderId);

  return (
    <main className="flex-1 max-w-[760px] mx-auto px-6 pt-16 pb-24 w-full text-center">
      <CheckoutSuccessBadge />

      <RevealGroup>
        <RevealItem>
          <div className="text-[11px] tracking-[0.2em] text-tan mb-2">ORDER CONFIRMED</div>
          <h1 className="font-bold text-[38px] m-0 mb-3">Thank you for your purchase</h1>
          <p className="text-[15px] text-muted mb-8">
            Your codes are ready below and saved to your purchase history.
          </p>
        </RevealItem>

        <RevealItem>
          <div className="border border-hairline bg-card p-5 text-left mb-6">
            {(orderItems ?? []).map((oi) => (
              <div
                key={oi.id}
                className="flex justify-between items-center gap-3 py-3 border-b border-divider flex-wrap"
              >
                <div>
                  <div className="text-[17px]">{oi.name_snapshot}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm tracking-[0.06em] text-gold-light">
                    {oi.item_codes?.code ?? "—"}
                  </div>
                  <div className="text-xs text-muted">${Number(oi.price_snapshot).toFixed(2)}</div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-base">Total paid</span>
              <span className="text-2xl text-gold-light">${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/items"
              className="px-6.5 py-3.5 border border-gold bg-[#1a1f2e] text-foreground! text-[13px] font-semibold tracking-[0.14em] transition-all duration-300 hover:bg-gold! hover:text-background!"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </RevealItem>
      </RevealGroup>
    </main>
  );
}
