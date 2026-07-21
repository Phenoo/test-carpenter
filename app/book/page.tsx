import { BookingFlow } from "@/components/site/booking-flow";
import { appointmentServices, siteConfig } from "@/lib/site-data";

export const metadata = {
  title: "Book an Appointment",
  description:
    "Book pixie installs, consultations, and maintenance services with demutzhair.",
};

export default function BookPage() {
  return (
    <main id="main-content" className="flex-1 pb-28 md:pb-16">
      <section className="section-shell py-12">
        <div className="max-w-4xl">
          <p className="eyebrow">Book an appointment</p>
          <h1 className="section-title">Understand the service before you enter the booking system.</h1>
          <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
            The booking journey is structured in three steps so clients can see what each
            service includes, who it is for, and how to prepare before choosing a date.
          </p>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-5 md:grid-cols-3">
          {appointmentServices.map((service) => (
            <article key={service.slug} className="panel p-6">
              <p className="font-serif text-4xl text-[var(--color-espresso)]">{service.title}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {service.audience}
              </p>
              <div className="mt-5 grid gap-2 text-sm text-[var(--color-muted)]">
                {service.includes.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
              <p className="mt-6 text-sm font-semibold text-[var(--color-burgundy)]">
                {service.duration} • {service.startingPrice}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Preparation: {service.preparation}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell section-divider">
        <BookingFlow />
      </section>

      <section className="section-shell section-divider">
        <div className="panel grid gap-6 p-6 md:grid-cols-2 md:p-10">
          <div>
            <p className="eyebrow">Policies</p>
            <h2 className="section-title max-w-xl">Clear preparation and rescheduling guidance.</h2>
          </div>
          <div className="grid gap-4 text-sm leading-7 text-[var(--color-muted)]">
            <p>Appointments take place in {siteConfig.location}.</p>
            <p>Clients receive full location details after booking confirmation.</p>
            <p>Late cancellations and missed appointments may affect deposit eligibility.</p>
            <p>Bring inspiration references if you are booking a consultation or custom fitting service.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
