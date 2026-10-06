import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "@/components/checkout-form-loader";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: cartRows } = await supabase
    .from("cart_items")
    .select("items(*)")
    .eq("user_id", user.id)
    .order("added_at", { ascending: true });

  const cartItems = (cartRows ?? []).map((row) => row.items).filter(Boolean);

  if (cartItems.length === 0) redirect("/cart");

  return (
    <main className="flex-1 max-w-[1100px] mx-auto px-6 pt-9 pb-24 w-full">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-7">
        <div>
          <div className="text-[11px] tracking-[0.2em] text-tan mb-1.5">STEP 2 OF 2</div>
          <h1 className="font-bold text-4xl m-0">Checkout</h1>
        </div>
        <Link href="/cart" className="text-xs text-gold! mt-1.5">
          ← BACK TO CART
        </Link>
      </div>

      <CheckoutForm email={user.email} cartItems={cartItems} />
    </main>
  );
}
