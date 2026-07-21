import Link from "next/link";
import { getCurrentFirebaseUser } from "@/lib/commerce/firebase-auth";
import { listCustomerOrders } from "@/lib/commerce/order-store";
import { formatNaira } from "@/lib/commerce/pricing";

export default async function AccountPage() {
  const user = await getCurrentFirebaseUser();
  const orders = user ? await listCustomerOrders(user.uid) : [];
  const paidTotal = orders.filter((order) => order.paymentStatus === "successful").reduce((sum, order) => sum + order.total, 0);

  return (
    <section className="py-10">
      <h1 className="instrument-serif text-5xl">Account overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Paid orders" value={String(orders.filter((order) => order.paymentStatus === "successful").length)} />
        <Stat label="Total spend" value={formatNaira(paidTotal)} />
      </div>
      <Link href="/account/orders" className="mt-8 inline-flex bg-black px-5 py-3 text-white text-[14px] ">View order history</Link>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="border border-black/15 p-5"><p className="text-[12px] uppercase tracking-[0.16em] text-black/50">{label}</p><p className="instrument-serif mt-3 text-4xl">{value}</p></div>;
}
