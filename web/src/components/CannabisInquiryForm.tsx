"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function CannabisInquiryForm() {
  const t = useTranslations("cannabis");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/cannabis-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Silently fail — form still shows
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-forest text-4xl mb-3">&#10003;</div>
        <p className="text-forest font-medium">{t("successMsg")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">
          {t("nameLabel")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-charcoal"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
          {t("emailLabel")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-charcoal"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-1">
          {t("phoneLabel")}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-charcoal"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-1">
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-charcoal resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-forest hover:bg-forest-light disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
      >
        {loading ? "..." : t("submitBtn")}
      </button>
    </form>
  );
}
