"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { ContentStatus, ContentPost } from "@/lib/types";

const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-300",
  pending_approval: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-blue-100 text-blue-800 border-blue-300",
  published: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

export default function AdminContentPage() {
  const t = useTranslations("admin.content");
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    const supabase = createClient();
    let query = supabase
      .from("content_posts")
      .select("*, content_users(name, telegram_user_id)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;
    setPosts((data as ContentPost[]) || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadPosts();
    const interval = setInterval(loadPosts, 30000);
    return () => clearInterval(interval);
  }, [loadPosts]);

  async function updateStatus(postId: string, newStatus: ContentStatus) {
    const supabase = createClient();
    const { error } = await supabase
      .from("content_posts")
      .update({ status: newStatus })
      .eq("id", postId);

    if (error) {
      alert("Failed to update status");
      return;
    }

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: newStatus } : p)),
    );
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

  const statusFilters: (ContentStatus | "all")[] = [
    "all",
    "pending_approval",
    "approved",
    "draft",
    "published",
    "rejected",
  ];

  if (loading) {
    return <div className="text-charcoal-light py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-3xl text-forest">{t("title")}</h1>
        <button
          onClick={loadPosts}
          className="text-sm px-3 py-1.5 rounded-lg bg-cream-dark hover:bg-forest/10 transition-colors"
        >
          {t("refresh")}
        </button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((status) => {
          const count =
            status === "all"
              ? posts.length
              : posts.filter((p) => p.status === status).length;
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

      {/* Posts grid */}
      {posts.length === 0 ? (
        <p className="text-charcoal-light">{t("noPosts")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border-2 border-cream-dark bg-cream-dark overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-square relative">
                <img
                  src={post.image_url}
                  alt={post.ai_image_description || "Content post"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[post.status]}`}
                  >
                    {t(`statuses.${post.status}`)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-sm text-charcoal-light mb-1">
                  {post.content_users?.name || "Unknown"} · {timeSince(post.created_at)}
                </p>

                <p className="text-sm text-charcoal line-clamp-3 mb-3">
                  {post.caption_final || post.caption_en || "No caption"}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/content/${post.id}`}
                    className="flex-1 text-center text-sm px-3 py-2 rounded-xl bg-forest/10 text-forest font-medium hover:bg-forest/20 transition-colors"
                  >
                    {t("viewEdit")}
                  </Link>

                  {post.status === "pending_approval" && (
                    <button
                      onClick={() => updateStatus(post.id, "approved")}
                      className="text-sm px-3 py-2 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors"
                    >
                      {t("approve")}
                    </button>
                  )}

                  {post.status === "pending_approval" && (
                    <button
                      onClick={() => updateStatus(post.id, "rejected")}
                      className="text-sm px-3 py-2 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                    >
                      {t("reject")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
