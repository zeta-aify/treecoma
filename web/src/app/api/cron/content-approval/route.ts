import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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

  const supabase = getServiceClient();

  // Find posts stuck in draft (no approval message sent yet)
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const { data: stuckPosts } = await supabase
    .from("content_posts")
    .select("*, content_users(name)")
    .eq("status", "draft")
    .is("approval_sent_at", null)
    .lt("created_at", fifteenMinutesAgo);

  if (!stuckPosts || stuckPosts.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;

  for (const post of stuckPosts) {
    const userName = post.content_users?.name || "Unknown";

    const approvalText = `<b>Pending post from ${userName}</b>

<b>EN:</b> ${post.caption_en || "No caption generated"}

<b>TH:</b> ${post.caption_th || "No caption generated"}

Reply to this message with:
• <b>ok</b> — approve English caption
• <b>th</b> — approve Thai caption
• <b>edit: your caption here</b> — use custom caption
• <b>no</b> — reject`;

    const sent = await sendMessageToGroup(approvalText);

    if (sent.ok && sent.result) {
      await supabase
        .from("content_posts")
        .update({
          status: "pending_approval",
          telegram_message_id: (sent.result as { message_id: number }).message_id,
          approval_sent_at: new Date().toISOString(),
        })
        .eq("id", post.id);
      processed++;
    }
  }

  return NextResponse.json({ processed });
}
