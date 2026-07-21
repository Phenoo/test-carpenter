import Link from "next/link";
import { listOrders } from "@/lib/commerce/order-store";
import { formatNaira } from "@/lib/commerce/pricing";

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  return <section className="py-8"><h1 className="instrument-serif text-5xl">Orders</h1><div className="mt-8 grid gap-3">{orders.map((order) => <Link key={order.id} href={`/admin/orders/${order.id}`} className="grid gap-2 border border-black/15 bg-white p-4 md:grid-cols-5"><span>{order.orderNumber}</span><span>{order.customer.firstName} {order.customer.lastName}</span><span>{order.paymentStatus}</span><span>{order.fulfilmentStatus}</span><span className="md:text-right">{formatNaira(order.total)}</span></Link>)}</div></section>;
}
