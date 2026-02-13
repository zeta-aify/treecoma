import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Use service role key for cron (no user session)
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase || !resend) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Find orders older than 2 hours that are still active
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { data: staleOrders } = await supabase
    .from("orders")
    .select("order_number, status, total, created_at, customers(name)")
    .in("status", ["pending", "confirmed", "preparing", "ready"])
    .lt("updated_at", twoHoursAgo)
    .order("created_at", { ascending: false });

  if (!staleOrders || staleOrders.length === 0) {
    return NextResponse.json({ message: "No stale orders", count: 0 });
  }

  const orderLines = staleOrders
    .map((o: Record<string, unknown>) => {
      const customer = o.customers as { name: string } | null;
      return `  ${o.order_number} — ${o.total}฿ — ${o.status} — ${customer?.name || "Unknown"}`;
    })
    .join("\n");

  await resend.emails.send({
    from: "Ban Passarelli <onboarding@resend.dev>",
    to: "treecoma.ltd@gmail.com",
    subject: `Reminder: ${staleOrders.length} order${staleOrders.length > 1 ? "s" : ""} need attention`,
    text: `Hi Angela,

The following orders have been waiting for more than 2 hours without being updated:

${orderLines}

Please update their status in the admin panel:
https://treecoma-banpassarelli.com/en/admin/orders

- Ban Passarelli Order System`,
  });

  return NextResponse.json({
    message: `Sent reminder for ${staleOrders.length} stale orders`,
    count: staleOrders.length,
  });
}
