"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const t = useTranslations("orderConfirmation");
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="py-20">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-forest"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="font-heading text-3xl text-forest mb-3">
          {t("title")}
        </h1>
        <p className="text-charcoal-light mb-6">{t("thankYou")}</p>

        {orderNumber && (
          <div className="bg-cream-dark rounded-xl p-4 mb-6">
            <p className="text-sm text-charcoal-light">{t("orderNumber")}</p>
            <p className="font-heading text-2xl text-forest font-bold">
              {orderNumber}
            </p>
          </div>
        )}

        <p className="text-sm text-charcoal-light mb-8">{t("statusMsg")}</p>

        <Link
          href="/"
          className="inline-block bg-forest hover:bg-forest-light text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
