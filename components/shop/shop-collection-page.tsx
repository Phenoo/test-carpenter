"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  LayoutGrid,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  formatShopPrice,
  shopCurrencies,
  shopSortOptions,
  shopProducts,
  type ShopAvailabilityFilter,
  type ShopCollection,
  type ShopCurrencyCode,
  type ShopProduct,
  type ShopSortKey,
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

const ITEMS_PER_PAGE = 12;
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

function clampPage(value: number, pageCount: number) {
  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.min(value, Math.max(1, pageCount));
}

function sortProducts(products: ShopProduct[], sortKey: ShopSortKey) {
  const next = [...products];

  switch (sortKey) {
    case "best-selling":
      return next.sort((left, right) => left.bestSellingRank - right.bestSellingRank);
    case "alpha-asc":
      return next.sort((left, right) => left.title.localeCompare(right.title));
    case "alpha-desc":
      return next.sort((left, right) => right.title.localeCompare(left.title));
    case "price-asc":
      return next.sort((left, right) => left.priceUsd - right.priceUsd);
    case "price-desc":
      return next.sort((left, right) => right.priceUsd - left.priceUsd);
    case "date-asc":
      return next.sort(
        (left, right) =>
          new Date(left.publishedAt).getTime() - new Date(right.publishedAt).getTime(),
      );
    case "date-desc":
      return next.sort(
        (left, right) =>
          new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
      );
    case "featured":
    default:
      return next.sort((left, right) => left.featuredRank - right.featuredRank);
  }
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

function ShopProductCard({
  currency,
  product,
  onAdd,
  onChoose,
}: {
  currency: ShopCurrencyCode;
  product: ShopProduct;
  onAdd: (product: ShopProduct) => void;
  onChoose: (product: ShopProduct) => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const hasMultipleImages = product.images.length > 1;
  const primaryActionLabel = product.requiresSelection ? "Choose" : "Add";

  function cycleImage(direction: -1 | 1) {
    if (!hasMultipleImages) {
      return;
    }

    setActiveImageIndex((current) => {
      const nextIndex = current + direction;

      if (nextIndex < 0) {
        return product.images.length - 1;
      }

      return nextIndex % product.images.length;
    });
  }

  function handleAction() {
    if (!product.available) {
      return;
    }

    if (product.requiresSelection) {
      onChoose(product);
      return;
    }

    onAdd(product);
  }

  return (
    <article className="group overflow-hidden rounded-[10px] bg-white">
      <div className="relative overflow-hidden rounded-[10px]">
        <Link
          href={`/shop/${product.slug}`}
          className="block"
          aria-label={`View ${product.title}`}
        >
          <div className="relative aspect-square overflow-hidden rounded-[10px] bg-[#f7f7f7]">
            <Image
              src={product.images[activeImageIndex] ?? product.images[0]}
              alt={product.alt}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.01]"
            />
          </div>
        </Link>

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

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:flex md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
              onClick={() => cycleImage(-1)}
              aria-label={`Show previous image for ${product.title}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:flex md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
              onClick={() => cycleImage(1)}
              aria-label={`Show next image for ${product.title}`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}

        {product.available ? (
          <button
            type="button"
            className="absolute bottom-3 left-3 right-3 h-10 rounded-full bg-white text-[13px] font-medium text-black transition hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
            onClick={handleAction}
            aria-label={`${primaryActionLabel} ${product.title}`}
          >
            {primaryActionLabel}
          </button>
        ) : null}
      </div>

      <div className="px-5 pb-6 pt-5 md:px-6">
        <Link
          href={`/shop/${product.slug}`}
          className="block text-[14px] leading-[1.4] text-black transition hover:opacity-70"
        >
          {product.title}
        </Link>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[14px] leading-[1.4]">
          <span>{formatShopPrice(product.priceUsd, currency)}</span>
          {product.compareAtUsd ? (
            <span className="text-[#7f7f7f] line-through">
              {formatShopPrice(product.compareAtUsd, currency)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ShopCollectionPage({ collection }: { collection: ShopCollection }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [selectedProductOptions, setSelectedProductOptions] = useState<ProductSelection>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [openFooterGroup, setOpenFooterGroup] = useState<string | null>("Shop");
  const [currency, setCurrency] = usePersistentStringState(
    CURRENCY_STORAGE_KEY,
    "USD",
    isShopCurrency,
  );
  const [cartItems, setCartItems] = usePersistentJsonState(CART_STORAGE_KEY, EMPTY_CART);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const availability = (searchParams.get("availability") ??
    "all") as ShopAvailabilityFilter;
  const sort = (searchParams.get("sort") ?? "featured") as ShopSortKey;
  const density = searchParams.get("grid") === "comfortable" ? "comfortable" : "standard";
  const requestedPage = Number(searchParams.get("page") ?? "1");

  const filteredProducts = useMemo(() => {
    const availabilityFiltered = shopProducts.filter((product) => {
      if (availability === "in-stock") {
        return product.available;
      }

      if (availability === "out-of-stock") {
        return !product.available;
      }

      return true;
    });

    return sortProducts(availabilityFiltered, sort);
  }, [availability, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const currentPage = clampPage(requestedPage, pageCount);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const searchResults = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();

    if (!query) {
      return shopProducts.slice(0, 5);
    }

    return shopProducts
      .filter((product) => {
        return (
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [deferredSearchQuery]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.priceUsd * item.quantity,
    0,
  );

  useEffect(() => {
    const hasOverlay =
      menuOpen ||
      searchOpen ||
      cartOpen ||
      currencyOpen ||
      filterOpen ||
      sortOpen ||
      Boolean(selectedProduct);

    document.body.style.overflow = hasOverlay ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, currencyOpen, filterOpen, menuOpen, searchOpen, selectedProduct, sortOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setMenuOpen(false);
      setSearchOpen(false);
      setCartOpen(false);
      setCurrencyOpen(false);
      setFilterOpen(false);
      setSortOpen(false);
      setSelectedProduct(null);
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (requestedPage === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(currentPage));

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [currentPage, pathname, requestedPage, router, searchParams]);

  function updateQuery(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all" || value === "featured" || value === "standard") {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function addToCart(product: ShopProduct, selection: ProductSelection = {}) {
    if (!product.available) {
      return;
    }

    const selections = getSelectionSummary(product, selection);
    const cartKey = getCartKey(product, selections);

    setCartItems((current) => {
      const existing = current.find((item) => item.key === cartKey);

      if (existing) {
        return current.map((item) =>
          item.key === cartKey ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...current,
        {
          key: cartKey,
          slug: product.slug,
          title: product.title,
          image: product.images[0] ?? "",
          quantity: 1,
          priceUsd: product.priceUsd,
          selections,
        },
      ];
    });

    setCartOpen(true);
  }

  function openProductSelection(product: ShopProduct) {
    setSelectedProduct(product);
    setSelectedProductOptions(getDefaultSelection(product));
  }

  function changeProductSelection(optionName: string, value: string) {
    setSelectedProductOptions((current) => ({
      ...current,
      [optionName]: value,
    }));
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
  


      <main id="main-content">
        <section className="px-4 pt-8 md:px-6 xl:px-10">
          <h1 className="instrument-serif text-[44px] font-normal leading-[1.08] tracking-[-0.03em] md:text-[56px] xl:text-[72px]">
            {collection.heading}
          </h1>

          <div className="mt-10 flex flex-col gap-4 pb-4 md:mt-14 md:flex-row md:items-center md:justify-between">
            <div className="relative">
              <ControlButton
                className="justify-start px-0"
                aria-expanded={filterOpen}
                aria-haspopup="dialog"
                onClick={() => {
                  setFilterOpen((current) => !current);
                  setSortOpen(false);
                  setCurrencyOpen(false);
                }}
              >
                <span>Availability</span>
                <ChevronDown className="h-4 w-4" />
              </ControlButton>

              {filterOpen ? (
                <div className="fixed inset-0 z-[60] md:absolute md:left-0 md:top-[calc(100%+8px)] md:w-[280px]">
                  <button
                    type="button"
                    aria-label="Close availability filter"
                    className="absolute inset-0 bg-black/20 md:hidden"
                    onClick={() => setFilterOpen(false)}
                  />
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:inset-auto md:w-[280px] md:rounded-xl">
                    <p className="text-[13px] text-[#666]">Filter by availability</p>
                    <div className="mt-4 grid gap-2">
                      {[
                        { key: "all", label: "All products" },
                        { key: "in-stock", label: "In stock" },
                        { key: "out-of-stock", label: "Out of stock" },
                      ].map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          className={`rounded-lg px-3 py-2 text-left text-[14px] transition hover:bg-[#f5f5f5] ${availability === option.key ? "bg-[#f3f3f3]" : ""}`}
                          onClick={() => {
                            updateQuery({ availability: option.key, page: "1" });
                            setFilterOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-4 md:justify-end">
              <span className="text-[14px] text-[#7a7a7a]">
                {filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"}
              </span>

              <div className="relative">
                <ControlButton
                  className="px-0"
                  aria-expanded={sortOpen}
                  aria-haspopup="dialog"
                  onClick={() => {
                    setSortOpen((current) => !current);
                    setFilterOpen(false);
                    setCurrencyOpen(false);
                  }}
                >
                  <span>Sort</span>
                  <ChevronDown className="h-4 w-4" />
                </ControlButton>

                {sortOpen ? (
                  <div className="fixed inset-0 z-[60] md:absolute md:right-0 md:top-[calc(100%+8px)] md:w-[260px]">
                    <button
                      type="button"
                      aria-label="Close sort menu"
                      className="absolute inset-0 bg-black/20 md:hidden"
                      onClick={() => setSortOpen(false)}
                    />
                    <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:inset-auto md:w-[260px] md:rounded-xl">
                      {shopSortOptions.map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[14px] transition hover:bg-[#f5f5f5] ${sort === option.key ? "bg-[#f3f3f3]" : ""}`}
                          onClick={() => {
                            updateQuery({ sort: option.key, page: "1" });
                            setSortOpen(false);
                          }}
                        >
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-black transition hover:bg-[#f3f3f3] ${density === "standard" ? "bg-[#f1f1f1]" : ""}`}
                  aria-label="Standard grid density"
                  onClick={() => updateQuery({ grid: "standard" })}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-black transition hover:bg-[#f3f3f3] ${density === "comfortable" ? "bg-[#f1f1f1]" : ""}`}
                  aria-label="Comfortable grid density"
                  onClick={() => updateQuery({ grid: "comfortable" })}
                >
                  <Grid2x2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 pt-2 md:px-6 xl:px-10">
          {isPending ? (
            <div
              className={`grid gap-x-4 gap-y-4 ${
                density === "comfortable"
                  ? "grid-cols-2 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-[10px] bg-white">
                  <div className="aspect-square animate-pulse bg-[#f5f5f5]" />
                  <div className="px-5 pb-6 pt-5 md:px-6">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-[#f1f1f1]" />
                    <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-[#f1f1f1]" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div
              className={`grid gap-x-4 gap-y-4 ${
                density === "comfortable"
                  ? "grid-cols-2 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              }`}
            >
              {paginatedProducts.map((product) => (
                <ShopProductCard
                  key={product.slug}
                  currency={currency}
                  product={product}
                  onAdd={(nextProduct) => addToCart(nextProduct)}
                  onChoose={openProductSelection}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[10px] bg-[#fafafa] px-6 py-14 text-center">
              <p className="instrument-serif text-[32px] leading-none">No products found</p>
              <p className="mx-auto mt-4 max-w-xl text-[14px] leading-[1.5] text-[#666]">
                Try changing the availability filter or clearing the current sort and page
                settings to see the full collection again.
              </p>
              <button
                type="button"
                className="mt-6 rounded-full bg-black px-5 py-3 text-[14px] text-white"
                onClick={() =>
                  startTransition(() => {
                    router.replace(pathname);
                  })
                }
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="px-4 pb-16 md:px-6 xl:px-10">
          <nav
            aria-label="Pagination"
            className="flex items-center justify-center gap-2 text-[14px]"
          >
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-[#f3f3f3] disabled:cursor-not-allowed disabled:opacity-35"
              onClick={() => updateQuery({ page: String(Math.max(1, currentPage - 1)) })}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: pageCount }).map((_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  type="button"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "text-black hover:bg-[#f3f3f3]"
                  }`}
                  onClick={() => updateQuery({ page: String(page) })}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md transition hover:bg-[#f3f3f3] disabled:cursor-not-allowed disabled:opacity-35"
              onClick={() =>
                updateQuery({ page: String(Math.min(pageCount, currentPage + 1)) })
              }
              disabled={currentPage === pageCount}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </section>

        <section className="px-4 pb-16 md:px-6 xl:px-10">
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
                    {searchResults.map((product) => (
                      <li key={product.slug}>
                        <Link
                          href={`/shop/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 rounded-[10px] p-2 transition hover:bg-[#f7f7f7]"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-[#f7f7f7]">
                            <Image
                              src={product.images[0] ?? ""}
                              alt={product.alt}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[14px]">{product.title}</p>
                            <p className="mt-1 text-[14px] text-[#666]">
                              {formatShopPrice(product.priceUsd, currency)}
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

      {selectedProduct ? (
        <DrawerBackdrop onClose={() => setSelectedProduct(null)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`Choose options for ${selectedProduct.title}`}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-white px-5 py-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="instrument-serif text-[32px] leading-none tracking-[-0.03em]">
                  Choose
                </p>
                <p className="mt-2 text-[14px]">{selectedProduct.title}</p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f4f4f4]"
                onClick={() => setSelectedProduct(null)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close product options</span>
              </button>
            </div>

            <div className="mt-6 grid gap-6 overflow-y-auto">
              {selectedProduct.options.map((option) => (
                <div key={option.name}>
                  <p className="text-[13px] text-[#666]">{option.name}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const isActive = selectedProductOptions[option.name] === value;

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
                          onClick={() => changeProductSelection(option.name, value)}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto border-t border-black pt-5">
              <div className="flex items-center justify-between text-[14px]">
                <span>{selectedProduct.title}</span>
                <span>{formatShopPrice(selectedProduct.priceUsd, currency)}</span>
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-full bg-black px-5 py-3 text-[14px] text-white"
                onClick={() => {
                  addToCart(selectedProduct, selectedProductOptions);
                  setSelectedProduct(null);
                }}
              >
                Add to cart
              </button>
            </div>
          </aside>
        </DrawerBackdrop>
      ) : null}
    </div>
  );
}

export function ShopCollectionPageSkeleton() {
  return (
    <div className="shop-collection-page instrument-sans min-h-screen bg-white text-black">
      <div className="h-[44px] bg-black" />
      <div className="h-[68px] border-b border-black/5 bg-white" />
      <div className="px-4 pb-12 pt-8 md:px-6 xl:px-10">
        <div className="h-14 w-40 animate-pulse rounded bg-[#f2f2f2] md:h-16 md:w-56 xl:h-20 xl:w-72" />
        <div className="mt-14 flex items-center justify-between gap-4">
          <div className="h-5 w-24 animate-pulse rounded bg-[#f2f2f2]" />
          <div className="flex items-center gap-3">
            <div className="h-5 w-16 animate-pulse rounded bg-[#f2f2f2]" />
            <div className="h-10 w-10 animate-pulse rounded-md bg-[#f2f2f2]" />
            <div className="h-10 w-10 animate-pulse rounded-md bg-[#f2f2f2]" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-square animate-pulse rounded-[10px] bg-[#f4f4f4]" />
              <div className="mt-5 h-4 w-2/3 animate-pulse rounded bg-[#f1f1f1]" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-[#f1f1f1]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
