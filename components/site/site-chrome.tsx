"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/site/icons";
import { useStorefront } from "@/components/site/storefront-provider";
import {
  footerGroups,
  navigationLinks,
  products,
  siteConfig,
} from "@/lib/site-data";
import { shopProducts } from "@/lib/shop-collection-data";

const simpleAnnouncement =
  "Complimentary consultation support with every bespoke unit";
const replicaProductPaths = new Set(shopProducts.map((product) => `/shop/${product.slug}`));

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const usesReplicaCollectionChrome =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/collections/") ||
    replicaProductPaths.has(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() =>
    typeof window === "undefined" ? false : window.scrollY > 16,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const {
    formatPrice,
    cartItems,
    cartCount,
    isCartOpen,
    openCart,
    closeCart,
    removeItem,
    updateQuantity,
    isSearchOpen,
    openSearch,
    closeSearch,
    rememberViewed,
  } = useStorefront();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const headerSolid = pathname !== "/" || scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      menuOpen || isCartOpen || isSearchOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isSearchOpen, menuOpen]);

  const searchResults = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();

    if (!query) {
      return products.slice(0, 5);
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });
  }, [deferredSearchQuery]);

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  if (usesReplicaCollectionChrome) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-espresso)]">
      <div className="relative z-50 border-b border-white/10 bg-[var(--color-burgundy)] px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-white">
        {simpleAnnouncement}
      </div>

      <header
        className={
          headerSolid
            ? "sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-xl"
            : "sticky top-0 z-40 bg-transparent"
        }
      >
        <div className="section-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-[var(--color-blush)] bg-[var(--color-espresso)] text-white">
              <span className="font-serif text-xl">D</span>
            </div>
            <p className="font-serif text-2xl text-[var(--color-espresso)]">demutzhair</p>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "nav-link nav-link-active" : "nav-link"}
              >
                {link.label}
              </Link>
            ))}
          
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" className="icon-button hidden md:inline-flex" onClick={openSearch}>
              <SearchIcon className="h-4 w-4" />
              <span className="sr-only">Search products</span>
            </button>
            <button type="button" className="icon-button relative" onClick={openCart}>
              <CartIcon className="h-4 w-4" />
              {cartCount > 0 ? <Counter count={cartCount} /> : null}
              <span className="sr-only">Cart</span>
            </button>
        
            <button
              type="button"
              className="icon-button md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
            >
              <MenuIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-5rem)] flex-col">{children}</div>

      <footer className="border-t border-[var(--color-border)] bg-[#f5f5f5]">
        <div className="section-shell grid gap-10 py-12 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <p className="font-serif text-4xl text-[var(--color-espresso)]">
              demutzhair
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-muted)]">
              Bespoke pixie units, salon appointments, and specialist education created
              with polish, warmth, and expert short-hair finishing.
            </p>
          </div>
          {footerGroups.slice(0, 3).map((group) => (
            <div key={group.title}>
              <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {group.title}
              </h3>
              <ul className="mt-4 grid gap-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="section-shell grid gap-4 border-t border-[var(--color-border)] py-5 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)] md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap gap-4">
            <span>{siteConfig.phone}</span>
            <span>{siteConfig.email}</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <span>© 2026 {siteConfig.name}</span>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <Link href="/shop" className="mobile-tab">
            Shop
          </Link>
          <Link href="/book" className="mobile-tab">
            Book
          </Link>
          <button type="button" className="mobile-tab" onClick={openCart}>
            Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <Overlay onClose={() => setMenuOpen(false)}>
          <aside className="ml-auto flex h-full w-full max-w-sm flex-col bg-white p-6">
            <div className="mb-8 flex items-center justify-between">
              <p className="font-serif text-3xl">Menu</p>
              <button type="button" className="icon-button" onClick={() => setMenuOpen(false)}>
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <nav className="grid gap-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-[var(--color-border)] py-3 font-serif text-3xl"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </Overlay>
      ) : null}

      {isSearchOpen ? (
        <Overlay onClose={closeSearch}>
          <div className="mx-auto mt-10 w-[min(92vw,680px)] bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Search</p>
                <h2 className="font-serif text-4xl text-[var(--color-espresso)]">
                  Search the shop
                </h2>
              </div>
              <button type="button" className="icon-button" onClick={closeSearch}>
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <label className="mt-6 flex items-center gap-3 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
              <SearchIcon className="h-5 w-5" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search pixie units, lace, or care"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <div className="mt-6 grid gap-3">
              {searchResults.map((product) => (
                <Link
                  key={product.slug}
                  href={`/shop/${product.slug}`}
                  onClick={() => {
                    closeSearch();
                    rememberViewed(product.slug);
                  }}
                  className="flex items-center gap-4 border border-[var(--color-border)] p-3 transition hover:border-[var(--color-blush)]"
                >
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden">
                    <Image
                      src={product.gallery[0]}
                      alt={`${product.name} search result image`}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-espresso)]">{product.name}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {product.price === 0 ? "Free" : formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Overlay>
      ) : null}

      {isCartOpen ? (
        <Overlay onClose={closeCart}>
          <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
              <h2 className="font-serif text-4xl text-[var(--color-espresso)]">Cart</h2>
              <button type="button" className="icon-button" onClick={closeCart}>
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cartItems.length === 0 ? (
                <p className="text-sm leading-7 text-[var(--color-muted)]">
                  Your cart is empty. Add a pixie unit or hair essential to get started.
                </p>
              ) : (
                <div className="grid gap-4">
                  {cartItems.map((item) => (
                    <article key={item.key} className="flex gap-4 border border-[var(--color-border)] p-3">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={`${item.name} cart preview`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-[var(--color-espresso)]">
                              {item.name}
                            </p>
                            <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                              {item.optionSummary.join(" • ") || "Standard"}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]"
                            onClick={() => removeItem(item.key)}
                          >
                            Remove
                          </button>
                        </div>
                        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--color-burgundy)]">
                          {item.dispatchEstimate}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-[var(--color-border)] px-2 py-1">
                            <button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                              +
                            </button>
                          </div>
                          <p className="font-semibold text-[var(--color-burgundy)]">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-[var(--color-border)] px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-muted)]">Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <Link href="/shop" onClick={closeCart} className="button-primary mt-5 w-full text-center">
                Continue to checkout
              </Link>
            </div>
          </aside>
        </Overlay>
      ) : null}
    </div>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    >
      <div className="h-full overflow-y-auto" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Counter({ count }: { count: number }) {
  return (
    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-burgundy)] px-1 text-[10px] font-semibold text-white">
      {count}
    </span>
  );
}
