"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "@/lib/site-data";

const quizQuestions = [
  {
    key: "finish",
    label: "What finish do you prefer?",
    options: ["Polished", "Soft", "Defined", "Editorial"],
  },
  {
    key: "lace",
    label: "Closure or frontal?",
    options: ["Closure", "Frontal", "Not sure"],
  },
  {
    key: "wear",
    label: "Glueless or professionally installed?",
    options: ["Glueless", "Installed", "Either"],
  },
  {
    key: "parting",
    label: "Preferred parting side?",
    options: ["Left", "Right", "Middle"],
  },
  {
    key: "occasion",
    label: "Everyday look or special occasion?",
    options: ["Everyday", "Special", "Both"],
  },
];

export function RecommendationQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({
    finish: "Polished",
    lace: "Closure",
    wear: "Glueless",
    parting: "Left",
    occasion: "Everyday",
  });

  const recommendation = useMemo(() => {
    const tags = [
      answers.finish.toLowerCase(),
      answers.lace.toLowerCase(),
      answers.wear.toLowerCase(),
      answers.parting.toLowerCase(),
      answers.occasion.toLowerCase(),
    ];

    return (
      products
        .filter((product) => product.kind === "wig")
        .map((product) => ({
          product,
          score: product.quizTags.reduce(
            (sum, tag) => sum + (tags.some((selected) => tag.includes(selected)) ? 1 : 0),
            0,
          ),
        }))
        .sort((left, right) => right.score - left.score)[0]?.product ?? products[0]
    );
  }, [answers]);

  return (
    <section className="panel grid gap-6 p-6 md:grid-cols-[0.92fr_1.08fr] md:p-10">
      <div>
        <p className="eyebrow">Find your perfect pixie</p>
        <h2 className="section-title max-w-xl">
          A quick recommendation quiz for fit, finish, and wear style.
        </h2>
        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)] md:text-base">
          Use this as a starting point, then add consultation support if you want Selina’s
          guidance before ordering.
        </p>
      </div>
      <div className="grid gap-5">
        {quizQuestions.map((question) => (
          <label key={question.key} className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-[var(--color-espresso)]">{question.label}</span>
            <select
              value={answers[question.key]}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [question.key]: event.target.value,
                }))
              }
              className="form-select"
            >
              {question.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        ))}
        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Recommended result
          </p>
          <h3 className="mt-3 font-serif text-4xl text-[var(--color-espresso)]">
            {recommendation.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            {recommendation.shortBenefit}
          </p>
          <Link href={`/shop/${recommendation.slug}`} className="button-primary mt-5 inline-flex">
            View recommended unit
          </Link>
        </div>
      </div>
    </section>
  );
}
