import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CartLine from "@/components/cart-line";
import ItemCard from "@/components/item-card";

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: cartRows } = await supabase
    .from("cart_items")
    .select("item_id, items(*)")
    .eq("user_id", user.id)
    .order("added_at", { ascending: true });

  const cartItems = (cartRows ?? []).map((row) => row.items).filter(Boolean);
  const cartItemIds = new Set(cartItems.map((item) => item.id));

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  let upsellItems = [];
  if (cartItems.length > 0) {
    const [{ data: upsellRows }, { data: ownedRows }] = await Promise.all([
      supabase
        .from("items")
        .select("*")
        .eq("published", true)
        .eq("is_battle_pass", false)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase.from("order_items").select("item_id, orders!inner(user_id)").eq("orders.user_id", user.id),
    ]);
    const ownedItemIds = new Set((ownedRows ?? []).map((row) => row.item_id));
    upsellItems = (upsellRows ?? [])
      .filter((item) => !cartItemIds.has(item.id) && !ownedItemIds.has(item.id))
      .slice(0, 4);
  }

  return (
    <main className="flex-1 max-w-[1100px] mx-auto px-6 pt-9 pb-24 w-full">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-7">
        <div>
          <div className="text-[11px] tracking-[0.2em] text-tan mb-1.5">STEP 1 OF 2</div>
          <h1 className="font-bold text-4xl m-0">Your Cart</h1>
        </div>
        {cartItems.length > 0 && (
          <Link href="/items" className="text-xs text-gold! mt-1.5">
            ← KEEP BROWSING
          </Link>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="border border-hairline bg-card py-15 px-6 text-center">
          <div className="text-[22px] mb-2.5">Your cart is empty</div>
          <div className="text-sm text-muted mb-5">
            Browse the catalogue and add something to the fire.
          </div>
          <Link
            href="/items"
            className="inline-block px-6 py-3 border border-gold bg-[#1a1f2e] text-foreground! text-[13px] font-semibold tracking-[0.14em] transition-all duration-300 hover:bg-gold! hover:text-background!"
          >
            BROWSE SKINS
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(300px,1.5fr)_minmax(260px,0.8fr)] gap-7 items-start">
            <div className="border border-hairline bg-card">
              {cartItems.map((item) => (
                <CartLine key={item.id} item={item} />
              ))}
            </div>

            <div className="border border-hairline bg-card p-5">
              <div className="text-xl font-semibold mb-4">Summary</div>
              <div className="flex justify-between text-[13px] text-tan py-1.5">
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-tan py-1.5 border-b border-hairline">
                <span>TAX (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline py-4">
                <span className="text-lg">Total</span>
                <span className="text-[26px] text-gold-light">${total.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                className="block text-center py-3 border border-gold bg-[#1a1f2e] text-foreground! text-[13px] font-semibold tracking-[0.14em] transition-all duration-300 hover:bg-gold! hover:text-background!"
              >
                CHECKOUT
              </Link>
              <div className="text-[10px] text-muted text-center mt-3">
                ITEM CODES DELIVERED INSTANTLY
              </div>
            </div>
          </div>

          {upsellItems.length > 0 && (
            <div className="mt-11">
              <div className="text-[11px] tracking-[0.2em] text-tan mb-3.5">
                COMPLETE YOUR LOADOUT
              </div>
              <div
                className="grid gap-3.5"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
              >
                {upsellItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
