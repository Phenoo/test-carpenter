"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/product-card";
import { products, type ProductType } from "@/lib/site-data";

const collectionOptions: Array<"All collections" | ProductType> = [
  "All collections",
  "Bespoke Pixie Units",
  "Ready-to-Ship Units",
  "Custom Frontal Units",
  "Glueless Closure Units",
  "Hair Essentials",
  "Education",
  "Free Resources",
];

const availabilityOptions = ["All availability", "In stock", "Made to order", "Sold out"];
const priceOptions = ["All prices", "Under 100", "100 - 400", "400 - 700", "Over 700"];
const laceOptions = ["All lace", "HD Closure", "Transparent Closure", "HD Frontal", "Swiss Closure"];
const capOptions = ["All sizes", "Petite", "Small", "Medium", "Large"];
const partingOptions = ["All partings", "Left side", "Right side", "Soft middle", "Deep left", "Deep right", "Free part"];
const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low", "Availability"];

function matchesPrice(productPrice: number, filter: string) {
  if (filter === "All prices") {
    return true;
  }

  if (filter === "Under 100") {
    return productPrice < 100;
  }

  if (filter === "100 - 400") {
    return productPrice >= 100 && productPrice <= 400;
  }

  if (filter === "400 - 700") {
    return productPrice > 400 && productPrice <= 700;
  }

  return productPrice > 700;
}

export function ShopPageClient({
  initialCollection = "All collections",
}: {
  initialCollection?: "All collections" | ProductType;
}) {
  const [collection, setCollection] = useState<"All collections" | ProductType>(
    initialCollection,
  );
  const [availability, setAvailability] = useState("All availability");
  const [price, setPrice] = useState("All prices");
  const [lace, setLace] = useState("All lace");
  const [capSize, setCapSize] = useState("All sizes");
  const [parting, setParting] = useState("All partings");
  const [colour, setColour] = useState("All colours");
  const [processing, setProcessing] = useState("All processing times");
  const [sortBy, setSortBy] = useState("Featured");

  const colourOptions = useMemo(
    () => [
      "All colours",
      ...Array.from(
        new Set(products.flatMap((product) => product.colours.map((item) => item.name))),
      ),
    ],
    [],
  );

  const processingOptions = useMemo(
    () => [
      "All processing times",
      ...Array.from(new Set(products.map((product) => product.processingTag))),
    ],
    [],
  );

  const filteredProducts = useMemo(() => {
    const filtered = products
      .filter((product) => collection === "All collections" || product.type === collection)
      .filter((product) => {
        if (availability === "All availability") {
          return true;
        }

        return product.status.toLowerCase() === availability.toLowerCase();
      })
      .filter((product) => matchesPrice(product.price, price))
      .filter((product) => lace === "All lace" || product.laceTypes.includes(lace))
      .filter((product) => capSize === "All sizes" || product.capSizes.includes(capSize))
      .filter((product) => parting === "All partings" || product.partings.includes(parting))
      .filter(
        (product) =>
          colour === "All colours" ||
          product.colours.some((swatch) => swatch.name === colour),
      )
      .filter(
        (product) =>
          processing === "All processing times" || product.processingTag === processing,
      );

    if (sortBy === "Price: Low to High") {
      filtered.sort((left, right) => left.price - right.price);
    } else if (sortBy === "Price: High to Low") {
      filtered.sort((left, right) => right.price - left.price);
    } else if (sortBy === "Availability") {
      filtered.sort((left, right) => left.status.localeCompare(right.status));
    } else if (sortBy === "Newest") {
      filtered.reverse();
    }

    return filtered;
  }, [availability, capSize, collection, colour, lace, parting, price, processing, sortBy]);

  return (
    <section className="section-shell pb-16">
      <div className="grid gap-4 border border-[var(--color-border)] bg-white/75 p-5 md:grid-cols-2 xl:grid-cols-5">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Collection</span>
          <select
            value={collection}
            onChange={(event) =>
              setCollection(event.target.value as "All collections" | ProductType)
            }
            className="form-select"
          >
            {collectionOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Availability</span>
          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
            className="form-select"
          >
            {availabilityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Price</span>
          <select value={price} onChange={(event) => setPrice(event.target.value)} className="form-select">
            {priceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Lace type</span>
          <select value={lace} onChange={(event) => setLace(event.target.value)} className="form-select">
            {laceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="form-select">
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Cap size</span>
          <select value={capSize} onChange={(event) => setCapSize(event.target.value)} className="form-select">
            {capOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Parting</span>
          <select value={parting} onChange={(event) => setParting(event.target.value)} className="form-select">
            {partingOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Colour</span>
          <select value={colour} onChange={(event) => setColour(event.target.value)} className="form-select">
            {colourOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium">Processing</span>
          <select
            value={processing}
            onChange={(event) => setProcessing(event.target.value)}
            className="form-select"
          >
            {processingOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-muted)]">
          {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
        </p>
        <div className="flex flex-wrap gap-2">
          {collectionOptions.slice(1).map((option) => (
            <button
              key={option}
              type="button"
              className={collection === option ? "chip chip-active" : "chip"}
              onClick={() => setCollection(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="panel mt-8 p-8 text-sm leading-7 text-[var(--color-muted)]">
          No products match that filter combination yet. Try widening your lace, size, or
          price selections.
        </div>
      )}
    </section>
  );
}
