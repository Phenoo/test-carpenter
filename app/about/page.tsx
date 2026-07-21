import Image from "next/image";
import Link from "next/link";
import { aboutMilestones } from "@/lib/site-data";

export const metadata = {
  title: "About",
  description:
    "Learn Selina Williams’ story, the growth of demutzhair, and the mission behind the brand.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="flex-1 pb-28 md:pb-16">
      <section className="section-shell py-12">
        <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
          <div className="relative min-h-[520px] overflow-hidden border border-[var(--color-border)]">
            <Image
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80"
              alt="Portrait of Selina Williams in a calm editorial beauty setting."
              fill
              sizes="(max-width: 1280px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">About Selina</p>
            <h1 className="section-title max-w-3xl">Hair became my gift before it became my business.</h1>
            <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
              demutzhair began with personal restoration, grew through technical
              discipline, and now exists to help women feel polished and stylists feel more capable.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-5 md:grid-cols-2">
          {aboutMilestones.map((milestone) => (
            <article key={milestone.title} className="panel p-6">
              <h2 className="font-serif text-4xl text-[var(--color-espresso)]">
                {milestone.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {milestone.copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell section-divider">
        <div className="panel grid gap-6 p-6 md:grid-cols-2 md:p-10">
          <div>
            <p className="eyebrow">Mission</p>
            <h2 className="section-title max-w-xl">To use hair as a tool to inspire, uplift and empower women.</h2>
          </div>
          <div className="grid gap-4 text-sm leading-7 text-[var(--color-muted)]">
            <p>The work is rooted in confidence, comfort, and visible craftsmanship.</p>
            <p>Every client interaction and every education product is meant to feel warm, clear, and expertly led.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="button-primary">
                Discover the Collection
              </Link>
              <Link href="/education" className="button-secondary">
                Learn With Selina
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
