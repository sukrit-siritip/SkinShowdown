import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ItemCard from "@/components/item-card";
import { RevealGroup, RevealItem } from "@/components/reveal";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: favoriteRows }, { data: cartRows }, { data: ownedRows }] = await Promise.all([
    supabase
      .from("favorites")
      .select("item_id, items(*)")
      .eq("user_id", user.id),
    supabase.from("cart_items").select("item_id").eq("user_id", user.id),
    supabase.from("order_items").select("item_id, orders!inner(user_id)").eq("orders.user_id", user.id),
  ]);

  const favoriteItems = (favoriteRows ?? []).map((row) => row.items).filter(Boolean);
  const cartItemIds = new Set((cartRows ?? []).map((row) => row.item_id));
  const ownedItemIds = new Set((ownedRows ?? []).map((row) => row.item_id));

  return (
    <main className="flex-1 max-w-[1320px] mx-auto px-6 pt-9 pb-24 w-full">
      <div className="text-[11px] tracking-[0.2em] text-tan mb-1.5">ACCOUNT</div>
      <h1 className="font-bold text-4xl m-0 mb-7">Favorites</h1>

      {favoriteItems.length === 0 ? (
        <div className="border border-hairline bg-card py-12 px-6 text-center">
          <div className="text-xl mb-2">No favorites yet</div>
          <Link href="/items" className="inline-block text-xs text-gold! mt-1.5">
            BROWSE SKINS
          </Link>
        </div>
      ) : (
        <RevealGroup
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(236px, 1fr))" }}
        >
          {favoriteItems.map((item) => (
            <RevealItem key={item.id}>
              <ItemCard
                item={item}
                inCart={cartItemIds.has(item.id)}
                owned={ownedItemIds.has(item.id)}
                favorited
              />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </main>
  );
}
