import { notFound } from "next/navigation";
import { getShopProduct } from "@/lib/shop-collection-data";
export default async function AdminProductPage({ params }: { params: Promise<{ productId: string }> }) { const product = getShopProduct((await params).productId); if (!product) notFound(); return <section className="py-8"><p className="text-[12px] uppercase tracking-[0.16em]">Product</p><h1 className="instrument-serif mt-2 text-5xl">{product.title}</h1><p className="mt-5 max-w-2xl text-[14px] leading-7 text-black/60">{product.description}</p></section>; }
