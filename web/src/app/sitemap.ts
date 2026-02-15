import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://treecoma-banpassarelli.com"
).trim();

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["th", "en", "it"];
  const pages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/menu", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/cannabis", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/legal", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of locales) {
      const url =
        locale === "th"
          ? `${SITE_URL}${page.path}`
          : `${SITE_URL}/${locale}${page.path}`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              l === "th"
                ? `${SITE_URL}${page.path}`
                : `${SITE_URL}/${l}${page.path}`,
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
