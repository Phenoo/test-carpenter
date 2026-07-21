"use client";

import { useState } from "react";
import { appointmentServices, siteConfig } from "@/lib/site-data";

const timeSlots = ["10:00", "11:30", "13:00", "15:00", "17:00"];

export function BookingFlow() {
  const [service, setService] = useState(appointmentServices[0].slug);
  const [date, setDate] = useState("2026-08-01");
  const [time, setTime] = useState(timeSlots[0]);
  const selectedService = appointmentServices.find((item) => item.slug === service) ?? appointmentServices[0];

  return (
    <section className="panel grid gap-6 p-6 md:grid-cols-3 md:p-8">
      <div>
        <p className="eyebrow">Step 1</p>
        <h3 className="font-serif text-4xl text-[var(--color-espresso)]">Choose service</h3>
        <div className="mt-5 grid gap-3">
          {appointmentServices.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setService(item.slug)}
              className={
                item.slug === service
                  ? "border border-[var(--color-blush)] bg-[var(--color-surface)] p-4 text-left"
                  : "border border-[var(--color-border)] bg-white/70 p-4 text-left"
              }
            >
              <p className="font-medium text-[var(--color-espresso)]">{item.title}</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{item.startingPrice}</p>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow">Step 2</p>
        <h3 className="font-serif text-4xl text-[var(--color-espresso)]">Choose date and time</h3>
        <div className="mt-5 grid gap-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Preferred date</span>
            <input
              className="form-input"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={time === slot ? "chip chip-active" : "chip"}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <p className="eyebrow">Step 3</p>
        <h3 className="font-serif text-4xl text-[var(--color-espresso)]">Confirm details</h3>
        <div className="mt-5 grid gap-4 text-sm leading-7 text-[var(--color-muted)]">
          <p>
            <span className="font-semibold text-[var(--color-espresso)]">Service:</span>{" "}
            {selectedService.title}
          </p>
          <p>
            <span className="font-semibold text-[var(--color-espresso)]">Date:</span> {date}
          </p>
          <p>
            <span className="font-semibold text-[var(--color-espresso)]">Time:</span> {time}
          </p>
          <p>{selectedService.audience}</p>
          <a href={siteConfig.bookingUrl} target="_blank" rel="noreferrer" className="button-primary mt-2 text-center">
            Continue to secure booking
          </a>
        </div>
      </div>
    </section>
  );
}
