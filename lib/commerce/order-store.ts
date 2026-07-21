import "server-only";

import {
  commitDocumentUpdate,
  createDocument,
  getDocument,
  isFirestoreConfigured,
  listDocuments,
  queryByField,
} from "./firestore-rest";
import type { Order, PaymentDetails, PaymentStatus } from "./types";

declare global {
  var __demutzOrders: Map<string, Order> | undefined;
  var __demutzWebhookEvents: Set<string> | undefined;
}

const memoryOrders = globalThis.__demutzOrders ?? new Map<string, Order>();
const memoryWebhookEvents = globalThis.__demutzWebhookEvents ?? new Set<string>();
globalThis.__demutzOrders = memoryOrders;
globalThis.__demutzWebhookEvents = memoryWebhookEvents;

function allowMemoryStore() {
  return process.env.NODE_ENV !== "production";
}

function assertStorageAvailable() {
  if (!isFirestoreConfigured() && !allowMemoryStore()) {
    throw new Error("Firebase Admin credentials are required in production.");
  }
}

export async function createOrder(order: Order) {
  assertStorageAvailable();

  if (isFirestoreConfigured()) {
    await createDocument("orders", order.id, order as unknown as Record<string, unknown>);
    return;
  }

  memoryOrders.set(order.id, structuredClone(order));
}

export async function getOrderById(id: string) {
  assertStorageAvailable();

  if (isFirestoreConfigured()) {
    return (await getDocument<Order>(`orders/${encodeURIComponent(id)}`))?.data ?? null;
  }

  return memoryOrders.get(id) ?? null;
}

export async function getOrderByReference(reference: string) {
  assertStorageAvailable();

  if (isFirestoreConfigured()) {
    return (await queryByField<Order>("orders", "paystackReference", reference))[0]?.data ?? null;
  }

  return Array.from(memoryOrders.values()).find(
    (order) => order.paystackReference === reference,
  ) ?? null;
}

export async function listCustomerOrders(userId: string) {
  assertStorageAvailable();

  if (isFirestoreConfigured()) {
    return (await queryByField<Order>("orders", "customerUserId", userId)).map((row) => row.data);
  }

  return Array.from(memoryOrders.values()).filter((order) => order.customerUserId === userId);
}

export async function listOrders() {
  assertStorageAvailable();
  return isFirestoreConfigured()
    ? listDocuments<Order>("orders")
    : Array.from(memoryOrders.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markOrderPayment({
  orderId,
  paymentStatus,
  payment,
  eventId,
}: {
  orderId: string;
  paymentStatus: PaymentStatus;
  payment: PaymentDetails;
  eventId?: string;
}) {
  assertStorageAvailable();

  if (!isFirestoreConfigured()) {
    if (eventId && memoryWebhookEvents.has(eventId)) return memoryOrders.get(orderId) ?? null;
    const existing = memoryOrders.get(orderId);
    if (!existing) return null;
    if (existing.paymentStatus === "successful" && paymentStatus === "successful") {
      if (eventId) memoryWebhookEvents.add(eventId);
      return existing;
    }

    const now = new Date().toISOString();
    const updated: Order = {
      ...existing,
      paymentStatus,
      payment,
      paymentDate: paymentStatus === "successful" ? payment.paidAt ?? now : existing.paymentDate,
      fulfilmentStatus:
        paymentStatus === "successful" && existing.fulfilmentStatus === "pending"
          ? "processing"
          : existing.fulfilmentStatus,
      updatedAt: now,
    };
    memoryOrders.set(orderId, updated);
    if (eventId) memoryWebhookEvents.add(eventId);
    return updated;
  }

  const stored = await getDocument<Order>(`orders/${encodeURIComponent(orderId)}`);
  if (!stored) return null;
  if (eventId && (await getDocument(`webhookEvents/${encodeURIComponent(eventId)}`))) {
    return stored.data;
  }
  if (stored.data.paymentStatus === "successful" && paymentStatus === "successful") {
    return stored.data;
  }

  const now = new Date().toISOString();
  const updated: Order = {
    ...stored.data,
    paymentStatus,
    payment,
    paymentDate: paymentStatus === "successful" ? payment.paidAt ?? now : stored.data.paymentDate,
    fulfilmentStatus:
      paymentStatus === "successful" && stored.data.fulfilmentStatus === "pending"
        ? "processing"
        : stored.data.fulfilmentStatus,
    updatedAt: now,
  };

  await commitDocumentUpdate({
    path: `orders/${orderId}`,
    data: updated as unknown as Record<string, unknown>,
    updateTime: stored.updateTime,
    event: eventId
      ? {
          id: eventId,
          data: { eventId, orderId, paymentStatus, processedAt: now },
        }
      : undefined,
  });

  return updated;
}
