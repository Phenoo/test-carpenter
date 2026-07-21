"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  formatShopPrice,
  shopCurrencies,
  shopProducts,
  type ShopCurrencyCode,
  type ShopProduct,
} from "@/lib/shop-collection-data";
import {
  usePersistentJsonState,
  usePersistentStringState,
} from "@/components/shop/use-persistent-shop-state";

type CartItem = {
  key: string;
  slug: string;
  title: string;
  image: string;
  quantity: number;
  priceUsd: number;
  selections: string[];
};

type ProductSelection = Record<string, string>;

const CART_STORAGE_KEY = "hair-mswilliams-cart";
const CURRENCY_STORAGE_KEY = "hair-mswilliams-currency";
const EMPTY_CART: CartItem[] = [];

function isShopCurrency(value: string): value is ShopCurrencyCode {
  return value === "GBP" || value === "NGN" || value === "USD";
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Schedule an Appointment" },
  { href: "/shop", label: "Shop" },
  { href: "/education", label: "The Pixie Masterclass" },
];

const footerGroups = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Search" },
      { href: "/faq", label: "Refunds & Returns" },
      { href: "/about", label: "Blog" },
      { href: "/faq", label: "FAQ's" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/faq", label: "Shipping" },
      { href: "/faq", label: "Returns" },
      { href: "/faq", label: "Contact" },
      { href: "/faq", label: "Track your order" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/education", label: "Masterclass" },
      { href: "/book", label: "Appointments" },
      { href: "/faq", label: "FAQ's" },
    ],
  },
  {
    title: "Stay Connected",
    links: [
      { href: "/about", label: "Instagram" },
      { href: "/shop", label: "Product drops" },
      { href: "/education", label: "Classes" },
      { href: "/book", label: "Salon updates" },
    ],
  },
];

function ControlButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md text-[13px] text-black transition hover:bg-[#f5f5f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function DrawerBackdrop({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div className="relative z-[81] h-full">{children}</div>
    </div>
  );
}

function getDefaultSelection(product: ShopProduct) {
  return product.options.reduce<ProductSelection>((current, option) => {
    current[option.name] = option.values[0] ?? "";

    return current;
  }, {});
}

function getSelectionSummary(product: ShopProduct, selection: ProductSelection) {
  return product.options
    .map((option) => selection[option.name])
    .filter((value): value is string => Boolean(value));
}

function getCartKey(product: ShopProduct, selections: string[]) {
  return [product.slug, ...selections].join("|");
}

function getProductFacts(product: ShopProduct) {
  const facts = [
    product.requiresSelection
      ? "Custom-fit options available before checkout."
      : "Ready to add straight to cart.",
    product.available
      ? "Currently available to order."
      : "Currently sold out and unavailable for purchase.",
    product.compareAtUsd
      ? `Savings reflected from ${formatShopPrice(product.compareAtUsd, "USD")} to ${formatShopPrice(product.priceUsd, "USD")}.`
      : `Current selling price is ${formatShopPrice(product.priceUsd, "USD")}.`,
  ];

  if (product.options.length > 0) {
    facts.push(
      `This product includes ${product.options
        .map((option) => option.name.toLowerCase())
        .join(", ")} selections.`,
    );
  } else {
    facts.push("No extra selection is required before checkout.");
  }

  return facts;
}

export function ShopProductDetail({ product }: { product: ShopProduct }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFooterGroup, setOpenFooterGroup] = useState<string | null>("Shop");
  const [currency, setCurrency] = usePersistentStringState(
    CURRENCY_STORAGE_KEY,
    "USD",
    isShopCurrency,
  );
  const [cartItems, setCartItems] = usePersistentJsonState(CART_STORAGE_KEY, EMPTY_CART);
  const [selection, setSelection] = useState<ProductSelection>(() => getDefaultSelection(product));
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.priceUsd * item.quantity,
    0,
  );

  const relatedProducts = useMemo(() => {
    return shopProducts
      .filter((item) => item.slug !== product.slug)
      .filter((item) => item.requiresSelection === product.requiresSelection || item.sale === product.sale)
      .slice(0, 4);
  }, [product.requiresSelection, product.sale, product.slug]);

  const searchResults = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();

    if (!query) {
      return shopProducts.slice(0, 5);
    }

    return shopProducts
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [deferredSearchQuery]);

  useEffect(() => {
    const hasOverlay = menuOpen || searchOpen || cartOpen || currencyOpen;

    document.body.style.overflow = hasOverlay ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, currencyOpen, menuOpen, searchOpen]);

  function addToCart() {
    if (!product.available) {
      return;
    }

    const selections = getSelectionSummary(product, selection);
    const cartKey = getCartKey(product, selections);

    setCartItems((current) => {
      const existing = current.find((item) => item.key === cartKey);

      if (existing) {
        return current.map((item) =>
          item.key === cartKey ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [
        ...current,
        {
          key: cartKey,
          slug: product.slug,
          title: product.title,
          image: product.images[0] ?? "",
          quantity,
          priceUsd: product.priceUsd,
          selections,
        },
      ];
    });

    setCartOpen(true);
  }

  function updateCartQuantity(key: string, direction: -1 | 1) {
    setCartItems((current) =>
      current
        .map((item) => {
          if (item.key !== key) {
            return item;
          }

          return { ...item, quantity: item.quantity + direction };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function submitNewsletter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = newsletterEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      setNewsletterMessage({
        type: "error",
        text: "Enter a valid email address to stay connected.",
      });
      return;
    }

    setNewsletterMessage({
      type: "success",
      text: "You're in. Watch your inbox for tips, offers, and event updates.",
    });
    setNewsletterEmail("");
  }

  return (
    <div className="shop-collection-page instrument-sans min-h-screen bg-white text-black">
      <Link
        href="/collections/alldeep"
        className="flex h-[44px] items-center justify-center bg-black px-4 text-center text-[14px] leading-none text-white"
      >
        Don&apos;t Miss Out - 50% Off Hair Products Ends Soon!
      </Link>

      <header className="sticky top-0 z-40 bg-white">
        <div className="mx-auto flex h-[68px] w-full items-center justify-between px-4 md:px-6 xl:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="text-[14px] font-semibold tracking-[0.01em]">
              www.hairbymswilliams.com
            </Link>
          </div>

          <nav
            aria-label="Primary"
            className="hidden items-center justify-center gap-8 text-[14px] xl:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:opacity-70 ${pathname === link.href ? "opacity-100" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="relative">
              <ControlButton
                className="px-2 md:px-3"
                aria-expanded={currencyOpen}
                aria-haspopup="dialog"
                onClick={() => setCurrencyOpen((current) => !current)}
              >
                <span aria-hidden="true" className="text-[15px]">
                  🇺🇸
                </span>
                <span className="hidden sm:inline">{currency}</span>
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Select currency</span>
              </ControlButton>

              {currencyOpen ? (
                <div className="fixed inset-0 z-[60] md:absolute md:inset-auto md:right-0 md:top-[calc(100%+8px)] md:w-48">
                  <button
                    type="button"
                    aria-label="Close currency menu"
                    className="absolute inset-0 bg-black/20 md:hidden"
                    onClick={() => setCurrencyOpen(false)}
                  />
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:inset-auto md:w-48 md:rounded-xl">
                    {Object.values(shopCurrencies).map((currencyOption) => (
                      <button
                        key={currencyOption.label}
                        type="button"
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[14px] transition hover:bg-[#f5f5f5] ${currency === currencyOption.label ? "bg-[#f3f3f3]" : ""}`}
                        onClick={() => {
                          setCurrency(currencyOption.label);
                          setCurrencyOpen(false);
                        }}
                      >
                        <span>{currencyOption.label}</span>
                        <span className="text-[#7a7a7a]">{currencyOption.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <ControlButton onClick={() => setSearchOpen(true)} className="w-10 px-0">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search products</span>
            </ControlButton>
            <ControlButton className="hidden w-10 px-0 sm:inline-flex">
              <CircleUserRound className="h-4 w-4" />
              <span className="sr-only">Account</span>
            </ControlButton>
            <ControlButton onClick={() => setCartOpen(true)} className="relative w-10 px-0">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] leading-none text-white">
                {cartCount}
              </span>
              <span className="sr-only">Open cart, {cartCount} items</span>
            </ControlButton>
          </div>
        </div>
      </header>

      <main id="main-content" className="px-4 pb-16 pt-8 md:px-6 xl:px-10">
        <div className="flex items-center gap-2 text-[13px] text-[#666]">
          <Link href="/shop" className="transition hover:text-black">
            Products
          </Link>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </div>

        <Link
          href="/shop"
          className="mt-4 inline-flex items-center gap-2 text-[14px] transition hover:opacity-70"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to products
        </Link>

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,420px)] xl:gap-12">
          <div className="grid gap-4">
            <div className="relative aspect-square overflow-hidden rounded-[10px] bg-[#f7f7f7]">
              <Image
                src={product.images[activeImageIndex] ?? product.images[0]}
                alt={product.alt}
                fill
                loading="eager"
                sizes="(min-width: 1280px) 58vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute left-2 top-2 z-10 flex gap-2">
                {product.sale ? (
                  <span className="rounded-full bg-black px-[10px] py-1 text-[13px] leading-none text-white">
                    Sale
                  </span>
                ) : null}
                {!product.available ? (
                  <span className="rounded-full border border-black bg-white px-[10px] py-1 text-[13px] leading-none text-black">
                    Sold out
                  </span>
                ) : null}
              </div>
              {product.images.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    onClick={() =>
                      setActiveImageIndex((current) =>
                        current === 0 ? product.images.length - 1 : current - 1,
                      )
                    }
                    aria-label={`Show previous image for ${product.title}`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    onClick={() =>
                      setActiveImageIndex((current) => (current + 1) % product.images.length)
                    }
                    aria-label={`Show next image for ${product.title}`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              ) : null}
            </div>

            {product.images.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={`${product.slug}-${index}`}
                    type="button"
                    className={`relative aspect-square overflow-hidden rounded-[10px] border transition ${
                      activeImageIndex === index ? "border-black" : "border-transparent"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View image ${index + 1} of ${product.title}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.alt} thumbnail ${index + 1}`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="xl:sticky xl:top-[120px] xl:self-start">
            <h1 className="instrument-serif text-[42px] font-normal leading-[1.04] tracking-[-0.03em] md:text-[54px]">
              {product.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[14px]">
              <span>{formatShopPrice(product.priceUsd, currency)}</span>
              {product.compareAtUsd ? (
                <span className="text-[#7f7f7f] line-through">
                  {formatShopPrice(product.compareAtUsd, currency)}
                </span>
              ) : null}
            </div>
            <p className="mt-6 max-w-[42ch] text-[14px] leading-[1.5] text-[#4f4f4f]">
              {product.description}
            </p>

            {product.options.length > 0 ? (
              <div className="mt-8 grid gap-5">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <p className="text-[13px] text-[#666]">{option.name}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const isActive = selection[option.name] === value;

                        return (
                          <button
                            key={`${option.name}-${value}`}
                            type="button"
                            aria-pressed={isActive}
                            className={`rounded-full border px-4 py-2 text-[13px] transition ${
                              isActive
                                ? "border-black bg-black text-white"
                                : "border-black/10 bg-white text-black hover:bg-[#f4f4f4]"
                            }`}
                            onClick={() =>
                              setSelection((current) => ({
                                ...current,
                                [option.name]: value,
                              }))
                            }
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-black/10">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-[14px]">{quantity}</span>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center"
                  onClick={() => setQuantity((current) => current + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                className="flex-1 rounded-full bg-black px-5 py-3 text-[14px] text-white transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
                onClick={addToCart}
                disabled={!product.available}
              >
                {product.available ? "Add to cart" : "Sold out"}
              </button>
            </div>

            <div className="mt-8 rounded-[10px] bg-[#fafafa] p-5">
              <p className="text-[13px] text-[#666]">Product details</p>
              <ul className="mt-3 space-y-2 text-[14px] leading-[1.5] text-[#4f4f4f]">
                {getProductFacts(product).map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[10px] bg-[#fafafa] p-6">
            <h2 className="instrument-serif text-[32px] font-normal leading-none tracking-[-0.03em]">
              Product Overview
            </h2>
            <p className="mt-4 text-[14px] leading-[1.6] text-[#4f4f4f]">
              {product.description} This screen is now a dedicated product experience with its
              own gallery, option selection, quantity control, and cart flow so each item
              has a proper destination beyond the collection grid.
            </p>
          </div>

          <div className="rounded-[10px] bg-[#fafafa] p-6">
            <h2 className="instrument-serif text-[32px] font-normal leading-none tracking-[-0.03em]">
              Delivery & Purchase
            </h2>
            <p className="mt-4 text-[14px] leading-[1.6] text-[#4f4f4f]">
              Orders are shown in your selected currency, with saved cart state shared across
              the shop screens. Wig products surface hair type, size, lace, nape, and color
              choices directly on the page before cart actions are enabled.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-center justify-between gap-4">
            <h2 className="instrument-serif text-[32px] font-normal leading-none tracking-[-0.03em] md:text-[40px]">
              You may also like
            </h2>
            <Link href="/shop" className="text-[14px] transition hover:opacity-70">
              View all products
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <article key={item.slug} className="overflow-hidden rounded-[10px] bg-white">
                <Link href={`/shop/${item.slug}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-[10px] bg-[#f7f7f7]">
                    <Image
                      src={item.images[0] ?? ""}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1280px) 22vw, 50vw"
                      className="object-cover transition duration-300 hover:scale-[1.01]"
                    />
                  </div>
                </Link>
                <div className="px-5 pb-6 pt-5">
                  <Link href={`/shop/${item.slug}`} className="block text-[14px] leading-[1.4]">
                    {item.title}
                  </Link>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[14px] leading-[1.4]">
                    <span>{formatShopPrice(item.priceUsd, currency)}</span>
                    {item.compareAtUsd ? (
                      <span className="text-[#7f7f7f] line-through">
                        {formatShopPrice(item.compareAtUsd, currency)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="grid overflow-hidden rounded-[10px] md:min-h-[196px] md:grid-cols-2">
            <div className="relative min-h-[220px] md:min-h-[196px]">
              <Image
                src="/collections/alldeep/newsletter/shop-newsletter.jpg"
                alt="Hair styling close-up for the shop newsletter"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="bg-white px-5 py-7 md:px-10 md:py-8">
              <h2 className="instrument-serif max-w-[19ch] text-[28px] font-normal leading-[1.1] tracking-[-0.03em] md:text-[32px]">
                Stay Connected - Exclusive Hair Tips, Offers & Events
              </h2>
              <form
                className="mt-8 flex items-end gap-4 border-b border-black pb-3"
                onSubmit={submitNewsletter}
              >
                <label className="flex-1">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(event) => {
                      setNewsletterEmail(event.target.value);
                      setNewsletterMessage(null);
                    }}
                    placeholder="Email address"
                    className="w-full border-0 bg-transparent p-0 text-[14px] text-black outline-none placeholder:text-[#8a8a8a]"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  aria-label="Submit email address"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              {newsletterMessage ? (
                <p
                  className={`mt-3 text-[13px] text-black ${
                    newsletterMessage.type === "error" ? "font-medium underline underline-offset-4" : ""
                  }`}
                >
                  {newsletterMessage.text}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-4 pb-6 md:px-6 xl:px-10">
        <div className="hidden gap-8 pb-12 md:grid md:grid-cols-2 xl:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="instrument-serif text-[32px] font-normal leading-none tracking-[-0.03em]">
                {group.title}
              </h3>
              <ul className="mt-7 space-y-3 text-[14px] leading-[1.4]">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link href={link.href} className="transition hover:opacity-70">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-black md:hidden">
          {footerGroups.map((group) => {
            const isOpen = openFooterGroup === group.title;

            return (
              <div key={group.title} className="border-b border-black/15 py-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() =>
                    setOpenFooterGroup((current) =>
                      current === group.title ? null : group.title,
                    )
                  }
                  aria-expanded={isOpen}
                >
                  <span className="instrument-serif text-[28px] leading-none tracking-[-0.03em]">
                    {group.title}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen ? (
                  <ul className="mt-5 space-y-3 text-[14px]">
                    {group.links.map((link) => (
                      <li key={`${group.title}-${link.label}`}>
                        <Link href={link.href} className="transition hover:opacity-70">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-2 border-t border-black pt-4 text-[12px] leading-[1.5] text-[#6f6f6f] md:mt-0 md:grid md:grid-cols-[1fr_auto] md:items-center">
          <p>© 2026 www.hairbymswilliams.com, Powered by Shopify</p>
          <p className="mt-3 md:mt-0">Terms and Policies</p>
        </div>
      </footer>

      {menuOpen ? (
        <DrawerBackdrop onClose={() => setMenuOpen(false)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="ml-auto flex h-full w-full max-w-sm flex-col bg-white px-5 py-5"
          >
            <div className="flex items-center justify-between">
              <p className="instrument-serif text-[32px] leading-none tracking-[-0.03em]">
                Menu
              </p>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4f4f4]"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <nav className="mt-8 grid gap-5 text-[15px]" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-black/10 pb-4 transition hover:opacity-70"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </DrawerBackdrop>
      ) : null}

      {searchOpen ? (
        <DrawerBackdrop onClose={() => setSearchOpen(false)}>
          <div className="mx-auto h-full max-w-[720px] px-4 py-6 md:py-12">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Search products"
              className="mx-auto overflow-hidden rounded-[20px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between px-5 py-5 md:px-8">
                <h2 className="instrument-serif text-[32px] font-normal leading-none tracking-[-0.03em]">
                  Search
                </h2>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4f4f4]"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close search</span>
                </button>
              </div>
              <div className="border-t border-black/10 px-5 pb-6 pt-5 md:px-8">
                <label className="flex items-center gap-3 border-b border-black pb-3">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search the collection</span>
                  <input
                    autoFocus
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search"
                    className="w-full border-0 bg-transparent p-0 text-[14px] outline-none placeholder:text-[#8a8a8a]"
                  />
                </label>
                <div className="mt-5">
                  <p className="text-[13px] text-[#666]">Products</p>
                  <ul className="mt-4 grid gap-3">
                    {searchResults.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 rounded-[10px] p-2 transition hover:bg-[#f7f7f7]"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-[#f7f7f7]">
                            <Image
                              src={item.images[0] ?? ""}
                              alt={item.alt}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[14px]">{item.title}</p>
                            <p className="mt-1 text-[14px] text-[#666]">
                              {formatShopPrice(item.priceUsd, currency)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DrawerBackdrop>
      ) : null}

      {cartOpen ? (
        <DrawerBackdrop onClose={() => setCartOpen(false)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="ml-auto flex h-full w-full max-w-md flex-col bg-white px-5 py-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="instrument-serif text-[32px] leading-none tracking-[-0.03em]">
                  Cart
                </p>
                <p className="mt-2 text-[13px] text-[#666]">
                  Total items in cart: {cartCount}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4f4f4]"
                onClick={() => setCartOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close cart</span>
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="text-[14px]">Your cart is empty</p>
                <button
                  type="button"
                  className="mt-4 rounded-full bg-black px-5 py-3 text-[14px] text-white"
                  onClick={() => setCartOpen(false)}
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <ul className="mt-8 flex-1 space-y-4 overflow-y-auto">
                  {cartItems.map((item) => (
                    <li key={item.key} className="flex gap-3 rounded-[10px] border border-black/10 p-3">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[10px] bg-[#f7f7f7]">
                        <Image
                          src={item.image}
                          alt={`${item.title} cart image`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px]">{item.title}</p>
                        {item.selections.length > 0 ? (
                          <p className="mt-1 text-[13px] text-[#666]">
                            {item.selections.join(" / ")}
                          </p>
                        ) : null}
                        <p className="mt-2 text-[14px]">
                          {formatShopPrice(item.priceUsd, currency)}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 transition hover:bg-[#f4f4f4]"
                            onClick={() => updateCartQuantity(item.key, -1)}
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-6 text-center text-[13px]">{item.quantity}</span>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 transition hover:bg-[#f4f4f4]"
                            onClick={() => updateCartQuantity(item.key, 1)}
                            aria-label={`Increase quantity of ${item.title}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-black pt-5">
                  <div className="flex items-center justify-between text-[14px]">
                    <span>Subtotal</span>
                    <span>{formatShopPrice(cartSubtotal, currency)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    className="mt-5 block w-full rounded-full bg-black px-5 py-3 text-center text-[14px] text-white"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </aside>
        </DrawerBackdrop>
      ) : null}
    </div>
  );
}
