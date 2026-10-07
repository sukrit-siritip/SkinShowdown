import { cache } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ItemCard from "@/components/item-card";
import ItemDetailActions from "@/components/item-detail-actions";
import ItemDetailGallery from "@/components/item-detail-gallery";
import ItemReviews from "@/components/item-reviews";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { TYPE_GROUPS } from "@/lib/item-type-groups";

const getPublishedItem = cache(async (id) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  return data;
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getPublishedItem(id);
  return item ? { title: item.name, description: item.description } : {};
}

export default async function ItemDetailPage({ params }) {
  const { id } = await params;
  const item = await getPublishedItem(id);

  if (!item) notFound();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const relatedTypes = Object.values(TYPE_GROUPS).find((group) =>
    group.includes(item.type),
  ) ?? [item.type];

  const [
    { data: relatedItems },
    { data: reviewRows },
    favoriteResult,
    { data: ownedRows },
    { data: cartRows },
  ] = await Promise.all([
    supabase
      .from("items")
      .select("*")
      .in("type", relatedTypes)
      .eq("published", true)
      .neq("id", item.id)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("reviews")
      .select("id, rating, text, user_id, created_at")
      .eq("item_id", item.id)
      .order("created_at", { ascending: false }),
    user
      ? supabase
          .from("favorites")
          .select("item_id")
          .eq("user_id", user.id)
          .eq("item_id", item.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("order_items")
          .select("item_id, orders!inner(user_id)")
          .eq("orders.user_id", user.id)
      : Promise.resolve({ data: [] }),
    user
      ? supabase.from("cart_items").select("item_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] }),
  ]);

  const cartItemIds = new Set((cartRows ?? []).map((row) => row.item_id));
  const ownedItemIds = new Set((ownedRows ?? []).map((row) => row.item_id));

  const reviewerIds = [...new Set((reviewRows ?? []).map((r) => r.user_id))];
  let authorNames = {};
  if (reviewerIds.length > 0) {
    const admin = createAdminClient();
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, display_name")
      .in("id", reviewerIds);
    authorNames = Object.fromEntries(
      (profiles ?? []).map((p) => [p.id, p.display_name]),
    );
  }

  const reviews = (reviewRows ?? []).map((r) => ({
    ...r,
    authorName: authorNames[r.user_id] ?? "Hunter",
  }));

  const meta = [item.slot, item.weapon]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();

  return (
    <main className="flex-1 max-w-[1320px] mx-auto px-6 pt-9 pb-24 w-full">
      <RevealGroup className="grid grid-cols-1 md:grid-cols-[minmax(300px,1.5fr)_minmax(260px,0.62fr)] gap-8 items-start">
        <RevealItem>
          <ItemDetailGallery />
        </RevealItem>

        <RevealItem>
          <div className="text-[11px] tracking-[0.2em] text-tan mb-2">
            {meta}
          </div>
          <h1 className="font-bold text-4xl leading-tight m-0 mb-3">
            {item.name}
          </h1>

          {item.is_dlc && (
            <div className="inline-block text-[11px] tracking-[0.1em] text-gold-light border border-[#6b5a22] px-2.5 py-1 mb-3.5">
              DLC · {item.dlc_name}
            </div>
          )}

          <p className="text-[15px] leading-relaxed opacity-72 mb-5.5">
            {item.description}
          </p>

          <div className="border border-hairline bg-card p-4 mb-4.5">
            <div className="flex justify-between text-xs text-tan py-1.5 border-b border-divider">
              <span>BASE</span>
              <span className="text-foreground">{item.base}</span>
            </div>
          </div>

          {item.price != null && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl text-gold-light">
                ${Number(item.price).toFixed(2)}
              </span>
            </div>
          )}

          <ItemDetailActions
            item={item}
            initialFavorited={Boolean(favoriteResult.data)}
            initialInCart={cartItemIds.has(item.id)}
            owned={ownedItemIds.has(item.id)}
          />
        </RevealItem>
      </RevealGroup>

      {relatedItems && relatedItems.length > 0 && (
        <div className="mt-14">
          <div className="text-[11px] tracking-[0.2em] text-tan mb-3.5">
            YOU MAY ALSO LIKE
          </div>
          <RevealGroup
            className="grid gap-4 items-start"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {relatedItems.map((related) => (
              <RevealItem key={related.id}>
                <ItemCard
                  item={related}
                  inCart={cartItemIds.has(related.id)}
                  owned={ownedItemIds.has(related.id)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      )}

      <RevealGroup>
        <RevealItem>
          <ItemReviews
            itemId={item.id}
            reviews={reviews}
            currentUserId={user?.id ?? null}
            ownsItem={ownedItemIds.has(item.id)}
          />
        </RevealItem>
      </RevealGroup>
    </main>
  );
}
