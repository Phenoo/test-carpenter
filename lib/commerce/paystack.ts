import "server-only";

import type { PaystackTransaction } from "./types";
import { verifyWebhookSignature } from "./paystack-signature";

const PAYSTACK_API = "https://api.paystack.co";

function secretKey() {
  const value = process.env.PAYSTACK_SECRET_KEY;
  if (!value) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  return value;
}

async function paystackRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${secretKey()}`,
      "content-type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response.json()) as {
    status: boolean;
    message: string;
    data: T;
  };

  if (!response.ok || !payload.status) {
    throw new Error(payload.message || `Paystack request failed (${response.status}).`);
  }

  return payload.data;
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountMinor: number;
  currency: "NGN";
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}) {
  if (process.env.PAYSTACK_MOCK === "true" && process.env.NODE_ENV !== "production") {
    return {
      authorization_url: `${input.callbackUrl}&reference=${encodeURIComponent(input.reference)}&mock=1`,
      access_code: "mock-access-code",
      reference: input.reference,
    };
  }

  return paystackRequest<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountMinor,
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });
}

export async function verifyPaystackTransaction(reference: string, mock = false) {
  if (mock && process.env.PAYSTACK_MOCK === "true" && process.env.NODE_ENV !== "production") {
    return {
      id: 1,
      status: "success",
      reference,
      amount: 0,
      currency: "NGN",
      channel: "mock",
      gateway_response: "Mock payment approved",
      paid_at: new Date().toISOString(),
    } satisfies PaystackTransaction;
  }

  return paystackRequest<PaystackTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
}

export function verifyPaystackSignature(rawBody: string, signature: string | null) {
  return verifyWebhookSignature(rawBody, signature, secretKey());
}
