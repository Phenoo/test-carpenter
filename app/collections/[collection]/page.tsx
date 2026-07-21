import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ShopCollectionPage,
  ShopCollectionPageSkeleton,
} from "@/components/shop/shop-collection-page";
import { getShopCollection } from "@/lib/shop-collection-data";

type CollectionPageProps = {
  params: Promise<{ collection: string }>;
};

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collection } = await params;
  const data = getShopCollection(collection);

  if (!data) {
    return {};
  }

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `/collections/${collection}`,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;
  const data = getShopCollection(collection);

  if (!data) {
    notFound();
  }

  return (
    <Suspense fallback={<ShopCollectionPageSkeleton />}>
      <ShopCollectionPage collection={data} />
    </Suspense>
  );
}
