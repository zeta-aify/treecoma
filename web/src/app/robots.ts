import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treecoma-banpassarelli.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/cart", "/checkout", "/track", "/order-confirmation"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
