# Commerce architecture

## Runtime boundaries

- The browser stores only cart product slugs, quantities, and selected option values.
- `POST /api/checkout/quote` and `POST /api/payments/initialize` reload products from the server catalog and recalculate NGN prices and shipping.
- Paystack's secret key is read only by Node.js route handlers. It is never returned to the browser.
- Firebase Authentication is accessed through server routes. Email/password and Google sign-in both issue ID and refresh tokens as HTTP-only cookies.
- Firestore is accessed with a server-only service account through its REST API. When Firebase credentials are absent, an in-memory store is allowed only outside production.

## Firestore collections

- `users/{uid}`: customer profile, role, contact details, default address, timestamps.
- `orders/{orderId}`: immutable customer, shipping, product, variant, and price snapshots plus payment and fulfilment status.
- `payments/{reference}`: reserved for gateway transaction records.
- `products/{productId}` and `categories/{categoryId}`: managed catalog and inventory records.
- `shippingZones/{zoneId}`: server-readable delivery rates and estimates.
- `webhookEvents/{eventHash}`: idempotency record committed atomically with an order update.
- `inventoryMovements/{movementId}` and `auditLogs/{logId}`: server-written operational history.

## Payment sequence

1. Checkout input is validated with Zod.
2. The server validates every product, quantity, and variant, then calculates shipping and total.
3. A pending order and server-generated Paystack reference are stored.
4. Paystack is initialized with amount in kobo, NGN currency, callback URL, and order metadata.
5. The customer completes hosted Paystack checkout.
6. The callback verifies the reference directly with Paystack before showing success.
7. The webhook verifies `x-paystack-signature` using HMAC-SHA512 and independently re-verifies the transaction.
8. Reference, amount, and currency must all match. Firestore commits the order update with an event-id precondition so duplicate delivery is harmless.

## Inventory strategy

Inventory is reduced only after a confirmed payment. This avoids locking stock for abandoned payments. Production inventory documents should be included in the same Firestore commit as the successful payment; the static catalog currently uses availability flags and does not expose mutable stock quantities.

## Setup

1. Copy `.env.example` to `.env.local` and fill in Firebase web configuration, service-account values, Paystack keys, and the public `APP_URL`.
2. In Firebase Authentication, enable Email/Password and Google sign-in.
3. In the Google OAuth web client, authorize `http://localhost:3000` for development and the exact production HTTPS origin before deployment.
4. Deploy rules and indexes with `firebase deploy --only firestore:rules,firestore:indexes,storage`.
5. Grant administrators the custom claim `{ "admin": true }` using a trusted Firebase administration script or console workflow.
6. In Paystack Dashboard, set the webhook URL to `https://YOUR_DOMAIN/api/payments/webhook`.
7. Keep `PAYSTACK_MOCK=false` in production. Use Paystack test keys until the complete test transaction and webhook flow has been verified.
8. Run `npm run lint`, `npm test`, and `npm run build` before deployment.

## Operations

- Logs are structured JSON and intentionally omit secrets, authorization headers, and full customer records.
- Rotate any key that has been shared in chat or another non-secret channel before enabling live payments.
- Set `APP_URL` to the exact HTTPS production origin so Paystack callbacks cannot be redirected to an untrusted host.
