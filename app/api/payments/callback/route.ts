import { NextResponse, type NextRequest } from "next/server";
import { verifyAndApplyPayment } from "@/lib/commerce/payment-service";
import { referenceSchema } from "@/lib/commerce/schemas";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("order") ?? "";
  const token = request.nextUrl.searchParams.get("token") ?? "";

  try {
    const reference = referenceSchema.parse(request.nextUrl.searchParams.get("reference"));
    const order = await verifyAndApplyPayment({
      reference,
      mock: request.nextUrl.searchParams.get("mock") === "1",
    });
    const destination = new URL(
      order.paymentStatus === "successful" ? "/checkout/success" : "/checkout/failed",
      request.url,
    );
    destination.searchParams.set("order", order.id);
    destination.searchParams.set("token", token);
    return NextResponse.redirect(destination);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "paystack.callback_error",
        orderId,
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
    const destination = new URL("/checkout/failed", request.url);
    destination.searchParams.set("order", orderId);
    destination.searchParams.set("token", token);
    return NextResponse.redirect(destination);
  }
}
