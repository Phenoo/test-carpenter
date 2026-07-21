import type { ShippingAddress } from "./types";

export const FREE_SHIPPING_THRESHOLD = 750_000;

export function calculateShipping(
  subtotal: number,
  address: ShippingAddress,
  hasPhysicalItems: boolean,
) {
  if (!hasPhysicalItems || subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { fee: 0, estimate: hasPhysicalItems ? "3-7 business days" : "Delivered by email" };
  }

  const country = address.country.trim().toLowerCase();
  const state = address.state.trim().toLowerCase();

  if (country === "nigeria" && state === "lagos") {
    return { fee: 5_000, estimate: "1-3 business days" };
  }

  if (country === "nigeria") {
    return { fee: 8_500, estimate: "3-7 business days" };
  }

  return { fee: 35_000, estimate: "7-14 business days" };
}
