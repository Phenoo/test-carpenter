import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutResult } from "@/components/checkout/checkout-result";

export const metadata: Metadata = { title: "Payment Not Completed", robots: { index: false, follow: false } };

export default function CheckoutFailedPage() {
  return <Suspense fallback={<div className="min-h-screen bg-white" />}><CheckoutResult successful={false} /></Suspense>;
}
