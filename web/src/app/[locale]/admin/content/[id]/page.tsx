"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { ContentStatus, ContentPost } from "@/lib/types";
import { useParams } from "next/navigation";

const STATUS_COLORS: Record<ContentStatus, string> = {
  draft: "bg-gray-100 text-gray-700 border-gray-300",
  pending_approval: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-blue-100 text-blue-800 border-blue-300",
  published: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

export default function AdminContentDetailPage() {
  const t = useTranslations("admin.content");
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<ContentPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [captionEn, setCaptionEn] = useState("");
  const [captionTh, setCaptionTh] = useState("");
  const [captionFinal, setCaptionFinal] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("content_posts")
        .select("*, content_users(name, telegram_user_id)")
        .eq("id", postId)
        .single();

      if (data) {
        const p = data as ContentPost;
        setPost(p);
        setCaptionEn(p.caption_en || "");
        setCaptionTh(p.caption_th || "");
        setCaptionFinal(p.caption_final || "");
      }
      setLoading(false);
    }
    load();
  }, [postId]);

  async function saveChanges() {
    if (!post) return;
    setSaving(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("content_posts")
      .update({
        caption_en: captionEn,
        caption_th: captionTh,
        caption_final: captionFinal,
      })
      .eq("id", post.id)
      .select("*, content_users(name, telegram_user_id)")
      .single();

    if (error) {
      alert("Failed to save changes");
    } else if (data) {
      setPost(data as ContentPost);
    }
    setSaving(false);
  }

  async function updateStatus(newStatus: ContentStatus) {
    if (!post) return;
    const supabase = createClient();

    const updates: Record<string, unknown> = { status: newStatus };

    // If approving and no final caption set, use English
    if (newStatus === "approved" && !captionFinal) {
      updates.caption_final = captionEn;
      setCaptionFinal(captionEn);
    }

    const { data, error } = await supabase
      .from("content_posts")
      .update(updates)
      .eq("id", post.id)
      .select("*, content_users(name, telegram_user_id)")
      .single();

    if (error) {
      alert("Failed to update status");
    } else if (data) {
      setPost(data as ContentPost);
    }
  }

  if (loading) {
    return <div className="text-charcoal-light py-8">Loading...</div>;
  }

  if (!post) {
    return <div className="text-charcoal-light py-8">{t("notFound")}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/content"
          className="text-forest hover:underline text-sm"
        >
          &larr; {t("backToList")}
        </Link>
        <h1 className="font-heading text-2xl text-forest">{t("editPost")}</h1>
        <span
          className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[post.status]}`}
        >
          {t(`statuses.${post.status}`)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image */}
        <div>
          <img
            src={post.image_url}
            alt={post.ai_image_description || "Content post"}
            className="w-full rounded-2xl"
          />
          {post.ai_image_description && (
            <p className="text-sm text-charcoal-light mt-2 italic">
              AI: {post.ai_image_description}
            </p>
          )}
          <p className="text-sm text-charcoal-light mt-2">
            {t("uploadedBy")}: {post.content_users?.name || "Unknown"} ·{" "}
            {new Date(post.created_at).toLocaleString()}
          </p>
          {post.published_at && (
            <p className="text-sm text-green-700 mt-1">
              {t("publishedAt")}: {new Date(post.published_at).toLocaleString()}
            </p>
          )}
          {post.instagram_post_id && (
            <p className="text-sm text-charcoal-light mt-1">
              Instagram ID: {post.instagram_post_id}
            </p>
          )}
        </div>

        {/* Captions */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              {t("captionEn")}
            </label>
            <textarea
              value={captionEn}
              onChange={(e) => setCaptionEn(e.target.value)}
              rows={4}
              className="w-full rounded-xl border-2 border-cream-dark p-3 text-sm focus:border-forest focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              {t("captionTh")}
            </label>
            <textarea
              value={captionTh}
              onChange={(e) => setCaptionTh(e.target.value)}
              rows={4}
              className="w-full rounded-xl border-2 border-cream-dark p-3 text-sm focus:border-forest focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              {t("captionFinal")}
            </label>
            <textarea
              value={captionFinal}
              onChange={(e) => setCaptionFinal(e.target.value)}
              rows={4}
              className="w-full rounded-xl border-2 border-cream-dark p-3 text-sm focus:border-forest focus:outline-none"
              placeholder={t("captionFinalPlaceholder")}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-forest text-white font-medium hover:bg-forest-light transition-colors disabled:opacity-50"
            >
              {saving ? t("saving") : t("save")}
            </button>

            {(post.status === "draft" || post.status === "pending_approval") && (
              <button
                onClick={() => updateStatus("approved")}
                className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors"
              >
                {t("approve")}
              </button>
            )}

            {post.status === "approved" && (
              <button
                onClick={() => updateStatus("pending_approval")}
                className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-800 font-medium hover:bg-yellow-200 transition-colors"
              >
                {t("moveToPending")}
              </button>
            )}

            {post.status !== "rejected" && post.status !== "published" && (
              <button
                onClick={() => updateStatus("rejected")}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
              >
                {t("reject")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
