import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Thai } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
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
      process.env.NEXT_PUBLIC_SITE_URL || "https://banpassarelli.com",
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
  };
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
      <body
        className={`${playfair.variable} ${inter.variable} ${notoSansThai.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
