import { CommercePricingError } from "@/lib/commerce/pricing";
import { getCurrentFirebaseUser } from "@/lib/commerce/firebase-auth";
import { createCheckoutOrder } from "@/lib/commerce/payment-service";
import { checkRateLimit } from "@/lib/commerce/rate-limit";
import { checkoutSchema } from "@/lib/commerce/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!checkRateLimit(`checkout:${forwardedFor}`)) {
    return Response.json({ error: "Too many checkout attempts. Please wait a minute." }, { status: 429 });
  }

  try {
    const input = checkoutSchema.parse(await request.json());
    const appUrl = process.env.APP_URL;
    if (!appUrl) throw new Error("APP_URL is not configured.");
    const user = await getCurrentFirebaseUser();
    const { order, authorizationUrl } = await createCheckoutOrder(input, appUrl, user?.uid ?? null);

    return Response.json({
      authorizationUrl,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    if (error instanceof CommercePricingError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    const isValidationError = error instanceof Error && error.name === "ZodError";
    if (!isValidationError) {
      console.error(
        JSON.stringify({
          event: "checkout.initialization_error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );
    }
    return Response.json(
      { error: isValidationError ? "Check the highlighted checkout information." : "Payment could not be started. Please try again." },
      { status: isValidationError ? 400 : 500 },
    );
  }
}
