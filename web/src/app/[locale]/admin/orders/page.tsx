"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { OrderStatus } from "@/lib/types";

interface OrderWithDetails {
  id: string;
  order_number: string;
  status: OrderStatus;
  order_type: "pickup" | "delivery";
  delivery_address: string | null;
  notes: string | null;
  total: number;
  payment_status: string;
  created_at: string;
  customers: { name: string; phone: string; email: string | null } | null;
  order_items: { name_snapshot: string; price: number; quantity: number; variant: string | null }[];
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  preparing: "bg-orange-100 text-orange-800 border-orange-300",
  ready: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-gray-100 text-gray-600 border-gray-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "completed"];

export default function AdminOrdersPage() {
  const t = useTranslations("admin.orders");
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("orders")
      .select("*, customers(name, phone, email), order_items(name_snapshot, price, quantity, variant)")
      .order("created_at", { ascending: false })
      .limit(50);
    setOrders((data as OrderWithDetails[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  async function updateStatus(orderId: string, newStatus: OrderStatus) {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Failed to update status");
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  }

  function getNextStatus(current: OrderStatus): OrderStatus | null {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  }

  function timeSince(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  const activeStatuses: OrderStatus[] = ["pending", "confirmed", "preparing", "ready"];
  const filtered =
    filter === "all"
      ? orders
      : filter === "active"
        ? orders.filter((o) => activeStatuses.includes(o.status))
        : orders.filter((o) => o.status === filter);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  if (loading) {
    return <div className="text-charcoal-light py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-forest">{t("title")}</h1>
        <button
          onClick={loadOrders}
          className="text-sm px-3 py-1.5 rounded-lg bg-cream-dark hover:bg-forest/10 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Alert for pending orders */}
      {pendingCount > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 mb-6 animate-pulse">
          <p className="text-yellow-800 font-semibold text-lg text-center">
            {pendingCount} new order{pendingCount > 1 ? "s" : ""} waiting!
          </p>
        </div>
      )}

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === "active"
              ? "bg-forest text-white"
              : "bg-cream-dark text-charcoal-light hover:bg-forest/10"
          }`}
        >
          Active ({orders.filter((o) => activeStatuses.includes(o.status)).length})
        </button>
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
        {(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"] as OrderStatus[]).map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          if (count === 0) return null;
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
        <div className="space-y-4">
          {filtered.map((order) => {
            const nextStatus = getNextStatus(order.status);
            return (
              <div
                key={order.id}
                className={`rounded-2xl p-5 border-2 ${
                  order.status === "pending"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-cream-dark bg-cream-dark"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-heading text-lg text-forest font-bold">
                        {order.order_number}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[order.status]}`}>
                        {t(`statuses.${order.status}`)}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal-light">
                      {order.order_type === "delivery" ? "Delivery" : "Pickup"}
                      {" · "}
                      {timeSince(order.created_at)}
                    </p>
                  </div>
                  <p className="font-heading text-2xl text-forest font-bold shrink-0">
                    {order.total}฿
                  </p>
                </div>

                {/* Customer info */}
                {order.customers && (
                  <div className="bg-white/60 rounded-xl p-3 mb-3">
                    <p className="font-medium text-charcoal">
                      {order.customers.name}
                    </p>
                    <a href={`tel:${order.customers.phone}`} className="text-sm text-forest underline">
                      {order.customers.phone}
                    </a>
                    {order.customers.email && (
                      <p className="text-sm text-charcoal-light">{order.customers.email}</p>
                    )}
                  </div>
                )}

                {/* Delivery address */}
                {order.delivery_address && (
                  <div className="bg-white/60 rounded-xl p-3 mb-3">
                    <p className="text-sm font-medium text-charcoal">Delivery address:</p>
                    <p className="text-sm text-charcoal-light">{order.delivery_address}</p>
                  </div>
                )}

                {/* Order items */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="bg-white/60 rounded-xl p-3 mb-3">
                    {order.order_items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm py-0.5">
                        <span className="text-charcoal">
                          {item.name_snapshot}
                          {item.variant ? ` (${item.variant})` : ""}
                          {item.quantity > 1 ? ` x${item.quantity}` : ""}
                        </span>
                        <span className="font-medium text-charcoal">
                          {item.price * item.quantity}฿
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <p className="text-sm text-terracotta mb-3">
                    Note: {order.notes}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  {nextStatus && (
                    <button
                      onClick={() => updateStatus(order.id, nextStatus)}
                      className="flex-1 bg-forest hover:bg-forest-light text-white py-3 rounded-xl font-medium text-base transition-colors"
                    >
                      {t(`statuses.${nextStatus}`)} →
                    </button>
                  )}
                  {order.status !== "cancelled" && order.status !== "completed" && (
                    <button
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className="px-4 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
