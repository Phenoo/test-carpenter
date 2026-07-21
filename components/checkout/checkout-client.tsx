"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { ServerQuote } from "@/lib/commerce/types";

type StoredCartItem = {
  key: string;
  slug: string;
  title: string;
  image: string;
  quantity: number;
  priceUsd: number;
  selections: string[];
};

type CheckoutFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryInstructions: string;
};

const CART_STORAGE_KEY = "hair-mswilliams-cart";
const QUOTE_DEBOUNCE_MS = 350;
const COUNTRY_OPTIONS = [
  "Nigeria",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
] as const;

const initialFields: CheckoutFields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Nigeria",
  deliveryInstructions: "",
};

function subscribeToCart(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getCartSnapshot() {
  return window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]";
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  required = true,
}: {
  label: string;
  name: keyof CheckoutFields;
  value: string;
  onChange: (name: keyof CheckoutFields, value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-[13px] font-medium">
      <span>
        {label} {!required ? <span className="font-normal text-black/50">(optional)</span> : null}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-12 rounded-none border border-black/20 bg-white px-4 text-[14px] outline-none transition focus:border-black focus:ring-1 focus:ring-black"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  autoComplete,
  options,
}: {
  label: string;
  name: keyof CheckoutFields;
  value: string;
  onChange: (name: keyof CheckoutFields, value: string) => void;
  autoComplete?: string;
  options: readonly string[];
}) {
  return (
    <label className="grid gap-2 text-[13px] font-medium">
      <span>{label}</span>
      <select
        name={name}
        value={value}
        required
        autoComplete={autoComplete}
        onChange={(event) => onChange(name, event.target.value)}
        className="h-12 rounded-none border border-black/20 bg-white px-4 pr-10 text-[14px] outline-none transition focus:border-black focus:ring-1 focus:ring-black"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function buildShippingAddress(fields: CheckoutFields) {
  return {
    addressLine1: fields.addressLine1,
    addressLine2: fields.addressLine2,
    city: fields.city,
    state: fields.state,
    postalCode: fields.postalCode,
    country: fields.country,
    deliveryInstructions: fields.deliveryInstructions,
  };
}

export function CheckoutClient() {
  const cartSnapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => null);
  const cartItems = useMemo(() => {
    if (cartSnapshot === null) return null;

    try {
      const parsed = JSON.parse(cartSnapshot) as StoredCartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [cartSnapshot]);
  const quoteItems = useMemo(
    () =>
      (cartItems ?? []).map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
        selections: item.selections,
      })),
    [cartItems],
  );
  const [fields, setFields] = useState(initialFields);
  const [quote, setQuote] = useState<ServerQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shippingAddress = useMemo(() => buildShippingAddress(fields), [fields]);
  const isCustomerInfoComplete =
    fields.firstName.trim().length >= 2 &&
    fields.lastName.trim().length >= 2 &&
    fields.email.trim().length >= 3 &&
    fields.phone.trim().length >= 7;
  const isQuoteAddressReady =
    fields.addressLine1.trim().length >= 5 &&
    fields.city.trim().length >= 2 &&
    fields.state.trim().length >= 2 &&
    fields.country.trim().length >= 2;
  const isCheckoutFormComplete = isCustomerInfoComplete && isQuoteAddressReady;

  function updateField(name: keyof CheckoutFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
    setQuote(null);
    setQuoteLoading(false);
    setError(null);
  }

  useEffect(() => {
    if (!quoteItems.length || !isQuoteAddressReady) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setQuoteLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            items: quoteItems,
            shippingAddress,
          }),
          signal: controller.signal,
        });
        const payload = (await response.json()) as { quote?: ServerQuote; error?: string };
        if (!response.ok || !payload.quote) {
          throw new Error(payload.error ?? "Could not calculate total.");
        }

        setQuote(payload.quote);
      } catch (quoteError) {
        if (quoteError instanceof Error && quoteError.name === "AbortError") {
          return;
        }

        setError(quoteError instanceof Error ? quoteError.message : "Could not calculate total.");
      } finally {
        if (!controller.signal.aborted) {
          setQuoteLoading(false);
        }
      }
    }, QUOTE_DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
      setQuoteLoading(false);
    };
  }, [
    isQuoteAddressReady,
    quoteItems,
    shippingAddress,
  ]);

  async function submitCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cartItems?.length || submitting || !isCheckoutFormComplete) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName: fields.firstName,
            lastName: fields.lastName,
            email: fields.email,
            phone: fields.phone,
          },
          shippingAddress,
          items: quoteItems,
        }),
      });
      const payload = (await response.json()) as { authorizationUrl?: string; error?: string };
      if (!response.ok || !payload.authorizationUrl) {
        throw new Error(payload.error ?? "Payment could not be started.");
      }
      window.location.assign(payload.authorizationUrl);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Payment could not be started.");
      setSubmitting(false);
    }
  }

  if (cartItems === null) {
    return <div className="min-h-[70vh] animate-pulse bg-[#f5f5f5]" aria-label="Loading checkout" />;
  }

  if (cartItems.length === 0) {
    return (
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-white px-5 text-black">
        <div className="max-w-lg text-center">
          <p className="instrument-serif text-5xl">Your cart is empty.</p>
          <p className="mt-5 text-[14px] leading-6 text-black/60">
            Add a product and choose its options before returning to checkout.
          </p>
          <Link href="/shop" className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-[14px] text-white">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const provisionalSubtotal = cartItems.reduce(
    (total, item) => total + Math.round(item.priceUsd * 1540) * item.quantity,
    0,
  );

  return (
    <main id="main-content" className="min-h-screen bg-white text-black">
      <div className="border-b border-black bg-black px-5 py-3 text-center text-[12px] uppercase tracking-[0.18em] text-white">
        Secure checkout powered by Paystack
      </div>
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-10 lg:py-14">
        <section>
          <Link href="/shop" className="inline-flex items-center gap-2 text-[13px] hover:opacity-60">
            <ArrowLeft className="h-4 w-4" /> Back to shop
          </Link>
          <h1 className="instrument-serif mt-8 text-5xl tracking-[-0.04em] md:text-7xl">Checkout</h1>
          <form className="mt-10 grid gap-10" onSubmit={submitCheckout}>
            <fieldset className="grid gap-5">
              <legend className="instrument-serif mb-5 text-3xl">Customer information</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField label="First name" name="firstName" value={fields.firstName} onChange={updateField} autoComplete="given-name" />
                <InputField label="Last name" name="lastName" value={fields.lastName} onChange={updateField} autoComplete="family-name" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField label="Email address" name="email" value={fields.email} onChange={updateField} type="email" autoComplete="email" />
                <InputField label="Phone number" name="phone" value={fields.phone} onChange={updateField} type="tel" autoComplete="tel" />
              </div>
            </fieldset>

            <fieldset className="grid gap-5">
              <legend className="instrument-serif mb-5 text-3xl">Delivery address</legend>
              <InputField label="Address line 1" name="addressLine1" value={fields.addressLine1} onChange={updateField} autoComplete="address-line1" />
              <InputField label="Address line 2" name="addressLine2" value={fields.addressLine2} onChange={updateField} autoComplete="address-line2" required={false} />
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField label="City" name="city" value={fields.city} onChange={updateField} autoComplete="address-level2" />
                <InputField label="State or region" name="state" value={fields.state} onChange={updateField} autoComplete="address-level1" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <InputField label="Postal code" name="postalCode" value={fields.postalCode} onChange={updateField} autoComplete="postal-code" required={false} />
                <SelectField
                  label="Country"
                  name="country"
                  value={fields.country}
                  onChange={updateField}
                  autoComplete="country-name"
                  options={COUNTRY_OPTIONS}
                />
              </div>
              <label className="grid gap-2 text-[13px] font-medium">
                <span>Delivery instructions <span className="font-normal text-black/50">(optional)</span></span>
                <textarea
                  value={fields.deliveryInstructions}
                  onChange={(event) => updateField("deliveryInstructions", event.target.value)}
                  rows={4}
                  className="resize-none rounded-none border border-black/20 bg-white p-4 text-[14px] outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                />
              </label>
              <p className="text-[13px] leading-6 text-black/55">
                Delivery charges update automatically once your address is complete.
              </p>
            </fieldset>

            {error ? (
              <p role="alert" className="border border-black bg-[#f5f5f5] p-4 text-[13px] leading-6">
                {error}
              </p>
            ) : null}

            <div className="grid gap-3">
              <button
                type="submit"
                disabled={submitting || quoteLoading || !isCheckoutFormComplete}
                className="inline-flex h-13 items-center justify-center gap-2 bg-black px-5 text-[14px] text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LockKeyhole className="h-4 w-4" />
                {submitting ? "Starting secure payment..." : "Pay securely with Paystack"}
              </button>
            </div>
          </form>
        </section>

        <aside className="h-fit border border-black/15 bg-[#f7f7f7] p-5 lg:sticky lg:top-8 lg:p-7">
          <h2 className="instrument-serif text-3xl">Order summary</h2>
          <ul className="mt-6 space-y-5">
            {cartItems.map((item) => (
              <li key={item.key} className="flex gap-4 border-b border-black/10 pb-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-white">
                  <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-[13px]">
                  <div className="flex justify-between gap-3">
                    <p className="font-medium">{item.title}</p>
                    <p>{formatNaira(Math.round(item.priceUsd * 1540) * item.quantity)}</p>
                  </div>
                  <p className="mt-1 text-black/55">Quantity {item.quantity}</p>
                  {item.selections.length ? (
                    <p className="mt-1 leading-5 text-black/55">{item.selections.join(" / ")}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3 text-[14px]">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatNaira(quote?.subtotal ?? provisionalSubtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{quoteLoading ? "Updating..." : quote ? (quote.shippingFee ? formatNaira(quote.shippingFee) : "Free") : isQuoteAddressReady ? "Calculating..." : "Enter address"}</span></div>
            <div className="mt-2 flex justify-between border-t border-black pt-4 text-[16px] font-semibold">
              <span>Total</span><span>{formatNaira(quote?.total ?? provisionalSubtotal)}</span>
            </div>
            {quote ? <p className="mt-1 text-[12px] text-black/55">Estimated delivery: {quote.estimatedDelivery}</p> : null}
          </div>
          <p className="mt-6 flex items-start gap-2 text-[12px] leading-5 text-black/55">
            <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Your total is recalculated securely on the server before Paystack opens.
          </p>
        </aside>
      </div>
    </main>
  );
}
