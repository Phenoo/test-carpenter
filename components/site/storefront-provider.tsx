"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CurrencyCode, Product } from "@/lib/site-data";
import { currencyOptions, formatCurrency, getProduct } from "@/lib/site-data";

type CartItem = {
  key: string;
  slug: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  optionSummary: string[];
  dispatchEstimate: string;
};

type QuickViewSelection = {
  capSize?: string;
  laceType?: string;
  parting?: string;
  colour?: string;
};

type StorefrontContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amount: number) => string;
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: Product,
    config?: {
      quantity?: number;
      unitPrice?: number;
      optionSummary?: string[];
    },
  ) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  quickViewSlug: string | null;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;
  recentlyViewed: string[];
  rememberViewed: (slug: string) => void;
  quickViewSelection: QuickViewSelection;
  setQuickViewSelection: (next: QuickViewSelection) => void;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    if (typeof window === "undefined") {
      return "GBP";
    }

    const savedCurrency = window.localStorage.getItem("hbmw-currency");

    return savedCurrency && savedCurrency in currencyOptions
      ? (savedCurrency as CurrencyCode)
      : "GBP";
  });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedCart = window.localStorage.getItem("hbmw-cart");

    return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedWishlist = window.localStorage.getItem("hbmw-wishlist");

    return savedWishlist ? (JSON.parse(savedWishlist) as string[]) : [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedViewed = window.localStorage.getItem("hbmw-viewed");

    return savedViewed ? (JSON.parse(savedViewed) as string[]) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);
  const [quickViewSelection, setQuickViewSelection] = useState<QuickViewSelection>({});

  useEffect(() => {
    window.localStorage.setItem("hbmw-currency", currency);
  }, [currency]);

  useEffect(() => {
    window.localStorage.setItem("hbmw-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem("hbmw-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    window.localStorage.setItem("hbmw-viewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const value = useMemo<StorefrontContextValue>(() => {
    return {
      currency,
      setCurrency,
      formatPrice: (amount) => formatCurrency(amount, currency),
      cartItems,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addToCart: (product, config) => {
        const optionSummary =
          config?.optionSummary?.filter((item): item is string => Boolean(item)) ?? [];
        const key = [product.slug, ...optionSummary].join("|");
        const unitPrice = config?.unitPrice ?? product.price;
        const quantity = config?.quantity ?? 1;

        setCartItems((current) => {
          const existing = current.find((item) => item.key === key);

          if (existing) {
            return current.map((item) =>
              item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
            );
          }

          return [
            ...current,
            {
              key,
              slug: product.slug,
              name: product.name,
              image: product.gallery[0],
              quantity,
              unitPrice,
              optionSummary,
              dispatchEstimate: product.dispatchEstimate,
            },
          ];
        });

        setIsCartOpen(true);
      },
      updateQuantity: (key, quantity) => {
        setCartItems((current) =>
          current.map((item) =>
            item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        );
      },
      removeItem: (key) => {
        setCartItems((current) => current.filter((item) => item.key !== key));
      },
      wishlist,
      toggleWishlist: (slug) => {
        setWishlist((current) =>
          current.includes(slug)
            ? current.filter((item) => item !== slug)
            : [...current, slug],
        );
      },
      isSearchOpen,
      openSearch: () => setIsSearchOpen(true),
      closeSearch: () => setIsSearchOpen(false),
      quickViewSlug,
      openQuickView: (slug) => {
        setQuickViewSlug(slug);
        const product = getProduct(slug);

        setQuickViewSelection({
          capSize: product?.capSizes[0],
          laceType: product?.laceTypes[0],
          parting: product?.partings[0],
          colour: product?.colours[0]?.name,
        });
      },
      closeQuickView: () => setQuickViewSlug(null),
      recentlyViewed,
      rememberViewed: (slug) => {
        setRecentlyViewed((current) => [slug, ...current.filter((item) => item !== slug)].slice(0, 6));
      },
      quickViewSelection,
      setQuickViewSelection,
    };
  }, [cartItems, currency, isCartOpen, isSearchOpen, quickViewSelection, quickViewSlug, recentlyViewed, wishlist]);

  return (
    <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);

  if (!context) {
    throw new Error("useStorefront must be used within StorefrontProvider");
  }

  return context;
}
