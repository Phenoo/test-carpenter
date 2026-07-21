import { listOrders } from "@/lib/commerce/order-store";
import { formatNaira } from "@/lib/commerce/pricing";

export default async function AdminPage() {
  const orders = await listOrders();
  const paid = orders.filter((order) => order.paymentStatus === "successful");
  const revenue = paid.reduce((sum, order) => sum + order.total, 0);
  return <section className="py-8"><h1 className="instrument-serif text-5xl">Overview</h1><div className="mt-8 grid gap-4 md:grid-cols-4"><Card label="Revenue" value={formatNaira(revenue)} /><Card label="Orders" value={String(orders.length)} /><Card label="Paid" value={String(paid.length)} /><Card label="Awaiting payment" value={String(orders.filter((order) => order.paymentStatus === "pending").length)} /></div></section>;
}
function Card({ label, value }: { label: string; value: string }) { return <div className="border border-black/15 bg-white p-5"><p className="text-[12px] uppercase tracking-[0.16em] text-black/50">{label}</p><p className="instrument-serif mt-3 text-3xl">{value}</p></div>; }
