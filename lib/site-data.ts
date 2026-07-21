export type CurrencyCode = "GBP" | "USD" | "NGN";

export type ProductKind = "wig" | "essential" | "education" | "resource";

export type ProductType =
  | "Bespoke Pixie Units"
  | "Ready-to-Ship Units"
  | "Custom Frontal Units"
  | "Glueless Closure Units"
  | "Hair Essentials"
  | "Education"
  | "Free Resources";

export type ProductStatus =
  | "Bestseller"
  | "Made to Order"
  | "Ready to Ship"
  | "Sold Out";

export type ColourSwatch = {
  name: string;
  hex: string;
};

export type Product = {
  slug: string;
  name: string;
  type: ProductType;
  kind: ProductKind;
  status: ProductStatus;
  price: number;
  description: string;
  shortBenefit: string;
  longDescription: string;
  dispatchEstimate: string;
  installmentHint: string;
  laceTypes: string[];
  capSizes: string[];
  partings: string[];
  colours: ColourSwatch[];
  options: string[];
  benefits: string[];
  included: string[];
  care: string[];
  policy: string[];
  faq: { question: string; answer: string }[];
  gallery: string[];
  videoPoster?: string;
  reviewLabel?: string;
  processingTag: string;
  featured?: boolean;
  recommendedSlugs?: string[];
  quizTags: string[];
};

export type CollectionCard = {
  title: ProductType;
  description: string;
  href: string;
  image: string;
};

export type EducationProgram = {
  slug: string;
  title: string;
  level: string;
  format: string;
  duration: string;
  price: string;
  summary: string;
  curriculum: string[];
  outcomes: string[];
  ctaLabel: string;
};

export type AppointmentService = {
  slug: string;
  title: string;
  audience: string;
  includes: string[];
  duration: string;
  startingPrice: string;
  preparation: string;
};

export type FaqGroup = {
  title: string;
  items: { question: string; answer: string }[];
};

export const siteConfig = {
  name: "demutzhair",
  founder: "Selina Williams",
  domain: "https://demutzhair.example",
  phone: "+44 (0)20 7946 1208",
  email: "hello@demutzhair.example",
  instagram: "https://www.instagram.com/demutzhair",
  bookingUrl: "https://bookings.demutzhair.example",
  whatsappUrl: "https://wa.me/447700900123",
  location: "South East London, United Kingdom",
  founded: "2014",
};

export const currencyOptions: Record<
  CurrencyCode,
  { label: string; locale: string; rate: number }
> = {
  GBP: { label: "GBP", locale: "en-GB", rate: 1 },
  USD: { label: "USD", locale: "en-US", rate: 1.29 },
  NGN: { label: "NGN", locale: "en-NG", rate: 2050 },
};

export const announcementMessages = [
  "Complimentary consultation support with every bespoke unit",
  "Worldwide delivery available on bespoke pixie units and ready-to-ship drops",
  "New enrolment open for the Online Pixie Masterclass",
];

export const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/book", label: "Book an Appointment" },
  { href: "/education", label: "Education" },
  { href: "/about", label: "About" },
];

export const trustBenefits = [
  "Expertly Cut & Styled",
  "Premium HD Lace",
  "Secure, Comfortable Fit",
  "Worldwide Delivery",
];

export const categoryCards: CollectionCard[] = [
  {
    title: "Bespoke Pixie Units",
    description:
      "Custom pixie units designed, cut and finished for women who want polish without the daily styling stress.",
    href: "/shop?collection=Bespoke%20Pixie%20Units",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Custom Frontal Units",
    description:
      "Signature short styles with more versatility, lace detail, and expressive side or deep-part finishes.",
    href: "/shop?collection=Custom%20Frontal%20Units",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Hair Essentials",
    description:
      "Keep your unit fresh, smooth and camera-ready with salon-backed care and lace-finishing staples.",
    href: "/shop?collection=Hair%20Essentials",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Education",
    description:
      "Free guides, professional masterclasses, and one-to-one mentoring for stylists ready to elevate their pixie work.",
    href: "/education",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
];

export const products: Product[] = [
  {
    slug: "signature-soft-sculpt-pixie",
    name: "Signature Soft Sculpt Pixie",
    type: "Bespoke Pixie Units",
    kind: "wig",
    status: "Bestseller",
    price: 695,
    description:
      "A refined side-swept pixie with soft movement, polished layering, and a natural lace finish.",
    shortBenefit:
      "A made-to-order pixie that frames the face beautifully and wears comfortably from morning to evening.",
    longDescription:
      "This signature unit is designed for clients who want a sophisticated short style with salon-finished movement. Each unit is cut, thinned, refined, and lightly customised to your chosen side, fit, and colour direction.",
    dispatchEstimate: "Dispatches in 14 to 18 working days",
    installmentHint: "Split available at checkout through Shopify instalments.",
    laceTypes: ["HD Closure", "Transparent Closure"],
    capSizes: ["Petite", "Small", "Medium", "Large"],
    partings: ["Left side", "Right side", "Soft middle"],
    colours: [
      { name: "Natural Black", hex: "#1B1413" },
      { name: "Soft Burgundy", hex: "#6E292C" },
      { name: "Chestnut", hex: "#5B392C" },
    ],
    options: ["Custom density balancing", "Extra lace melt kit", "Rush finish"],
    benefits: [
      "Premium HD lace",
      "Breathable cap construction",
      "Secure elastic band and combs",
      "Professionally cut and styled",
      "Worldwide shipping",
    ],
    included: [
      "Finished wig unit",
      "Care card",
      "Storage satin bag",
      "Elastic band pre-installed",
    ],
    care: [
      "Wrap lightly at night using a silk scarf or bonnet.",
      "Use foam wrap sparingly to maintain direction and movement.",
      "Avoid heavy oils near the lace and knots.",
    ],
    policy: [
      "Custom units are final sale once production begins.",
      "If measurements are unclear, Selina’s team will contact you before build approval.",
      "Dispatch windows may shift slightly during launch periods or holiday closures.",
    ],
    faq: [
      {
        question: "Is this unit glueless?",
        answer:
          "It can be worn glueless when paired with the elastic band and the right measurements, though some clients still prefer additional lace hold for extended wear.",
      },
      {
        question: "Can I request a stronger swoop or softer cut?",
        answer:
          "Yes. Use the optional notes field and order consultation support for detail-led customisation before build approval.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1400&q=80",
    ],
    videoPoster:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
    reviewLabel: "Selected client feedback available on request",
    processingTag: "Made to order",
    featured: true,
    recommendedSlugs: ["pixie-revive-care-kit", "lace-melt-finish-duo"],
    quizTags: ["polished", "everyday", "glueless", "left"],
  },
  {
    slug: "glueless-satin-closure-pixie",
    name: "Glueless Satin Closure Pixie",
    type: "Glueless Closure Units",
    kind: "wig",
    status: "Made to Order",
    price: 645,
    description:
      "A sleek, secure pixie for clients who want polished short hair without salon-only upkeep.",
    shortBenefit:
      "Ideal for women who want an elegant everyday fit with minimal attachment fuss.",
    longDescription:
      "The Glueless Satin Closure Pixie is shaped for smooth daily wear and easy removal, with a secure interior and soft crown movement that reads polished rather than overly rigid.",
    dispatchEstimate: "Dispatches in 12 to 16 working days",
    installmentHint: "Flexible payment options shown at checkout.",
    laceTypes: ["HD Closure", "Swiss Closure"],
    capSizes: ["Small", "Medium", "Large"],
    partings: ["Left side", "Right side"],
    colours: [
      { name: "Natural Black", hex: "#181110" },
      { name: "Warm Brown", hex: "#6A4430" },
    ],
    options: ["Band reinforcement", "Additional sideburn shaping"],
    benefits: [
      "Glueless-ready fit",
      "Secure comb and band support",
      "Lightweight breathable cap",
      "Travel-friendly styling",
      "Professional finishing",
    ],
    included: [
      "Finished glueless closure unit",
      "Elastic band fitted",
      "Basic care instructions",
    ],
    care: [
      "Store on a wig stand when not in use.",
      "Use low heat and short passes for touch-ups.",
      "Apply styling foam lightly to preserve softness.",
    ],
    policy: [
      "Custom production begins after measurement confirmation.",
      "Glueless performance depends on fit accuracy and client application technique.",
    ],
    faq: [
      {
        question: "Will this unit lie flat at the front?",
        answer:
          "Yes, it is cut and prepared for a soft natural lay, though exact melt depends on your skin prep and fitting technique.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1524255684952-d7185b509571?auto=format&fit=crop&w=1400&q=80",
    ],
    videoPoster:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80",
    processingTag: "Made to order",
    featured: true,
    recommendedSlugs: ["pixie-revive-care-kit"],
    quizTags: ["glueless", "everyday", "comfortable"],
  },
  {
    slug: "deep-part-frontal-pixie",
    name: "Deep Part Frontal Pixie",
    type: "Custom Frontal Units",
    kind: "wig",
    status: "Made to Order",
    price: 760,
    description:
      "For clients who love a sharper finish, deeper parting, and a little more styling drama.",
    shortBenefit:
      "A statement pixie for women who want short hair with editorial definition and lace versatility.",
    longDescription:
      "This frontal unit is crafted for stronger styling direction, more visible lace detail, and a refined, camera-ready finish that still feels wearable in real life.",
    dispatchEstimate: "Dispatches in 16 to 20 working days",
    installmentHint: "Secure checkout with instalment support where available.",
    laceTypes: ["HD Frontal", "Transparent Frontal"],
    capSizes: ["Small", "Medium", "Large"],
    partings: ["Deep left", "Deep right", "Free part"],
    colours: [
      { name: "Jet Black", hex: "#111111" },
      { name: "Espresso", hex: "#241B18" },
      { name: "Mulled Wine", hex: "#5E2227" },
    ],
    options: ["Bleached knots", "Tinted lace finish", "Custom razor detailing"],
    benefits: [
      "Frontal styling versatility",
      "Polished shape retention",
      "Luxury lace finish",
      "Custom cutting direction",
      "Editorial-ready movement",
    ],
    included: [
      "Finished frontal unit",
      "Styling notes",
      "Satin storage pouch",
    ],
    care: [
      "Use heat sparingly around the frontal edge.",
      "Do not overwork the hairline with thick adhesives.",
      "Book maintenance if you want Selina to refresh the cut or melt.",
    ],
    policy: [
      "Frontal units require slightly more fitting confidence than closure units.",
      "Bespoke specifications are confirmed before production begins.",
    ],
    faq: [
      {
        question: "Who is this best for?",
        answer:
          "Clients who want a little more styling freedom, a cleaner hairline moment, and a stronger fashion finish.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1524255684952-d7185b509571?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1400&q=80",
    ],
    videoPoster:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80",
    processingTag: "Made to order",
    featured: true,
    recommendedSlugs: ["lace-melt-finish-duo"],
    quizTags: ["frontal", "special", "dramatic", "right"],
  },
  {
    slug: "ready-to-ship-noir-crop",
    name: "Ready-to-Ship Noir Crop",
    type: "Ready-to-Ship Units",
    kind: "wig",
    status: "Ready to Ship",
    price: 575,
    description:
      "A polished short crop prepared in advance for clients who want faster dispatch without losing the demutzhair finish.",
    shortBenefit:
      "An easier route into the pixie look when timing matters but quality still comes first.",
    longDescription:
      "The Ready-to-Ship Noir Crop is completed in a classic, wearable shape with soft texture and a discreet closure finish. It is ideal for a first purchase or an upcoming occasion.",
    dispatchEstimate: "Dispatches in 2 to 4 working days",
    installmentHint: "Fast secure checkout available.",
    laceTypes: ["HD Closure"],
    capSizes: ["Medium"],
    partings: ["Left side"],
    colours: [{ name: "Soft Black", hex: "#191414" }],
    options: ["Additional melt kit"],
    benefits: [
      "Fast dispatch",
      "Professionally pre-cut",
      "Lightweight everyday shape",
      "Secure interior fit",
      "Signature short-hair finish",
    ],
    included: ["Ready-to-ship unit", "Care card"],
    care: [
      "Refresh with a light foam wrap and finger styling.",
      "Trim maintenance can be booked after wear.",
    ],
    policy: [
      "Ready-to-ship items may be returned only if unworn and lace remains uncut.",
    ],
    faq: [
      {
        question: "Can this be resized?",
        answer:
          "Minor internal adjustments may be possible, but the cap base itself is not remade on ready-to-ship stock.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80",
    ],
    videoPoster:
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1400&q=80",
    processingTag: "Ready to ship",
    featured: true,
    recommendedSlugs: ["pixie-revive-care-kit"],
    quizTags: ["fast", "everyday", "left"],
  },
  {
    slug: "lace-melt-finish-duo",
    name: "Lace Melt Finish Duo",
    type: "Hair Essentials",
    kind: "essential",
    status: "Bestseller",
    price: 38,
    description:
      "A salon-approved pair for clean lace hold and soft finishing without stiffness or heavy residue.",
    shortBenefit:
      "Designed to support the natural-looking front and polish that clients ask Selina about most.",
    longDescription:
      "This duo includes the lace melt spray and a flexible wrap mousse to help secure the front, refine flyaways, and maintain pixie direction between appointments.",
    dispatchEstimate: "Dispatches in 1 to 3 working days",
    installmentHint: "Checkout supports card, wallet, and instalment methods where available.",
    laceTypes: [],
    capSizes: [],
    partings: [],
    colours: [],
    options: ["Add mini edge brush"],
    benefits: [
      "Flexible hold",
      "No heavy white cast",
      "Travel-friendly sizing",
      "Pair with custom units or ready-to-ship pieces",
    ],
    included: ["Lace melt spray", "Flexible wrap mousse"],
    care: [
      "Store upright in a cool dry place.",
      "Use a small amount at a time for best finish.",
    ],
    policy: ["Beauty consumables are non-returnable once opened."],
    faq: [
      {
        question: "Will this work on non-pixie units?",
        answer:
          "Yes, but it was selected specifically because it performs beautifully on short lace units and close-cut finishes.",
      },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80",
    ],
    processingTag: "Ships quickly",
    featured: false,
    recommendedSlugs: ["signature-soft-sculpt-pixie"],
    quizTags: ["care", "support"],
  },
  {
    slug: "pixie-revive-care-kit",
    name: "Pixie Revive Care Kit",
    type: "Hair Essentials",
    kind: "essential",
    status: "Ready to Ship",
    price: 64,
    description:
      "A four-piece care kit created to keep your pixie unit fresh, soft, and confidently wearable.",
    shortBenefit:
      "A simple maintenance set for clients who want the demutzhair look to last beautifully between visits.",
    longDescription:
      "The Pixie Revive Care Kit includes a wrap foam, silk scarf, detailing comb, and refresh mist so your unit holds its shape and softness without guesswork.",
    dispatchEstimate: "Dispatches in 1 to 3 working days",
    installmentHint: "Secure checkout available.",
    laceTypes: [],
    capSizes: [],
    partings: [],
    colours: [],
    options: ["Add lace melt duo"],
    benefits: ["Travel-ready", "Beginner-friendly", "Gentle maintenance", "Works with closure and frontal units"],
    included: ["Wrap foam", "Refresh mist", "Silk scarf", "Detail comb"],
    care: ["Keep away from direct heat and close lids after use."],
    policy: ["Consumables and opened care items are final sale."],
    faq: [],
    gallery: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80",
    ],
    processingTag: "Ships quickly",
    featured: false,
    recommendedSlugs: ["glueless-satin-closure-pixie"],
    quizTags: ["care", "everyday"],
  },
  {
    slug: "online-pixie-masterclass",
    name: "Online Pixie Masterclass",
    type: "Education",
    kind: "education",
    status: "Bestseller",
    price: 297,
    description:
      "A self-paced learning experience covering pixie unit construction, cutting, styling, and finishing.",
    shortBenefit:
      "For stylists who want clear, practical instruction they can revisit while building short-unit confidence.",
    longDescription:
      "The masterclass walks through Selina’s pixie process step by step, from cap preparation and lace choice to shaping, styling, finishing, client positioning, and quality control.",
    dispatchEstimate: "Instant access after purchase",
    installmentHint: "Course payments may be split depending on checkout eligibility.",
    laceTypes: [],
    capSizes: [],
    partings: [],
    colours: [],
    options: ["Add private review session"],
    benefits: ["Self-paced lessons", "Replay access", "Professional techniques", "Built for working stylists and serious beginners"],
    included: ["Video curriculum", "Student workbook", "Materials list", "Certificate of completion"],
    care: [],
    policy: ["Digital education purchases are non-refundable once access is granted."],
    faq: [],
    gallery: [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1400&q=80",
    ],
    processingTag: "Instant access",
    featured: false,
    recommendedSlugs: ["one-to-one-pixie-intensive"],
    quizTags: ["education", "self-paced"],
  },
  {
    slug: "pixie-wig-checklist",
    name: "Free Pixie Wig Checklist",
    type: "Free Resources",
    kind: "resource",
    status: "Ready to Ship",
    price: 0,
    description:
      "A concise guide to choosing lace, fit, finish, and styling direction before you buy your next pixie unit.",
    shortBenefit:
      "A quick confidence-building resource for clients and stylists who want a smarter starting point.",
    longDescription:
      "This free resource helps you ask the right questions before ordering a bespoke unit, choosing closure versus frontal construction, and planning measurements, colour, and finish.",
    dispatchEstimate: "Delivered by email after sign-up",
    installmentHint: "Free download.",
    laceTypes: [],
    capSizes: [],
    partings: [],
    colours: [],
    options: [],
    benefits: ["Free lead resource", "Client-friendly", "Useful before ordering or training"],
    included: ["PDF checklist"],
    care: [],
    policy: [],
    faq: [],
    gallery: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80",
    ],
    processingTag: "Free resource",
    featured: false,
    recommendedSlugs: ["signature-soft-sculpt-pixie"],
    quizTags: ["resource", "planning"],
  },
];

export const featuredWigs = products.filter(
  (product) => product.featured && product.kind === "wig",
);

export const educationPrograms: EducationProgram[] = [
  {
    slug: "free-checklist",
    title: "Free Pixie Wig Checklist",
    level: "Beginner",
    format: "Downloadable PDF",
    duration: "10-minute read",
    price: "Free",
    summary:
      "A smart starting point for clients and stylists who want to understand lace, fit, parting, and finish before committing.",
    curriculum: ["Choosing closure vs frontal", "Measuring basics", "Colour and finish prompts"],
    outcomes: ["Better buying decisions", "Clearer consultation questions", "More confident planning"],
    ctaLabel: "Get the Checklist",
  },
  {
    slug: "masterclass",
    title: "Online Pixie Masterclass",
    level: "Intermediate",
    format: "Self-paced video course",
    duration: "4+ hours",
    price: "From £297",
    summary:
      "Selina’s core pixie method taught step by step for stylists who want a repeatable, premium result.",
    curriculum: ["Construction foundations", "Short-unit shaping", "Finishing and client-ready styling"],
    outcomes: ["Confident pixie workflow", "Professional polish", "Replayable learning"],
    ctaLabel: "View the Masterclass",
  },
  {
    slug: "intensive",
    title: "One-to-One Pixie Wig Intensive",
    level: "Advanced",
    format: "Private in-person training",
    duration: "Full day",
    price: "From £895",
    summary:
      "A tailored mentorship day for stylists who want close feedback, personal guidance, and a faster leap in results.",
    curriculum: ["Live build review", "Cutting refinement", "Problem-solving and business guidance"],
    outcomes: ["Personal feedback", "Faster confidence growth", "Closer accountability"],
    ctaLabel: "Enquire About Intensive",
  },
];

export const appointmentServices: AppointmentService[] = [
  {
    slug: "pixie-install-finish",
    title: "Pixie Install and Finish",
    audience: "For clients with a completed unit ready for a salon-finished melt and style.",
    includes: ["Lace installation", "Cutting refinement", "Polish finish", "Aftercare guidance"],
    duration: "2 hours",
    startingPrice: "From £145",
    preparation: "Arrive with your hair clean, braided flat, and your unit ready for assessment.",
  },
  {
    slug: "custom-pixie-consultation",
    title: "Custom Pixie Consultation",
    audience: "For clients ordering a bespoke unit or deciding between closure, frontal, colour, and fit options.",
    includes: ["Needs review", "Measurement guidance", "Style planning", "Order recommendations"],
    duration: "30 minutes",
    startingPrice: "From £35",
    preparation: "Bring inspiration photos and your preferred wear routine.",
  },
  {
    slug: "maintenance-refresh",
    title: "Pixie Maintenance Refresh",
    audience: "For returning clients who want the cut, finish, and movement restored.",
    includes: ["Wash and prep", "Light cut tune-up", "Styling refresh"],
    duration: "75 minutes",
    startingPrice: "From £95",
    preparation: "Book before heavy product build-up or severe tangling for best results.",
  },
];

export const transformationStories = [
  {
    name: "Chinelo",
    service: "Signature Soft Sculpt Pixie",
    quote:
      "I wanted short hair that looked expensive and still felt like me. The fit and finish made me feel instantly polished.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    href: "/shop/signature-soft-sculpt-pixie",
  },
  {
    name: "Marcia",
    service: "Ready-to-Ship Noir Crop",
    quote:
      "The lace sat beautifully and the style looked salon-fresh from the moment I opened the box.",
    image:
      "https://images.unsplash.com/photo-1524255684952-d7185b509571?auto=format&fit=crop&w=1200&q=80",
    href: "/shop/ready-to-ship-noir-crop",
  },
  {
    name: "Ayo",
    service: "Deep Part Frontal Pixie",
    quote:
      "Selina understood exactly how I wanted the side profile to move. It felt bold but still very wearable.",
    image:
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1200&q=80",
    href: "/shop/deep-part-frontal-pixie",
  },
];

export const customerFeedback = [
  {
    concern: "Natural-looking lace",
    quote:
      "The lace was subtle, soft, and blended much better than units I had ordered elsewhere.",
    author: "Client note",
  },
  {
    concern: "Accurate fit",
    quote:
      "I was nervous about measurements, but the guidance made the process straightforward and the fit felt secure.",
    author: "Client note",
  },
  {
    concern: "Training quality",
    quote:
      "The masterclass explained pixie shaping in a way that finally clicked for me as a stylist.",
    author: "Student note",
  },
];

export const styledGallery = [
  {
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    href: "/shop/signature-soft-sculpt-pixie",
    label: "Shop the signature sculpt",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
    href: "/shop/deep-part-frontal-pixie",
    label: "Shop the deep-part frontal",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    href: "/shop/ready-to-ship-noir-crop",
    label: "Shop the ready-to-ship crop",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    href: "/book",
    label: "Book a custom appointment",
  },
];

export const aboutMilestones = [
  {
    title: "Hair became personal first",
    copy:
      "After navigating hair loss and a discouraging salon experience as a teenager, Selina taught herself how hair could restore confidence rather than diminish it.",
  },
  {
    title: "Natural skill became a qualified path",
    copy:
      "What began as personal necessity grew into a profession shaped by technical training, persistent practice, and a love for short-hair transformation.",
  },
  {
    title: "The brand launched in 2014",
    copy:
      "demutzhair grew from salon artistry into a recognised short-hair and pixie-wig destination serving both clients and aspiring stylists.",
  },
  {
    title: "Today the work is both beauty and education",
    copy:
      "Selina now supports women seeking polished pixie units and stylists determined to master the same level of finish in their own work.",
  },
];

export const faqGroups: FaqGroup[] = [
  {
    title: "Ordering",
    items: [
      {
        question: "How do I know which pixie unit is right for me?",
        answer:
          "Start with the recommendation quiz, then book a consultation if you want help choosing finish, lace type, fit, and wear routine.",
      },
      {
        question: "Can I place an order without a consultation?",
        answer:
          "Yes. Most clients order directly, but consultation support is included if your measurements or preferences need review.",
      },
    ],
  },
  {
    title: "Custom wigs",
    items: [
      {
        question: "Are bespoke units final sale?",
        answer:
          "Yes. Because custom units are made to your chosen specification, they are treated as final sale once production begins.",
      },
      {
        question: "Do you offer glueless options?",
        answer:
          "Yes. Several closure units are designed for comfortable glueless wear with the right measurements and fit support.",
      },
    ],
  },
  {
    title: "Sizing",
    items: [
      {
        question: "How do I measure my head?",
        answer:
          "Every product page includes a simple measurement guide. If you are unsure, send your measurements during consultation support before final build approval.",
      },
      {
        question: "What if I am between cap sizes?",
        answer:
          "Choose the closest size and add a note. Selina’s team will review and advise if a fit adjustment is sensible.",
      },
    ],
  },
  {
    title: "Shipping",
    items: [
      {
        question: "Do you ship internationally?",
        answer:
          "Yes. Worldwide delivery is available for units, essentials, and education access where relevant.",
      },
      {
        question: "How long does dispatch take?",
        answer:
          "Each product page includes its dispatch window. Ready-to-ship stock leaves much faster than bespoke units.",
      },
    ],
  },
  {
    title: "Appointments",
    items: [
      {
        question: "Where are appointments held?",
        answer:
          "Appointments take place in South East London. Location details are shared with confirmed bookings.",
      },
      {
        question: "What is your cancellation policy?",
        answer:
          "Appointments can be rescheduled within the stated notice period on the booking page. Late changes may incur a fee or deposit loss depending on the service.",
      },
    ],
  },
  {
    title: "Masterclasses",
    items: [
      {
        question: "Who is the Online Pixie Masterclass for?",
        answer:
          "It is designed for aspiring and working hairstylists who want a stronger pixie-wig process and cleaner finishing technique.",
      },
      {
        question: "Do I need advanced experience before the private intensive?",
        answer:
          "Not necessarily, but the private day is most valuable when you already understand the basics and want feedback tailored to your skill gaps.",
      },
    ],
  },
];

export const footerGroups = [
  {
    title: "Shop",
    links: [
      { href: "/shop?collection=Bespoke%20Pixie%20Units", label: "Bespoke Pixie Units" },
      { href: "/shop?collection=Ready-to-Ship%20Units", label: "Ready-to-Ship Units" },
      { href: "/shop?collection=Hair%20Essentials", label: "Hair Essentials" },
      { href: "/shop?collection=Education", label: "Education" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { href: "/faq", label: "FAQs" },
      { href: "/faq#shipping", label: "Shipping" },
      { href: "/faq", label: "Returns and custom-order policy" },
      { href: "/faq", label: "Accessibility" },
    ],
  },
  {
    title: "Appointments",
    links: [
      { href: "/book", label: "Book now" },
      { href: "/book", label: "Service guide" },
      { href: "/book", label: "Preparation" },
    ],
  },
  {
    title: "Education",
    links: [
      { href: "/education", label: "Masterclass" },
      { href: "/education", label: "One-to-one intensive" },
      { href: "/education", label: "Free resources" },
    ],
  },
];

export function formatCurrency(amount: number, currency: CurrencyCode) {
  const config = currencyOptions[currency];

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount * config.rate);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string) {
  const product = getProduct(slug);

  if (!product?.recommendedSlugs?.length) {
    return [];
  }

  return product.recommendedSlugs
    .map((relatedSlug) => getProduct(relatedSlug))
    .filter((item): item is Product => Boolean(item));
}

export function getAllRouteUrls() {
  return [
    "/",
    "/shop",
    "/book",
    "/education",
    "/about",
    "/faq",
    ...products.map((product) => `/shop/${product.slug}`),
  ];
}
