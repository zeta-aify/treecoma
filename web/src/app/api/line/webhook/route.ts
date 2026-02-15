import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || "";
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treecoma-banpassarelli.com";
const QR_IMAGE_URL = `${SITE_URL}/images/promptpay-qr.jpeg`;

type LineMessage =
  | { type: "text"; text: string }
  | { type: "image"; originalContentUrl: string; previewImageUrl: string };

function verifySignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac("SHA256", CHANNEL_SECRET)
    .update(body)
    .digest("base64");
  return hash === signature;
}

async function reply(replyToken: string, messages: LineMessage[]) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
}

async function getDisplayName(userId: string): Promise<string> {
  try {
    const res = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
      headers: { Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}` },
    });
    if (res.ok) {
      const profile = await res.json();
      return profile.displayName || "Unknown";
    }
  } catch {
    // ignore
  }
  return "Unknown";
}

async function notifyAngela(customerName: string, message: string) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transport.sendMail({
    from: `"Treecoma LINE Bot" <${user}>`,
    to: user,
    subject: `💬 LINE: ${customerName} messaged`,
    text: `New LINE message from ${customerName}:

"${message}"

👉 Reply here:
https://manager.line.biz/account/@898awkbw/chat`,
  });
}

const CANNABIS_MENU = `🌿 Treecoma Cannabis Menu

Indoor:
• Ethanol (Hybrid) — 120฿/g

Greenhouse (100฿/g):
• Amnesia Payton (Sativa)
• Blue Sushi (Indica)
• Gorilla Glue (Indica)
• Sky Walker (Sativa)

🍰 Edibles:
• Magic Cake — 250฿ (vegan chocolate cake with extract)

⚕️ Licensed dispensary — valid Thai medical cannabis license required.
📍 Visit us in Mae On, Chiang Mai

💬 Want to know more? Just type in this chat and our team will help you.`;

const WELCOME_AND_MENU = `Welcome to Bân Passarelli & Treecoma! 🌿🍕

We're an Italian family restaurant in Mae On, Chiang Mai — serving handmade pizza, fresh pasta, homemade desserts, and Italian coffee.

We are also a licensed cannabis dispensary (Treecoma).

🕐 Open: 10:00 – 21:00
❌ Closed: Tuesdays

🍕 See our full menu:
${SITE_URL}/en/menu

🌿 Type "cannabis menu" to see our strains & edibles.

💬 Need help or have questions?
Just type in this chat and our team will assist you directly.

📍 Mae On District, Chiang Mai 🙏`;

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-line-signature") || "";

  if (CHANNEL_SECRET && !verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const body = JSON.parse(rawBody);
  const events = body.events || [];

  for (const event of events) {
    const userId = event.source?.userId || "";

    // New follower → send full menu
    if (event.type === "follow") {
      await reply(event.replyToken, [
        { type: "text", text: WELCOME_AND_MENU },
      ]);
      const name = await getDisplayName(userId);
      notifyAngela(name, "[New follower]").catch(() => {});
      continue;
    }

    if (event.type === "message" && event.message?.type === "text") {
      const userText = event.message.text;
      const lower = userText.toLowerCase().trim();
      const customerName = await getDisplayName(userId);

      // "pay" → send QR code
      if (
        lower === "pay" ||
        lower === "qr" ||
        lower === "betala" ||
        lower === "ready" ||
        lower === "จ่าย" ||
        lower === "พร้อม"
      ) {
        await reply(event.replyToken, [
          {
            type: "text",
            text: `Here's our PromptPay QR code 👇

Scan with your banking app, send the amount, and share the payment screenshot here.

Angela will confirm your order! 🙏`,
          },
          {
            type: "image",
            originalContentUrl: QR_IMAGE_URL,
            previewImageUrl: QR_IMAGE_URL,
          },
        ]);
        await notifyAngela(customerName, `${userText} [QR code sent]`);
        continue;
      }

      // "cannabis menu" → send cannabis product list
      if (
        lower === "cannabis menu" ||
        lower === "cannabis meny" ||
        lower === "weed menu" ||
        lower === "strain" ||
        lower === "strains" ||
        lower === "เมนูกัญชา"
      ) {
        await reply(event.replyToken, [
          { type: "text", text: CANNABIS_MENU },
        ]);
        await notifyAngela(customerName, `${userText} [Cannabis menu sent]`);
        continue;
      }

      // Any first message / greeting / menu request → send welcome
      if (
        lower === "hi" ||
        lower === "hello" ||
        lower === "hey" ||
        lower === "help" ||
        lower === "start" ||
        lower === "menu" ||
        lower.includes("สวัสดี") ||
        lower.includes("cannabis") ||
        lower.includes("weed") ||
        lower.includes("food") ||
        lower.includes("pizza") ||
        lower.includes("price") ||
        lower.includes("กัญชา") ||
        lower.includes("เมนู") ||
        lower.includes("ราคา")
      ) {
        await reply(event.replyToken, [
          { type: "text", text: WELCOME_AND_MENU },
        ]);
        await notifyAngela(customerName, userText);
        continue;
      }

      // Everything else → just notify Angela (no bot reply, she handles it)
      await notifyAngela(customerName, userText);
    }
  }

  return NextResponse.json({ status: "ok" });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
