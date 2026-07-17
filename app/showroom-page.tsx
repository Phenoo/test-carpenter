"use client";

import Image from "next/image";
import { useDeferredValue, useEffect, useState } from "react";

type CurrencyCode = "USD" | "EUR" | "GBP" | "NGN";

type RegionOption = {
  code: string;
  label: string;
  currency: CurrencyCode;
  locale: string;
};

type ColorOption = {
  name: string;
  hex: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  badge: "New" | "Bestseller" | "Made to Order";
  availability: "In Stock" | "Made to Order";
  basePrice: number;
  lead: string;
  dimensions: string;
  timeframe: string;
  description: string;
  care: string;
  delivery: string;
  warranty: string;
  materials: string[];
  finishes: string[];
  colors: ColorOption[];
  sizes: { label: string; adjustment: number }[];
  images: string[];
};

type Project = {
  id: string;
  title: string;
  location: string;
  type: "Homes" | "Offices" | "Hotels" | "Hospitality";
  services: string;
  challenge: string;
  result: string;
  image: string;
};

type CartItem = {
  key: string;
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  size: string;
  color: string;
  finish: string;
};

type ProductSelection = {
  size: string;
  color: string;
  finish: string;
  quantity: number;
};

type ShowroomPageProps = {
  companyName: string;
};

const whatsappLink = "https://wa.me/2348000000000";

const regions: RegionOption[] = [
  { code: "us", label: "United States (USD)", currency: "USD", locale: "en-US" },
  { code: "uk", label: "United Kingdom (GBP)", currency: "GBP", locale: "en-GB" },
  { code: "eu", label: "Europe (EUR)", currency: "EUR", locale: "en-IE" },
  { code: "ng", label: "Nigeria (NGN)", currency: "NGN", locale: "en-NG" },
];

const exchangeRates: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1580,
};

const categoryCards = [
  {
    title: "Living Room",
    copy: "Modular seating, sculptural lounge chairs, and statement tables for layered everyday living.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Bedroom",
    copy: "Softly upholstered beds, crafted storage, and suites designed for quiet luxury.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80&sat=-10",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Dining",
    copy: "Tables, banquettes, and joinery that turn gatherings into memorable rituals.",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Office",
    copy: "Executive desks, meeting-room pieces, and storage calibrated for modern workflow.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Hotels & Hospitality",
    copy: "Guest-room, lobby, restaurant, and public-space furniture for high-touch environments.",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Bespoke Furniture",
    copy: "Custom proportions, materials, and finishes shaped around your space and brief.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    className: "md:col-span-2 md:row-span-1",
  },
];

const products: Product[] = [
  {
    id: "aria-modular-sofa",
    name: "Aria Modular Sofa",
    category: "Living Room",
    badge: "Bestseller",
    availability: "Made to Order",
    basePrice: 4200,
    lead: "Cloud-soft modular seating with disciplined tailoring and deep comfort.",
    dimensions: "W 320 x D 110 x H 78 cm",
    timeframe: "Production lead time: 8 to 10 weeks",
    description:
      "The Aria is designed for conversation-heavy living spaces, pairing a sculpted silhouette with long-life upholstery and a solid hardwood base.",
    care: "Vacuum weekly with a soft brush attachment and blot spills immediately with a lint-free cloth.",
    delivery:
      "White-glove delivery and room placement are included in select cities. Nationwide delivery available.",
    warranty:
      "Five-year frame warranty, two-year upholstery workmanship warranty.",
    materials: ["Performance Boucle", "Solid Walnut", "High-Resilience Foam"],
    finishes: ["Natural Walnut", "Smoked Oak", "Dark Espresso"],
    colors: [
      { name: "Ivory", hex: "#F3EDE5" },
      { name: "Sand", hex: "#D8C7B4" },
      { name: "Mink", hex: "#9A8878" },
    ],
    sizes: [
      { label: "2-piece", adjustment: 0 },
      { label: "3-piece", adjustment: 900 },
      { label: "4-piece with chaise", adjustment: 1700 },
    ],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sat=-20",
    ],
  },
  {
    id: "milano-dining-table",
    name: "Milano Dining Table",
    category: "Dining",
    badge: "New",
    availability: "Made to Order",
    basePrice: 3600,
    lead: "Architectural stone-and-timber dining made for generous entertaining.",
    dimensions: "L 240 x D 110 x H 75 cm",
    timeframe: "Production lead time: 6 to 8 weeks",
    description:
      "A monolithic dining piece with softly eased edges, precision joinery, and a durable finish suitable for daily use.",
    care: "Use placemats for hot items and clean with a damp microfiber cloth followed by a dry wipe.",
    delivery:
      "Delivered in assembled components with installation by our logistics team or approved partners.",
    warranty:
      "Five-year structural warranty with refinishing support available on request.",
    materials: ["American Walnut Veneer", "Travertine", "Matte Lacquer"],
    finishes: ["Walnut", "Light Oak", "Stone Grey"],
    colors: [
      { name: "Travertine", hex: "#DCCEBE" },
      { name: "Walnut", hex: "#5A3A2E" },
      { name: "Bone", hex: "#EFE6DA" },
    ],
    sizes: [
      { label: "6-seater", adjustment: 0 },
      { label: "8-seater", adjustment: 700 },
      { label: "10-seater", adjustment: 1300 },
    ],
    images: [
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "haven-upholstered-bed",
    name: "Haven Upholstered Bed",
    category: "Bedroom",
    badge: "Made to Order",
    availability: "Made to Order",
    basePrice: 3100,
    lead: "A softly wrapped bed frame with a hotel-grade headboard and hidden joinery.",
    dimensions: "King: W 220 x D 225 x H 128 cm",
    timeframe: "Production lead time: 7 to 9 weeks",
    description:
      "Built for quiet, restorative spaces, the Haven layers high-density padding, durable upholstery, and a refined profile.",
    care: "Spot clean with approved upholstery solution and rotate the mattress base monthly during the first year.",
    delivery:
      "Includes in-room assembly and debris removal in major cities. International freight can be arranged.",
    warranty:
      "Three-year upholstery and joinery warranty, extendable through maintenance plans.",
    materials: ["Belgian Linen", "Ash Hardwood", "Brushed Brass"],
    finishes: ["Champagne Ash", "Fumed Oak", "Brushed Walnut"],
    colors: [
      { name: "Oat", hex: "#E9DDCF" },
      { name: "Clay", hex: "#B79F8B" },
      { name: "Charcoal", hex: "#383331" },
    ],
    sizes: [
      { label: "Queen", adjustment: 0 },
      { label: "King", adjustment: 400 },
      { label: "Super King", adjustment: 950 },
    ],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&blend=202020&sat=-40",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&crop=entropy",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&hue=15",
    ],
  },
  {
    id: "executive-walnut-desk",
    name: "Executive Walnut Desk",
    category: "Office Furniture",
    badge: "Bestseller",
    availability: "In Stock",
    basePrice: 2800,
    lead: "A composed executive desk with concealed cable paths and a hand-finished walnut top.",
    dimensions: "W 220 x D 85 x H 76 cm",
    timeframe: "Dispatch in 10 business days",
    description:
      "Purpose-built for leadership suites and private studies, the desk balances warmth, utility, and low-profile storage.",
    care: "Dust regularly with a dry cotton cloth and avoid abrasive cleaners on the lacquered surfaces.",
    delivery:
      "Ships flat-packed or fully assembled depending on region. Installation visits available on request.",
    warranty: "Five-year structural warranty with one complimentary finish check after delivery.",
    materials: ["Solid Walnut", "Leather Inlay", "Powder-Coated Steel"],
    finishes: ["Walnut", "Ebony", "Latte Leather"],
    colors: [
      { name: "Walnut", hex: "#5A3A2E" },
      { name: "Black", hex: "#202020" },
      { name: "Cognac", hex: "#8F5F3B" },
    ],
    sizes: [
      { label: "Standard", adjustment: 0 },
      { label: "Large", adjustment: 500 },
      { label: "Boardroom", adjustment: 1200 },
    ],
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "luna-lounge-chair",
    name: "Luna Lounge Chair",
    category: "Living Room",
    badge: "New",
    availability: "In Stock",
    basePrice: 1450,
    lead: "A sculpted occasional chair with compact proportions and generous comfort.",
    dimensions: "W 82 x D 86 x H 78 cm",
    timeframe: "Dispatch in 7 business days",
    description:
      "The Luna works as a hero accent in living rooms, suites, and reception lounges, with a timber plinth and tailored upholstery.",
    care: "Protect from direct sunlight for prolonged periods and use a fabric guard for high-traffic settings.",
    delivery:
      "Delivery available nationwide with optional installation and placement for hospitality projects.",
    warranty: "Three-year upholstery and frame warranty.",
    materials: ["Textured Weave", "Oak", "Feather Blend Cushioning"],
    finishes: ["Natural Oak", "Dark Walnut", "Blackened Ash"],
    colors: [
      { name: "Pearl", hex: "#E9E1D7" },
      { name: "Moss", hex: "#6B735D" },
      { name: "Brick", hex: "#995846" },
    ],
    sizes: [
      { label: "Standard", adjustment: 0 },
      { label: "Ottoman Set", adjustment: 420 },
    ],
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "bespoke-hotel-headboard",
    name: "Bespoke Hotel Headboard",
    category: "Hotel Furniture",
    badge: "Made to Order",
    availability: "Made to Order",
    basePrice: 5200,
    lead: "A contract-grade upholstered wall headboard engineered for hospitality suites.",
    dimensions: "Custom sizes up to W 480 x H 340 cm",
    timeframe: "Production lead time: 10 to 12 weeks",
    description:
      "Specified for boutique hotels and signature suites, this system supports custom lighting, integrated tables, and acoustic padding.",
    care: "Hospitality maintenance guide available with approved fabric and panel replacement program.",
    delivery:
      "Contract delivery, site coordination, and installation scheduling handled by our project team.",
    warranty:
      "Five-year contract warranty on frame integrity and installation workmanship.",
    materials: ["Contract Fabric", "Acoustic Backing", "Engineered Timber"],
    finishes: ["Bronze Trim", "Blackened Oak", "Walnut Slat"],
    colors: [
      { name: "Champagne", hex: "#D8C7B4" },
      { name: "Olive Grey", hex: "#7B7A70" },
      { name: "Ink", hex: "#202020" },
    ],
    sizes: [
      { label: "Guest Room", adjustment: 0 },
      { label: "Suite", adjustment: 1500 },
      { label: "Signature Suite", adjustment: 3400 },
    ],
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80&sat=-30",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const projects: Project[] = [
  {
    id: "lagos-waterfront-residence",
    title: "Lagos Waterfront Residence",
    location: "Lekki, Lagos",
    type: "Homes",
    services: "Interior concept, custom furniture, installation",
    challenge: "Create a calm family home that still feels sculptural and editorial.",
    result: "Layered walnut joinery, textural upholstery, and hotel-grade detailing throughout.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "harbor-house-boardrooms",
    title: "Harbor House Boardrooms",
    location: "Victoria Island, Lagos",
    type: "Offices",
    services: "Space planning, executive furniture, acoustic finishes",
    challenge: "Balance prestige, ergonomics, and private meeting performance.",
    result: "A cohesive suite of meeting spaces with refined storage and branded materials.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "the-gilded-stay",
    title: "The Gilded Stay",
    location: "Abuja",
    type: "Hotels",
    services: "Guest-room packages, headboards, lobby furniture, installation",
    challenge: "Deliver a premium boutique-hotel look under an active construction schedule.",
    result: "A warm, memorable hospitality language rolled out across rooms and public spaces.",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "atelier-brasserie",
    title: "Atelier Brasserie",
    location: "Accra",
    type: "Hospitality",
    services: "Banquettes, dining furniture, lighting integration",
    challenge: "Create an intimate restaurant atmosphere with durable contract finishes.",
    result: "Layered timber, brass, and upholstery details that elevate the guest experience.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
  },
];

const serviceCards = [
  {
    title: "Residential Interiors",
    copy: "Furniture and interior schemes built around how you live, host, and unwind.",
  },
  {
    title: "Office Interiors",
    copy: "Purposeful workspaces, leadership suites, meeting zones, and staff environments.",
  },
  {
    title: "Hotel & Hospitality",
    copy: "Guest rooms, lobbies, restaurants, and public areas designed for lasting impact.",
  },
  {
    title: "Space Planning",
    copy: "Precise layouts, measurements, flow studies, and furniture specifications.",
  },
  {
    title: "Furniture Production",
    copy: "In-house manufacturing with premium materials, hardware, and finishing standards.",
  },
  {
    title: "Delivery & Installation",
    copy: "Site coordination, white-glove logistics, final fit-out, and aftercare support.",
  },
];

const processSteps = [
  "Consultation",
  "Design and Measurements",
  "Material Selection",
  "Production",
  "Delivery and Installation",
];

const testimonials = [
  {
    quote:
      "They translated our mood boards into a home that feels quiet, elevated, and completely ours.",
    author: "Amina and Tunde O.",
    role: "Residential client",
  },
  {
    quote:
      "The project team handled production and installation with the rigor we expect from hospitality partners.",
    author: "N. Bassey",
    role: "Hotel development lead",
  },
  {
    quote:
      "From boardroom tables to executive offices, every piece feels tailored to our brand.",
    author: "Adaeze M.",
    role: "Corporate workplace client",
  },
];

const faqItems = [
  {
    question: "Can you produce custom sizes and finishes?",
    answer:
      "Yes. Most of our furniture can be resized, reconfigured, or finished in alternative timber, lacquer, stone, or upholstery options.",
  },
  {
    question: "How do measurements and site checks work?",
    answer:
      "We schedule a design consultation, follow with site measurements or architectural drawing review, then confirm production-ready dimensions before fabrication starts.",
  },
  {
    question: "Do you handle delivery and installation?",
    answer:
      "Yes. Our team coordinates delivery, room placement, installation, snagging, and final styling support where required.",
  },
  {
    question: "Do you supply internationally?",
    answer:
      "We support export orders and regional commercial rollouts. Shipping method, duties, and installation support are scoped per destination.",
  },
  {
    question: "What is your warranty and returns policy?",
    answer:
      "Every product includes workmanship coverage, while made-to-order items follow project-specific terms. Returns for non-bespoke pieces are assessed according to condition and logistics status.",
  },
];

const socialGallery = [
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=900&q=80",
];

const allMaterials = [
  "All materials",
  ...Array.from(new Set(products.flatMap((product) => product.materials))),
];

const allCategories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];

const priceBands = ["All prices", "Under 2,500", "2,500 - 5,000", "Over 5,000"];
const availabilityOptions = ["All availability", "In Stock", "Made to Order"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Alphabetical"];

function getDefaultSelection(product: Product): ProductSelection {
  return {
    size: product.sizes[0].label,
    color: product.colors[0].name,
    finish: product.finishes[0],
    quantity: 1,
  };
}

function getPriceBand(price: number) {
  if (price < 2500) {
    return "Under 2,500";
  }

  if (price <= 5000) {
    return "2,500 - 5,000";
  }

  return "Over 5,000";
}

export default function ShowroomPage({ companyName }: ShowroomPageProps) {
  const [selectedRegionCode, setSelectedRegionCode] = useState(regions[0].code);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMaterial, setActiveMaterial] = useState("All materials");
  const [activeAvailability, setActiveAvailability] = useState("All availability");
  const [activePriceBand, setActivePriceBand] = useState("All prices");
  const [sortOrder, setSortOrder] = useState("Featured");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [productSelections, setProductSelections] = useState<Record<string, ProductSelection>>({});
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [activeProjectFilter, setActiveProjectFilter] = useState<
    "All" | "Homes" | "Offices" | "Hotels" | "Hospitality"
  >("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [guideSubmitted, setGuideSubmitted] = useState(false);
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const selectedRegion =
    regions.find((region) => region.code === selectedRegionCode) ?? regions[0];

  const filteredProducts = products
    .filter((product) => activeCategory === "All" || product.category === activeCategory)
    .filter(
      (product) =>
        activeMaterial === "All materials" || product.materials.includes(activeMaterial),
    )
    .filter(
      (product) =>
        activeAvailability === "All availability" ||
        product.availability === activeAvailability,
    )
    .filter(
      (product) =>
        activePriceBand === "All prices" || getPriceBand(product.basePrice) === activePriceBand,
    )
    .sort((left, right) => {
      if (sortOrder === "Price: Low to High") {
        return left.basePrice - right.basePrice;
      }

      if (sortOrder === "Price: High to Low") {
        return right.basePrice - left.basePrice;
      }

      if (sortOrder === "Alphabetical") {
        return left.name.localeCompare(right.name);
      }

      return 0;
    });

  const quickViewProduct =
    products.find((product) => product.id === quickViewId) ?? null;

  const filteredProjects = projects.filter((project) => {
    if (activeProjectFilter === "All") {
      return true;
    }

    return project.type === activeProjectFilter;
  });

  const suggestedProducts =
    deferredSearchQuery.trim().length === 0
      ? products.slice(0, 4)
      : products.filter((product) => {
          const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

          return (
            product.name.toLowerCase().includes(normalizedQuery) ||
            product.category.toLowerCase().includes(normalizedQuery) ||
            product.materials.join(" ").toLowerCase().includes(normalizedQuery)
          );
        });

  const discountRate = appliedPromoCode === "WELCOME10" ? 0.1 : 0;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const discountValue = subtotal * discountRate;
  const total = subtotal - discountValue;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setMobileMenuOpen(false);
      setSearchOpen(false);
      setAccountOpen(false);
      setCartOpen(false);
      setQuickViewId(null);
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      mobileMenuOpen || searchOpen || cartOpen || quickViewId !== null ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, mobileMenuOpen, quickViewId, searchOpen]);

  function formatPrice(amount: number) {
    return new Intl.NumberFormat(selectedRegion.locale, {
      style: "currency",
      currency: selectedRegion.currency,
      maximumFractionDigits: selectedRegion.currency === "NGN" ? 0 : 0,
    }).format(amount * exchangeRates[selectedRegion.currency]);
  }

  function getSelection(product: Product) {
    return productSelections[product.id] ?? getDefaultSelection(product);
  }

  function getCurrentPrice(product: Product) {
    const selection = getSelection(product);
    const size = product.sizes.find((item) => item.label === selection.size);

    return product.basePrice + (size?.adjustment ?? 0);
  }

  function setSelection(productId: string, nextSelection: Partial<ProductSelection>) {
    setProductSelections((current) => {
      const product = products.find((item) => item.id === productId);

      if (!product) {
        return current;
      }

      return {
        ...current,
        [productId]: {
          ...getSelection(product),
          ...nextSelection,
        },
      };
    });
  }

  function toggleWishlist(productId: string) {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId],
    );
  }

  function trackRecentlyViewed(productId: string) {
    setRecentlyViewed((current) => [
      productId,
      ...current.filter((item) => item !== productId),
    ].slice(0, 4));
  }

  function openQuickView(productId: string) {
    setQuickViewId(productId);
    trackRecentlyViewed(productId);
  }

  function addToCart(product: Product) {
    const selection = getSelection(product);
    const unitPrice = getCurrentPrice(product);
    const cartKey = [product.id, selection.size, selection.color, selection.finish].join("|");

    setCartItems((current) => {
      const existingItem = current.find((item) => item.key === cartKey);

      if (existingItem) {
        return current.map((item) =>
          item.key === cartKey
            ? { ...item, quantity: item.quantity + selection.quantity }
            : item,
        );
      }

      return [
        ...current,
        {
          key: cartKey,
          productId: product.id,
          name: product.name,
          image: product.images[0],
          quantity: selection.quantity,
          unitPrice,
          size: selection.size,
          color: selection.color,
          finish: selection.finish,
        },
      ];
    });

    setCartOpen(true);
  }

  function handlePromoApply() {
    if (promoCode.trim().toUpperCase() === "WELCOME10") {
      setAppliedPromoCode("WELCOME10");
      setPromoMessage("Promo applied: 10% off your current basket.");
      return;
    }

    setAppliedPromoCode("");
    setPromoMessage("That code is not active right now. Try WELCOME10.");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-background)] text-[var(--color-charcoal)]">
      <AnnouncementBar />
      <Header
        companyName={companyName}
        selectedRegionCode={selectedRegionCode}
        setSelectedRegionCode={setSelectedRegionCode}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setSearchOpen={setSearchOpen}
        accountOpen={accountOpen}
        setAccountOpen={setAccountOpen}
        setCartOpen={setCartOpen}
      />

      <main id="main-content" className="relative flex-1">
        <HeroSection companyName={companyName} />

        <section id="shop" className="section-shell pt-10 md:pt-16">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Collections</p>
              <h2 className="section-title max-w-2xl">
                Furniture collections curated like an editorial issue.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
              A residential and commercial product mix built for refined homes,
              executive spaces, and hospitality environments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[220px]">
            {categoryCards.map((card, index) => (
              <article
                key={card.title}
                className={`group relative overflow-hidden border border-black/8 bg-white ${card.className} animate-fade-up`}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <Image
                  src={card.image}
                  alt={`${card.title} furniture collection`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 text-white md:p-6">
                  <h3 className="font-serif text-3xl leading-none md:text-4xl">
                    {card.title}
                  </h3>
                  <p className="max-w-md text-sm leading-6 text-white/80">{card.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Best-Selling Products</p>
              <h2 className="section-title">Made Beautifully. Built to Last.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
              Filter by room, material, price, or availability, then move from
              discovery to quotation and cart in a few clicks.
            </p>
          </div>

          <div className="panel mb-8 grid gap-4 p-5 lg:grid-cols-5">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[var(--color-charcoal)]">Category</span>
              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
                className="form-select"
              >
                {allCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[var(--color-charcoal)]">Material</span>
              <select
                value={activeMaterial}
                onChange={(event) => setActiveMaterial(event.target.value)}
                className="form-select"
              >
                {allMaterials.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[var(--color-charcoal)]">Availability</span>
              <select
                value={activeAvailability}
                onChange={(event) => setActiveAvailability(event.target.value)}
                className="form-select"
              >
                {availabilityOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[var(--color-charcoal)]">Price</span>
              <select
                value={activePriceBand}
                onChange={(event) => setActivePriceBand(event.target.value)}
                className="form-select"
              >
                {priceBands.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-[var(--color-charcoal)]">Sort</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="form-select"
              >
                {sortOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, index) => {
              const selection = getSelection(product);
              const isWishlisted = wishlist.includes(product.id);

              return (
                <article
                  key={product.id}
                  className="group panel overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative aspect-[4/4.8] overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={`${product.name} in a styled interior setting`}
                      fill
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.02]"
                    />
                    <Image
                      src={product.images[1]}
                      alt={`${product.name} detail view`}
                      fill
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                      <span className="badge">{product.badge}</span>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-pressed={isWishlisted}
                        className="icon-button"
                      >
                        <HeartIcon filled={isWishlisted} />
                        <span className="sr-only">
                          {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        </span>
                      </button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4 opacity-100 transition md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => openQuickView(product.id)}
                        className="button-secondary flex-1"
                      >
                        Quick View
                      </button>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="button-primary flex-1"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                          {product.category}
                        </p>
                        <h3 className="mt-2 font-serif text-3xl leading-none text-[var(--color-charcoal)]">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-right text-sm font-semibold text-[var(--color-walnut)]">
                        From {formatPrice(getCurrentPrice(product))}
                      </p>
                    </div>

                    <p className="text-sm leading-7 text-[var(--color-muted)]">
                      {product.lead}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {selection && product.colors.map((color) => (
                        <span
                          key={color.name}
                          className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]"
                        >
                          <span
                            aria-hidden="true"
                            className="h-3 w-3 border border-black/10"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      {product.materials.slice(0, 2).map((material) => (
                        <span key={material} className="border border-black/10 px-2 py-1">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[520px] overflow-hidden border border-black/8">
              <Image
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
                alt="Workshop craftsperson refining a custom furniture detail."
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="panel flex flex-col justify-between p-6 md:p-10">
              <div>
                <p className="eyebrow">Bespoke Furniture</p>
                <h2 className="section-title max-w-xl">
                  Designed for You. Crafted by Us.
                </h2>
                <p className="mt-6 text-base leading-8 text-[var(--color-muted)]">
                  From initial sketches to the final finish, our team creates
                  furniture tailored to your space, style, dimensions, and
                  everyday needs.
                </p>
                <div className="mt-8 grid gap-3 text-sm text-[var(--color-muted)]">
                  <p>Custom room plans and furniture scheduling</p>
                  <p>Material boards, sample approvals, and finish sign-off</p>
                  <p>Production oversight with delivery and installation included</p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#services" className="button-primary">
                  Discover Bespoke
                </a>
                <a href="#consultation" className="button-secondary">
                  Request a Quote
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section-shell section-divider">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Interior Services</p>
              <h2 className="section-title max-w-3xl">
                Interiors that move seamlessly from planning to final installation.
              </h2>
            </div>
            <a href="#consultation" className="button-ghost">
              Discuss Your Interior Project
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceCards.map((service) => (
              <article key={service.title} className="panel p-6">
                <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[var(--color-gold)]/60 text-[var(--color-gold)]">
                  <SparkIcon />
                </div>
                <h3 className="font-serif text-3xl text-[var(--color-charcoal)]">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {service.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section-shell section-divider">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Project Showcase</p>
              <h2 className="section-title">Portfolio storytelling with architectural clarity.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Homes", "Offices", "Hotels", "Hospitality"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveProjectFilter(
                      filter as "All" | "Homes" | "Offices" | "Hotels" | "Hospitality",
                    )
                  }
                  className={
                    activeProjectFilter === filter ? "chip chip-active" : "chip"
                  }
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {filteredProjects.map((project) => (
              <article key={project.id} className="panel overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} project photography`}
                    fill
                    sizes="(max-width: 1280px) 100vw, 50vw"
                    className="object-cover transition duration-700 hover:scale-[1.03]"
                  />
                </div>
                <div className="grid gap-6 p-6 md:grid-cols-[1fr_0.9fr]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      {project.type}
                    </p>
                    <h3 className="mt-3 font-serif text-4xl leading-none">
                      {project.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      {project.services}
                    </p>
                  </div>
                  <dl className="grid gap-4 text-sm leading-7 text-[var(--color-muted)]">
                    <div>
                      <dt className="font-semibold text-[var(--color-charcoal)]">Location</dt>
                      <dd>{project.location}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--color-charcoal)]">Challenge</dt>
                      <dd>{project.challenge}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--color-charcoal)]">Result</dt>
                      <dd>{project.result}</dd>
                    </div>
                  </dl>
                </div>
                <div className="border-t border-black/8 px-6 py-4">
                  <a href="#consultation" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-walnut)]">
                    View case study
                    <ArrowRightIcon />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="relative overflow-hidden border border-black/8 bg-[var(--color-charcoal)] px-5 py-8 text-white md:px-10 md:py-12">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div>
                <p className="eyebrow text-white/60">Video Story</p>
                <h2 className="section-title text-white">From Our Workshop to Your Space</h2>
                <p className="mt-6 text-sm leading-7 text-white/75 md:text-base">
                  See how consultations, production, finishing, logistics, and
                  completed interiors connect into one highly managed experience.
                </p>
              </div>
              <div className="overflow-hidden border border-white/10">
                <video
                  controls
                  poster="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80"
                  className="h-full w-full bg-black object-cover"
                >
                  <source
                    src="https://cdn.coverr.co/videos/coverr-carpenter-sanding-wood-1561009523003?download=1080p"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section-shell section-divider">
          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
            <div className="panel p-6 md:p-10">
              <p className="eyebrow">Company Story</p>
              <h2 className="section-title max-w-2xl">
                We believe exceptional spaces begin with furniture made with purpose.
              </h2>
              <p className="mt-6 text-base leading-8 text-[var(--color-muted)]">
                Our team combines skilled craftsmanship, carefully selected
                materials, and thoughtful interior design to create spaces that
                feel distinctive, functional, and lasting.
              </p>
              <p className="mt-6 text-sm leading-7 text-[var(--color-muted)]">
                {companyName} works across residential homes, offices, hotels,
                restaurants, and premium commercial properties, delivering a
                complete process from concept to completion.
              </p>
              <a href="#contact" className="button-primary mt-8 inline-flex">
                Meet Our Team
              </a>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="stat-card">
                <p className="font-serif text-5xl text-[var(--color-charcoal)]">14+</p>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Years of Experience
                </p>
              </div>
              <div className="stat-card">
                <p className="font-serif text-5xl text-[var(--color-charcoal)]">260+</p>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Projects Completed
                </p>
              </div>
              <div className="stat-card">
                <p className="font-serif text-5xl text-[var(--color-charcoal)]">85+</p>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Commercial Clients
                </p>
              </div>
              <div className="stat-card">
                <p className="font-serif text-5xl text-[var(--color-charcoal)]">12</p>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Cities Supplied
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="mb-8">
            <p className="eyebrow">The Process</p>
            <h2 className="section-title">A five-stage journey from brief to installation.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-5">
            {processSteps.map((step, index) => (
              <article key={step} className="panel relative p-6">
                <span className="absolute right-5 top-5 text-xs uppercase tracking-[0.18em] text-[var(--color-gold)]">
                  0{index + 1}
                </span>
                <h3 className="mt-10 font-serif text-3xl leading-none">{step}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="panel p-6 md:p-10">
              <p className="eyebrow">Trust & Social Proof</p>
              <h2 className="section-title">
                Clear guarantees, dependable delivery, and high-touch support.
              </h2>
              <div className="mt-8 grid gap-4 text-sm leading-7 text-[var(--color-muted)]">
                <p>Quality craftsmanship guarantee on every installed project.</p>
                <p>Secure payment, milestone billing, and transparent production updates.</p>
                <p>Trusted by residences, boutique hotels, developers, and workplace teams.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {["Crestline Hotels", "Vista Developments", "Meridian Offices", "Harbor House"].map(
                  (brand) => (
                    <span key={brand} className="border border-black/10 px-3 py-2">
                      {brand}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <blockquote key={testimonial.author} className="panel flex flex-col p-6">
                  <div className="mb-5 flex gap-1 text-[var(--color-gold)]">
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                  <p className="flex-1 text-sm leading-7 text-[var(--color-muted)]">
                    “{testimonial.quote}”
                  </p>
                  <footer className="mt-6">
                    <p className="font-semibold text-[var(--color-charcoal)]">
                      {testimonial.author}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      {testimonial.role}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="panel p-6 md:p-10">
              <p className="eyebrow">Free Design Guide</p>
              <h2 className="section-title max-w-2xl">
                Download Our Furniture and Interior Planning Guide
              </h2>
              <p className="mt-6 text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Get practical guidance on furniture sizing, room layouts,
                materials, finishes, and planning your interior project.
              </p>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setGuideSubmitted(true);
              }}
              className="panel grid gap-4 p-6 md:p-8"
            >
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Name</span>
                <input className="form-input" type="text" name="name" required />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Email</span>
                <input className="form-input" type="email" name="email" required />
              </label>
              <label className="flex items-start gap-3 text-sm leading-6 text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-[var(--color-walnut)]"
                  required
                />
                <span>
                  I agree to receive the guide and occasional updates about products,
                  consultations, and project insights.
                </span>
              </label>
              <button type="submit" className="button-primary">
                Download Guide
              </button>
              {guideSubmitted ? (
                <p className="text-sm text-[var(--color-walnut)]">
                  Your guide request has been captured. Connect this form to your CRM
                  or CMS endpoint to deliver the download automatically.
                </p>
              ) : null}
            </form>
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Instagram / Project Gallery</p>
              <h2 className="section-title">Completed rooms, materials, and making in progress.</h2>
            </div>
            <a
              href="https://www.instagram.com/companyname"
              target="_blank"
              rel="noreferrer"
              className="button-ghost"
            >
              Visit Instagram
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {socialGallery.map((image, index) => (
              <div key={image} className={index === 0 ? "relative col-span-2 row-span-2 aspect-[16/10] overflow-hidden border border-black/8" : "relative aspect-square overflow-hidden border border-black/8"}>
                <Image
                  src={image}
                  alt="Completed interior and craftsmanship gallery image"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </section>

        {recentlyViewed.length > 0 ? (
          <section className="section-shell section-divider">
            <div className="mb-8">
              <p className="eyebrow">Recently Viewed</p>
              <h2 className="section-title">Keep exploring the pieces that stood out.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {recentlyViewed.map((productId) => {
                const product = products.find((item) => item.id === productId);

                if (!product) {
                  return null;
                }

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => openQuickView(product.id)}
                    className="panel overflow-hidden text-left"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={`${product.name} preview image`}
                        fill
                        sizes="(max-width: 1280px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-serif text-2xl">{product.name}</p>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">
                        From {formatPrice(getCurrentPrice(product))}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <section
          id="consultation"
          className="section-shell section-divider"
        >
          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="panel p-6 md:p-10">
              <p className="eyebrow">Book a Consultation</p>
              <h2 className="section-title max-w-2xl">
                Start with your project type, location, budget, and timeline.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[var(--color-muted)]">
                Residential and commercial briefs can be reviewed online or in
                person, with WhatsApp as a fast-track option for initial sharing.
              </p>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="button-secondary mt-8 inline-flex items-center gap-2"
              >
                <WhatsappIcon />
                WhatsApp Alternative
              </a>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setConsultationSubmitted(true);
              }}
              className="panel grid gap-4 p-6 md:grid-cols-2 md:p-8"
            >
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Residential or Commercial</span>
                <select className="form-select" required>
                  <option>Residential</option>
                  <option>Commercial</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Project Type</span>
                <select className="form-select" required>
                  <option>Home Interior</option>
                  <option>Office Fit-Out</option>
                  <option>Hotel or Hospitality</option>
                  <option>Custom Furniture Only</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Location</span>
                <input className="form-input" type="text" required />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Approximate Budget</span>
                <select className="form-select" required>
                  <option>10,000 - 25,000</option>
                  <option>25,000 - 50,000</option>
                  <option>50,000 - 100,000</option>
                  <option>100,000+</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Preferred Timeline</span>
                <input className="form-input" type="text" placeholder="Q4 2026" required />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Required Services</span>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Interior design, production, installation"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm md:col-span-2">
                <span className="font-medium">Project files or inspiration images</span>
                <input
                  className="form-input file:mr-4 file:border-0 file:bg-[var(--color-walnut)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
                  type="file"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Preferred Meeting Date</span>
                <input className="form-input" type="date" required />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">Contact Email</span>
                <input className="form-input" type="email" required />
              </label>
              <label className="flex flex-col gap-2 text-sm md:col-span-2">
                <span className="font-medium">Additional Notes</span>
                <textarea className="form-input min-h-32" />
              </label>
              <div className="md:col-span-2">
                <button type="submit" className="button-primary">
                  Submit Consultation Request
                </button>
                {consultationSubmitted ? (
                  <p className="mt-3 text-sm text-[var(--color-walnut)]">
                    Consultation request captured. Hook this form into Shopify,
                    HubSpot, or your preferred CMS workflow for production use.
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </section>

        <section id="faq" className="section-shell section-divider">
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">FAQ</p>
              <h2 className="section-title max-w-xl">
                Common questions about custom orders, timing, delivery, and care.
              </h2>
            </div>
            <div className="grid gap-4">
              {faqItems.map((item) => (
                <details key={item.question} className="panel group p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-2xl text-[var(--color-charcoal)]">
                    {item.question}
                    <span className="transition group-open:rotate-180">
                      <ChevronDownIcon />
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-shell section-divider pb-20 md:pb-28">
          <div className="relative overflow-hidden border border-black/8 bg-[var(--color-charcoal)] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(185,154,99,0.22),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.03),transparent_45%)]" />
            <div className="relative grid gap-8 p-6 md:p-10 xl:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="eyebrow text-white/60">Final CTA</p>
                <h2 className="section-title max-w-3xl text-white">
                  Let&apos;s Create a Space That Feels Like Yours
                </h2>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href="#consultation" className="button-primary">
                    Book a Consultation
                  </a>
                  <a href="#services" className="button-secondary border-white/20 text-white">
                    Request a Quote
                  </a>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary border-white/20 text-white"
                  >
                    <span className="inline-flex items-center gap-2">
                      <WhatsappIcon />
                      WhatsApp
                    </span>
                  </a>
                </div>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                  <ContactPill icon={<PhoneIcon />} label="Phone" value="+234 (0) 800 000 0000" />
                  <ContactPill icon={<MailIcon />} label="Email" value="hello@companyname.example" />
                  <ContactPill
                    icon={<LocationIcon />}
                    label="Showroom"
                    value="Victoria Island, Lagos"
                  />
                </div>
              </div>

              <div className="grid gap-5">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="grid gap-4 border border-white/10 bg-white/6 p-6 backdrop-blur"
                >
                  <label className="flex flex-col gap-2 text-sm">
                    <span>Name</span>
                    <input className="form-input form-input-dark" type="text" required />
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span>Email</span>
                    <input className="form-input form-input-dark" type="email" required />
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span>Message</span>
                    <textarea className="form-input form-input-dark min-h-28" required />
                  </label>
                  <button type="submit" className="button-primary">
                    Send Enquiry
                  </button>
                  {contactSubmitted ? (
                    <p className="text-sm text-white/75">
                      Enquiry sent for review. Connect this form to your backend or
                      Shopify inbox endpoint for production messaging.
                    </p>
                  ) : null}
                </form>

                <div className="overflow-hidden border border-white/10">
                  <iframe
                    title="Map showing Lagos, Nigeria"
                    src="https://www.google.com/maps?q=Lagos%2C%20Nigeria&z=12&output=embed"
                    className="h-64 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        companyName={companyName}
        selectedRegionCode={selectedRegionCode}
        setSelectedRegionCode={setSelectedRegionCode}
        newsletterSubmitted={newsletterSubmitted}
        onNewsletterSubmit={() => setNewsletterSubmitted(true)}
      />

      {mobileMenuOpen ? (
        <Overlay onClose={() => setMobileMenuOpen(false)}>
          <div className="ml-auto flex h-full w-full max-w-sm flex-col bg-white p-6">
            <div className="mb-8 flex items-center justify-between">
              <BrandMark companyName={companyName} />
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="icon-button">
                <CloseIcon />
              </button>
            </div>
            <nav className="grid gap-4 text-lg">
              {[
                ["Home", "#main-content"],
                ["About", "#about"],
                ["Shop", "#shop"],
                ["Interior Services", "#services"],
                ["Projects", "#projects"],
                ["Book a Consultation", "#consultation"],
                ["FAQ", "#faq"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-black/8 py-3 font-serif text-3xl"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </Overlay>
      ) : null}

      {searchOpen ? (
        <Overlay onClose={() => setSearchOpen(false)}>
          <div className="mx-auto mt-10 w-[min(90vw,760px)] bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Search</p>
                <h2 className="font-serif text-4xl">Find furniture by room, style, or material.</h2>
              </div>
              <button type="button" onClick={() => setSearchOpen(false)} className="icon-button">
                <CloseIcon />
              </button>
            </div>
            <label className="mt-6 flex items-center gap-3 border border-black/10 bg-[var(--color-surface)] px-4 py-3">
              <SearchIcon />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Try sofa, walnut, hotel, dining..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <div className="mt-6 grid gap-4">
              {suggestedProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    openQuickView(product.id);
                  }}
                  className="flex items-center gap-4 border border-black/8 p-3 text-left transition hover:border-[var(--color-gold)]"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={`${product.name} search result image`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-serif text-2xl">{product.name}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {product.category} • From {formatPrice(getCurrentPrice(product))}
                    </p>
                  </div>
                </button>
              ))}
              {suggestedProducts.length === 0 ? (
                <p className="text-sm text-[var(--color-muted)]">
                  No matches yet. Try a category, material, or product name.
                </p>
              ) : null}
            </div>
          </div>
        </Overlay>
      ) : null}

      {cartOpen ? (
        <Overlay onClose={() => setCartOpen(false)}>
          <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white">
            <div className="flex items-center justify-between border-b border-black/8 px-6 py-5">
              <div>
                <p className="eyebrow">Shopping Cart</p>
                <h2 className="font-serif text-4xl">Your selections</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} className="icon-button">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cartItems.length === 0 ? (
                <p className="text-sm leading-7 text-[var(--color-muted)]">
                  Your cart is currently empty. Add a product from the collection or
                  use Quick View to configure a made-to-order piece.
                </p>
              ) : (
                <div className="grid gap-4">
                  {cartItems.map((item) => (
                    <article key={item.key} className="flex gap-4 border border-black/8 p-3">
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
                            <h3 className="font-serif text-2xl">{item.name}</h3>
                            <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                              {item.size} • {item.color} • {item.finish}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setCartItems((current) =>
                                current.filter((cartItem) => cartItem.key !== item.key),
                              )
                            }
                            className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-black/8 px-2 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                setCartItems((current) =>
                                  current.map((cartItem) =>
                                    cartItem.key === item.key
                                      ? {
                                          ...cartItem,
                                          quantity: Math.max(1, cartItem.quantity - 1),
                                        }
                                      : cartItem,
                                  ),
                                )
                              }
                              className="px-2"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setCartItems((current) =>
                                  current.map((cartItem) =>
                                    cartItem.key === item.key
                                      ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                      : cartItem,
                                  ),
                                )
                              }
                              className="px-2"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-semibold text-[var(--color-walnut)]">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-black/8 px-6 py-5">
              <div className="mb-4 flex items-center gap-3">
                <input
                  value={promoCode}
                  onChange={(event) => setPromoCode(event.target.value)}
                  type="text"
                  placeholder="Discount code"
                  className="form-input"
                />
                <button type="button" onClick={handlePromoApply} className="button-secondary">
                  Apply
                </button>
              </div>
              {promoMessage ? (
                <p className="mb-4 text-sm text-[var(--color-muted)]">{promoMessage}</p>
              ) : null}
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted)]">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted)]">Discount</span>
                  <span>-{formatPrice(discountValue)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-black/8 pt-3 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                <a href="#consultation" onClick={() => setCartOpen(false)} className="button-primary text-center">
                  Proceed to Secure Checkout
                </a>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Secure payment • Dependable delivery • White-glove installation
                </p>
              </div>
            </div>
          </aside>
        </Overlay>
      ) : null}

      {quickViewProduct ? (
        <Overlay onClose={() => setQuickViewId(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
            className="mx-auto my-6 w-[min(96vw,1200px)] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
              <div>
                <p className="eyebrow">Quick View</p>
                <h2 id="quick-view-title" className="font-serif text-4xl">
                  {quickViewProduct.name}
                </h2>
              </div>
              <button type="button" onClick={() => setQuickViewId(null)} className="icon-button">
                <CloseIcon />
              </button>
            </div>
            <div className="grid gap-6 p-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-4">
                <div className="relative aspect-[4/4.6] overflow-hidden border border-black/8 bg-[var(--color-surface)]">
                  <Image
                    src={quickViewProduct.images[0]}
                    alt={`${quickViewProduct.name} hero image`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition duration-700 hover:scale-[1.06]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {quickViewProduct.images.slice(1).map((image, index) => (
                    <div key={image} className="relative aspect-square overflow-hidden border border-black/8">
                      <Image
                        src={image}
                        alt={`${quickViewProduct.name} alternate view ${index + 1}`}
                        fill
                        sizes="(max-width: 1024px) 33vw, 18vw"
                        className="object-cover transition duration-700 hover:scale-[1.06]"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {quickViewProduct.category}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[var(--color-walnut)]">
                    {formatPrice(getCurrentPrice(quickViewProduct))}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    {quickViewProduct.description}
                  </p>
                </div>

                <dl className="grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                  <div>
                    <dt className="font-semibold text-[var(--color-charcoal)]">Dimensions</dt>
                    <dd>{quickViewProduct.dimensions}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[var(--color-charcoal)]">Delivery</dt>
                    <dd>{quickViewProduct.timeframe}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[var(--color-charcoal)]">Warranty</dt>
                    <dd>{quickViewProduct.warranty}</dd>
                  </div>
                </dl>

                <div className="grid gap-4">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium">Size</span>
                    <select
                      value={getSelection(quickViewProduct).size}
                      onChange={(event) =>
                        setSelection(quickViewProduct.id, { size: event.target.value })
                      }
                      className="form-select"
                    >
                      {quickViewProduct.sizes.map((size) => (
                        <option key={size.label}>{size.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium">Finish</span>
                    <select
                      value={getSelection(quickViewProduct).finish}
                      onChange={(event) =>
                        setSelection(quickViewProduct.id, { finish: event.target.value })
                      }
                      className="form-select"
                    >
                      {quickViewProduct.finishes.map((finish) => (
                        <option key={finish}>{finish}</option>
                      ))}
                    </select>
                  </label>
                  <div className="flex flex-col gap-3 text-sm">
                    <span className="font-medium">Color</span>
                    <div className="flex flex-wrap gap-3">
                      {quickViewProduct.colors.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() =>
                            setSelection(quickViewProduct.id, { color: color.name })
                          }
                          className={
                            getSelection(quickViewProduct).color === color.name
                              ? "color-swatch color-swatch-active"
                              : "color-swatch"
                          }
                        >
                          <span
                            aria-hidden="true"
                            className="h-5 w-5 border border-black/10"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="font-medium">Quantity</span>
                    <div className="flex max-w-32 items-center justify-between border border-black/10 px-3 py-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelection(quickViewProduct.id, {
                            quantity: Math.max(1, getSelection(quickViewProduct).quantity - 1),
                          })
                        }
                      >
                        -
                      </button>
                      <span>{getSelection(quickViewProduct).quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelection(quickViewProduct.id, {
                            quantity: getSelection(quickViewProduct).quantity + 1,
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => addToCart(quickViewProduct)}
                    className="button-primary"
                  >
                    Add to Cart
                  </button>
                  <a href="#consultation" onClick={() => setQuickViewId(null)} className="button-secondary text-center">
                    Request Custom Size
                  </a>
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="button-ghost inline-flex items-center justify-center gap-2"
                >
                  <WhatsappIcon />
                  WhatsApp Enquiry
                </a>

                <div className="grid gap-3 border-t border-black/8 pt-6 text-sm leading-7 text-[var(--color-muted)]">
                  <p>
                    <span className="font-semibold text-[var(--color-charcoal)]">
                      Materials:
                    </span>{" "}
                    {quickViewProduct.materials.join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--color-charcoal)]">Care:</span>{" "}
                    {quickViewProduct.care}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--color-charcoal)]">Delivery & returns:</span>{" "}
                    {quickViewProduct.delivery}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Overlay>
      ) : null}
    </div>
  );
}

function AnnouncementBar() {
  return (
    <div className="relative z-40 border-b border-black/6 bg-[var(--color-charcoal)] px-4 py-3 text-center text-xs uppercase tracking-[0.22em] text-[var(--color-ivory)] md:text-sm">
      Complimentary Design Consultation for Selected Projects — Book Today
    </div>
  );
}

type HeaderProps = {
  companyName: string;
  selectedRegionCode: string;
  setSelectedRegionCode: (value: string) => void;
  cartCount: number;
  wishlistCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  setSearchOpen: (value: boolean) => void;
  accountOpen: boolean;
  setAccountOpen: (value: boolean) => void;
  setCartOpen: (value: boolean) => void;
};

function Header({
  companyName,
  selectedRegionCode,
  setSelectedRegionCode,
  cartCount,
  wishlistCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  setSearchOpen,
  accountOpen,
  setAccountOpen,
  setCartOpen,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/6 bg-[rgba(246,241,233,0.92)] backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between py-4">
        <BrandMark companyName={companyName} />

        <nav className="hidden items-center gap-6 text-sm xl:flex">
          <a href="#main-content" className="nav-link">
            Home
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
          <a href="#shop" className="nav-link">
            Shop
          </a>
          <a href="#services" className="nav-link">
            Interior Services
          </a>
          <a href="#projects" className="nav-link">
            Projects
          </a>
          <a href="#consultation" className="nav-link">
            Book a Consultation
          </a>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <label className="hidden items-center gap-2 border border-black/10 bg-white/90 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)] lg:flex">
            <span>Region</span>
            <select
              value={selectedRegionCode}
              onChange={(event) => setSelectedRegionCode(event.target.value)}
              className="bg-transparent text-[var(--color-charcoal)] outline-none"
              aria-label="Select region and currency"
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.currency}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => setSearchOpen(true)} className="icon-button">
            <SearchIcon />
            <span className="sr-only">Open search</span>
          </button>
          <button
            type="button"
            className="icon-button relative"
            onClick={() => setAccountOpen(!accountOpen)}
            aria-expanded={accountOpen}
          >
            <AccountIcon />
            <span className="sr-only">Open account panel</span>
          </button>
          <button type="button" className="icon-button relative">
            <HeartIcon filled={false} />
            {wishlistCount > 0 ? <Counter count={wishlistCount} /> : null}
            <span className="sr-only">Wishlist items</span>
          </button>
          <button type="button" onClick={() => setCartOpen(true)} className="icon-button relative">
            <CartIcon />
            {cartCount > 0 ? <Counter count={cartCount} /> : null}
            <span className="sr-only">Open cart</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="icon-button xl:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <MenuIcon />
            <span className="sr-only">Open mobile menu</span>
          </button>
        </div>
      </div>

      {accountOpen ? (
        <div className="section-shell pb-4">
          <div className="ml-auto max-w-md border border-black/8 bg-white p-4 text-sm leading-7 text-[var(--color-muted)] shadow-lg">
            Trade account access, saved projects, and client order history can live
            here once this storefront is connected to Shopify customer accounts or a
            preferred CRM.
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeroSection({ companyName }: { companyName: string }) {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=2000&q=80"
        alt="Luxury living room styled with warm wood furniture and soft neutral materials."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(32,32,32,0.88)_12%,rgba(32,32,32,0.5)_52%,rgba(32,32,32,0.18)_100%)]" />
      <div className="section-shell relative flex min-h-[88vh] flex-col justify-end pb-14 pt-28 md:pb-20">
        <div className="max-w-4xl animate-fade-up">
          <p className="eyebrow text-[var(--color-ivory)]/70">{companyName}</p>
          <h1 className="max-w-4xl font-serif text-6xl leading-[0.92] tracking-[-0.03em] text-white md:text-7xl lg:text-[6.4rem]">
            Furniture Made for the Way You Live
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
            Custom furniture and thoughtful interiors for homes, offices,
            hotels, and exceptional commercial spaces.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#shop" className="button-primary">
              Explore the Collection
            </a>
            <a href="#consultation" className="button-secondary border-white/20 text-white">
              Start Your Project
            </a>
          </div>
        </div>
        <a
          href="#shop"
          className="mt-16 inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-white/70"
        >
          Scroll to discover
          <span className="h-px w-12 bg-white/40" />
        </a>
      </div>
    </section>
  );
}

function Footer({
  companyName,
  selectedRegionCode,
  setSelectedRegionCode,
  newsletterSubmitted,
  onNewsletterSubmit,
}: {
  companyName: string;
  selectedRegionCode: string;
  setSelectedRegionCode: (value: string) => void;
  newsletterSubmitted: boolean;
  onNewsletterSubmit: () => void;
}) {
  return (
    <footer className="border-t border-black/8 bg-[#f0e5d6]">
      <div className="section-shell grid gap-10 py-12 md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <BrandMark companyName={companyName} />
          <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-muted)]">
            Premium furniture manufacturing, bespoke interiors, and complete
            project delivery for residential, workplace, hospitality, and
            commercial environments.
          </p>
        </div>
        <FooterList
          title="Shop"
          items={["Living Room", "Bedroom", "Dining", "Office Furniture", "Hotel Furniture", "Custom Furniture"]}
        />
        <FooterList
          title="Services"
          items={["Residential Interiors", "Office Interiors", "Space Planning", "Production", "Installation"]}
        />
        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Updates
          </h3>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onNewsletterSubmit();
            }}
            className="mt-4 grid gap-3"
          >
            <input className="form-input" type="email" placeholder="Email address" required />
            <button type="submit" className="button-primary">
              Join Newsletter
            </button>
          </form>
          {newsletterSubmitted ? (
            <p className="mt-3 text-sm text-[var(--color-walnut)]">
              Newsletter signup saved for integration.
            </p>
          ) : null}
        </div>
      </div>
      <div className="section-shell grid gap-4 border-t border-black/8 py-6 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)] md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-wrap gap-4">
          {[
            "Privacy Policy",
            "Refund and Returns Policy",
            "Delivery Policy",
            "Terms and Conditions",
            "Accepted Payments: Visa, Mastercard, Bank Transfer",
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <span>Currency</span>
            <select
              value={selectedRegionCode}
              onChange={(event) => setSelectedRegionCode(event.target.value)}
              className="bg-transparent text-[var(--color-charcoal)] outline-none"
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.currency}
                </option>
              ))}
            </select>
          </label>
          <span>© 2026 {companyName}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {title}
      </h3>
      <ul className="mt-4 grid gap-3 text-sm text-[var(--color-charcoal)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ContactPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/10 bg-white/6 p-4">
      <div className="mb-3 text-[var(--color-gold)]">{icon}</div>
      <p className="text-xs uppercase tracking-[0.18em] text-white/55">{label}</p>
      <p className="mt-2 text-sm text-white">{value}</p>
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
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    >
      <div className="h-full overflow-y-auto" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function BrandMark({ companyName }: { companyName: string }) {
  return (
    <a href="#main-content" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center border border-[var(--color-gold)]/70 bg-[var(--color-charcoal)] text-[var(--color-ivory)]">
        <span className="font-serif text-2xl">C</span>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
          Furniture and Interiors
        </p>
        <p className="font-serif text-2xl text-[var(--color-charcoal)]">{companyName}</p>
      </div>
    </a>
  );
}

function Counter({ count }: { count: number }) {
  return (
    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-walnut)] px-1 text-[10px] font-semibold text-white">
      {count}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-7-4.35-9.2-8.17C1.05 9.93 2.3 6 6.1 6c2 0 3.14 1.11 3.9 2.2C10.76 7.11 11.9 6 13.9 6c3.8 0 5.05 3.93 3.3 6.83C19 16.65 12 21 12 21Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 5h2l2.1 9.2c.1.48.53.8 1.02.8H17.6c.48 0 .9-.32 1.02-.79L20 8H7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.2" fill="currentColor" />
      <circle cx="18" cy="19" r="1.2" fill="currentColor" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 20c1.4-3.1 4.1-4.7 7-4.7s5.6 1.6 7 4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 3 2.8 5.66 6.24.9-4.52 4.4 1.06 6.22L12 17.2 6.42 20.18l1.06-6.22-4.52-4.4 6.24-.9L12 3Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.6 4h3.2L11 8.8l-2 1.8a15 15 0 0 0 4.4 4.4l1.8-2 4.8 1.2v3.2c0 .55-.45 1-1 1C10.85 19.4 4.6 13.15 4.6 5c0-.55.45-1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.7" />
      <path d="m4.8 7 7.2 5.5L19.2 7" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="10" r="2.2" fill="currentColor" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3a8.94 8.94 0 0 0-7.75 13.45L3 21l4.69-1.22A9 9 0 1 0 12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.3 8.5c-.2-.45-.42-.46-.62-.47h-.54c-.19 0-.5.07-.76.35-.26.28-1 1-.99 2.42 0 1.42 1.02 2.8 1.16 2.99.14.18 2 3.2 5 4.36 2.48.95 2.99.77 3.53.72.54-.05 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.08-.12-.29-.2-.6-.35-.31-.14-1.83-.9-2.11-1-.28-.1-.49-.14-.69.14-.2.29-.79 1-.97 1.2-.18.2-.37.22-.68.08-.31-.14-1.3-.48-2.47-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.13-.62.13-.13.31-.34.46-.51.15-.17.2-.29.31-.48.1-.19.05-.37-.03-.51-.08-.14-.7-1.68-.96-2.31Z" fill="currentColor" />
    </svg>
  );
}
