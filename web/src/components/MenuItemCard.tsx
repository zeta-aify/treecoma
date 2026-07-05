"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/stores/cart";

// Preferred display order for the "choose your pasta" shape options.
const SHAPE_ORDER = ["spaghetti", "fusilli", "penne"];

function sortVariants(pv: Record<string, number>): [string, number][] {
  const rank = (k: string) => {
    const i = SHAPE_ORDER.indexOf(k);
    return i === -1 ? 99 : i;
  };
  return Object.entries(pv).sort((a, b) => rank(a[0]) - rank(b[0]));
}

export default function MenuItemCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations("menu");
  const addItem = useCartStore((s) => s.addItem);
  const name = locale === "th" ? product.name_th : product.name_en;
  const altName = locale === "th" ? product.name_en : product.name_th;
  const desc = locale === "th" ? product.description_th : product.description_en;

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
    <div className="flex items-start gap-4 py-4 border-b border-dashed border-charcoal/20 last:border-0">
      {product.image_url && (
        <Image
          src={product.image_url}
          alt={name}
          width={76}
          height={76}
          className="w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-lg object-cover shrink-0 shadow-sm ring-1 ring-black/5"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-condensed uppercase tracking-wide text-lg leading-tight font-semibold text-charcoal">
            {name}
          </h3>
          {product.is_seasonal && (
            <span className="font-condensed text-[10px] uppercase tracking-wider bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full">
              {t("seasonal")}
            </span>
          )}
        </div>

        {/* the other language's name, quiet, echoing the PDF's bilingual lines */}
        <p className="text-xs text-charcoal-light/70 leading-snug">{altName}</p>

        {desc && (
          <p className="text-sm text-charcoal-light mt-1 max-w-[52ch] leading-snug">
            {desc}
          </p>
        )}

        {product.price_variant && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {sortVariants(product.price_variant).map(([variant, price]) => {
              const samePrice = price === product.price;
              return (
                <button
                  key={variant}
                  onClick={() => handleAdd(variant, price)}
                  className="font-condensed text-xs uppercase tracking-wide bg-cream-dark hover:bg-terracotta/15 text-charcoal-light px-2.5 py-1 rounded-full transition-colors"
                >
                  + {variant.replace(/_/g, " ")}
                  {samePrice ? "" : ` ${price}฿`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-right shrink-0 pt-0.5">
        <div className="font-condensed font-bold text-xl text-charcoal tabular-nums leading-none">
          {product.price}฿
        </div>
        <button
          onClick={() => handleAdd()}
          className="mt-2 font-condensed uppercase tracking-wide text-[11px] font-semibold text-cream bg-forest hover:bg-forest-dark px-3.5 py-1.5 rounded-full transition-colors shadow-sm"
        >
          + {t("addToCart")}
        </button>
      </div>
    </div>
  );
}
