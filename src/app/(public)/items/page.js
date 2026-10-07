import { createClient } from "@/lib/supabase/server";
import ItemCard from "@/components/item-card";
import ItemsClearLink from "@/components/items-clear-link";
import ItemsFilters from "@/components/items-filters";
import ItemsPagination from "@/components/items-pagination";
import ItemsSort from "@/components/items-sort";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { TYPE_GROUPS } from "@/lib/item-type-groups";

const PAGE_SIZE = 12;

export const metadata = { title: "All Skins" };

export default async function ItemsPage({ searchParams }) {
  const { type, weapon, utility, q, sort, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let itemsQuery = supabase.from("items").select("*", { count: "exact" }).eq("published", true);

  const groupTypes = TYPE_GROUPS[type];
  if (groupTypes) itemsQuery = itemsQuery.in("type", groupTypes);
  if (type === "weapon" && weapon) itemsQuery = itemsQuery.eq("weapon", weapon);
  if (type === "utility" && utility) itemsQuery = itemsQuery.eq("name", utility);
  if (q) itemsQuery = itemsQuery.ilike("name", `%${q}%`);

  itemsQuery = itemsQuery
    .order("price", { ascending: sort !== "desc", nullsFirst: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const [
    { data: items, count: totalCount },
    { data: weaponRows },
    { data: utilityRows },
    { data: cartRows },
    { data: ownedRows },
  ] = await Promise.all([
    itemsQuery,
    supabase.from("items").select("weapon").eq("published", true).in("type", TYPE_GROUPS.weapon),
    supabase.from("items").select("name").eq("published", true).in("type", TYPE_GROUPS.utility),
    user
      ? supabase.from("cart_items").select("item_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] }),
    user
      ? supabase.from("order_items").select("item_id, orders!inner(user_id)").eq("orders.user_id", user.id)
      : Promise.resolve({ data: [] }),
  ]);

  const weaponOptions = [...new Set((weaponRows ?? []).map((row) => row.weapon))]
    .filter(Boolean)
    .sort();
  const utilityOptions = [...new Set((utilityRows ?? []).map((row) => row.name))].sort();
  const cartItemIds = new Set((cartRows ?? []).map((row) => row.item_id));
  const ownedItemIds = new Set((ownedRows ?? []).map((row) => row.item_id));

  return (
    <main className="flex-1 max-w-[1320px] mx-auto px-6 pt-9 pb-24 w-full">
      <div className="grid grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)] gap-8 items-start">
        <ItemsFilters weaponOptions={weaponOptions} utilityOptions={utilityOptions} />

        <div>
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
            <div>
              <div className="text-[11px] tracking-[0.2em] text-tan mb-1.5">CATALOGUE</div>
              <h1 className="font-bold text-3xl m-0">All Skins</h1>
            </div>
            <ItemsSort resultCount={totalCount ?? 0} />
          </div>

          {items && items.length > 0 ? (
            <>
              <RevealGroup
                key={`${type ?? ""}-${weapon ?? ""}-${utility ?? ""}-${q ?? ""}-${sort ?? ""}-${page}`}
                className="grid gap-4 items-start"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))" }}
              >
                {items.map((item) => (
                  <RevealItem key={item.id}>
                    <ItemCard
                      item={item}
                      inCart={cartItemIds.has(item.id)}
                      owned={ownedItemIds.has(item.id)}
                    />
                  </RevealItem>
                ))}
              </RevealGroup>
              <ItemsPagination page={page} pageSize={PAGE_SIZE} total={totalCount ?? 0} />
            </>
          ) : (
            <div className="border border-hairline bg-card p-12 text-center">
              <div className="mb-2">No skins match those filters</div>
              <ItemsClearLink label="CLEAR FILTERS" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
