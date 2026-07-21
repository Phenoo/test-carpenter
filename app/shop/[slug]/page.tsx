import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopProductDetail } from "@/components/shop/shop-product-detail";
import { ProductDetailClient } from "@/components/site/product-detail-client";
import { getAllRouteUrls, getProduct, siteConfig } from "@/lib/site-data";
import { getShopProduct, shopProducts } from "@/lib/shop-collection-data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const existingParams = getAllRouteUrls()
    .filter((url) => url.startsWith("/shop/") && url !== "/shop")
    .map((url) => ({ slug: url.replace("/shop/", "") }));
  const replicaParams = shopProducts.map((product) => ({ slug: product.slug }));

  return [...existingParams, ...replicaParams];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const shopProduct = getShopProduct(slug);

  if (shopProduct) {
    return {
      title: shopProduct.title,
      description: shopProduct.description,
      alternates: {
        canonical: `/shop/${shopProduct.slug}`,
      },
      openGraph: {
        title: `${shopProduct.title} | demutzhair`,
        description: shopProduct.description,
        images: [
          {
            url: shopProduct.images[0],
            width: 1200,
            height: 1200,
            alt: shopProduct.alt,
          },
        ],
      },
    };
  }

  const product = getProduct(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/shop/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | demutzhair`,
      description: product.description,
      images: [
        {
          url: product.gallery[0],
          width: 1400,
          height: 1600,
          alt: `${product.name} product image`,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const shopProduct = getShopProduct(slug);

  if (shopProduct) {
    return (
      <main id="main-content" className="flex-1">
        <ShopProductDetail key={shopProduct.slug} product={shopProduct} />
      </main>
    );
  }

  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: siteConfig.name,
    description: product.description,
    image: product.gallery,
    category: product.type,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: product.price,
      availability:
        product.status === "Sold Out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      url: `${siteConfig.domain}/shop/${product.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main-content" className="flex-1">
        <ProductDetailClient product={product} />
      </main>
    </>
  );
}
