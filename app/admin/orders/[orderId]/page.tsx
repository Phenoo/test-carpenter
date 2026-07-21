import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/commerce/order-store";
import { formatNaira } from "@/lib/commerce/pricing";

export default async function AdminOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const order = await getOrderById((await params).orderId); if (!order) notFound();
  return <section className="py-8"><p className="text-[12px] uppercase tracking-[0.16em]">Order</p><h1 className="instrument-serif mt-2 text-5xl">{order.orderNumber}</h1><div className="mt-8 grid gap-5 md:grid-cols-2"><div className="bg-white p-5"><p>{order.customer.firstName} {order.customer.lastName}</p><p className="mt-2 text-[13px] text-black/60">{order.customer.email}<br />{order.customer.phone}</p></div><div className="bg-white p-5"><p className="capitalize">Payment: {order.paymentStatus}</p><p className="mt-2 capitalize">Fulfilment: {order.fulfilmentStatus.replaceAll("_", " ")}</p><p className="mt-2 font-semibold">{formatNaira(order.total)}</p></div></div></section>;
}
