"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon } from "@/components/site/icons";
import { transformationStories } from "@/lib/site-data";

export function TransformationGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = transformationStories[activeIndex];

  return (
    <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
      <div>
        <p className="eyebrow">Transformation gallery</p>
        <h2 className="section-title max-w-2xl">
          Client looks that feel polished, personal, and completely wearable.
        </h2>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)] md:text-base">
          Swipe through recent looks or use the keyboard to move between stories.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {transformationStories.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={activeIndex === index ? "chip chip-active" : "chip"}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <div className="panel overflow-hidden">
        <div className="relative aspect-[16/11] overflow-hidden">
          <Image
            src={activeItem.image}
            alt={`${activeItem.name} wearing a finished pixie unit by demutzhair.`}
            fill
            sizes="(max-width: 1280px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {activeItem.service}
          </p>
          <blockquote className="mt-4 font-serif text-4xl leading-none text-[var(--color-espresso)]">
            “{activeItem.quote}”
          </blockquote>
          <Link href={activeItem.href} className="button-ghost mt-6 inline-flex items-center gap-2">
            Shop the look
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
