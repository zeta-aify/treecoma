import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getMenuProducts } from "@/lib/menu";
import { FOOD_CATEGORIES, CATEGORY_KEYS } from "@/lib/types";
import type { ProductCategory, Product } from "@/lib/types";
import MenuItemCard from "@/components/MenuItemCard";

// ISR: cache the page, re-fetch products at most every 5 minutes.
export const revalidate = 300;

// Sections that open with a full-width dish photo (a matching hero-<cat>.webp exists).
const HERO_CATEGORIES = new Set<ProductCategory>([
  "starters",
  "pasta",
  "classic_pizza",
  "special_pizza",
]);

// Short intro line under a section title, keyed into the `menu` message namespace.
const SECTION_NOTES: Partial<Record<ProductCategory, string>> = {
  bakery: "bakeryNote",
  pasta: "notes.pasta",
};

const PARCHMENT = {
  backgroundColor: "#e7e3da",
  backgroundImage: "url('/menu/parchment.jpg')",
  backgroundSize: "760px",
  backgroundRepeat: "repeat",
} as const;

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("menu");
  const products = await getMenuProducts();

  const grouped = FOOD_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = products.filter((p) => p.category === cat);
      return acc;
    },
    {} as Record<ProductCategory, Product[]>,
  );

  const activeCategories = FOOD_CATEGORIES.filter(
    (cat) => grouped[cat]?.length,
  );

  return (
    <div style={PARCHMENT} className="text-charcoal overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-4 pb-24">
        {/* Masthead */}
        <header className="text-center pt-14 sm:pt-20 pb-6">
          <p className="font-condensed uppercase tracking-[0.35em] text-xs text-terracotta-dark mb-2">
            Bân Passarelli
          </p>
          <h1 className="font-script text-[2.5rem] sm:text-6xl md:text-7xl leading-none text-charcoal">
            {t("title")}
          </h1>
          <p className="mt-3 text-charcoal-light">{t("subtitle")}</p>
          <a
            href="/ban-passarelli-menu.pdf"
            className="inline-flex items-center gap-2 mt-6 font-condensed uppercase tracking-wide text-xs px-5 py-2.5 rounded-full border border-charcoal/40 text-charcoal hover:bg-charcoal hover:text-cream transition-colors"
          >
            ↓ {t("downloadPdf")}
          </a>
        </header>

        {/* Category nav */}
        <nav className="flex flex-wrap justify-center gap-2 mb-4 sticky top-0 z-10 py-3 -mx-4 px-4 bg-[#e7e3da]/85 backdrop-blur supports-[backdrop-filter]:bg-[#e7e3da]/70">
          {activeCategories.map((cat) => (
            <a
              key={cat}
              href={`#${cat}`}
              className="font-condensed uppercase tracking-wide text-[11px] px-3 py-1.5 rounded-full bg-white/50 text-charcoal-light hover:bg-forest hover:text-cream transition-colors"
            >
              {t(`categories.${CATEGORY_KEYS[cat]}`)}
            </a>
          ))}
        </nav>

        {/* Sections */}
        <div className="space-y-14">
          {activeCategories.map((cat) => {
            const items = grouped[cat];
            const label = t(`categories.${CATEGORY_KEYS[cat]}`);
            const noteKey = SECTION_NOTES[cat];
            return (
              <section key={cat} id={cat} className="scroll-mt-16">
                {HERO_CATEGORIES.has(cat) ? (
                  <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden mb-5 shadow-md">
                    <Image
                      src={`/menu/hero-${cat}.webp`}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <h2 className="absolute left-5 bottom-4 font-script text-4xl sm:text-5xl text-cream drop-shadow">
                      {label}
                    </h2>
                  </div>
                ) : (
                  <div className="text-center mb-5">
                    <h2 className="font-script text-4xl sm:text-5xl text-charcoal leading-none">
                      {label}
                    </h2>
                    <div className="w-24 h-0.5 bg-terracotta/60 rounded mx-auto mt-3" />
                  </div>
                )}

                {noteKey && (
                  <p
                    className={`text-sm text-charcoal-light mb-2 ${HERO_CATEGORIES.has(cat) ? "" : "text-center"}`}
                  >
                    {t(noteKey)}
                  </p>
                )}

                <div>
                  {items.map((product) => (
                    <MenuItemCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
