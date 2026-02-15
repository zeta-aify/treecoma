import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Thai } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const meta = messages.meta as { title: string; description: string };

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://treecoma-banpassarelli.com",
    ),
    title: {
      default: meta.title,
      template: `%s | Ban Passarelli`,
    },
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      siteName: "Ban Passarelli & Treecoma",
      locale: locale === "th" ? "th_TH" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/restaurant/terrace-garden-view.jpg",
          width: 1600,
          height: 900,
          alt: "Ban Passarelli terrace restaurant",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/images/restaurant/terrace-garden-view.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://treecoma-banpassarelli.com"
).trim();

function LocalBusinessJsonLd() {
  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Bân Passarelli",
    alternateName: "Ban Passarelli",
    description:
      "Authentic Italian restaurant in Mae On District, Chiang Mai. Handmade pizza, fresh pasta, homemade desserts and Italian coffee. Family-run by Angela and her family.",
    url: SITE_URL,
    telephone: "+66950579660",
    image: `${SITE_URL}/images/restaurant/terrace-garden-view.jpg`,
    priceRange: "฿฿",
    servesCuisine: ["Italian", "Pizza", "Pasta"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "85, Moo 8, Ban Sa Ha Khon",
      addressLocality: "Mae On",
      addressRegion: "Chiang Mai",
      postalCode: "50130",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.776815,
      longitude: 99.24196,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "21:00",
      },
    ],
    menu: `${SITE_URL}/en/menu`,
    hasMenu: {
      "@type": "Menu",
      url: `${SITE_URL}/en/menu`,
    },
    sameAs: [],
  };

  const store = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Treecoma Cannabis",
    alternateName: "Tree Coma Co., Ltd.",
    description:
      "Licensed cannabis dispensary in Mae On District, Chiang Mai. Operating under Thai Ministry of Public Health license CM-1-725/2567. Controlled environment cultivation with Athena Ag systems.",
    url: `${SITE_URL}/en/cannabis`,
    telephone: "+66950579660",
    image: `${SITE_URL}/images/restaurant/family-terrace-cannabis.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "85, Moo 8, Ban Sa Ha Khon",
      addressLocality: "Mae On",
      addressRegion: "Chiang Mai",
      postalCode: "50130",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.776815,
      longitude: 99.24196,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "21:00",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurant) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(store) }}
      />
    </>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <LocalBusinessJsonLd />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} ${notoSansThai.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChatWidget />
          <Analytics />
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
