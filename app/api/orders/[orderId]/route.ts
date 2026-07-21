import { getOrderById } from "@/lib/commerce/order-store";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const token = new URL(request.url).searchParams.get("token");
  const order = await getOrderById(orderId);

  if (!order || !token || token !== order.accessToken) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  return Response.json({
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customer,
      shippingAddress: order.shippingAddress,
      items: order.items,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discount: order.discount,
      tax: order.tax,
      total: order.total,
      currency: order.currency,
      paymentStatus: order.paymentStatus,
      fulfilmentStatus: order.fulfilmentStatus,
      createdAt: order.createdAt,
      paymentDate: order.paymentDate,
    },
  });
}
