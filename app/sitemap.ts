import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://qraft.ashutoshswamy.in",
      lastModified: "2026-11-11", // ponytail: bump manually when page content changes
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
