import "server-only";

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { calculateServerQuote } from "./pricing";
import { createOrder, getOrderByReference, markOrderPayment } from "./order-store";
import { initializePaystackTransaction, verifyPaystackTransaction } from "./paystack";
import type { CheckoutInput } from "./schemas";
import type { Order, PaymentDetails, PaymentStatus, PaystackTransaction } from "./types";

function compactDate() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

function transactionReference() {
  return `DHM-${Date.now()}-${randomBytes(4).toString("hex")}`;
}

function orderNumber() {
  return `DHM-${compactDate()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function paymentStatusFromPaystack(status: string): PaymentStatus {
  switch (status.toLowerCase()) {
    case "success":
      return "successful";
    case "failed":
      return "failed";
    case "abandoned":
      return "abandoned";
    case "reversed":
      return "refunded";
    case "ongoing":
    case "processing":
    case "pending":
    case "queued":
      return "processing";
    default:
      return "pending";
  }
}

function paymentDetails(transaction: PaystackTransaction): PaymentDetails {
  const status = paymentStatusFromPaystack(transaction.status);

  return {
    transactionId: String(transaction.id),
    status,
    channel: transaction.channel,
    gatewayResponse: transaction.gateway_response,
    amountPaid: transaction.amount / 100,
    paidAt: transaction.paid_at ?? undefined,
    verifiedAt: new Date().toISOString(),
  };
}

export async function createCheckoutOrder(input: CheckoutInput, appUrl: string, customerUserId: string | null = null) {
  const quote = calculateServerQuote(input.items, input.shippingAddress);
  const now = new Date().toISOString();
  const reference = transactionReference();
  const order: Order = {
    id: randomUUID(),
    orderNumber: orderNumber(),
    accessToken: randomBytes(24).toString("hex"),
    customerUserId,
    customer: input.customer,
    shippingAddress: input.shippingAddress,
    items: quote.items,
    subtotal: quote.subtotal,
    shippingFee: quote.shippingFee,
    discount: quote.discount,
    tax: quote.tax,
    total: quote.total,
    currency: quote.currency,
    paymentStatus: "pending",
    fulfilmentStatus: "pending",
    paystackReference: reference,
    payment: { status: "pending" },
    trackingNumber: null,
    deliveryProvider: null,
    internalNotes: null,
    createdAt: now,
    updatedAt: now,
    paymentDate: null,
  };

  await createOrder(order);

  const callbackUrl = new URL("/api/payments/callback", appUrl);
  callbackUrl.searchParams.set("order", order.id);
  callbackUrl.searchParams.set("token", order.accessToken);

  try {
    const transaction = await initializePaystackTransaction({
      email: order.customer.email,
      amountMinor: order.total * 100,
      currency: order.currency,
      reference,
      callbackUrl: callbackUrl.toString(),
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        itemCount: order.items.reduce((count, item) => count + item.quantity, 0),
      },
    });

    console.info(JSON.stringify({ event: "paystack.initialized", orderId: order.id, reference }));
    return { order, authorizationUrl: transaction.authorization_url };
  } catch (error) {
    await markOrderPayment({
      orderId: order.id,
      paymentStatus: "failed",
      payment: { status: "failed", gatewayResponse: "Transaction initialization failed" },
    });
    console.error(
      JSON.stringify({
        event: "paystack.initialization_failed",
        orderId: order.id,
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
    throw error;
  }
}

export async function verifyAndApplyPayment({
  reference,
  mock = false,
  eventId,
}: {
  reference: string;
  mock?: boolean;
  eventId?: string;
}) {
  const order = await getOrderByReference(reference);
  if (!order) throw new Error("No order matches this payment reference.");
  if (order.paymentStatus === "successful") return order;

  const transaction = await verifyPaystackTransaction(reference, mock);
  const expectedMinorAmount = order.total * 100;
  const receivedAmount = mock ? expectedMinorAmount : transaction.amount;

  if (
    transaction.reference !== order.paystackReference ||
    receivedAmount !== expectedMinorAmount ||
    transaction.currency !== order.currency
  ) {
    console.error(
      JSON.stringify({
        event: "paystack.verification_mismatch",
        orderId: order.id,
        reference,
      }),
    );
    throw new Error("Payment amount, currency, or reference did not match the order.");
  }

  const status = paymentStatusFromPaystack(transaction.status);
  const details = paymentDetails({ ...transaction, amount: receivedAmount });
  const updated = await markOrderPayment({
    orderId: order.id,
    paymentStatus: status,
    payment: details,
    eventId,
  });

  console.info(JSON.stringify({ event: "paystack.verified", orderId: order.id, reference, status }));
  return updated ?? order;
}

export function webhookEventId(rawBody: string) {
  return createHash("sha256").update(rawBody).digest("hex");
}
