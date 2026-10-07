"use client";

import { getImageProps } from "next/image";
import { Image } from "antd";
import { itemRender } from "@/lib/renders";

export default function ItemDetailGallery({ item }) {
  const render = itemRender(item);

  if (!render) {
    return (
      <div
        className="border border-hairline aspect-video flex items-center justify-center text-sm text-dim"
        style={{ background: "repeating-linear-gradient(135deg, #121822 0 12px, #182029 12px 24px)" }}
      >
        NO RENDER YET
      </div>
    );
  }

  const {
    props: { src, srcSet, sizes, loading, fetchPriority, decoding },
  } = getImageProps({
    src: render.src,
    alt: item.name,
    width: render.width,
    height: render.height,
    quality: 90,
    priority: true,
    sizes: "(min-width: 1024px) 55vw, 100vw",
  });

  return (
    <div className="relative border border-hairline overflow-hidden aspect-video bg-background">
      <Image
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        alt={item.name}
        width="100%"
        height="100%"
        rootClassName="block! h-full!"
        className="object-contain! h-full! p-2!"
        preview={{ src: render.src }}
      />
      <div className="absolute bottom-3.5 right-3.5 text-[10px] text-muted pointer-events-none">
        {render.width}×{render.height}
      </div>
    </div>
  );
}
