import { calculateServerQuote, CommercePricingError } from "@/lib/commerce/pricing";
import { quoteSchema } from "@/lib/commerce/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = quoteSchema.parse(await request.json());
    return Response.json({ quote: calculateServerQuote(input.items, input.shippingAddress) });
  } catch (error) {
    if (error instanceof CommercePricingError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    return Response.json({ error: "Check your cart and shipping information." }, { status: 400 });
  }
}
