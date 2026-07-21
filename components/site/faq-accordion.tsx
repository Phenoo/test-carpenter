"use client";

import { ChevronDownIcon } from "@/components/site/icons";

export function FaqAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <details key={item.question} className="panel group p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-2xl text-[var(--color-espresso)]">
            {item.question}
            <ChevronDownIcon className="h-5 w-5 transition group-open:rotate-180" />
          </summary>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
