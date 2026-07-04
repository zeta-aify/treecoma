import { setRequestLocale, getTranslations } from "next-intl/server";
import { getMenuProducts } from "@/lib/menu";
import { FOOD_CATEGORIES, CATEGORY_KEYS } from "@/lib/types";
import type { ProductCategory, Product } from "@/lib/types";
import MenuItemCard from "@/components/MenuItemCard";

// ISR: cache the page, re-fetch products at most every 5 minutes.
export const revalidate = 300;

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

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl sm:text-5xl text-forest mb-3">
            {t("title")}
          </h1>
          <p className="text-charcoal-light">{t("subtitle")}</p>
          <a
            href="/ban-passarelli-menu.pdf"
            className="inline-block mt-5 text-sm px-4 py-2 rounded-full border border-forest text-forest hover:bg-forest hover:text-white transition-colors"
          >
            {t("downloadPdf")}
          </a>
        </div>

        <nav className="flex flex-wrap justify-center gap-2 mb-10 sticky top-0 bg-cream/90 backdrop-blur py-3 z-10">
          {FOOD_CATEGORIES.filter((cat) => grouped[cat]?.length).map((cat) => (
            <a
              key={cat}
              href={`#${cat}`}
              className="text-sm px-3 py-1.5 rounded-full bg-cream-dark text-charcoal-light hover:bg-forest hover:text-white transition-colors"
            >
              {t(`categories.${CATEGORY_KEYS[cat]}`)}
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {FOOD_CATEGORIES.map((cat) => {
            const items = grouped[cat];
            if (!items?.length) return null;
            return (
              <section key={cat} id={cat} className="scroll-mt-20">
                <h2 className="font-heading text-2xl text-forest mb-4 pb-2 border-b-2 border-terracotta/30">
                  {t(`categories.${CATEGORY_KEYS[cat]}`)}
                </h2>
                {cat === "bakery" && (
                  <p className="text-xs text-charcoal-light mb-3">{t("bakeryNote")}</p>
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
