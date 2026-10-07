import { createClient } from "@/lib/supabase/server";
import BattlePassTrack from "@/components/battle-pass-track";
import { RevealGroup, RevealItem } from "@/components/reveal";

export const metadata = { title: "Battle Pass" };

const DAY_MS = 86_400_000;

export default async function BattlePassPage({ searchParams }) {
  const { item: highlightId } = await searchParams;
  const supabase = await createClient();

  const { data: pass } = await supabase
    .from("events")
    .select("id, title, total_tiers, ends_at")
    .eq("type", "Battle Pass")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: rewards } = pass
    ? await supabase
        .from("items")
        .select("id, name, battle_pass_tier")
        .eq("battle_pass_event_id", pass.id)
        .eq("published", true)
        .order("battle_pass_tier", { ascending: true })
    : { data: [] };

  const daysLeft = pass?.ends_at
    ? Math.max(0, Math.ceil((Date.parse(pass.ends_at) - Date.now()) / DAY_MS))
    : null;

  return (
    <main className="flex-1 max-w-[1320px] mx-auto px-6 pt-9 pb-24 w-full">
      <RevealGroup>
        <RevealItem>
          <div className="text-[11px] tracking-[0.2em] text-tan mb-1.5">SEASON PASS</div>
          <h1 className="font-bold text-4xl m-0 mb-2.5">{pass?.title ?? "Battle Pass"}</h1>
          <p className="text-[15px] text-muted m-0 mb-5.5 max-w-[600px] leading-relaxed">
            {pass
              ? "Track every reward in the current battle pass."
              : "No battle pass is running right now — check back next season."}
          </p>
        </RevealItem>
      </RevealGroup>

      {pass && (
        <BattlePassTrack
          rewards={rewards ?? []}
          totalTiers={pass.total_tiers ?? rewards?.length ?? 0}
          daysLeft={daysLeft}
          highlightId={highlightId}
        />
      )}
    </main>
  );
}
