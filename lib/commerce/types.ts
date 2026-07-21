export type PaymentStatus =
  | "pending"
  | "processing"
  | "successful"
  | "failed"
  | "abandoned"
  | "refunded"
  | "partially_refunded";

export type FulfilmentStatus =
  | "pending"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export type CartLineInput = {
  slug: string;
  quantity: number;
  selections: string[];
};

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ShippingAddress = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  deliveryInstructions?: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  sku: string;
  variants: Record<string, string>;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type PaymentDetails = {
  transactionId?: string;
  status: PaymentStatus;
  channel?: string;
  gatewayResponse?: string;
  amountPaid?: number;
  paidAt?: string;
  verifiedAt?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  accessToken: string;
  customerUserId: string | null;
  customer: CheckoutCustomer;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  currency: "NGN";
  paymentStatus: PaymentStatus;
  fulfilmentStatus: FulfilmentStatus;
  paystackReference: string;
  payment: PaymentDetails;
  trackingNumber: string | null;
  deliveryProvider: string | null;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  paymentDate: string | null;
};

export type ServerQuote = Pick<
  Order,
  "items" | "subtotal" | "shippingFee" | "discount" | "tax" | "total" | "currency"
> & {
  estimatedDelivery: string;
};

export type PaystackTransaction = {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  gateway_response?: string;
  paid_at?: string | null;
  metadata?: Record<string, unknown> | null;
};
