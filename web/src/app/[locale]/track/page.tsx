"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Link } from "@/i18n/navigation";
import type { OrderStatus } from "@/lib/types";

const STATUS_STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "pending", label: "Order Received", icon: "📋" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { key: "ready", label: "Ready", icon: "🔔" },
  { key: "completed", label: "Completed", icon: "🎉" },
];

interface TrackedOrder {
  order_number: string;
  status: OrderStatus;
  order_type: string;
  total: number;
  created_at: string;
  order_items: { name_snapshot: string; price: number; quantity: number; variant: string | null }[];
}

function TrackContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("orders")
        .select("order_number, status, order_type, total, created_at, order_items(name_snapshot, price, quantity, variant)")
        .eq("order_number", orderNumber)
        .single();

      if (data) {
        setOrder(data as TrackedOrder);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }

    load();

    // Poll every 10 seconds for status updates
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse text-charcoal-light">Loading order...</div>
      </div>
    );
  }

  if (!orderNumber || notFound) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <h1 className="font-heading text-3xl text-forest mb-4">Track Your Order</h1>
          <p className="text-charcoal-light mb-8">
            {notFound
              ? `Order "${orderNumber}" not found. Please check your order number.`
              : "Enter your order number to track your order."}
          </p>
          <Link
            href="/"
            className="inline-block bg-forest hover:bg-forest-light text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-lg mx-auto px-4">
        {/* Order header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl text-forest mb-2">
            {isCancelled ? "Order Cancelled" : order.status === "completed" ? "Order Complete!" : "Tracking Your Order"}
          </h1>
          <p className="text-charcoal-light">
            {order.order_number} · {order.order_type === "delivery" ? "Delivery" : "Pickup"}
          </p>
        </div>

        {/* Status timeline */}
        {!isCancelled && (
          <div className="bg-cream-dark rounded-2xl p-6 mb-6">
            <div className="space-y-0">
              {STATUS_STEPS.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    {/* Timeline line + dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                          isCurrent
                            ? "bg-forest text-white ring-4 ring-forest/20"
                            : isActive
                              ? "bg-forest text-white"
                              : "bg-cream text-charcoal-light"
                        }`}
                      >
                        {step.icon}
                      </div>
                      {index < STATUS_STEPS.length - 1 && (
                        <div
                          className={`w-0.5 h-8 ${
                            index < currentStepIndex ? "bg-forest" : "bg-cream"
                          }`}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className={`pt-2 pb-4 ${isCurrent ? "font-semibold text-forest" : isActive ? "text-charcoal" : "text-charcoal-light"}`}>
                      <p className="text-sm">{step.label}</p>
                      {isCurrent && (
                        <p className="text-xs text-forest/70 mt-0.5 animate-pulse">
                          Current status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled notice */}
        {isCancelled && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-6 text-center">
            <p className="text-red-700 font-medium">This order has been cancelled.</p>
            <p className="text-red-600 text-sm mt-1">Please contact us if you have questions.</p>
          </div>
        )}

        {/* Order items */}
        <div className="bg-cream-dark rounded-2xl p-5 mb-6">
          <h2 className="font-heading text-lg text-forest mb-3">Your Order</h2>
          {order.order_items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1 border-b border-cream last:border-0">
              <span className="text-charcoal">
                {item.name_snapshot}
                {item.variant ? ` (${item.variant})` : ""}
                {item.quantity > 1 ? ` x${item.quantity}` : ""}
              </span>
              <span className="font-medium">{item.price * item.quantity}฿</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 mt-2 border-t border-cream">
            <span className="font-semibold">Total</span>
            <span className="font-heading text-xl text-forest font-bold">{order.total}฿</span>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-sm text-charcoal-light mb-3">Questions about your order?</p>
          <div className="flex justify-center gap-3">
            <a
              href="https://line.me/ti/p/~banpassarelli"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#06C755] text-white text-sm font-medium hover:bg-[#05b34d] transition-colors"
            >
              LINE
            </a>
            <a
              href="https://wa.me/66950579660"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:bg-[#20bd5a] transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-charcoal-light">Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}
