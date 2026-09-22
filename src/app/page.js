import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Footer from "@/components/footer";
import Header from "@/components/header";
import HeroCarousel from "@/components/hero-carousel";
import ItemCard from "@/components/item-card";
import StatCard from "@/components/stat-card";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: slides }, { count: catalogSize }, { data: newItems }, { data: cartRows }] =
    await Promise.all([
      supabase
        .from("events")
        .select("id, title, tag, body, cta_label, cta_link, type")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase.from("items").select("id", { count: "exact", head: true }).eq("published", true),
      supabase
        .from("items")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(8),
      user
        ? supabase.from("cart_items").select("item_id").eq("user_id", user.id)
        : Promise.resolve({ data: [] }),
    ]);

  const cartItemIds = new Set((cartRows ?? []).map((row) => row.item_id));

  const activeEvent = slides?.[0];
  const lastSync = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <>
      <Header />

      <HeroCarousel slides={slides ?? []} />

      <main className="flex-1 max-w-[1320px] mx-auto px-6 pt-11 pb-24 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {activeEvent && (
            <StatCard
              label={`ACTIVE EVENT · ${activeEvent.title}`}
              value={activeEvent.tag}
              valueClassName="text-2xl text-danger"
              description="live now"
            />
          )}
          <StatCard
            label="SKINS LIVE"
            value={catalogSize ?? 0}
            valueClassName="text-[32px] text-gold-light"
            description="published in the store"
          />
          <StatCard
            label="LAST SYNC"
            value={lastSync}
            description="data as of this date · prices in USD"
          />
          <StatCard
            href="/battle-pass"
            label="BATTLE PASS"
            labelClassName="text-gold"
            value="Old Testament"
            valueClassName="text-xl font-semibold mb-1.5"
            description="See all tier rewards →"
            descriptionClassName="text-tan"
            style={{ border: "1px solid #6b5a22", background: "#13110a" }}
          />
        </div>

        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
          <div>
            <div className="text-[11px] tracking-[0.2em] text-tan mb-1.5">JUST ADDED</div>
            <h2 className="font-bold text-3xl m-0">New Skins &amp; DLC</h2>
          </div>
          <Link href="/items" className="text-xs text-gold">
            VIEW ALL {catalogSize ?? 0} →
          </Link>
        </div>

        {newItems && newItems.length > 0 ? (
          <div
            className="grid gap-4 items-start"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))" }}
          >
            {newItems.map((item) => (
              <ItemCard key={item.id} item={item} inCart={cartItemIds.has(item.id)} />
            ))}
          </div>
        ) : (
          <div className="border border-hairline bg-card p-12 text-center text-muted">
            No skins published yet — check back soon.
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
