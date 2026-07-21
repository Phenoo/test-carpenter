"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { CheckIcon, WhatsappIcon } from "@/components/site/icons";
import { ProductCard } from "@/components/site/product-card";
import { useStorefront } from "@/components/site/storefront-provider";
import {
  getProduct,
  getRelatedProducts,
  type Product,
  siteConfig,
} from "@/lib/site-data";

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.gallery[0]);
  const [capSize, setCapSize] = useState(product.capSizes[0] ?? "One size");
  const [laceType, setLaceType] = useState(product.laceTypes[0] ?? "Standard");
  const [parting, setParting] = useState(product.partings[0] ?? "Default");
  const [colour, setColour] = useState(product.colours[0]?.name ?? "Natural");
  const [quantity, setQuantity] = useState(1);
  const { addToCart, formatPrice, rememberViewed, recentlyViewed } = useStorefront();
  const relatedProducts = getRelatedProducts(product.slug);

  useEffect(() => {
    rememberViewed(product.slug);
  }, [product.slug, rememberViewed]);

  const recommendedViewed = useMemo(
    () => recentlyViewed.filter((slug) => slug !== product.slug).slice(0, 3),
    [product.slug, recentlyViewed],
  );

  const detailSections = [
    { question: "Description", answer: product.longDescription },
    { question: "What’s included", answer: product.included.join(" • ") },
    { question: "Sizing", answer: "Measure your circumference, front-to-nape, ear-to-ear, and temple-to-temple before ordering. Consultation support is available if you are unsure." },
    { question: "Processing & delivery", answer: product.dispatchEstimate },
    { question: "Care instructions", answer: product.care.join(" • ") },
    { question: "Returns & custom order policy", answer: product.policy.join(" • ") || "See checkout for policy details." },
    ...product.faq,
  ];

  return (
    <>
      <section className="section-shell py-10">
        <nav className="mb-8 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Home / Shop / {product.name}
        </nav>
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4">
            <div className="relative aspect-[4/4.8] overflow-hidden border border-[var(--color-border)] bg-white">
              <Image
                src={selectedImage}
                alt={`${product.name} shown in a detailed editorial product view.`}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={
                    selectedImage === image
                      ? "relative aspect-square overflow-hidden border border-[var(--color-blush)]"
                      : "relative aspect-square overflow-hidden border border-[var(--color-border)]"
                  }
                >
                  <Image
                    src={image}
                    alt={`${product.name} gallery thumbnail ${index + 1}`}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            {product.videoPoster ? (
              <div className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-espresso)] p-4 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Movement video placeholder
                </p>
                <div className="relative mt-4 aspect-video overflow-hidden">
                  <Image
                    src={product.videoPoster}
                    alt={`${product.name} movement preview poster`}
                    fill
                    sizes="(max-width: 1280px) 100vw, 55vw"
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {product.type}
              </p>
              <h1 className="mt-3 font-serif text-6xl leading-[0.92] text-[var(--color-espresso)]">
                {product.name}
              </h1>
              <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[var(--color-burgundy)]">
                {product.status} • {product.dispatchEstimate}
              </p>
              <p className="mt-4 text-3xl font-semibold text-[var(--color-burgundy)]">
                {product.price === 0 ? "Free" : `From ${formatPrice(product.price)}`}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {product.description}
              </p>
              <p className="mt-3 text-sm text-[var(--color-muted)]">{product.installmentHint}</p>
            </div>

            {product.kind === "wig" ? (
              <div className="panel grid gap-4 p-5">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium">Cap size</span>
                  <select value={capSize} onChange={(event) => setCapSize(event.target.value)} className="form-select">
                    {product.capSizes.map((size) => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium">Lace type</span>
                  <select value={laceType} onChange={(event) => setLaceType(event.target.value)} className="form-select">
                    {product.laceTypes.map((lace) => (
                      <option key={lace}>{lace}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-medium">Parting</span>
                  <select value={parting} onChange={(event) => setParting(event.target.value)} className="form-select">
                    {product.partings.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-col gap-3 text-sm">
                  <span className="font-medium">Colour</span>
                  <div className="flex flex-wrap gap-3">
                    {product.colours.map((swatch) => (
                      <button
                        key={swatch.name}
                        type="button"
                        onClick={() => setColour(swatch.name)}
                        className={colour === swatch.name ? "color-swatch color-swatch-active" : "color-swatch"}
                      >
                        <span
                          aria-hidden="true"
                          className="h-5 w-5 border border-black/10"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        {swatch.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 border border-[var(--color-border)] bg-white/80 p-5">
              <div className="flex items-center justify-between">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center gap-3 border border-[var(--color-border)] px-3 py-2">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setQuantity((value) => value + 1)}>+</button>
                </div>
              </div>
              <div className="grid gap-3">
                {product.benefits.map((benefit) => (
                  <p key={benefit} className="inline-flex items-center gap-3 text-sm text-[var(--color-muted)]">
                    <CheckIcon className="h-4 w-4 text-[var(--color-burgundy)]" />
                    {benefit}
                  </p>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="button-primary"
                  onClick={() =>
                    addToCart(product, {
                      quantity,
                      optionSummary:
                        product.kind === "wig"
                          ? [capSize, laceType, parting, colour]
                          : ["Standard"],
                    })
                  }
                >
                  Add to cart
                </button>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary inline-flex items-center justify-center gap-2"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  Need help choosing?
                </a>
              </div>
            </div>

            <div className="panel p-5">
              <p className="eyebrow">How to measure your head</p>
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Measure your circumference, front-to-nape, ear-to-ear, and temple-to-temple.
                If you need guidance, add consultation support or message before production begins.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-8 pb-14 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Supporting information</p>
          <h2 className="section-title max-w-xl">Everything you need before checkout.</h2>
        </div>
        <FaqAccordion items={detailSections} />
      </section>

      {relatedProducts.length > 0 ? (
        <section className="section-shell pb-14">
          <div className="mb-8">
            <p className="eyebrow">Recommended with this purchase</p>
            <h2 className="section-title">Suggested essentials and next steps.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      {recommendedViewed.length > 0 ? (
        <section className="section-shell pb-28 md:pb-16">
          <div className="mb-8">
            <p className="eyebrow">Recently viewed</p>
            <h2 className="section-title">Keep exploring your shortlist.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommendedViewed.map((slug) => {
              const item = getProduct(slug);

              if (!item) {
                return null;
              }

              return <ProductCard key={item.slug} product={item} />;
            })}
          </div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[rgba(255,255,255,0.96)] px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
              {product.status}
            </p>
            <p className="font-semibold text-[var(--color-burgundy)]">
              {product.price === 0 ? "Free" : formatPrice(product.price)}
            </p>
          </div>
          <button
            type="button"
            className="button-primary"
            onClick={() =>
              addToCart(product, {
                quantity,
                optionSummary: product.kind === "wig" ? [capSize, laceType, parting, colour] : ["Standard"],
              })
            }
          >
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
}
