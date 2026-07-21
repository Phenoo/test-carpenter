"use client";

import Link from "next/link";
import { Check, CircleX, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Order } from "@/lib/commerce/types";

type PublicOrder = Omit<
  Order,
  "accessToken" | "paystackReference" | "payment" | "trackingNumber" | "deliveryProvider" | "internalNotes"
>;

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CheckoutResult({ successful }: { successful: boolean }) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const token = searchParams.get("token");
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId && token));

  useEffect(() => {
    if (!orderId || !token) return;

    fetch(`/api/orders/${encodeURIComponent(orderId)}?token=${encodeURIComponent(token)}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Order not found");
        return response.json() as Promise<{ order: PublicOrder }>;
      })
      .then((payload) => {
        setOrder(payload.order);
        if (payload.order.paymentStatus === "successful") {
          window.localStorage.removeItem("hair-mswilliams-cart");
        }
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId, token]);

  const isPaid = successful && order?.paymentStatus === "successful";

  return (
    <main id="main-content" className="min-h-screen bg-white px-5 py-16 text-black">
      <div className="mx-auto max-w-3xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
          {isPaid ? <Check className="h-6 w-6" /> : <CircleX className="h-6 w-6" />}
        </div>
        <p className="mt-8 text-[12px] uppercase tracking-[0.2em]">Payment status</p>
        <h1 className="instrument-serif mt-3 text-5xl tracking-[-0.04em] md:text-7xl">
          {loading ? "Confirming your order..." : isPaid ? "Payment confirmed." : "Payment not completed."}
        </h1>
        <p className="mt-5 max-w-2xl text-[14px] leading-7 text-black/60">
          {isPaid
            ? "Thank you. Your order is secured and has moved into processing. Keep this page as your receipt."
            : "No successful charge has been applied to this order. You can return to checkout and try again."}
        </p>

        {order ? (
          <section className="mt-10 border border-black/15 p-5 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-5">
              <div>
                <p className="text-[12px] uppercase tracking-[0.16em] text-black/50">Order number</p>
                <p className="mt-2 font-medium">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] uppercase tracking-[0.16em] text-black/50">Total</p>
                <p className="mt-2 font-medium">{formatNaira(order.total)}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-4">
              {order.items.map((item) => (
                <li key={`${item.slug}-${JSON.stringify(item.variants)}`} className="flex justify-between gap-5 text-[14px]">
                  <div>
                    <p>{item.name} x {item.quantity}</p>
                    <p className="mt-1 text-[12px] text-black/50">{Object.values(item.variants).join(" / ")}</p>
                  </div>
                  <p>{formatNaira(item.lineTotal)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-black/10 pt-5 text-[13px] leading-6 text-black/60">
              <p>{order.customer.firstName} {order.customer.lastName}</p>
              <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </section>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Link href={isPaid ? "/shop" : "/checkout"} className="inline-flex bg-black px-6 py-3 text-[14px] text-white">
            {isPaid ? "Continue shopping" : "Return to checkout"}
          </Link>
          {order ? (
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 border border-black px-6 py-3 text-[14px]">
              <Printer className="h-4 w-4" /> Print receipt
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
