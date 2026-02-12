export type ProductCategory =
  | "starters"
  | "pasta"
  | "main"
  | "sides"
  | "classic_pizza"
  | "special_pizza"
  | "premium_pizza"
  | "calzoni"
  | "panini"
  | "dessert"
  | "drinks"
  | "beers"
  | "coffee"
  | "cannabis";

export interface Product {
  id: string;
  name_en: string;
  name_th: string;
  description_en: string | null;
  description_th: string | null;
  category: ProductCategory;
  price: number;
  price_variant: Record<string, number> | null;
  image_url: string | null;
  is_available: boolean;
  is_seasonal: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CannabisInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  product_id: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  created_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "refunded";

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: OrderStatus;
  order_type: "pickup" | "delivery";
  delivery_address: string | null;
  notes: string | null;
  total: number;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name_snapshot: string;
  price: number;
  quantity: number;
  variant: string | null;
  created_at: string;
}

// Category groupings for display
export const FOOD_CATEGORIES: ProductCategory[] = [
  "starters",
  "pasta",
  "main",
  "sides",
  "classic_pizza",
  "special_pizza",
  "premium_pizza",
  "calzoni",
  "panini",
  "dessert",
  "drinks",
  "beers",
  "coffee",
];

export const CATEGORY_KEYS: Record<ProductCategory, string> = {
  starters: "starters",
  pasta: "pasta",
  main: "main",
  sides: "sides",
  classic_pizza: "classicPizza",
  special_pizza: "specialPizza",
  premium_pizza: "premiumPizza",
  calzoni: "calzoni",
  panini: "panini",
  dessert: "dessert",
  drinks: "drinks",
  beers: "beers",
  coffee: "coffee",
  cannabis: "cannabis",
};
