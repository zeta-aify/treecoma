"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/stores/cart";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <h1 className="font-heading text-3xl text-forest mb-4">
            {t("title")}
          </h1>
          <p className="text-charcoal-light mb-8">{t("empty")}</p>
          <Link
            href="/menu"
            className="inline-block bg-forest hover:bg-forest-light text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            {t("continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-heading text-3xl sm:text-4xl text-forest mb-8">
          {t("title")}
        </h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => {
            const name = locale === "th" ? item.name_th : item.name_en;
            return (
              <div
                key={`${item.id}:${item.variant || ""}`}
                className="flex items-center gap-4 bg-cream-dark rounded-xl p-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-charcoal truncate">
                    {name}
                  </h3>
                  {item.variant && (
                    <p className="text-xs text-charcoal-light">{item.variant}</p>
                  )}
                  <p className="text-sm text-forest font-semibold">
                    {item.price}฿
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1, item.variant)
                    }
                    className="w-8 h-8 rounded-full bg-cream border border-cream-dark flex items-center justify-center text-charcoal hover:bg-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1, item.variant)
                    }
                    className="w-8 h-8 rounded-full bg-cream border border-cream-dark flex items-center justify-center text-charcoal hover:bg-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="text-right shrink-0 w-16">
                  <p className="font-semibold text-charcoal">
                    {item.price * item.quantity}฿
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id, item.variant)}
                  className="text-charcoal-light hover:text-terracotta transition-colors"
                  aria-label={t("remove")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="border-t border-cream-dark pt-6 mb-8">
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium">{t("subtotal")}</span>
            <span className="font-heading text-2xl text-forest font-bold">
              {totalPrice()}฿
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/menu"
            className="flex-1 text-center border border-forest text-forest hover:bg-forest/5 px-6 py-3 rounded-full font-medium transition-colors"
          >
            {t("continueShopping")}
          </Link>
          <Link
            href="/checkout"
            className="flex-1 text-center bg-terracotta hover:bg-terracotta-dark text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            {t("checkout")}
          </Link>
        </div>
      </div>
    </div>
  );
}
