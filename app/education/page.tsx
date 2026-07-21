import { FaqAccordion } from "@/components/site/faq-accordion";
import { educationPrograms, faqGroups } from "@/lib/site-data";

export const metadata = {
  title: "Education",
  description:
    "Compare the free Pixie Wig Checklist, Online Pixie Masterclass, and One-to-One Pixie Wig Intensive.",
};

export default function EducationPage() {
  return (
    <main id="main-content" className="flex-1 pb-28 md:pb-16">
      <section className="section-shell py-12">
        <div className="max-w-4xl">
          <p className="eyebrow">Education hub</p>
          <h1 className="section-title">Professional pixie education for stylists at different stages.</h1>
          <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
            Explore free resources, self-paced learning, and private training designed to
            help stylists build stronger pixie-wig construction, cutting, and finishing skills.
          </p>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-5 md:grid-cols-3">
          {educationPrograms.map((program) => (
            <article key={program.slug} className="panel p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {program.level} • {program.format}
              </p>
              <h2 className="mt-3 font-serif text-4xl text-[var(--color-espresso)]">
                {program.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {program.summary}
              </p>
              <div className="mt-5 grid gap-2 text-sm text-[var(--color-muted)]">
                {program.curriculum.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
              <p className="mt-6 text-sm font-semibold text-[var(--color-burgundy)]">
                {program.duration} • {program.price}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell section-divider">
        <div className="panel overflow-hidden">
          <div className="border-b border-[var(--color-border)] px-6 py-5 md:px-8">
            <p className="eyebrow">Comparison table</p>
            <h2 className="section-title max-w-2xl">Choose the right training path.</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--color-surface)] text-[var(--color-espresso)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Programme</th>
                  <th className="px-6 py-4 font-medium">Skill level</th>
                  <th className="px-6 py-4 font-medium">Format</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                  <th className="px-6 py-4 font-medium">Best for</th>
                </tr>
              </thead>
              <tbody>
                {educationPrograms.map((program) => (
                  <tr key={program.slug} className="border-t border-[var(--color-border)]">
                    <td className="px-6 py-4 font-medium">{program.title}</td>
                    <td className="px-6 py-4">{program.level}</td>
                    <td className="px-6 py-4">{program.format}</td>
                    <td className="px-6 py-4">{program.duration}</td>
                    <td className="px-6 py-4">{program.outcomes.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-shell section-divider">
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Education FAQ</p>
            <h2 className="section-title max-w-xl">Questions aspiring students ask most.</h2>
          </div>
          <FaqAccordion items={faqGroups.find((group) => group.title === "Masterclasses")?.items ?? []} />
        </div>
      </section>
    </main>
  );
}
