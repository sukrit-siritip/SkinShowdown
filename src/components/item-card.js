import Link from "next/link";
import { Card, Button } from "antd";

export default function ItemCard({ item }) {
  const { id, name, base, slot, price, is_dlc, dlc_name, dlc_steam_url, is_battle_pass } = item;
  const showPrice = !is_dlc && !is_battle_pass;

  const viewButton = (
    <Link href={`/items/${id}`} className="block w-full">
      <Button size="small" block>
        VIEW
      </Button>
    </Link>
  );

  const secondaryButton = is_battle_pass ? (
    <Link href="/battle-pass" className="block w-full">
      <Button type="primary" size="small" block>
        BATTLE PASS
      </Button>
    </Link>
  ) : is_dlc ? (
    <Button
      type="primary"
      size="small"
      block
      href={dlc_steam_url || "#"}
      target="_blank"
      rel="noopener noreferrer"
    >
      STEAM
    </Button>
  ) : (
    <Button type="primary" size="small" block>
      ADD
    </Button>
  );

  return (
    <Card
      variant="borderless"
      classNames={{ body: "p-0!" }}
      className="group relative overflow-hidden transition-[transform,border-color]! duration-300! hover:border-gold! hover:-translate-y-1!"
      style={{ border: "1px solid #2d3543", background: "#0f131a", borderRadius: 0 }}
    >
      <div
        className="h-[150px] relative flex flex-col justify-between p-2.5"
        style={{
          background:
            "repeating-linear-gradient(135deg, #131820 0 8px, #181f2a 8px 16px)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,14,18,0.85), transparent 45%, transparent 60%, rgba(10,14,18,0.85))",
          }}
        />
        <div className="relative">
          <div className="text-[15px] font-semibold leading-tight">{name}</div>
          <div className="text-[11px] text-tan">{base}</div>
          {is_dlc && (
            <div className="text-[9px] text-gold tracking-[0.08em] mt-0.5">
              DLC · {dlc_name}
            </div>
          )}
        </div>
        <div className="relative flex items-end justify-between">
          <span className="text-[10px] text-dim">{slot}</span>
          {showPrice && (
            <span className="text-base text-gold-light">${Number(price).toFixed(2)}</span>
          )}
        </div>
        {/* Mouse/trackpad devices: buttons hidden until hover, overlaid on the art. */}
        <div className="hidden [@media(hover:hover)]:flex absolute inset-0 flex-col justify-center gap-1.5 px-2.5 bg-[#0a0e12]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {viewButton}
          {secondaryButton}
        </div>
      </div>
      {/* Touch devices: no hover, so keep the buttons permanently visible below the art. */}
      <div className="flex flex-col gap-1.5 p-2.5 [@media(hover:hover)]:hidden">
        {viewButton}
        {secondaryButton}
      </div>
    </Card>
  );
}
