import type { Product, ProductCategory } from "./types";

// Static menu data for development / fallback
// In production, this is fetched from Supabase

let counter = 0;
function id() {
  return `static-${++counter}`;
}

function p(
  name_en: string,
  name_th: string,
  category: ProductCategory,
  price: number,
  opts?: {
    price_variant?: Record<string, number>;
    description_en?: string;
    description_th?: string;
    is_seasonal?: boolean;
  },
): Product {
  return {
    id: id(),
    name_en,
    name_th,
    description_en: opts?.description_en ?? null,
    description_th: opts?.description_th ?? null,
    category,
    price,
    price_variant: opts?.price_variant ?? null,
    image_url: null,
    is_available: true,
    is_seasonal: opts?.is_seasonal ?? false,
    sort_order: counter,
    created_at: "",
    updated_at: "",
  };
}

export const menuData: Product[] = [
  // STARTERS
  p("Bruschetta Tomato", "บรุสเกตต้า มะเขือเทศ", "starters", 69),
  p("Bruschetta Olive & Dry Tomato", "บรุสเกตต้า มะกอก & มะเขือเทศอบแห้ง", "starters", 89),
  p("Mozzarella Potato Balls", "มอสซาเรลล่า โปเตโต้ บอล", "starters", 89),
  p("Caprese", "คาปรีเซ่", "starters", 120),
  p("Cold Cuts & Cheese Platter (2p)", "แผ่นเนื้อเย็น & ชีส (2 ท่าน)", "starters", 249),

  // PASTA
  p("Penne All'Arrabbiata", "เพนเน่ อัลลาร์ราเบียต้า", "pasta", 139, { price_variant: { "with ragù": 169, "with pesto": 159 } }),
  p("Spaghetti Carbonara", "สปาเก็ตตี้ คาร์โบนาร่า", "pasta", 169, { price_variant: { "with cream": 189 } }),
  p("Gnocchi al Pesto", "ยอกกี้ อัล เพสโต้", "pasta", 179, { price_variant: { "with ragù": 169 } }),
  p("Tagliatelle al Ragù", "ตัลยาเตลเล่ อัล ราคู", "pasta", 199, { price_variant: { "with tomato": 169 } }),
  p("Lasagna", "ลาซานญ่า", "pasta", 219),
  p("Spaghetti Sea Food", "สปาเก็ตตี้ ซีฟู้ด", "pasta", 249),

  // MAIN DISHES
  p("Cotoletta Milanese", "โคโตเลตต้า มิลาเนเซ่", "main", 180),
  p("Meatballs in Tomato Sauce", "มีทบอล ซอสมะเขือเทศ", "main", 200),
  p("Italian Sausage", "ไส้กรอกอิตาเลียน", "main", 200),
  p("Sauté Sea Food", "ผัดซีฟู้ด", "main", 299),

  // SIDES
  p("Green Salad", "สลัดผัก", "sides", 40),
  p("French Fries", "เฟรนช์ฟรายส์", "sides", 50),
  p("Baked Potatoes", "มันฝรั่งอบ", "sides", 60),
  p("Sautéed Spinach", "ผักโขมผัด", "sides", 70),

  // CLASSIC PIZZA
  p("Marinara", "มารีนาร่า", "classic_pizza", 150),
  p("Margherita", "มาร์เกริต้า", "classic_pizza", 180),
  p("Biggs Bufalina", "บิ๊กส์ บูฟาลิน่า", "classic_pizza", 200),
  p("Broccoli & Potato", "บร็อคโคลี่ & มันฝรั่ง", "classic_pizza", 200),
  p("Diavola", "เดียโวล่า", "classic_pizza", 220),
  p("Wurtel & Fries", "เวือร์เทล & ฟรายส์", "classic_pizza", 220),
  p("Four Season", "โฟร์ซีซั่น", "classic_pizza", 220),
  p("Four Cheese", "โฟร์ชีส", "classic_pizza", 240),
  p("Sea Food", "ซีฟู้ด", "classic_pizza", 289),

  // SPECIAL PIZZA
  p("Avocado", "อะโวคาโด", "special_pizza", 180, { is_seasonal: true }),
  p("Hawaiian", "ฮาวายเอี้ยน", "special_pizza", 220),
  p("Carbonara", "คาร์โบนาร่า", "special_pizza", 240),

  // PREMIUM PIZZA
  p("Regina Napoli", "เรจิน่า นาโปลี", "premium_pizza", 260),
  p("Rock", "ร็อค", "premium_pizza", 280),
  p("Marlon Brando", "มาร์ลอน แบรนโด", "premium_pizza", 270),
  p("Reggiana", "เรจจาน่า", "premium_pizza", 299),
  p("BG (2 person)", "BG (2 ท่าน)", "premium_pizza", 340),

  // CALZONI
  p("Classic", "คลาสสิก", "calzoni", 200),
  p("Filled", "ฟิลด์", "calzoni", 220),
  p("Roger", "โรเจอร์", "calzoni", 279),

  // FOCACCIA PANINI
  p("Veggie Gourmet", "เวจจี้ กูร์เมต์", "panini", 120),
  p("Ham & Cheese", "แฮม & ชีส", "panini", 120),
  p("Caprese", "คาปรีเซ่", "panini", 140),
  p("Cotoletta", "โคโตเลตต้า", "panini", 140),
  p("Sausage", "ไส้กรอก", "panini", 140),
  p("Mortadella", "มอร์ตาเดลล่า", "panini", 150),
  p("Parma Ham", "พาร์มาแฮม", "panini", 160),

  // DESSERT
  p("Energy Ball", "เอเนอร์จี้ บอล", "dessert", 30),
  p("Chocolate Cake", "ช็อกโกแลตเค้ก", "dessert", 89),
  p("Panna Cotta", "พานนาคอตต้า", "dessert", 89),
  p("House Cake", "เค้กบ้าน", "dessert", 99),
  p("Tiramisù", "ทีรามิสุ", "dessert", 99),

  // DRINKS
  p("Mineral Water", "น้ำแร่", "drinks", 20),
  p("Soda Water", "โซดา", "drinks", 20),
  p("Coca Cola", "โคคา-โคล่า", "drinks", 30),
  p("Schweppes Lime", "ชเวปส์ ไลม์", "drinks", 35),
  p("Lime & Honey Tea", "ชามะนาว & น้ำผึ้ง", "drinks", 50),
  p("Lavender Tea", "ชาลาเวนเดอร์", "drinks", 50),
  p("Fresh Juice (Mango/Passion)", "น้ำผลไม้สด (มะม่วง/เสาวรส)", "drinks", 60),

  // BEERS
  p("Singha 66cl", "สิงห์ 66cl", "beers", 99),
  p("Leo 66cl", "ลีโอ 66cl", "beers", 99),
  p("Asahi 33cl", "อาซาฮี 33cl", "beers", 89),

  // COFFEE
  p("Espresso", "เอสเพรสโซ่", "coffee", 40),
  p("Americano", "อเมริกาโน่", "coffee", 50, { price_variant: { iced: 55 } }),
  p("Cappuccino", "คาปูชิโน่", "coffee", 60, { price_variant: { iced: 65 } }),
  p("Latte", "ลาเต้", "coffee", 60, { price_variant: { iced: 65 } }),
  p("Chocolate", "ช็อกโกแลต", "coffee", 70, { price_variant: { iced: 75 } }),
  p("Matcha", "มัทฉะ", "coffee", 70, { price_variant: { iced: 75 }, description_en: "Oat milk +30฿", description_th: "นมข้าวโอ๊ต +30฿" }),
];
