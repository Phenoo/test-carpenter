import { z } from "zod";

export const cartLineSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  quantity: z.number().int().min(1).max(10),
  selections: z.array(z.string().trim().min(1).max(80)).max(8).default([]),
});

export const customerSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: z.email().trim().toLowerCase(),
  phone: z.string().trim().min(7).max(24),
});

export const shippingAddressSchema = z.object({
  addressLine1: z.string().trim().min(5).max(160),
  addressLine2: z.string().trim().max(160).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().min(2).max(80),
  deliveryInstructions: z.string().trim().max(500).optional().or(z.literal("")),
});

export const checkoutSchema = z.object({
  customer: customerSchema,
  shippingAddress: shippingAddressSchema,
  items: z.array(cartLineSchema).min(1).max(40),
});

export const quoteSchema = z.object({
  shippingAddress: shippingAddressSchema,
  items: z.array(cartLineSchema).min(1).max(40),
});

export const referenceSchema = z
  .string()
  .trim()
  .min(8)
  .max(120)
  .regex(/^[A-Za-z0-9._-]+$/);

export type CheckoutInput = z.infer<typeof checkoutSchema>;
