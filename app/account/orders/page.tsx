import Link from "next/link";
import { getCurrentFirebaseUser } from "@/lib/commerce/firebase-auth";
import { listCustomerOrders } from "@/lib/commerce/order-store";
import { formatNaira } from "@/lib/commerce/pricing";

export default async function OrdersPage() {
  const user = await getCurrentFirebaseUser();
  const orders = user ? await listCustomerOrders(user.uid) : [];

  return (
    <section className="py-10">
      <h1 className="instrument-serif text-5xl">Your orders</h1>
      {orders.length ? (
        <div className="mt-8 grid gap-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="grid gap-3 border border-black/15 p-5 transition hover:border-black sm:grid-cols-4">
              <span>{order.orderNumber}</span><span className="capitalize">{order.paymentStatus}</span><span className="capitalize">{order.fulfilmentStatus.replaceAll("_", " ")}</span><span className="sm:text-right">{formatNaira(order.total)}</span>
            </Link>
          ))}
        </div>
      ) : <p className="mt-6 text-[14px] text-black/60">No orders yet.</p>}
    </section>
  );
}
