"use client";

import { useTranslations } from "next-intl";
import { useEffect, useReducer, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { Product, ProductCategory } from "@/lib/types";
import { FOOD_CATEGORIES } from "@/lib/types";

const ALL_CATEGORIES: ProductCategory[] = [...FOOD_CATEGORIES, "cannabis"];

export default function AdminProductsPage() {
  const t = useTranslations("admin.products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);

  const [reloadKey, reload] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("category")
        .order("sort_order");
      setProducts((data as Product[]) || []);
      setLoading(false);
    }
    load();
  }, [reloadKey]);

  async function saveProduct(formData: FormData) {
    const supabase = createClient();
    const payload = {
      name_en: formData.get("name_en") as string,
      name_th: formData.get("name_th") as string,
      category: formData.get("category") as ProductCategory,
      price: parseInt(formData.get("price") as string),
      is_available: formData.get("is_available") === "on",
    };

    if (editing) {
      await supabase.from("products").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("products").insert(payload);
    }

    setEditing(null);
    setAdding(false);
    reload();
  }

  async function toggleAvailability(product: Product) {
    const supabase = createClient();
    await supabase
      .from("products")
      .update({ is_available: !product.is_available })
      .eq("id", product.id);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, is_available: !p.is_available } : p,
      ),
    );
  }

  if (loading) {
    return <div className="text-charcoal-light py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-forest">{t("title")}</h1>
        <button
          onClick={() => {
            setAdding(true);
            setEditing(null);
          }}
          className="bg-forest hover:bg-forest-light text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors"
        >
          + {t("addNew")}
        </button>
      </div>

      {/* Product form modal */}
      {(adding || editing) && (
        <div className="bg-cream-dark rounded-2xl p-6 mb-6">
          <h2 className="font-heading text-xl text-forest mb-4">
            {editing ? t("editProduct") : t("addNew")}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProduct(new FormData(e.currentTarget));
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                {t("nameEn")}
              </label>
              <input
                name="name_en"
                defaultValue={editing?.name_en || ""}
                required
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                {t("nameTh")}
              </label>
              <input
                name="name_th"
                defaultValue={editing?.name_th || ""}
                required
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                {t("category")}
              </label>
              <select
                name="category"
                defaultValue={editing?.category || "starters"}
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-lg"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                {t("price")}
              </label>
              <input
                name="price"
                type="number"
                defaultValue={editing?.price || ""}
                required
                className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:ring-2 focus:ring-forest/30 text-lg"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                name="is_available"
                type="checkbox"
                defaultChecked={editing?.is_available ?? true}
                className="w-5 h-5 rounded"
              />
              <label className="text-sm font-medium text-charcoal">
                {t("available")}
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-forest hover:bg-forest-light text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                {t("save")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setAdding(false);
                }}
                className="bg-cream text-charcoal-light px-6 py-3 rounded-xl font-medium hover:bg-cream-dark transition-colors"
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products list */}
      <div className="space-y-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-4 bg-cream-dark rounded-xl p-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    product.is_available ? "bg-forest" : "bg-charcoal-light"
                  }`}
                />
                <p className="font-medium text-charcoal truncate">
                  {product.name_en}
                </p>
              </div>
              <p className="text-xs text-charcoal-light ml-4">
                {product.category} &middot; {product.price}฿
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => toggleAvailability(product)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  product.is_available
                    ? "bg-forest/10 text-forest"
                    : "bg-charcoal/10 text-charcoal-light"
                }`}
              >
                {product.is_available ? "Available" : "Unavailable"}
              </button>
              <button
                onClick={() => {
                  setEditing(product);
                  setAdding(false);
                }}
                className="px-3 py-2 rounded-xl text-sm font-medium bg-cream text-charcoal hover:bg-white transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
