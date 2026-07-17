import ShowroomPage from "./showroom-page";

const companyName = "COMPANY NAME";
const companyUrl = "https://companyname.example";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: companyName,
    description:
      "Premium furniture manufacturing, interior design, delivery, and installation for residential and commercial projects.",
    url: companyUrl,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    telephone: "+234-800-000-0000",
    email: "hello@companyname.example",
    areaServed: ["Nigeria", "Ghana", "United Kingdom", "United States"],
    priceRange: "$$$",
    sameAs: [
      "https://www.instagram.com/companyname",
      "https://www.linkedin.com/company/companyname",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Aria Modular Sofa",
    brand: companyName,
    category: "Living Room Furniture",
    image: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "A made-to-order modular sofa crafted with premium upholstery and tailored proportions.",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "4200",
      availability: "https://schema.org/PreOrder",
    },
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ShowroomPage companyName={companyName} />
    </>
  );
}
