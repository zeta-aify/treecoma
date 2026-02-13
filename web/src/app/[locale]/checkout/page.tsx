"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const cartT = useTranslations("cart");
  const locale = useLocale();
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <p className="text-charcoal-light mb-8">{cartT("empty")}</p>
          <Link
            href="/menu"
            className="inline-block bg-forest hover:bg-forest-light text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            {cartT("continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: data.get("name"),
            phone: data.get("phone"),
            email: data.get("email") || null,
          },
          order: {
            order_type: orderType,
            delivery_address:
              orderType === "delivery" ? data.get("address") : null,
            notes: data.get("notes") || null,
            payment_status: hasPaid ? "paid" : "pending",
          },
          items: items.map((item) => ({
            product_id: item.id,
            name_snapshot: locale === "th" ? item.name_th : item.name_en,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant || null,
          })),
        }),
      });

      if (res.ok) {
        const { order_number } = await res.json();
        clearCart();
        router.push(`/track?order=${order_number}`);
      } else {
        setError("Something went wrong. Please try again or contact us via LINE/WhatsApp.");
      }
    } catch {
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-heading text-3xl sm:text-4xl text-forest mb-8">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer info */}
          <section>
            <h2 className="font-heading text-xl text-forest mb-4">
              {t("customerInfo")}
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-charcoal mb-1"
                >
                  {t("nameLabel")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-charcoal mb-1"
                >
                  {t("phoneLabel")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-charcoal mb-1"
                >
                  {t("emailLabel")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
              </div>
            </div>
          </section>

          {/* Order type */}
          <section>
            <h2 className="font-heading text-xl text-forest mb-4">
              {t("orderType")}
            </h2>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setOrderType("pickup")}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  orderType === "pickup"
                    ? "bg-forest text-white"
                    : "bg-cream-dark text-charcoal hover:bg-cream-dark/80"
                }`}
              >
                {t("pickup")}
              </button>
              <button
                type="button"
                onClick={() => setOrderType("delivery")}
                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                  orderType === "delivery"
                    ? "bg-forest text-white"
                    : "bg-cream-dark text-charcoal hover:bg-cream-dark/80"
                }`}
              >
                {t("delivery")}
              </button>
            </div>
            {orderType === "delivery" && (
              <div className="mt-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-charcoal mb-1"
                >
                  {t("addressLabel")}
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                />
              </div>
            )}
            <div className="mt-4">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-charcoal mb-1"
              >
                {t("notesLabel")}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
              />
            </div>
          </section>

          {/* Order summary */}
          <section>
            <h2 className="font-heading text-xl text-forest mb-4">
              {t("orderTotal")}
            </h2>
            <div className="bg-cream-dark rounded-xl p-4 space-y-2">
              {items.map((item) => {
                const name = locale === "th" ? item.name_th : item.name_en;
                return (
                  <div
                    key={`${item.id}:${item.variant || ""}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-charcoal">
                      {name}
                      {item.variant ? ` (${item.variant})` : ""} x
                      {item.quantity}
                    </span>
                    <span className="font-medium">
                      {item.price * item.quantity}฿
                    </span>
                  </div>
                );
              })}
              <div className="border-t border-cream pt-2 flex justify-between">
                <span className="font-semibold">{t("orderTotal")}</span>
                <span className="font-heading text-xl text-forest font-bold">
                  {totalPrice()}฿
                </span>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-heading text-xl text-forest mb-4">
              {t("paymentTitle")}
            </h2>
            <div className="bg-cream-dark rounded-xl p-6 text-center">
              <p className="text-sm text-charcoal-light mb-4">
                {t("paymentInstructions")}
              </p>
              <div className="inline-block bg-white p-4 rounded-xl mb-3">
                <Image
                  src="/images/promptpay-qr.jpeg"
                  alt="PromptPay QR — Treecoma Co., Ltd."
                  width={280}
                  height={280}
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm font-semibold text-forest mb-1">
                {totalPrice()}฿
              </p>
              <p className="text-xs text-charcoal-light">
                ทรี โคมา (Treecoma Co., Ltd.)
              </p>

              <label className="flex items-center justify-center gap-3 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPaid}
                  onChange={(e) => setHasPaid(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-forest text-forest focus:ring-forest/30 accent-forest"
                />
                <span className="text-sm font-medium text-charcoal">
                  I have paid via PromptPay
                </span>
              </label>
            </div>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !hasPaid}
            className="w-full bg-terracotta hover:bg-terracotta-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-medium text-lg transition-colors"
          >
            {loading ? "..." : !hasPaid ? "Pay first to place order" : t("placeOrder")}
          </button>
        </form>
      </div>
    </div>
  );
}
