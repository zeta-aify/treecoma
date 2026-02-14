import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

function getMailTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BP-${dateStr}-${random}`;
}

function buildOrderText(
  orderNumber: string,
  customer: { name: string; phone: string; email?: string },
  items: { name_snapshot: string; price: number; quantity: number; variant?: string | null }[],
  total: number,
  orderType: string,
  deliveryAddress?: string,
  notes?: string,
) {
  const itemLines = items
    .map(
      (item) =>
        `  ${item.name_snapshot}${item.variant ? ` (${item.variant})` : ""} x${item.quantity} — ${item.price * item.quantity}฿`,
    )
    .join("\n");

  return `🔔 New Order ${orderNumber}

Type: ${orderType === "pickup" ? "🏠 Pickup" : "🛵 Delivery"}
${deliveryAddress ? `Address: ${deliveryAddress}\n` : ""}
Customer: ${customer.name}
Phone: ${customer.phone}
${customer.email ? `Email: ${customer.email}\n` : ""}
Items:
${itemLines}

Total: ${total}฿
${notes ? `\nNotes: ${notes}` : ""}`;
}

async function sendEmailNotification(
  orderNumber: string,
  customer: { name: string; phone: string; email?: string },
  items: { name_snapshot: string; price: number; quantity: number; variant?: string | null }[],
  total: number,
  orderType: string,
  deliveryAddress?: string,
  notes?: string,
) {
  const transport = getMailTransport();
  if (!transport) return;

  const text = buildOrderText(orderNumber, customer, items, total, orderType, deliveryAddress, notes);

  await transport.sendMail({
    from: `"Ban Passarelli" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER!,
    subject: `New Order ${orderNumber} — ${total}฿`,
    text: text + "\n\nView in admin: https://treecoma-banpassarelli.com/en/admin/orders",
  });
}

async function sendLineNotification(
  orderNumber: string,
  customer: { name: string; phone: string; email?: string },
  items: { name_snapshot: string; price: number; quantity: number; variant?: string | null }[],
  total: number,
  orderType: string,
  deliveryAddress?: string,
  notes?: string,
) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) return;

  const text = buildOrderText(orderNumber, customer, items, total, orderType, deliveryAddress, notes);

  await fetch("https://api.line.me/v2/bot/message/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messages: [{ type: "text", text }],
    }),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customer, order, items } = body;

  if (!customer?.name || !customer?.phone || !items?.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    // Create customer
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .insert({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      })
      .select("id")
      .single();

    if (customerError) throw customerError;

    // Calculate total
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0,
    );

    // Create order
    const orderNumber = generateOrderNumber();
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerData.id,
        order_type: order.order_type,
        delivery_address: order.delivery_address,
        notes: order.notes,
        total,
        payment_status: order.payment_status || "pending",
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map(
      (item: {
        product_id: string;
        name_snapshot: string;
        price: number;
        quantity: number;
        variant: string | null;
      }) => ({
        order_id: orderData.id,
        product_id: item.product_id.startsWith("static-") ? null : item.product_id,
        name_snapshot: item.name_snapshot,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant,
      }),
    );

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Send notifications (wait for them before returning so serverless doesn't kill the process)
    const notifyArgs = [orderNumber, customer, items, total, order.order_type, order.delivery_address, order.notes] as const;
    const results = await Promise.allSettled([
      sendEmailNotification(...notifyArgs),
      sendLineNotification(...notifyArgs),
    ]);

    const emailResult = results[0].status === "fulfilled" ? "sent" : `error: ${(results[0] as PromiseRejectedResult).reason}`;
    const lineResult = results[1].status === "fulfilled" ? "sent" : `error: ${(results[1] as PromiseRejectedResult).reason}`;
    console.log(`Order ${orderNumber} notifications — email: ${emailResult}, line: ${lineResult}`);

    return NextResponse.json({ order_number: orderNumber });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error("Order creation error:", message);
    return NextResponse.json(
      { error: "Failed to create order", detail: message },
      { status: 500 },
    );
  }
}
