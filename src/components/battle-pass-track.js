"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Card } from "antd";
import { motion, useScroll, useSpring } from "motion/react";

const cardStyle = {
  border: "1px solid #2d3543",
  background: "#0f131a",
  borderRadius: 0,
};
const highlightStyle = {
  border: "1px solid #b8860b",
  background: "#161200",
  borderRadius: 0,
};
const artStyle = {
  background:
    "repeating-linear-gradient(135deg, #131820 0 8px, #181f2a 8px 16px)",
};

function TierCard({ tier, reward, highlighted }) {
  const body = (
    <Card
      variant="borderless"
      classNames={{ body: "p-3.5!" }}
      className={`h-full transition-[transform,border-color]! duration-300! ${
        reward ? "hover:border-gold! hover:-translate-y-0.75!" : "opacity-50"
      }`}
      style={highlighted ? highlightStyle : cardStyle}
    >
      <div className="text-[10px] text-muted mb-2">LEVEL {tier}</div>
      <div className="h-20 mb-2.5" style={artStyle} />
      <div className="text-sm">{reward?.name ?? "Locked"}</div>
    </Card>
  );

  return reward ? (
    <Link
      href={`/items/${reward.id}`}
      className="block h-full text-foreground!"
      data-tier={tier}
    >
      {body}
    </Link>
  ) : (
    <div className="h-full" data-tier={tier}>
      {body}
    </div>
  );
}

export default function BattlePassTrack({
  rewards,
  totalTiers,
  daysLeft,
  highlightId,
}) {
  const rowRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: rowRef });
  const progress = useSpring(scrollXProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  const rewardByTier = new Map(
    rewards.map((reward) => [reward.battle_pass_tier, reward]),
  );
  const highlightTier = rewards.find(
    (reward) => reward.id === highlightId,
  )?.battle_pass_tier;
  const tiers = Array.from({ length: totalTiers }, (_, i) => i + 1);

  useEffect(() => {
    const row = rowRef.current;
    const card =
      highlightTier && row?.querySelector(`[data-tier="${highlightTier}"]`);
    if (!card) return;
    const timer = setTimeout(() => {
      const left = card.offsetLeft - (row.clientWidth - card.offsetWidth) / 2;
      row.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }, 250);
    return () => clearTimeout(timer);
  }, [highlightTier]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = row.scrollWidth - row.clientWidth;
      const atStart = row.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = row.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      row.scrollLeft += e.deltaY;
    };
    row.addEventListener("wheel", onWheel, { passive: false });
    return () => row.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="border border-hairline bg-card p-4.5 mb-8"
      >
        <div className="h-1 bg-hairline mb-2 overflow-hidden">
          <motion.div
            className="h-full bg-danger origin-left"
            style={{ scaleX: progress }}
          />
        </div>
        <div className="flex justify-end text-[11px] text-muted">
          {daysLeft !== null && <span>{daysLeft} DAYS LEFT</span>}
        </div>
      </motion.div>

      <div
        ref={rowRef}
        className="flex gap-3.5 overflow-x-auto overflow-y-hidden pt-2.5 pb-3.5 overscroll-x-contain scrollbar-thin"
        aria-label="Battle pass rewards by level"
        role="list"
      >
        {tiers.map((tier, i) => (
          <motion.div
            key={tier}
            role="listitem"
            className="flex-[0_0_180px]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ root: rowRef, once: true, amount: 0.2 }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
              delay: i < 8 ? i * 0.06 : 0,
            }}
          >
            <TierCard
              tier={tier}
              reward={rewardByTier.get(tier)}
              highlighted={tier === highlightTier}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}
