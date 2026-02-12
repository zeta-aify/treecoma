"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart";
import { useState } from "react";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.totalItems());
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/menu", label: t("menu") },
    { href: "/cannabis", label: t("cannabis") },
    { href: "/about", label: t("about") },
    { href: "/social", label: t("social") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-xl sm:text-2xl text-forest font-bold">
              Ban Passarelli
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-forest ${
                  pathname === link.href
                    ? "text-forest border-b-2 border-terracotta"
                    : "text-charcoal-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: language switcher + cart */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-charcoal hover:text-forest transition-colors"
              aria-label={t("cart")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-charcoal"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-cream-dark pt-3">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-base font-medium px-2 py-1 rounded transition-colors ${
                    pathname === link.href
                      ? "text-forest bg-forest/5"
                      : "text-charcoal-light hover:text-forest"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(locale: "th" | "en") {
    router.replace(pathname, { locale });
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale("th")}
        className="px-1.5 py-0.5 rounded hover:bg-cream-dark transition-colors"
      >
        TH
      </button>
      <span className="text-charcoal-light">/</span>
      <button
        onClick={() => switchLocale("en")}
        className="px-1.5 py-0.5 rounded hover:bg-cream-dark transition-colors"
      >
        EN
      </button>
    </div>
  );
}
