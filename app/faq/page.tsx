import { FaqAccordion } from "@/components/site/faq-accordion";
import { faqGroups, siteConfig } from "@/lib/site-data";

export const metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about ordering, custom wigs, sizing, shipping, appointments, and masterclasses.",
};

export default function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    ),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main id="main-content" className="flex-1 pb-28 md:pb-16">
        <section className="section-shell py-12">
          <div className="max-w-4xl">
            <p className="eyebrow">FAQ</p>
            <h1 className="section-title">Answers on ordering, custom wigs, sizing, shipping, and training.</h1>
          </div>
        </section>

        <section className="section-shell">
          <div className="grid gap-8">
            {faqGroups.map((group) => (
              <section key={group.title} id={group.title.toLowerCase()} className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
                <div>
                  <p className="eyebrow">{group.title}</p>
                  <h2 className="font-serif text-5xl text-[var(--color-espresso)]">
                    {group.title}
                  </h2>
                </div>
                <FaqAccordion items={group.items} />
              </section>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
