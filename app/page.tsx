import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@/components/site/icons";
import {
  customerFeedback,
  educationPrograms,
  siteConfig,
  trustBenefits,
} from "@/lib/site-data";
import {
  formatShopPrice,
  getShopProduct,
  type ShopProduct,
} from "@/lib/shop-collection-data";

const featuredShopProducts = [
  "aliyah-unit",
  "janelle-unit",
  "megan-unit",
  "rih-rih-unit",
]
  .map(getShopProduct)
  .filter((product): product is ShopProduct => product !== null);

const finishingProducts = ["finishing-sheen-mist", "hair-serum"]
  .map(getShopProduct)
  .filter((product): product is ShopProduct => product !== null);

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.domain,
    founder: siteConfig.founder,
    sameAs: [siteConfig.instagram],
  },
];

function HomeShopProductCard({
  product,
  wide = false,
}: {
  product: ShopProduct;
  wide?: boolean;
}) {
  return (
    <article className="group overflow-hidden">
      <Link
        href={`/shop/${product.slug}`}
        className={`relative block overflow-hidden bg-[#f5f5f5] ${
          wide ? "aspect-[16/11]" : "aspect-[4/5]"
        }`}
        aria-label={`View ${product.title}`}
      >
        <Image
          src={product.images[0]}
          alt={product.alt}
          fill
          sizes={wide ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 1280px) 50vw, 25vw"}
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        {product.images[1] ? (
          <Image
            src={product.images[1]}
            alt={`${product.title} alternate view`}
            fill
            sizes={wide ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 1280px) 50vw, 25vw"}
            className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute left-4 top-4 flex gap-2">
          {product.sale ? <span className="badge">Sale</span> : null}
          {!product.available ? <span className="badge">Sold out</span> : null}
        </div>
      </Link>

      <div className="border border-t-0 border-[var(--color-border)] bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {product.requiresSelection ? "Pixie unit" : "Hair essential"}
            </p>
            <h3 className="mt-2 font-serif text-3xl leading-none text-[var(--color-espresso)]">
              {product.title}
            </h3>
          </div>
          <p className="shrink-0 text-right text-sm font-semibold text-black">
            {product.priceUsd === 0
              ? "Free"
              : `${product.requiresSelection ? "From " : ""}${formatShopPrice(product.priceUsd, "USD")}`}
          </p>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
          {product.description}
        </p>
        <Link href={`/shop/${product.slug}`} className="button-ghost mt-4 inline-flex px-0">
          View product
        </Link>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main-content" className="flex-1 pb-28 md:pb-0">
        <section className="relative isolate overflow-hidden">
          <Image
            src="/collections/alldeep/products/aliyah-1.jpg"
            alt="Aliyah Unit styled in polished sculpted waves"
            fill
            preload
            sizes="100vw"
            className="object-cover object-[58%_38%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(0,0,0,0.82)_12%,rgba(0,0,0,0.48)_50%,rgba(0,0,0,0.16)_100%)]" />
          <div className="section-shell relative flex min-h-[78vh] flex-col justify-end pb-16 pt-28 md:pb-20">
            <div className="max-w-3xl">
              <p className="eyebrow text-white/70">Luxury Pixie Wig Studio</p>
              <h1 className="max-w-3xl font-serif text-6xl leading-[0.92] tracking-[-0.04em] text-white md:text-7xl">
                Short Hair. Signature Confidence.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 md:text-lg">
                Bespoke pixie units designed, cut and styled by specialist hairstylist
                Selina Williams.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/shop" className="button-primary">
                  Shop pixie units
                </Link>
                <Link href="/book" className="button-secondary border-white/20 text-white">
                  Book an appointment
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--color-border)] bg-white/70">
          <div className="section-shell grid gap-4 py-5 md:grid-cols-4">
            {trustBenefits.map((benefit) => (
              <p
                key={benefit}
                className="text-sm uppercase tracking-[0.16em] text-[var(--color-espresso)]"
              >
                {benefit}
              </p>
            ))}
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="grid gap-5 md:grid-cols-3">
            <article className="panel p-6">
              <p className="eyebrow">Bespoke Units</p>
              <h2 className="font-serif text-4xl text-[var(--color-espresso)]">
                Short wigs made to order.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Choose your cap size, lace type, parting, and colour with simple
                consultation support built in.
              </p>
              <Link href="/shop" className="button-ghost mt-5 inline-flex px-0">
                Shop now
              </Link>
            </article>
            <article className="panel p-6">
              <p className="eyebrow">Appointments</p>
              <h2 className="font-serif text-4xl text-[var(--color-espresso)]">
                Need a salon finish?
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Book a pixie install, consultation, or maintenance refresh and understand
                the service before you check dates.
              </p>
              <Link href="/book" className="button-ghost mt-5 inline-flex px-0">
                Book now
              </Link>
            </article>
            <article className="panel p-6">
              <p className="eyebrow">Education</p>
              <h2 className="font-serif text-4xl text-[var(--color-espresso)]">
                Learn the pixie method.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Explore Selina’s free checklist, online masterclass, and one-to-one
                intensive for stylists.
              </p>
              <Link href="/education" className="button-ghost mt-5 inline-flex px-0">
                Learn more
              </Link>
            </article>
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured pixie units</p>
              <h2 className="section-title">Shop the signature styles.</h2>
            </div>
            <Link href="/shop" className="button-ghost hidden md:inline-flex">
              View all
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredShopProducts.map((product) => (
              <HomeShopProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
            <div className="relative min-h-[420px] overflow-hidden border border-[var(--color-border)]">
              <Image
                src="/collections/alldeep/products/custom-frontal-1.jpg"
                alt="Custom Frontal Unit with a softly layered pixie fringe"
                fill
                sizes="(max-width: 1280px) 100vw, 45vw"
                className="object-cover object-[center_35%]"
              />
            </div>
            <div className="panel p-6 md:p-10">
              <p className="eyebrow">The signature finish</p>
              <h2 className="section-title max-w-2xl">
                More than a wig. A look designed to help women feel polished and like themselves.
              </h2>
              <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
                Every pixie is shaped with balance, movement, and a clean salon finish so it
                feels considered from every angle.
              </p>
              <Link href="/shop/custom-frontal-unit" className="button-primary mt-8 inline-flex">
                Shop the look
              </Link>
            </div>
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="grid gap-5 md:grid-cols-3">
            {customerFeedback.map((feedback) => (
              <blockquote key={feedback.concern} className="panel p-6">
                <div className="mb-4 flex gap-1 text-[var(--color-burgundy)]">
                  <StarIcon className="h-4 w-4" />
                  <StarIcon className="h-4 w-4" />
                  <StarIcon className="h-4 w-4" />
                  <StarIcon className="h-4 w-4" />
                  <StarIcon className="h-4 w-4" />
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {feedback.concern}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  “{feedback.quote}”
                </p>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Hair essentials</p>
              <h2 className="section-title">Finish the look.</h2>
            </div>
            <Link href="/shop" className="button-ghost hidden md:inline-flex">
              Shop all
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {finishingProducts.map((product) => (
              <HomeShopProductCard key={product.slug} product={product} wide />
            ))}
          </div>
        </section>

        <section className="section-shell section-divider">
          <div className="grid gap-5 md:grid-cols-3">
            {educationPrograms.map((program) => (
              <article key={program.slug} className="panel p-6">
                <p className="eyebrow">Education</p>
                <h2 className="font-serif text-4xl text-[var(--color-espresso)]">
                  {program.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  {program.summary}
                </p>
                <p className="mt-5 text-sm font-semibold text-[var(--color-burgundy)]">
                  {program.price}
                </p>
                <Link href="/education" className="button-ghost mt-5 inline-flex px-0">
                  Learn more
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-divider pb-20 md:pb-28">
          <div className="panel grid gap-6 p-6 md:grid-cols-[0.95fr_1.05fr] md:p-10">
            <div>
              <p className="eyebrow">Join the list</p>
              <h2 className="section-title max-w-2xl">Your best pixie starts here.</h2>
              <p className="mt-5 text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Join for new-unit releases, appointment updates, and Selina’s free pixie
                checklist.
              </p>
            </div>
            <form className="grid gap-4">
              <input className="form-input" type="text" placeholder="First name" required />
              <input className="form-input" type="email" placeholder="Email address" required />
              <select className="form-select">
                <option>Wigs</option>
                <option>Appointments</option>
                <option>Education</option>
              </select>
              <button type="submit" className="button-primary">
                Join the community
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
