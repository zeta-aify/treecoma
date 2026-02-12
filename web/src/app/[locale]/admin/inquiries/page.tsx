"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { CannabisInquiry } from "@/lib/types";

export default function AdminInquiriesPage() {
  const t = useTranslations("admin.inquiries");
  const [inquiries, setInquiries] = useState<CannabisInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("cannabis_inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setInquiries((data as CannabisInquiry[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id: string, status: "contacted" | "closed") {
    const supabase = createClient();
    await supabase
      .from("cannabis_inquiries")
      .update({ status })
      .eq("id", id);
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)),
    );
  }

  if (loading) {
    return <div className="text-charcoal-light py-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-forest mb-6">{t("title")}</h1>

      {inquiries.length === 0 ? (
        <p className="text-charcoal-light">No inquiries yet.</p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-cream-dark rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-medium text-charcoal text-lg">
                    {inq.name}
                  </p>
                  <p className="text-sm text-charcoal-light">{inq.email}</p>
                  {inq.phone && (
                    <p className="text-sm text-charcoal-light">
                      <a href={`tel:${inq.phone}`} className="underline">
                        {inq.phone}
                      </a>
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={inq.status} />
                  <p className="text-xs text-charcoal-light mt-1">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {inq.message && (
                <p className="text-sm text-charcoal bg-cream rounded-xl p-3 mb-3">
                  {inq.message}
                </p>
              )}

              {inq.status === "new" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(inq.id, "contacted")}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-forest text-white hover:bg-forest-light transition-colors"
                  >
                    {t("markContacted")}
                  </button>
                  <button
                    onClick={() => updateStatus(inq.id, "closed")}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-cream text-charcoal-light hover:bg-white transition-colors"
                  >
                    {t("markClosed")}
                  </button>
                </div>
              )}

              {inq.status === "contacted" && (
                <button
                  onClick={() => updateStatus(inq.id, "closed")}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-cream text-charcoal-light hover:bg-white transition-colors"
                >
                  {t("markClosed")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-terracotta/15 text-terracotta-dark",
    contacted: "bg-gold/15 text-gold-dark",
    closed: "bg-charcoal/10 text-charcoal-light",
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || ""}`}
    >
      {status}
    </span>
  );
}
