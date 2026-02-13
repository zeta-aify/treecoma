import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return NextResponse.json({
      error: "Missing env vars",
      hasUser: !!user,
      hasPass: !!pass,
    });
  }

  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const info = await transport.sendMail({
      from: `"Ban Passarelli" <${user}>`,
      to: user,
      subject: "Test from Vercel - " + new Date().toISOString(),
      text: "If you see this, email works from Vercel!",
    });

    return NextResponse.json({ success: true, response: info.response });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message });
  }
}
