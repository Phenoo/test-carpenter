"use client";

import Image from "next/image";
import Link from "next/link";
import { useStorefront } from "@/components/site/storefront-provider";
import type { Product } from "@/lib/site-data";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { formatPrice, rememberViewed } = useStorefront();

  return (
    <article className="group overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link
          href={`/shop/${product.slug}`}
          onClick={() => rememberViewed(product.slug)}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">View {product.name}</span>
        </Link>
        <Image
          src={product.gallery[0]}
          alt={`${product.name} shown on a model with polished pixie styling.`}
          fill
          priority={priority}
          sizes="(max-width: 1280px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        {product.gallery[1] ? (
          <Image
            src={product.gallery[1]}
            alt={`${product.name} alternate view showing the lace finish and side profile.`}
            fill
            sizes="(max-width: 1280px) 50vw, 25vw"
            className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-start p-4">
          <span className="badge">{product.status}</span>
        </div>
      </div>

      <div className="border border-t-0 border-[var(--color-border)] bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {product.type}
            </p>
            <h3 className="mt-2 font-serif text-3xl leading-none text-[var(--color-espresso)]">
              {product.name}
            </h3>
          </div>
          <p className="text-right text-sm font-semibold text-[var(--color-burgundy)]">
            {product.price === 0 ? "Free" : `From ${formatPrice(product.price)}`}
          </p>
        </div>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{product.shortBenefit}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--color-burgundy)]">
          {product.dispatchEstimate}
        </p>
        <Link
          href={`/shop/${product.slug}`}
          onClick={() => rememberViewed(product.slug)}
          className="button-ghost mt-4 inline-flex px-0"
        >
          {product.kind === "wig" ? "View product" : "View details"}
        </Link>
      </div>
    </article>
  );
}
