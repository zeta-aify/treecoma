import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { menuData } from "@/lib/menu-data";
import { FOOD_CATEGORIES, CATEGORY_KEYS } from "@/lib/types";
import type { ProductCategory } from "@/lib/types";
import MenuItemCard from "@/components/MenuItemCard";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MenuContent />;
}

function MenuContent() {
  const t = useTranslations("menu");

  const grouped = FOOD_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = menuData.filter((p) => p.category === cat);
      return acc;
    },
    {} as Record<ProductCategory, typeof menuData>,
  );

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl sm:text-5xl text-forest mb-3">
            {t("title")}
          </h1>
          <p className="text-charcoal-light">{t("subtitle")}</p>
        </div>

        {/* Category navigation */}
        <nav className="flex flex-wrap justify-center gap-2 mb-10">
          {FOOD_CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`#${cat}`}
              className="text-sm px-3 py-1.5 rounded-full bg-cream-dark text-charcoal-light hover:bg-forest hover:text-white transition-colors"
            >
              {t(`categories.${CATEGORY_KEYS[cat]}`)}
            </a>
          ))}
        </nav>

        {/* Menu sections */}
        <div className="space-y-12">
          {FOOD_CATEGORIES.map((cat) => {
            const items = grouped[cat];
            if (!items?.length) return null;
            return (
              <section key={cat} id={cat}>
                <h2 className="font-heading text-2xl text-forest mb-4 pb-2 border-b-2 border-terracotta/30">
                  {t(`categories.${CATEGORY_KEYS[cat]}`)}
                </h2>
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
