import { verifyAndApplyPayment } from "@/lib/commerce/payment-service";
import { referenceSchema } from "@/lib/commerce/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { reference?: unknown };
    const reference = referenceSchema.parse(body.reference);
    const order = await verifyAndApplyPayment({ reference });
    return Response.json({ orderId: order.id, paymentStatus: order.paymentStatus });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "paystack.verification_error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
    return Response.json({ error: "Payment verification failed." }, { status: 400 });
  }
}
