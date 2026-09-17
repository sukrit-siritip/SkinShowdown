"use client";

import { Carousel } from "antd";
import Link from "next/link";

export default function HeroCarousel({ slides }) {
  if (slides.length === 0) return null;

  return (
    <div className="relative overflow-hidden">
      <Carousel
        autoplay={{ dotDuration: true }}
        autoplaySpeed={6000}
        effect="fade"
        dots={slides.length > 1}
      >
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className="max-w-[1320px] mx-auto px-6 pt-16 sm:pt-20 pb-8 sm:pb-10 grid grid-cols-1 md:grid-cols-[minmax(300px,1fr)_minmax(280px,1.05fr)] gap-6 sm:gap-8 md:gap-12 items-center">
              <div className="flex flex-col min-h-[220px] sm:min-h-[260px] md:min-h-[360px] justify-center">
                <div className="inline-block text-[10px] tracking-[0.2em] px-2.5 py-1.5 bg-danger text-foreground mb-4 self-start">
                  {slide.tag}
                </div>
                <h1 className="font-bold text-[clamp(36px,5.4vw,62px)] leading-[1.03] m-0 mb-4 md:min-h-[132px]">
                  {slide.title}
                </h1>
                <p className="max-w-[480px] m-0 mb-7 min-h-[54px] text-base leading-[1.65] text-foreground/70">
                  {slide.body}
                </p>
                {slide.cta_label && slide.cta_link && (
                  <Link
                    href={slide.cta_link}
                    className="block w-full text-center md:inline-block md:w-auto md:self-start md:text-left px-7 py-3.5 border border-gold bg-[#1a1f2e] text-foreground! text-[13px] font-semibold tracking-[0.14em] transition-colors hover:bg-gold! hover:text-background!"
                  >
                    {slide.cta_label}
                  </Link>
                )}
              </div>
              <div className="relative flex items-center justify-center aspect-video border border-hairline bg-card overflow-hidden">
                <span className="text-[11px] text-dim">{slide.type?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
