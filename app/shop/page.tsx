import { Suspense } from "react";
import {
  ShopCollectionPage,
  ShopCollectionPageSkeleton,
} from "@/components/shop/shop-collection-page";
import { getShopCollection } from "@/lib/shop-collection-data";

export const metadata = {
  title: "Products",
  description:
    "Browse wigs, essentials, and digital products from the Hair by Ms Williams collection.",
};

export default function ShopPage() {
  const collection = getShopCollection("alldeep");

  if (!collection) {
    return null;
  }

  return (
    <Suspense fallback={<ShopCollectionPageSkeleton />}>
      <ShopCollectionPage collection={collection} />
    </Suspense>
  );
}
