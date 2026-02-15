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

const WELCOME_AND_MENU = `Welcome to Treecoma & Ban Passarelli! 🌿🍕

🌿 CANNABIS (Treecoma)

Indoor:
• Ethanol (Hybrid) — 120฿/g

Greenhouse (100฿/g):
• Amnesia Payton (Sativa)
• Blue Sushi (Indica)
• Gorilla Glue (Indica)
• Sky Walker (Sativa)

🍰 Edibles:
• Magic Cake — 250฿ (100% vegan chocolate cake with extract)

🍕 FOOD (Ban Passarelli)
Pizza from 150฿ · Pasta from 139฿ · Desserts from 30฿
Full menu: ${SITE_URL}/en/menu

📦 Shipping cost extra — just ask!
⚕️ Cannabis requires a valid Thai medical license.
📍 Chiang Mai · Open daily except Wednesday

———
To order, send us:
1. What you want & how much
2. Your name
3. Delivery address (or "pickup")

Then type "pay" to get the QR code! 🙏`;

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

      // Any first message / greeting / menu request → send menu
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
