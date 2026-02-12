"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/stores/cart";

export default function MenuItemCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations("menu");
  const addItem = useCartStore((s) => s.addItem);
  const name = locale === "th" ? product.name_th : product.name_en;

  function handleAdd(variant?: string, price?: number) {
    addItem({
      id: product.id,
      name_en: product.name_en,
      name_th: product.name_th,
      price: price ?? product.price,
      variant,
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-cream-dark last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-charcoal truncate">{name}</h3>
          {product.is_seasonal && (
            <span className="text-xs bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full shrink-0">
              Seasonal
            </span>
          )}
        </div>
        {product.description_en && (
          <p className="text-xs text-charcoal-light mt-0.5">
            {locale === "th" ? product.description_th : product.description_en}
          </p>
        )}
        {product.price_variant && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(product.price_variant).map(([variant, price]) => (
              <button
                key={variant}
                onClick={() => handleAdd(variant, price as number)}
                className="text-xs bg-cream-dark hover:bg-terracotta/10 text-charcoal-light px-2 py-0.5 rounded-full transition-colors"
              >
                +{variant} {price as number}฿
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-semibold text-forest">{product.price}฿</span>
        <button
          onClick={() => handleAdd()}
          className="bg-forest hover:bg-forest-light text-white text-sm px-3 py-1.5 rounded-full transition-colors"
        >
          {t("addToCart")}
        </button>
      </div>
    </div>
  );
}
