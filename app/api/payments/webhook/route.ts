import { verifyAndApplyPayment, webhookEventId } from "@/lib/commerce/payment-service";
import { verifyPaystackSignature } from "@/lib/commerce/paystack";
import { referenceSchema } from "@/lib/commerce/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!verifyPaystackSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: { reference?: unknown };
    };
    const reference = referenceSchema.parse(event.data?.reference);
    await verifyAndApplyPayment({ reference, eventId: webhookEventId(rawBody) });
    return new Response("OK");
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "paystack.webhook_error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
    return new Response("Webhook processing failed", { status: 400 });
  }
}
