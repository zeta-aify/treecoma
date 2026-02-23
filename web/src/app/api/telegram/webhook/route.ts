import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { downloadFile, sendMessageToGroup } from "@/lib/content/telegram";
import { uploadImage } from "@/lib/content/storage";
import { generateCaption } from "@/lib/content/anthropic";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getServiceClient();
    const telegramUserId = message.from?.id;

    // Ignore bot's own messages
    if (message.from?.is_bot) {
      return NextResponse.json({ ok: true });
    }

    // Check if user is authorized
    const { data: user } = await supabase
      .from("content_users")
      .select("*")
      .eq("telegram_user_id", telegramUserId)
      .eq("is_active", true)
      .single();

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Handle photo message — start the content pipeline
    if (message.photo && message.photo.length > 0) {
      await handlePhoto(supabase, message, user);
      return NextResponse.json({ ok: true });
    }

    // Handle text replies to bot messages (approval flow)
    if (message.text && message.reply_to_message) {
      await handleReply(supabase, message);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}

async function handlePhoto(
  supabase: ReturnType<typeof getServiceClient>,
  message: Record<string, unknown>,
  user: { id: string; name: string },
) {
  const photos = message.photo as { file_id: string; width: number }[];
  // Get the highest resolution photo
  const photo = photos[photos.length - 1];

  try {
    // Download from Telegram
    const buffer = await downloadFile(photo.file_id);

    // Upload to Supabase Storage
    const fileName = `${user.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.jpg`;
    const { path, url } = await uploadImage(buffer, fileName);

    // Generate AI caption
    const caption = await generateCaption(url);

    // Save to database
    const { data: post, error } = await supabase
      .from("content_posts")
      .insert({
        user_id: user.id,
        status: "pending_approval",
        image_path: path,
        image_url: url,
        caption_en: caption.caption_en,
        caption_th: caption.caption_th,
        ai_image_description: caption.image_description,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save content post:", error);
      await sendMessageToGroup(
        `Something went wrong saving the post. Please try again.`,
        (message as { message_id: number }).message_id,
      );
      return;
    }

    // Send caption suggestion to group
    const approvalText = `<b>New post from ${user.name}</b>

<b>EN:</b> ${caption.caption_en}

<b>TH:</b> ${caption.caption_th}

Reply to this message with:
• <b>ok</b> — approve English caption
• <b>th</b> — approve Thai caption
• <b>edit: your caption here</b> — use custom caption
• <b>no</b> — reject`;

    const sent = await sendMessageToGroup(
      approvalText,
      (message as { message_id: number }).message_id,
    );

    // Save the bot's message ID for tracking replies
    if (sent.ok && sent.result) {
      await supabase
        .from("content_posts")
        .update({
          telegram_message_id: (sent.result as { message_id: number }).message_id,
          approval_sent_at: new Date().toISOString(),
        })
        .eq("id", post.id);
    }
  } catch (error) {
    console.error("Photo handling error:", error);
    await sendMessageToGroup(
      `Something went wrong processing this photo. Please try again.`,
      (message as { message_id: number }).message_id,
    );
  }
}

async function handleReply(
  supabase: ReturnType<typeof getServiceClient>,
  message: { text: string; reply_to_message: { message_id: number } },
) {
  const replyToId = message.reply_to_message.message_id;
  const text = message.text.trim().toLowerCase();

  // Find the post this reply is about
  const { data: post } = await supabase
    .from("content_posts")
    .select("*")
    .eq("telegram_message_id", replyToId)
    .eq("status", "pending_approval")
    .single();

  if (!post) return;

  if (text === "ok" || text === "yes" || text === "approve") {
    // Approve with English caption
    await supabase
      .from("content_posts")
      .update({
        status: "approved",
        caption_final: post.caption_en,
      })
      .eq("id", post.id);

    await sendMessageToGroup("Approved! Post queued for publishing.", replyToId);
  } else if (text === "th" || text === "thai") {
    // Approve with Thai caption
    await supabase
      .from("content_posts")
      .update({
        status: "approved",
        caption_final: post.caption_th,
      })
      .eq("id", post.id);

    await sendMessageToGroup("Approved with Thai caption! Post queued for publishing.", replyToId);
  } else if (text.startsWith("edit:") || text.startsWith("edit ")) {
    // Custom caption
    const customCaption = message.text.trim().replace(/^edit[:\s]+/i, "").trim();
    await supabase
      .from("content_posts")
      .update({
        status: "approved",
        caption_final: customCaption,
      })
      .eq("id", post.id);

    await sendMessageToGroup("Approved with custom caption! Post queued for publishing.", replyToId);
  } else if (text === "no" || text === "reject" || text === "skip") {
    await supabase
      .from("content_posts")
      .update({ status: "rejected" })
      .eq("id", post.id);

    await sendMessageToGroup("Post rejected.", replyToId);
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
