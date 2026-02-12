import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BP-${dateStr}-${random}`;
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
        product_id: item.product_id,
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

    return NextResponse.json({ order_number: orderNumber });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
