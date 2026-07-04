import { createClient } from "@/lib/supabase/server";
import { menuData } from "@/lib/menu-data";
import type { Product } from "@/lib/types";

// Single source of truth for the public menu: Supabase, with the static
// menu-data.ts as a defensive fallback if the DB is unreachable/empty.
export async function getMenuProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .neq("category", "cannabis")
      .eq("is_available", true)
      .order("category")
      .order("sort_order");
    if (error || !data || data.length === 0) {
      return menuData;
    }
    return data as Product[];
  } catch {
    return menuData;
  }
}
