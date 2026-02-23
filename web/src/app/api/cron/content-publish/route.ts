import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { publishPost } from "@/lib/content/instagram";
import { sendMessageToGroup } from "@/lib/content/telegram";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if Instagram credentials are configured
  if (!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || !process.env.META_PAGE_ACCESS_TOKEN) {
    return NextResponse.json({ skipped: true, reason: "Instagram not configured" });
  }

  const supabase = getServiceClient();

  // Get approved posts ready to publish (limit 1 per cron run to avoid rate limits)
  const { data: posts } = await supabase
    .from("content_posts")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: true })
    .limit(1);

  if (!posts || posts.length === 0) {
    return NextResponse.json({ published: 0 });
  }

  let published = 0;

  for (const post of posts) {
    const caption = post.caption_final || post.caption_en || "";

    try {
      const result = await publishPost(post.image_url, caption);

      const updates: Record<string, unknown> = {
        status: "published",
        published_at: new Date().toISOString(),
      };

      if (result.instagram_post_id) {
        updates.instagram_post_id = result.instagram_post_id;
      }
      if (result.facebook_post_id) {
        updates.facebook_post_id = result.facebook_post_id;
      }

      // Only mark as published if at least one platform succeeded
      if (result.instagram_post_id || result.facebook_post_id) {
        await supabase
          .from("content_posts")
          .update(updates)
          .eq("id", post.id);

        published++;

        // Notify the group
        const platforms = [];
        if (result.instagram_post_id) platforms.push("Instagram");
        if (result.facebook_post_id) platforms.push("Facebook");

        await sendMessageToGroup(
          `Published to ${platforms.join(" + ")}! ${caption.slice(0, 100)}...`,
        );
      } else if (result.error) {
        console.error(`Failed to publish post ${post.id}:`, result.error);
      }
    } catch (error) {
      console.error(`Error publishing post ${post.id}:`, error);
    }
  }

  return NextResponse.json({ published });
}
