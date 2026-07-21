import { getShopProduct } from "@/lib/shop-collection-data";
import type { CartLineInput, OrderItem, ServerQuote, ShippingAddress } from "./types";
import { calculateShipping } from "./shipping";

const USD_TO_NGN = 1540;

const physicalProductSlugs = new Set([
  "aliyah-unit",
  "custom-frontal-unit",
  "finishing-sheen-mist",
  "hair-serum",
  "hd-wig-cap",
  "janelle-unit",
  "lace-glue",
  "lace-glue-remover",
  "lace-melt-band",
  "lace-melting-spray",
  "lori-unit",
  "megan-unit",
  "rih-rih-unit",
]);

function priceInNaira(priceUsd: number) {
  return Math.round(priceUsd * USD_TO_NGN);
}

function validateVariants(slug: string, selections: string[]) {
  const product = getShopProduct(slug);

  if (!product) {
    throw new CommercePricingError(`Product ${slug} does not exist.`);
  }

  if (product.options.length !== selections.length) {
    throw new CommercePricingError(`Choose every option for ${product.title}.`);
  }

  return product.options.reduce<Record<string, string>>((variants, option, index) => {
    const value = selections[index];

    if (!value || !option.values.includes(value)) {
      throw new CommercePricingError(`Invalid ${option.name.toLowerCase()} for ${product.title}.`);
    }

    variants[option.name] = value;
    return variants;
  }, {});
}

export class CommercePricingError extends Error {}

export function calculateServerQuote(
  cartLines: CartLineInput[],
  shippingAddress: ShippingAddress,
): ServerQuote {
  const mergedLines = new Map<string, CartLineInput>();

  for (const line of cartLines) {
    const key = [line.slug, ...line.selections].join("|");
    const existing = mergedLines.get(key);
    const quantity = (existing?.quantity ?? 0) + line.quantity;

    if (quantity > 10) {
      throw new CommercePricingError("A maximum of 10 units is allowed per configured item.");
    }

    mergedLines.set(key, { ...line, quantity });
  }

  const items: OrderItem[] = Array.from(mergedLines.values()).map((line) => {
    const product = getShopProduct(line.slug);

    if (!product || !product.available) {
      throw new CommercePricingError(`${product?.title ?? line.slug} is not available.`);
    }

    const variants = validateVariants(line.slug, line.selections);
    const unitPrice = priceInNaira(product.priceUsd);

    return {
      productId: product.slug,
      slug: product.slug,
      name: product.title,
      image: product.images[0] ?? "",
      sku: product.handle.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 48),
      variants,
      unitPrice,
      quantity: line.quantity,
      lineTotal: unitPrice * line.quantity,
    };
  });

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const hasPhysicalItems = items.some((item) => physicalProductSlugs.has(item.slug));
  const shipping = calculateShipping(subtotal, shippingAddress, hasPhysicalItems);
  const discount = 0;
  const tax = 0;

  return {
    items,
    subtotal,
    shippingFee: shipping.fee,
    discount,
    tax,
    total: subtotal + shipping.fee - discount + tax,
    currency: "NGN",
    estimatedDelivery: shipping.estimate,
  };
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}
