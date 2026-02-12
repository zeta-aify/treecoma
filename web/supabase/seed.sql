-- Ban Passarelli Menu Seed Data
-- Prices in THB

-- STARTERS
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Bruschetta Tomato', 'บรุสเกตต้า มะเขือเทศ', 'starters', 69, 1),
  ('Bruschetta Olive & Dry Tomato', 'บรุสเกตต้า มะกอก & มะเขือเทศอบแห้ง', 'starters', 89, 2),
  ('Mozzarella Potato Balls', 'มอสซาเรลล่า โปเตโต้ บอล', 'starters', 89, 3),
  ('Caprese', 'คาปรีเซ่', 'starters', 120, 4),
  ('Cold Cuts & Cheese Platter (2p)', 'แผ่นเนื้อเย็น & ชีส (2 ท่าน)', 'starters', 249, 5);

-- PASTA
INSERT INTO products (name_en, name_th, category, price, price_variant, sort_order) VALUES
  ('Penne All''Arrabbiata', 'เพนเน่ อัลลาร์ราเบียต้า', 'pasta', 139, '{"with_ragu": 169, "with_pesto": 159}', 1),
  ('Spaghetti Carbonara', 'สปาเก็ตตี้ คาร์โบนาร่า', 'pasta', 169, '{"with_cream": 189}', 2),
  ('Gnocchi al Pesto', 'ยอกกี้ อัล เพสโต้', 'pasta', 179, '{"with_ragu": 169}', 3),
  ('Tagliatelle al Ragù', 'ตัลยาเตลเล่ อัล ราคู', 'pasta', 199, '{"with_tomato": 169}', 4),
  ('Lasagna', 'ลาซานญ่า', 'pasta', 219, NULL, 5),
  ('Spaghetti Sea Food', 'สปาเก็ตตี้ ซีฟู้ด', 'pasta', 249, NULL, 6);

-- MAIN DISHES
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Cotoletta Milanese', 'โคโตเลตต้า มิลาเนเซ่', 'main', 180, 1),
  ('Meatballs in Tomato Sauce', 'มีทบอล ซอสมะเขือเทศ', 'main', 200, 2),
  ('Italian Sausage', 'ไส้กรอกอิตาเลียน', 'main', 200, 3),
  ('Sauté Sea Food', 'ผัดซีฟู้ด', 'main', 299, 4);

-- SIDE DISHES
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Green Salad', 'สลัดผัก', 'sides', 40, 1),
  ('French Fries', 'เฟรนช์ฟรายส์', 'sides', 50, 2),
  ('Baked Potatoes', 'มันฝรั่งอบ', 'sides', 60, 3),
  ('Sautéed Spinach', 'ผักโขมผัด', 'sides', 70, 4);

-- CLASSIC PIZZA
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Marinara', 'มารีนาร่า', 'classic_pizza', 150, 1),
  ('Margherita', 'มาร์เกริต้า', 'classic_pizza', 180, 2),
  ('Biggs Bufalina', 'บิ๊กส์ บูฟาลิน่า', 'classic_pizza', 200, 3),
  ('Broccoli & Potato', 'บร็อคโคลี่ & มันฝรั่ง', 'classic_pizza', 200, 4),
  ('Diavola', 'เดียโวล่า', 'classic_pizza', 220, 5),
  ('Wurtel & Fries', 'เวือร์เทล & ฟรายส์', 'classic_pizza', 220, 6),
  ('Four Season', 'โฟร์ซีซั่น', 'classic_pizza', 220, 7),
  ('Four Cheese', 'โฟร์ชีส', 'classic_pizza', 240, 8),
  ('Sea Food', 'ซีฟู้ด', 'classic_pizza', 289, 9);

-- SPECIAL PIZZA
INSERT INTO products (name_en, name_th, category, price, is_seasonal, sort_order) VALUES
  ('Avocado', 'อะโวคาโด', 'special_pizza', 180, true, 1),
  ('Hawaiian', 'ฮาวายเอี้ยน', 'special_pizza', 220, false, 2),
  ('Carbonara', 'คาร์โบนาร่า', 'special_pizza', 240, false, 3);

-- PREMIUM PIZZA
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Regina Napoli', 'เรจิน่า นาโปลี', 'premium_pizza', 260, 1),
  ('Rock', 'ร็อค', 'premium_pizza', 280, 2),
  ('Marlon Brando', 'มาร์ลอน แบรนโด', 'premium_pizza', 270, 3),
  ('Reggiana', 'เรจจาน่า', 'premium_pizza', 299, 4),
  ('BG (2 person)', 'BG (2 ท่าน)', 'premium_pizza', 340, 5);

-- CALZONI
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Classic', 'คลาสสิก', 'calzoni', 200, 1),
  ('Filled', 'ฟิลด์', 'calzoni', 220, 2),
  ('Roger', 'โรเจอร์', 'calzoni', 279, 3);

-- FOCACCIA PANINI
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Veggie Gourmet', 'เวจจี้ กูร์เมต์', 'panini', 120, 1),
  ('Ham & Cheese', 'แฮม & ชีส', 'panini', 120, 2),
  ('Caprese', 'คาปรีเซ่', 'panini', 140, 3),
  ('Cotoletta', 'โคโตเลตต้า', 'panini', 140, 4),
  ('Sausage', 'ไส้กรอก', 'panini', 140, 5),
  ('Mortadella', 'มอร์ตาเดลล่า', 'panini', 150, 6),
  ('Parma Ham', 'พาร์มาแฮม', 'panini', 160, 7);

-- DESSERT
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Energy Ball', 'เอเนอร์จี้ บอล', 'dessert', 30, 1),
  ('Chocolate Cake', 'ช็อกโกแลตเค้ก', 'dessert', 89, 2),
  ('Panna Cotta', 'พานนาคอตต้า', 'dessert', 89, 3),
  ('House Cake', 'เค้กบ้าน', 'dessert', 99, 4),
  ('Tiramisù', 'ทีรามิสุ', 'dessert', 99, 5);

-- DRINKS
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Mineral Water', 'น้ำแร่', 'drinks', 20, 1),
  ('Soda Water', 'โซดา', 'drinks', 20, 2),
  ('Coca Cola', 'โคคา-โคล่า', 'drinks', 30, 3),
  ('Schweppes Lime', 'ชเวปส์ ไลม์', 'drinks', 35, 4),
  ('Lime & Honey Tea', 'ชามะนาว & น้ำผึ้ง', 'drinks', 50, 5),
  ('Lavender Tea', 'ชาลาเวนเดอร์', 'drinks', 50, 6),
  ('Fresh Juice (Mango/Passion)', 'น้ำผลไม้สด (มะม่วง/เสาวรส)', 'drinks', 60, 7);

-- BEERS
INSERT INTO products (name_en, name_th, category, price, sort_order) VALUES
  ('Singha 66cl', 'สิงห์ 66cl', 'beers', 99, 1),
  ('Leo 66cl', 'ลีโอ 66cl', 'beers', 99, 2),
  ('Asahi 33cl', 'อาซาฮี 33cl', 'beers', 89, 3);

-- COFFEE
INSERT INTO products (name_en, name_th, category, price, price_variant, sort_order, description_en, description_th) VALUES
  ('Espresso', 'เอสเพรสโซ่', 'coffee', 40, NULL, 1, NULL, NULL),
  ('Americano', 'อเมริกาโน่', 'coffee', 50, '{"iced": 55}', 2, NULL, NULL),
  ('Cappuccino', 'คาปูชิโน่', 'coffee', 60, '{"iced": 65}', 3, NULL, NULL),
  ('Latte', 'ลาเต้', 'coffee', 60, '{"iced": 65}', 4, NULL, NULL),
  ('Chocolate', 'ช็อกโกแลต', 'coffee', 70, '{"iced": 75}', 5, NULL, NULL),
  ('Matcha', 'มัทฉะ', 'coffee', 70, '{"iced": 75}', 6, 'Oat milk +30฿', 'นมข้าวโอ๊ต +30฿');
