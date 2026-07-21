import type { MetadataRoute } from "next";
import { getAllRouteUrls, siteConfig } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllRouteUrls().map((path) => ({
    url: `${siteConfig.domain}${path}`,
    lastModified: new Date("2026-07-18"),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
