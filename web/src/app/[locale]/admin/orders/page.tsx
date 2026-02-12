"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export default function AdminOrdersPage() {
  const t = useTranslations("admin.orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setOrders((data as Order[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(orderId: string, newStatus: OrderStatus) {
    const supabase = createClient();
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  }

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return <div className="text-charcoal-light py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-forest mb-6">{t("title")}</h1>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-forest text-white"
              : "bg-cream-dark text-charcoal-light hover:bg-forest/10"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-forest text-white"
                  : "bg-cream-dark text-charcoal-light hover:bg-forest/10"
              }`}
            >
              {t(`statuses.${status}`)} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <p className="text-charcoal-light">{t("noOrders")}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-cream-dark rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-heading text-lg text-forest">
                    {order.order_number}
                  </p>
                  <p className="text-sm text-charcoal-light">
                    {order.order_type === "delivery" ? "Delivery" : "Pickup"}{" "}
                    &middot;{" "}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  {order.delivery_address && (
                    <p className="text-sm text-charcoal-light mt-1">
                      {order.delivery_address}
                    </p>
                  )}
                  {order.notes && (
                    <p className="text-sm text-terracotta mt-1">
                      {order.notes}
                    </p>
                  )}
                </div>
                <p className="font-heading text-xl text-forest font-bold shrink-0">
                  {order.total}฿
                </p>
              </div>

              {/* Status update buttons */}
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(order.id, status)}
                    disabled={order.status === status}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      order.status === status
                        ? "bg-forest text-white"
                        : "bg-cream text-charcoal-light hover:bg-forest/10"
                    }`}
                  >
                    {t(`statuses.${status}`)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
