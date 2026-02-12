"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useRouter } from "@/i18n/navigation";

export default function AdminLoginPage() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const form = e.currentTarget;
    const data = new FormData(form);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(true);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="w-full max-w-sm mx-auto px-4">
        <h1 className="font-heading text-3xl text-forest text-center mb-8">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-terracotta/10 border border-terracotta/30 text-terracotta-dark text-sm p-3 rounded-xl">
              {t("error")}
            </div>
          )}

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
              required
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-lg"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-charcoal mb-1"
            >
              {t("passwordLabel")}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest hover:bg-forest-light disabled:opacity-50 text-white py-3 rounded-xl font-medium text-lg transition-colors"
          >
            {loading ? "..." : t("submitBtn")}
          </button>
        </form>
      </div>
    </div>
  );
}
