import { notFound } from "next/navigation";
import { getCurrentFirebaseUser } from "@/lib/commerce/firebase-auth";
import { getOrderById } from "@/lib/commerce/order-store";
import { formatNaira } from "@/lib/commerce/pricing";

export default async function AccountOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const user = await getCurrentFirebaseUser();
  const { orderId } = await params;
  const order = await getOrderById(orderId);
  if (!user || !order || order.customerUserId !== user.uid) notFound();

  return (
    <section className="py-10">
      <p className="text-[12px] uppercase tracking-[0.18em]">Order {order.orderNumber}</p>
      <h1 className="instrument-serif mt-3 text-5xl capitalize">{order.fulfilmentStatus.replaceAll("_", " ")}</h1>
      <div className="mt-8 border border-black/15 p-5">
        {order.items.map((item) => <div key={`${item.slug}-${JSON.stringify(item.variants)}`} className="flex justify-between gap-5 border-b border-black/10 py-4 text-[14px]"><span>{item.name} x {item.quantity}<small className="mt-1 block text-black/50">{Object.values(item.variants).join(" / ")}</small></span><span>{formatNaira(item.lineTotal)}</span></div>)}
        <p className="mt-5 text-right font-semibold">Total {formatNaira(order.total)}</p>
      </div>
    </section>
  );
}
