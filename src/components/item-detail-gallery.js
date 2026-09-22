"use client";

import { useState } from "react";
import { Image } from "antd";

function placeholderSrc(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
    <defs>
      <pattern id="stripes" width="24" height="24" patternTransform="rotate(135)" patternUnits="userSpaceOnUse">
        <rect width="12" height="24" fill="#121822" />
        <rect x="12" width="12" height="24" fill="#182029" />
      </pattern>
    </defs>
    <rect width="1280" height="720" fill="url(#stripes)" />
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="Newsreader, serif" font-size="22" fill="#5b6470">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const SHOTS = [
  { key: "art", label: "2D ART" },
  { key: "game", label: "IN GAME" },
];

export default function ItemDetailGallery() {
  const [active, setActive] = useState(0);
  const sources = SHOTS.map((shot) => placeholderSrc(shot.label));

  return (
    <div>
      <div className="relative border border-hairline overflow-hidden">
        <Image
          src={sources[active]}
          alt={SHOTS[active].label}
          width="100%"
          height="100%"
          className="aspect-video! object-cover!"
          rootClassName="block!"
        />
        <div className="absolute bottom-3.5 right-3.5 text-[10px] text-muted pointer-events-none">
          {active + 1} / {SHOTS.length} · 2560×1600
        </div>
      </div>

      <div className="flex gap-2.5 mt-3 flex-wrap">
        {SHOTS.map((shot, i) => (
          <button
            key={shot.key}
            type="button"
            onClick={() => setActive(i)}
            className={`w-20 h-14 overflow-hidden border transition-colors ${
              active === i ? "border-gold" : "border-hairline hover:border-brass"
            }`}
          >
            <img src={sources[i]} alt={shot.label} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
