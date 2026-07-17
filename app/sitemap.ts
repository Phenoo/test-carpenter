import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://companyname.example",
      lastModified: new Date("2026-07-17"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
