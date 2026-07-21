import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { canTransitionFulfilment } from "../lib/commerce/order-status.ts";
import { verifyWebhookSignature } from "../lib/commerce/paystack-signature.ts";
import { cartLineSchema, checkoutSchema } from "../lib/commerce/schemas.ts";
import { calculateShipping, FREE_SHIPPING_THRESHOLD } from "../lib/commerce/shipping.ts";

const address = {
  addressLine1: "12 Example Street",
  city: "Ikeja",
  state: "Lagos",
  country: "Nigeria",
};

test("shipping applies Lagos, Nigeria, international, free, and digital rates", () => {
  assert.equal(calculateShipping(100_000, address, true).fee, 5_000);
  assert.equal(calculateShipping(100_000, { ...address, state: "Oyo" }, true).fee, 8_500);
  assert.equal(calculateShipping(100_000, { ...address, country: "Ghana" }, true).fee, 35_000);
  assert.equal(calculateShipping(FREE_SHIPPING_THRESHOLD, address, true).fee, 0);
  assert.equal(calculateShipping(10_000, address, false).fee, 0);
});

test("cart validation rejects manipulated quantities and slugs", () => {
  assert.equal(cartLineSchema.safeParse({ slug: "aliyah-unit", quantity: 1, selections: [] }).success, true);
  assert.equal(cartLineSchema.safeParse({ slug: "../../admin", quantity: 1, selections: [] }).success, false);
  assert.equal(cartLineSchema.safeParse({ slug: "aliyah-unit", quantity: 999, selections: [] }).success, false);
});

test("checkout validation requires customer, address, and cart data", () => {
  assert.equal(checkoutSchema.safeParse({ customer: {}, shippingAddress: {}, items: [] }).success, false);
});

test("Paystack signatures use the raw body and reject modifications", () => {
  const secret = "test-secret";
  const body = JSON.stringify({ event: "charge.success", data: { reference: "DHM-123" } });
  const signature = createHmac("sha512", secret).update(body).digest("hex");
  assert.equal(verifyWebhookSignature(body, signature, secret), true);
  assert.equal(verifyWebhookSignature(`${body} `, signature, secret), false);
});

test("fulfilment transitions reject impossible jumps", () => {
  assert.equal(canTransitionFulfilment("pending", "processing"), true);
  assert.equal(canTransitionFulfilment("pending", "delivered"), false);
  assert.equal(canTransitionFulfilment("delivered", "refunded"), true);
});
