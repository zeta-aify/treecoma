"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Link } from "@/i18n/navigation";
import type { Order, CannabisInquiry } from "@/lib/types";

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<CannabisInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const today = new Date().toISOString().slice(0, 10);

      const [ordersRes, inquiriesRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .gte("created_at", `${today}T00:00:00`)
          .order("created_at", { ascending: false }),
        supabase
          .from("cannabis_inquiries")
          .select("*")
          .eq("status", "new")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      setOrders((ordersRes.data as Order[]) || []);
      setInquiries((inquiriesRes.data as CannabisInquiry[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  if (loading) {
    return <div className="text-charcoal-light py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-forest mb-6">{t("title")}</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/orders"
          className="bg-cream-dark rounded-2xl p-6 hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-charcoal-light mb-1">
            {t("todayOrders")}
          </p>
          <p className="font-heading text-3xl text-forest">{orders.length}</p>
        </Link>

        <Link
          href="/admin/inquiries"
          className="bg-cream-dark rounded-2xl p-6 hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-charcoal-light mb-1">
            {t("newInquiries")}
          </p>
          <p className="font-heading text-3xl text-terracotta">
            {inquiries.length}
          </p>
        </Link>

        <div className="bg-cream-dark rounded-2xl p-6">
          <p className="text-sm text-charcoal-light mb-1">
            {t("totalRevenue")}
          </p>
          <p className="font-heading text-3xl text-gold-dark">{revenue}฿</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mb-8">
        <h2 className="font-heading text-xl text-forest mb-3">
          {t("todayOrders")}
        </h2>
        {orders.length === 0 ? (
          <p className="text-charcoal-light text-sm">{t("noOrders")}</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-cream-dark rounded-xl p-4"
              >
                <div>
                  <p className="font-medium text-charcoal">
                    {order.order_number}
                  </p>
                  <p className="text-xs text-charcoal-light">
                    {order.order_type} &middot;{" "}
                    {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-forest">{order.total}฿</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent inquiries */}
      <div>
        <h2 className="font-heading text-xl text-forest mb-3">
          {t("newInquiries")}
        </h2>
        {inquiries.length === 0 ? (
          <p className="text-charcoal-light text-sm">{t("noInquiries")}</p>
        ) : (
          <div className="space-y-2">
            {inquiries.slice(0, 5).map((inq) => (
              <div
                key={inq.id}
                className="bg-cream-dark rounded-xl p-4"
              >
                <p className="font-medium text-charcoal">{inq.name}</p>
                <p className="text-sm text-charcoal-light">{inq.email}</p>
                {inq.message && (
                  <p className="text-sm text-charcoal-light mt-1 line-clamp-2">
                    {inq.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-gold/20 text-gold-dark",
    confirmed: "bg-forest/10 text-forest",
    preparing: "bg-terracotta/10 text-terracotta-dark",
    ready: "bg-forest/20 text-forest-dark",
    completed: "bg-charcoal/10 text-charcoal-light",
    cancelled: "bg-terracotta/20 text-terracotta-dark",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${colors[status] || "bg-cream-dark text-charcoal-light"}`}
    >
      {status}
    </span>
  );
}
