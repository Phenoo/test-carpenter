export type ShopCollectionSlug = "alldeep";

export type ShopCurrencyCode = "USD" | "GBP" | "NGN";

export type ShopSortKey =
  | "featured"
  | "best-selling"
  | "alpha-asc"
  | "alpha-desc"
  | "price-asc"
  | "price-desc"
  | "date-asc"
  | "date-desc";

export type ShopAvailabilityFilter = "all" | "in-stock" | "out-of-stock";

export type ShopVariantGroup = {
  name: string;
  values: string[];
};

export type ShopProduct = {
  slug: string;
  title: string;
  description: string;
  handle: string;
  priceUsd: number;
  compareAtUsd?: number;
  available: boolean;
  sale: boolean;
  requiresSelection: boolean;
  featuredRank: number;
  bestSellingRank: number;
  publishedAt: string;
  images: string[];
  alt: string;
  options: ShopVariantGroup[];
};

export type ShopCollection = {
  slug: ShopCollectionSlug;
  title: string;
  heading: string;
  description: string;
  announcement: string;
};

export const shopCollections: Record<ShopCollectionSlug, ShopCollection> = {
  alldeep: {
    slug: "alldeep",
    title: "Products",
    heading: "Products",
    description:
      "Browse wigs, essentials, and digital products from the Hair by Ms Williams collection.",
    announcement: "Don't Miss Out - 50% Off Hair Products Ends Soon!",
  },
};

export const shopCurrencies: Record<
  ShopCurrencyCode,
  { label: ShopCurrencyCode; symbol: string; rateFromUsd: number; locale: string }
> = {
  USD: { label: "USD", symbol: "$", rateFromUsd: 1, locale: "en-US" },
  GBP: { label: "GBP", symbol: "GBP", rateFromUsd: 0.79, locale: "en-GB" },
  NGN: { label: "NGN", symbol: "NGN", rateFromUsd: 1540, locale: "en-NG" },
};

export const shopSortOptions: { key: ShopSortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "best-selling", label: "Best selling" },
  { key: "alpha-asc", label: "Alphabetically, A-Z" },
  { key: "alpha-desc", label: "Alphabetically, Z-A" },
  { key: "price-asc", label: "Price, low to high" },
  { key: "price-desc", label: "Price, high to low" },
  { key: "date-asc", label: "Date, old to new" },
  { key: "date-desc", label: "Date, new to old" },
];

export const wigConfigurationOptions: ShopVariantGroup[] = [
  { name: "Hair type", values: ["Virgin hair", "Raw hair"] },
  { name: "Wig size", values: ["Small", "Medium", "Large"] },
  { name: "Lace type", values: ["HD lace", "HD lace lookalike"] },
  { name: "Nape type", values: ["Round", "Extended"] },
  { name: "Color", values: ["Black", "Brown", "Blonde", "Burgundy"] },
];

export const shopProducts: ShopProduct[] = [
  {
    slug: "1-on-1-mentorship",
    title: "1 on 1 Mentorship",
    description:
      "Private business and brand support designed for stylists ready to grow with clarity.",
    handle: "copy-of-1-on-1-mentoring",
    priceUsd: 0,
    available: true,
    sale: false,
    requiresSelection: false,
    featuredRank: 1,
    bestSellingRank: 10,
    publishedAt: "2026-06-27",
    images: ["/collections/alldeep/products/mentorship-1.jpg"],
    alt: "1 on 1 Mentorship course cover",
    options: [],
  },
  {
    slug: "1-1-pixie-wig-intensive",
    title: "1:1 Pixie Wig Intensive",
    description:
      "Hands-on pixie wig training for stylists who want direct correction and a faster learning curve.",
    handle: "1-1-pixie-wig-training-learn-directly-from-me",
    priceUsd: 892,
    available: true,
    sale: false,
    requiresSelection: false,
    featuredRank: 2,
    bestSellingRank: 2,
    publishedAt: "2026-03-18",
    images: ["/collections/alldeep/products/pixie-intensive-1.jpg"],
    alt: "1 to 1 Pixie Wig Intensive product image",
    options: [],
  },
  {
    slug: "aliyah-unit",
    title: "Aliyah Unit",
    description:
      "A custom pixie unit configured by hair type, wig size, lace, nape, and color.",
    handle: "sana-unit",
    priceUsd: 419,
    available: true,
    sale: true,
    requiresSelection: true,
    featuredRank: 3,
    bestSellingRank: 1,
    publishedAt: "2022-10-18",
    images: [
      "/collections/alldeep/products/aliyah-1.jpg",
      "/collections/alldeep/products/aliyah-2.jpg",
    ],
    alt: "Aliyah Unit pixie wig",
    options: wigConfigurationOptions,
  },
  {
    slug: "custom-frontal-unit",
    title: "Custom Frontal Unit",
    description:
      "A made-to-fit pixie unit with configurable hair, lace, nape, size, and color choices.",
    handle: "custom-frontal-unit",
    priceUsd: 419,
    available: true,
    sale: false,
    requiresSelection: true,
    featuredRank: 4,
    bestSellingRank: 3,
    publishedAt: "2026-03-18",
    images: ["/collections/alldeep/products/custom-frontal-1.jpg"],
    alt: "Custom Frontal Unit pixie wig",
    options: wigConfigurationOptions,
  },
  {
    slug: "finishing-sheen-mist",
    title: "Finishing Sheen Mist",
    description:
      "A light finishing mist that adds smooth shine without weighing styled hair down.",
    handle: "silkening-mist",
    priceUsd: 14,
    compareAtUsd: 27,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 5,
    bestSellingRank: 7,
    publishedAt: "2024-07-02",
    images: ["/collections/alldeep/products/finishing-sheen-mist-1.png"],
    alt: "Finishing Sheen Mist product bottle",
    options: [],
  },
  {
    slug: "freebie",
    title: "Freebie",
    description:
      "A complimentary digital resource to help you start learning the pixie wig process.",
    handle: "free-download-how-to-make-a-short-frontal-wig",
    priceUsd: 0,
    available: true,
    sale: false,
    requiresSelection: false,
    featuredRank: 6,
    bestSellingRank: 15,
    publishedAt: "2026-02-28",
    images: ["/collections/alldeep/products/freebie-1.jpg"],
    alt: "Freebie digital download cover",
    options: [],
  },
  {
    slug: "hair-serum",
    title: "Hair Serum",
    description:
      "A lightweight serum formulated to support shine and softness across your short-hair routine.",
    handle: "hair-growth-serum",
    priceUsd: 7,
    compareAtUsd: 21,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 7,
    bestSellingRank: 6,
    publishedAt: "2024-07-02",
    images: ["/collections/alldeep/products/hair-serum-1.png"],
    alt: "Hair Serum product bottle",
    options: [],
  },
  {
    slug: "hd-wig-cap",
    title: "HD Wig Cap",
    description:
      "A thin stocking cap for the bald-cap method and smoother wig installations.",
    handle: "hd-wig-cap",
    priceUsd: 14,
    available: false,
    sale: false,
    requiresSelection: false,
    featuredRank: 8,
    bestSellingRank: 11,
    publishedAt: "2024-07-02",
    images: ["/collections/alldeep/products/hd-wig-cap-1.png"],
    alt: "HD Wig Cap product image",
    options: [],
  },
  {
    slug: "how-to-make-a-short-frontal-wig-online-masterclass",
    title: "How To Make A Short Frontal Wig Online Masterclass",
    description:
      "A digital masterclass covering construction, styling, and finishing for short frontal wigs.",
    handle: "how-to-make-a-short-frontal-wig-masterclass",
    priceUsd: 136,
    compareAtUsd: 206,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 9,
    bestSellingRank: 4,
    publishedAt: "2026-06-30",
    images: [
      "/collections/alldeep/products/frontal-masterclass-1.jpg",
      "/collections/alldeep/products/frontal-masterclass-2.jpg",
    ],
    alt: "Short frontal wig masterclass cover",
    options: [],
  },
  {
    slug: "income-through-instagram",
    title: "Income Through Instagram",
    description:
      "A concise guide focused on content, positioning, and social strategy for hair entrepreneurs.",
    handle: "the-ultimate-reels-guide",
    priceUsd: 24,
    compareAtUsd: 35,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 10,
    bestSellingRank: 8,
    publishedAt: "2025-02-20",
    images: ["/collections/alldeep/products/income-through-instagram-1.png"],
    alt: "Income Through Instagram guide cover",
    options: [],
  },
  {
    slug: "janelle-unit",
    title: "Janelle Unit",
    description:
      "A short pixie unit tailored through five hair, cap, lace, nape, and color choices.",
    handle: "short-frontal-unit-1",
    priceUsd: 408,
    available: true,
    sale: false,
    requiresSelection: true,
    featuredRank: 11,
    bestSellingRank: 5,
    publishedAt: "2023-09-28",
    images: [
      "/collections/alldeep/products/janelle-1.jpg",
      "/collections/alldeep/products/janelle-2.jpg",
    ],
    alt: "Janelle Unit pixie wig",
    options: wigConfigurationOptions,
  },
  {
    slug: "lace-glue",
    title: "Lace Glue",
    description:
      "A strong-hold adhesive made for active installs and secure lace wear.",
    handle: "lace-glue",
    priceUsd: 14,
    compareAtUsd: 27,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 12,
    bestSellingRank: 9,
    publishedAt: "2024-07-02",
    images: ["/collections/alldeep/products/lace-glue-1.png"],
    alt: "Lace Glue product bottle",
    options: [],
  },
  {
    slug: "lace-glue-remover",
    title: "Lace Glue Remover",
    description:
      "A remover spray formulated with plant oils to help release lace adhesive gently.",
    handle: "lace-glue-remover",
    priceUsd: 10,
    compareAtUsd: 21,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 13,
    bestSellingRank: 13,
    publishedAt: "2026-04-18",
    images: ["/collections/alldeep/products/lace-glue-remover-1.jpg"],
    alt: "Lace Glue Remover spray bottle",
    options: [],
  },
  {
    slug: "lace-melt-band",
    title: "Lace Melt Band",
    description:
      "A soft band that helps press lace down for a flatter, cleaner finish.",
    handle: "untitled-jul2_19-11",
    priceUsd: 7,
    compareAtUsd: 14,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 14,
    bestSellingRank: 14,
    publishedAt: "2024-07-02",
    images: ["/collections/alldeep/products/lace-melt-band-1.jpg"],
    alt: "Lace Melt Band product image",
    options: [],
  },
  {
    slug: "lace-melting-spray",
    title: "Lace Melting Spray",
    description:
      "A removable hold spray for clients who want a lighter, short-wear lace option.",
    handle: "lace-melting-spray",
    priceUsd: 27,
    available: false,
    sale: false,
    requiresSelection: false,
    featuredRank: 15,
    bestSellingRank: 12,
    publishedAt: "2024-07-02",
    images: ["/collections/alldeep/products/lace-melting-spray-1.png"],
    alt: "Lace Melting Spray product bottle",
    options: [],
  },
  {
    slug: "learn-from-home-replay",
    title: "LEARN FROM HOME Replay",
    description:
      "A replay class that walks through constructing, moulding, cutting, and styling a pixie wig.",
    handle: "copy-of-learn-from-home-live-pixie-class",
    priceUsd: 48,
    compareAtUsd: 65,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 16,
    bestSellingRank: 16,
    publishedAt: "2023-01-20",
    images: [
      "/collections/alldeep/products/learn-from-home-1.png",
      "/collections/alldeep/products/learn-from-home-2.png",
    ],
    alt: "Learn From Home Replay course cover",
    options: [],
  },
  {
    slug: "lori-unit",
    title: "Lori Unit",
    description:
      "A polished short unit configured to your preferred hair, size, lace, nape, and color.",
    handle: "short-frontal-unit-2",
    priceUsd: 408,
    available: true,
    sale: false,
    requiresSelection: true,
    featuredRank: 17,
    bestSellingRank: 17,
    publishedAt: "2026-03-04",
    images: [
      "/collections/alldeep/products/lori-1.jpg",
      "/collections/alldeep/products/lori-2.jpg",
    ],
    alt: "Lori Unit pixie wig",
    options: wigConfigurationOptions,
  },
  {
    slug: "megan-unit",
    title: "Megan Unit",
    description:
      "A custom pixie unit with selectable hair type, fit, lace finish, nape, and color.",
    handle: "megan-unit-glueless-5x5-closure",
    priceUsd: 424,
    available: true,
    sale: false,
    requiresSelection: true,
    featuredRank: 18,
    bestSellingRank: 18,
    publishedAt: "2025-03-12",
    images: [
      "/collections/alldeep/products/megan-1.jpg",
      "/collections/alldeep/products/megan-2.jpg",
    ],
    alt: "Megan Unit pixie wig",
    options: wigConfigurationOptions,
  },
  {
    slug: "pixie-wig-tutorial",
    title: "PIXIE WIG TUTORIAL",
    description:
      "A bite-size tutorial for stylists who want a faster route into pixie wig construction.",
    handle: "pixie-wig-tutorial",
    priceUsd: 21,
    compareAtUsd: 40,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 19,
    bestSellingRank: 19,
    publishedAt: "2025-02-03",
    images: ["/collections/alldeep/products/pixie-tutorial-1.png"],
    alt: "Pixie Wig Tutorial cover",
    options: [],
  },
  {
    slug: "product-packaging-vendors",
    title: "Product & Packaging Vendors",
    description:
      "A vendor resource covering packaging, product sourcing, and support for business setup.",
    handle: "copy-of-vendors-list",
    priceUsd: 106,
    compareAtUsd: 138,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 20,
    bestSellingRank: 20,
    publishedAt: "2025-01-01",
    images: [
      "/collections/alldeep/products/packaging-vendors-1.png",
      "/collections/alldeep/products/packaging-vendors-2.jpg",
    ],
    alt: "Product and Packaging Vendors guide cover",
    options: [],
  },
  {
    slug: "rih-rih-unit",
    title: "Rih Rih Unit",
    description:
      "A custom pixie unit configured across hair type, wig size, lace, nape, and color.",
    handle: "rih-rih-unit-1",
    priceUsd: 364,
    available: true,
    sale: false,
    requiresSelection: true,
    featuredRank: 21,
    bestSellingRank: 21,
    publishedAt: "2025-02-03",
    images: [
      "/collections/alldeep/products/rih-rih-1.jpg",
      "/collections/alldeep/products/rih-rih-2.jpg",
    ],
    alt: "Rih Rih Unit pixie wig",
    options: wigConfigurationOptions,
  },
  {
    slug: "sell-while-you-sleep",
    title: "Sell While You Sleep",
    description:
      "A digital guide on pricing, positioning, and selling custom pixie units with more confidence.",
    handle: "pricing-marketing-selling-custom-pixie-wigs",
    priceUsd: 24,
    available: true,
    sale: false,
    requiresSelection: false,
    featuredRank: 22,
    bestSellingRank: 22,
    publishedAt: "2025-02-20",
    images: ["/collections/alldeep/products/sell-while-you-sleep-1.png"],
    alt: "Sell While You Sleep guide cover",
    options: [],
  },
  {
    slug: "start-your-hair-business",
    title: "Start Your Hair Business",
    description:
      "A vendor-led starter resource built to help future founders move faster with less guesswork.",
    handle: "vendors-list",
    priceUsd: 106,
    compareAtUsd: 138,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 23,
    bestSellingRank: 23,
    publishedAt: "2025-01-01",
    images: [
      "/collections/alldeep/products/start-hair-business-1.png",
      "/collections/alldeep/products/start-hair-business-2.jpg",
    ],
    alt: "Start Your Hair Business guide cover",
    options: [],
  },
  {
    slug: "the-pixie-queen-guide",
    title: "The Pixie Queen Guide",
    description:
      "A beginner-friendly business guide covering branding, clients, and building income around pixie work.",
    handle: "pixie-queen-ebook",
    priceUsd: 11,
    compareAtUsd: 35,
    available: true,
    sale: true,
    requiresSelection: false,
    featuredRank: 24,
    bestSellingRank: 24,
    publishedAt: "2025-02-03",
    images: [
      "/collections/alldeep/products/pixie-queen-guide-1.png",
      "/collections/alldeep/products/pixie-queen-guide-2.jpg",
    ],
    alt: "The Pixie Queen Guide cover",
    options: [],
  },
];

export function getShopCollection(slug: string) {
  return shopCollections[slug as ShopCollectionSlug] ?? null;
}

export function getShopProduct(slug: string) {
  return shopProducts.find((product) => product.slug === slug) ?? null;
}

export function formatShopPrice(amountUsd: number, currency: ShopCurrencyCode) {
  const config = shopCurrencies[currency];
  const amount = amountUsd * config.rateFromUsd;

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
