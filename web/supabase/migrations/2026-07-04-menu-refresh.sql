-- 2026-07-04 Menu refresh: new categories + full Ban Passarelli re-seed
-- Run in Supabase SQL Editor (or `supabase db execute`). Enum values must be
-- committed before they can be used by the INSERTs in seed section below.

ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'bakery';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'fresh_pasta';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'salads';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'liquori';

-- Make product references survive menu re-seeds. order_items snapshots
-- name/price, so product_id can be nulled rather than blocking deletes.
-- Andreas: run this block together with (or right after) the ALTER TYPE
-- statements above, and before the seed transaction below.
ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

ALTER TABLE cannabis_inquiries DROP CONSTRAINT IF EXISTS cannabis_inquiries_product_id_fkey;
ALTER TABLE cannabis_inquiries ADD CONSTRAINT cannabis_inquiries_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

-- (seed section added in Task 3, run as a SEPARATE statement batch after the
--  ALTER TYPE statements above have committed)

-- ===== SEED (run after ALTER TYPE has committed) =====
BEGIN;

-- Remove existing FOOD products only; leave cannabis untouched.
DELETE FROM products WHERE category <> 'cannabis';

-- sort_order increments within each category in menu order.
-- price_variant JSONB used where the PDF lists options.
-- image_url is NULL for all rows here; Task 6 populates photos.

-- BAKERY
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Pagnotta 500g', 'พาน็อตต้า 500g', NULL, NULL, 'bakery', 100, NULL, false, 1),
('Baguette 200g', 'บาแก็ต 200g', NULL, NULL, 'bakery', 50, NULL, false, 2),
('Rosemary Focaccia', 'ฟอคคาเซีย โรสแมรี', 'Single piece / tray of 6', 'ชิ้นเดียว / ถาด 6 ชิ้น', 'bakery', 60, '{"tray_6": 300}', false, 3),
('Cherry Tomato or Potato Focaccia', 'ฟอคคาเซีย มะเขือเทศเชอร์รีหรือมันฝรั่ง', 'Single piece / tray of 4', 'ชิ้นเดียว / ถาด 4 ชิ้น', 'bakery', 80, '{"tray_4": 300}', false, 4);

-- STARTERS
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Bruschetta Garlic', 'บรุสเกตต้า กระเทียม', 'Garlic, evo oil', 'กระเทียม นํามันมะกอกบริสุทธิ', 'starters', 49, NULL, false, 1),
('Bruschetta Tomato', 'บรุสเกตต้า มะเขือเทศ', 'Tomato, garlic, evo oil, oregano', 'มะเขือเทศ กระเทียม นํามันมะกอกบริสุทธิ', 'starters', 69, NULL, false, 2),
('Bruschetta Olive & Dry Tomato', 'บรุสเกตต้า มะกอก & มะเขือเทศแห้ง', 'Black olive, dry tomato, evo oil, oregano', 'มะกอกดำ มะเขือเทศแห้ง นํามันมะกอกบริสุทธิ', 'starters', 99, NULL, false, 3),
('Mozzarella-Filled Potato Balls', 'มอสซาเรลล่า โปเตโต้ บอล', 'Potato, mozzarella', 'มันฝรังกับมอซซาเรลล่า', 'starters', 99, NULL, false, 4),
('Bruschetta Parma Ham', 'บรุสเกตต้า แฮมพาร์มา', 'Parma ham, Parmesan cheese, balsamic glaze', 'แฮมพาร์มา, พาร์เมซานชีส, บัลซามิก', 'starters', 120, NULL, false, 5),
('Caprese', 'คาปรีเซ่', 'Fresh mozzarella, tomato, evo oil', 'มอซซาเรลล่าสด มะเขือเทศ นํามันมะกอกบริสุทธิ', 'starters', 150, NULL, false, 6),
('Cold Cuts & Cheese Platter (2 Person)', 'แผ่นเนื้อเย็นและชีส (สำหรับ 2 ท่าน)', 'Parma ham, Salami, Mortadella Bologna, Speck, Blue cheese, Parmesan cheese, scamorza', 'แฮมพาร์มา, ซาลามี่, มอร์ทาเดลล่า โบโลญญ่า, สเปค, บลูชีส, พาร์เมซานชีส, ชีสรมควัน', 'starters', 339, NULL, false, 7);

-- PASTA ("choose your pasta": spaghetti / fusilli / penne)
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Penne Arrabbiata', 'เพนเน่ อาราเบียต้า', 'Homemade tomato sauce, chili, garlic, parsley', 'เพนเน่อาราเบียต้า — ซอสมะเขือเทศโฮมเมด พริกสด และผักชี กระเทียม', 'pasta', 159, NULL, false, 1),
('Penne Amatriciana', 'เพนเน่ อามาทริชาน่า', 'Homemade tomato sauce, cured pork jowl, white wine', 'เพนเน่อาราเบียต้า — ซอสมะเขือเทศโฮมเมด, เบคอน , และไวน์ขาว', 'pasta', 189, NULL, false, 2),
('Pasta Pesto', 'พาสต้า เพสโต้', 'Italian basil, nut, parmesan cheese, evo oil', 'ใบโหระพา, ถั่ว, พาร์เมซานชีส, นํามันมะกอกบริสุทธิ', 'pasta', 189, NULL, false, 3),
('Pasta Clams', 'พาสต้า หอยลาย', 'Clams, garlic, white wine, parsley', 'หอยลาย, กระเทียม, และไวน์ขาว, ผักชี', 'pasta', 199, NULL, false, 4),
('Spaghetti Carbonara', 'สปาเก็ตตี้ คาร์โบนาร่า', 'Eggs, parmesan cheese, cured pork jowl, black pepper', 'ไข่, พาร์เมซานชีส, เบคอน , พริกไทย', 'pasta', 199, NULL, false, 5),
('Pasta Bolognese', 'พาสต้า โบโลเนส', 'Homemade Bolognese with original recipe, beef and pork', 'โบโลเนสโฮมเมด สูตรต้นตํารับ ใช้เนือวัวและเนือหมู', 'pasta', 199, NULL, false, 6),
('Tagliatelle Sea Food', 'ทายาเทลเล่ ซีฟู้ด', 'River prawn, king prawn, mussel, clams, squid, garlic, parsley, white wine', 'กุ้งแม่น้ำ, กุ้งกุลาดำ, หอยแมลงภู่, หอยลาย, ปลาหมึก, หอยตลับ, กระเทียม, และไวน์ขาว', 'pasta', 269, NULL, false, 7);

-- FRESH_PASTA (homemade pasta; +20 baht surcharge noted on Cannelloni/Lasagna in the PDF, not modeled as a line item)
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Tagliatelle', 'ทายาเทลเล่', 'Tomato sauce / Pesto / Bolognese', NULL, 'fresh_pasta', 219, '{"pesto": 229, "bolognese": 239}', false, 1),
('Gnocchi', 'นอคคี', 'Pesto / Bolognese / Blue cheese', NULL, 'fresh_pasta', 229, '{"bolognese": 239, "blue_cheese": 249}', false, 2),
('Tortelli Spinach-Ricotta', 'ทอร์เทลลี ผักโขม-ริกอตต้า', 'Tortelli filled with spinach, ricotta cheese, parmesan cheese. Butter salvia / Bolognese', NULL, 'fresh_pasta', 229, '{"bolognese": 249}', false, 3),
('Cannelloni Spinach-Ricotta', 'คานเนลโลนี ผักโขม-ริกอตต้า', 'Filled with spinach, ricotta cheese, parmesan cheese.', NULL, 'fresh_pasta', 239, NULL, false, 4),
('Lasagna', 'ลาซานญ่า', 'Homemade traditional lasagna, beef, pork, homemade béchamel sauce, Parmesan cheese', 'โบโลเนสโฮมเมด สูตรต้นตำรับ ใช้เนื้อวัวและเนื้อหมู, ซอสเบชาเมลโฮมเมด และพาร์เมซานชีส', 'fresh_pasta', 259, NULL, false, 5);

-- MAIN (Sauté Sea Food placed here per plan note, not in SIDES)
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Cotoletta Milanese', 'คอทโทเลตต้า', '100% chicken breast, crispy breading made with flour, breadcrumbs, and egg', 'อกไก่ 100% ชุบแป้ง ไข่ และเกล็ดขนมปัง ทอดกรอบ', 'main', 220, NULL, false, 1),
('Meatballs in Tomato Sauce', 'มีทบอลในซอสมะเขือเทศ', 'Beef, fresh pork belly, parsley, garlic, egg, breadcrumbs, in homemade tomato sauce, served with homemade toasted bread (5 pcs)', 'เนื้อวัว เนื้อหมูสามชั้นสด พาสลีย์ กระเทียม ไข่ เกล็ดขนมปัง ในซอสมะเขือเทศโฮมเมด เสิร์ฟพร้อมขนมปังโฮมเมด', 'main', 230, NULL, false, 2),
('Italian Sausage', 'ไส้กรอกอิตาเลียน', 'Artisanal 100% pork (shoulder and fresh belly), garlic, black pepper, salt, sweet paprika, a touch of dry wine (2 pcs)', 'เนื้อหมู 100% (เนื้อส่วนหัวไหล่และสามชั้น) กระเทียม พริกไทยดำ เกลือ ปาปริกาหวาน ไวน์ขาว', 'main', 230, NULL, false, 3),
('Beef Tagliata', 'บีฟ ทาเลียต้า', 'Tenderloin 250-270g, served with salad, parmesan cheese and balsamic vinegar', 'เนื้อวัว สันใน 250g. เสิร์ฟพร้อมพาร์เมซานชีสสไลซ์ และบัลซามิก', 'main', 419, NULL, false, 4),
('Sauté Sea Food', 'ผัดซีฟู้ด', 'River prawn, king prawn, mussel, clams, squid, garlic, parsley, white wine, tomato sauce, served with homemade toasted bread', 'กุ้งแม่น้ำ กุ้งกุลาดำ หอยแมลงภู่ หอยตลับ ปลาหมึก หอยลาย กระเทียม และไวน์ขาว เสิร์ฟพร้อมขนมปังโฮมเมดปิ้ง', 'main', 339, NULL, false, 5);

-- SALADS
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Beetroot Salad', 'สลัดบีทรูท', 'House-marinated beetroot carpaccio with extra virgin olive oil, lemon, sea salt and vinegar, topped with fresh rocket, Fuji apple slices and crushed walnuts', 'บีทรูทหมักหั่นบาง ปรุงด้วยน้ำมันมะกอก น้ำมะนาว เกลือทะเล และน้ำส้มสายชู เสิร์ฟพร้อมร็อกเก็ต แอปเปิลฟูจิ', 'salads', 180, NULL, false, 1),
('Italian Salad', 'สลัดอิตาเลียน', 'Fresh mixed green lettuce, rocket, cherry tomatoes, red onion, grated carrot and fresh mozzarella. Dressing: mayo basil or Italian sweet and sour', 'ผักสลัดสด ร็อกเก็ต มะเขือเทศเชอร์รี หอมหัวแดง แครอทขูด และมอสซาเรลลาสดเนื้อนุ่ม', 'salads', 199, NULL, false, 2),
('Parma Ham & Melon', 'พาร์มาแฮมและเมลอน', 'Parma ham served with sweet melon. A classic Italian combination balancing the delicate savory flavor of cured ham with the freshness and sweetness of melon', 'พาร์มาแฮมคุณภาพเยี่ยม เสิร์ฟพร้อมเมลอนหวานฉ่ำสุกกำลังดี เมนูอิตาเลียนคลาสสิกที่ผสมผสานรสเค็มนุ่มของแฮมบ่มกับความหวานสดชื่นของเมลอนได้อย่างลงตัว', 'salads', 220, NULL, false, 3);

-- SIDES
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Green Salad', 'สลัดผัก', NULL, NULL, 'sides', 40, NULL, false, 1),
('French Fries', 'เฟรนช์ฟรายส์', NULL, NULL, 'sides', 50, NULL, false, 2),
('Baked Potatoes', 'มันฝรั่งอบ', NULL, NULL, 'sides', 60, NULL, false, 3),
('Grilled Vegetable', 'ผักย่าง', NULL, NULL, 'sides', 70, NULL, false, 4),
('Sautéed Spinach', 'ผักโขมผัด', NULL, NULL, 'sides', 70, NULL, false, 5);

-- CLASSIC_PIZZA (category note, not modeled per-item: +50 vegan mozzarella / +40 double crust)
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Marinara', 'พิซซ่า มารีนารา', 'Tomato, oregano, garlic', 'มะเขือเทศ ออริกาโน กระเทียม', 'classic_pizza', 180, NULL, false, 1),
('Margherita', 'มาร์เกอริต้า', 'Tomato, mozzarella', 'มะเขือเทศ มอซซาเรลล่า', 'classic_pizza', 200, NULL, false, 2),
('Bugs Bunny', 'พิซซ่า บักส์บันนี', 'Tomato, mozzarella, grilled vegetables', 'มะเขือเทศ มอซซาเรลล่า และผักย่าง', 'classic_pizza', 230, NULL, false, 3),
('Diavola', 'ดิอาโวล่า', 'Tomato, mozzarella, spicy salami', 'มะเขือเทศ มอซซาเรลล่า และซาลามิเผ็ด', 'classic_pizza', 240, NULL, false, 4),
('Napoli', 'นาโปลี', 'Tomato, mozzarella, anchovies, oregano', 'มะเขือเทศ มอซซาเรลล่า ออริกาโน ปลาแอนโชวีในนํามัน', 'classic_pizza', 250, NULL, false, 5),
('Sausage & Onion', 'พิซซ่าไส้กรอกหอมใหญ่', 'Tomato, mozzarella, sausage, onion', 'มะเขือเทศ ไส้กรอก มอซซาเรลล่า หอมหัวใหญ่', 'classic_pizza', 250, NULL, false, 6),
('Siciliana', 'ซิซิเลียน่า', 'Tomato, mozzarella, black olives, anchovies, capers', 'มะเขือเทศ มอซซเรลล่า มะกอกดำ ปลาแอนโชวีในนํามัน เคเปอร์', 'classic_pizza', 260, NULL, false, 7),
('Four Season', 'พิซซ่าโฟร์ซีซั่นส์', 'Tomato, mozzarella, ham, artichokes, sausage, mushrooms', 'มะเขือเทศ มอซซาเรลล่า แฮม อาร์ติโช้ค ไส้กรอก และเห็ด', 'classic_pizza', 260, NULL, false, 8),
('Four Cheese', 'โฟร์ชีส', 'Tomato, mozzarella, blue cheese, Parmesan cheese, scamorza', 'มะเขือเทศ มอซซาเรลล่า บลูชีส พาร์เมซานชีส ชีสรมควัน', 'classic_pizza', 260, NULL, false, 9),
('Sea Food', 'พิซซ่าซีฟูด', 'Tomato, mozzarella, squid, shrimp, mussels', 'มะเขือเทศ มอซซาเรลล่า ปลาหมึก กุ้ง หอยแมลงภู่', 'classic_pizza', 299, NULL, false, 10);

-- SPECIAL_PIZZA (no premium_pizza in the new menu; those items fold into special_pizza)
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Avocado', 'อโวคาโด', 'Mozzarella with avocado on top and dry tomato (available only when in season)', 'มอซซาเรลล่า ด้านบนด้วยอโวคาโด (มีเฉพาะช่วงที่มีผลผลิต) มะเขือเทศตากแห้ง', 'special_pizza', 240, NULL, true, 1),
('Patbon', 'พัดบอน', 'Tomato, mozzarella, ham, baked potatoes', 'มะเขือเทศ มอซซาเรลล่า แฮม มันฝรั่งอบ', 'special_pizza', 240, NULL, false, 2),
('Hawaiian', 'ฮาวายเอี้ยน', 'Tomato, mozzarella, pineapple, ham', 'มะเขือเทศ มอซซาเรลล่า สับปะรด และแฮม', 'special_pizza', 240, NULL, false, 3),
('Carbonara', 'คาร์โบนาร่า', 'Tomato, mozzarella, pancetta, Parmesan cheese, egg, pepper', 'มะเขือเทศ มอซซาเรลล่า เบคอน พาร์เมซานชีส ไข่ และพริกไทย', 'special_pizza', 260, NULL, false, 4),
('Speciale', 'สเปเชียล', 'Tomato, mozzarella, topped with fresh mozzarella and basil. This pizza has a thicker crust edge', 'มะเขือเทศ มอซซาเรลล่า ด้านบนด้วยมอซซาเรลล่าสดและโหระพา ขอบพิซซ่าหนากรอบ', 'special_pizza', 279, NULL, false, 5),
('Rock', 'ร็อค', 'Tomato, mozzarella, spicy salami, blue cheese, spinach, pancetta', 'มะเขือเทศ มอซซาเรลล่า ซาลามิเผ็ด บลูชีส ผักโขม และเบคอน', 'special_pizza', 299, NULL, false, 6),
('Gitana', 'กิตาน่า', 'Tomato, mozzarella, cherry tomato, speck, mushroom, Parmesan cheese', 'มะเขือเทศ มอซซาเรลล่า มะเขือเทศราชินี สเปค เห็ด พาร์เมซานชีส', 'special_pizza', 299, NULL, false, 7),
('Pizman', 'พิซแมน', 'Mozzarella, blue cheese, walnuts, on top Parmesan shavings, balsamic glaze and speck', 'มอซซาเรลล่า บลูชีส วอลนัท ด้านบนมีพาร์เมซานชีสสไลซ์ สเปค บัลซามิก', 'special_pizza', 299, NULL, false, 8),
('Reggiana', 'เรจจิอาน่า', 'Tomato, mozzarella, Parma ham, Parmesan shavings, balsamic glaze', 'มะเขือเทศ มอซซาเรลล่า พาร์มาแฮม พาร์เมซานชีสสไลซ์ และซอสบัลซามิก', 'special_pizza', 320, NULL, false, 9),
('Marlon Brando', 'มาร์ลอน แบรนโด', 'Half Rock, half calzone', 'ครึ่งร็อค ครึ่งคาลโซเน', 'special_pizza', 320, NULL, false, 10),
('8G', '8G', 'Rock pizza combined with Quattro Stagioni', 'ครึ่งร็อค ครึ่งโฟร์ซีซันส์', 'special_pizza', 349, NULL, false, 11);

-- CALZONI
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Classic Calzone', 'คาลโซเน', 'Tomato, mozzarella, ham', 'มะเขือเทศ มอซซาเรลล่า และแฮม', 'calzoni', 240, NULL, false, 1),
('Filled Calzone', 'คาลโซเนสอดไส้', 'Tomato, mozzarella, ham, sausage, mushrooms', 'มะเขือเทศ มอซซาเรลล่า แฮมและไส้กรอก เห็ด', 'calzoni', 270, NULL, false, 2),
('Roger Calzone', 'คาลโซเน โรเจอร์', 'Tomato, mozzarella, ham, mushrooms, sausage, topped with Parma ham', 'มะเขือเทศ มอซซาเรลล่า แฮม ไส้กรอก เห็ด และโรยพาร์มาแฮมหลังอบ', 'calzoni', 320, NULL, false, 3),
('Choose Your Calzone', 'คาลโซเนตามใจคุณ', 'Tomato, mozzarella and as you desired. Price shown is the starting price', 'มะเขือเทศ มอซซ่าเรลล่า และอะไรก็ได้', 'calzoni', 220, NULL, false, 4);

-- PANINI (choice of bread or focaccia)
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Veggie Gourmet', 'เวจจี้ กูร์เมต์', 'Grilled vegetables and Italian scamorza', 'ผักย่าง ชีสรมควัน', 'panini', 140, NULL, false, 1),
('Avocado', 'อโวคาโด', 'Avocado, Italian scamorza, dry tomato', 'อโวคาโด ชีสรมควัน มะเขือเทศแห้ง', 'panini', 150, NULL, false, 2),
('Ham & Cheese', 'แฮมแอนด์ชีส', 'Ham and Italian scamorza, salad', 'แฮม ชีสรมควัน และผักสลัด', 'panini', 160, NULL, false, 3),
('Caprese', 'คาปรีเซ่', 'Fresh mozzarella, tomatoes, oregano', 'มอซซาเรลล่าสด มะเขือเทศ และออริกาโน', 'panini', 170, NULL, false, 4),
('Italian Salami', 'ซาลามิอิตาเลียน', 'Italian salami and scamorza cheese', 'ชีสรมควัน ซาลามิอิตาเลียน', 'panini', 170, NULL, false, 5),
('Sausage', 'ไส้กรอก', 'Italian sausage, grilled onion, mustard, salad', 'ไส้กรอกอิตาเลียน หัวหอมย่าง มัสตาร์ด และผักสลัด', 'panini', 180, NULL, false, 6),
('Parma Ham', 'พาร์มาแฮม', 'Fresh mozzarella and Parma ham', 'มอซซาเรลล่าสด และพาร์มาแฮม', 'panini', 200, NULL, false, 7);

-- DESSERT
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Fruit Salad', 'สลัดผลไม้ตามฤดูกาล', 'Seasonal fruit salad', NULL, 'dessert', 69, NULL, false, 1),
('Energy Bar 2 Pcs', 'เอนเนอร์จี้บาร์ 2 ชิ้น', NULL, NULL, 'dessert', 89, NULL, false, 2),
('Chocolate Cake', 'เค้กช็อกโกแลต', NULL, NULL, 'dessert', 99, NULL, false, 3),
('Panna Cotta', 'พานาคอตต้า', 'Chocolate, passion, or raspberry', NULL, 'dessert', 99, NULL, false, 4),
('Semi Frozen Cake', 'เซมิโฟรเซนเค้ก', NULL, NULL, 'dessert', 120, NULL, false, 5),
('Tiramisù', 'ทีรามิสุ', NULL, NULL, 'dessert', 120, NULL, false, 6);

-- DRINKS
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Mineral Water', 'น้ำแร่', NULL, NULL, 'drinks', 20, NULL, false, 1),
('Soda Water', 'โซดา', NULL, NULL, 'drinks', 20, NULL, false, 2),
('Coca Cola Normal or Zero', 'โคคาโคล่า ปกติหรือซีโร่', NULL, NULL, 'drinks', 30, NULL, false, 3),
('Schweppes Zero Lime', 'สเวปส์ ซีโร่ มะนาว', NULL, NULL, 'drinks', 35, NULL, false, 4),
('Homemade Lime & Honey Tea', 'ชามะนาวผึ้งโฮมเมด', NULL, NULL, 'drinks', 60, NULL, false, 5),
('Homemade Lavender Tea', 'ชาลาเวนเดอร์โฮมเมด', NULL, NULL, 'drinks', 60, NULL, false, 6),
('Homemade Safflower Tea', 'ชาดอกคำฝอยโฮมเมด', NULL, NULL, 'drinks', 60, NULL, false, 7),
('Fresh Juice', 'น้ำผลไม้สดตามฤดูกาล', 'Seasonal fresh juice', NULL, 'drinks', 80, NULL, false, 8);

-- BEERS
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Chang 62cl', 'ช้าง 62cl', NULL, NULL, 'beers', 99, NULL, false, 1),
('Leo 62cl', 'ลีโอ 62cl', NULL, NULL, 'beers', 110, NULL, false, 2),
('Singha 62cl', 'สิงห์ 62cl', NULL, NULL, 'beers', 120, NULL, false, 3),
('Asahi 49cl', 'อาซาฮี 49cl', NULL, NULL, 'beers', 130, NULL, false, 4);

-- COFFEE (base price = hot; price_variant.iced = iced price; *oat milk +20 baht, category note, not modeled)
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Espresso', 'เอสเปรสโซ่', NULL, NULL, 'coffee', 50, '{"iced": 60}', false, 1),
('Americano', 'อเมริกาโน่', NULL, NULL, 'coffee', 55, '{"iced": 60}', false, 2),
('Cappuccino', 'คาปูชิโน่', NULL, NULL, 'coffee', 65, '{"iced": 70}', false, 3),
('Latte', 'ลาเต้', NULL, NULL, 'coffee', 65, '{"iced": 70}', false, 4),
('Chocolate', 'ช็อกโกแลต', NULL, NULL, 'coffee', 75, '{"iced": 80}', false, 5),
('Matcha Latte', 'มัทฉะ ลาเต้', NULL, NULL, 'coffee', 75, '{"iced": 80}', false, 6);

-- LIQUORI
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Grappa Moscato', 'กราปปา มอสกาโต', NULL, NULL, 'liquori', 99, NULL, false, 1),
('Limoncello', 'ลิมอนเชลโล', NULL, NULL, 'liquori', 99, NULL, false, 2);

COMMIT;

-- ===== Task 6: photo assignments (paths served from web/public/menu/) =====
-- Run as a separate statement batch AFTER the seed above has committed.
-- Andreas: run this block in the Supabase SQL Editor once the seed is live.

-- BAKERY
UPDATE products SET image_url = '/menu/pagnotta-500g.webp' WHERE name_en = 'Pagnotta 500g' AND category = 'bakery';
UPDATE products SET image_url = '/menu/baguette-200g.webp' WHERE name_en = 'Baguette 200g' AND category = 'bakery';
UPDATE products SET image_url = '/menu/rosemary-focaccia.webp' WHERE name_en = 'Rosemary Focaccia' AND category = 'bakery';

-- STARTERS
UPDATE products SET image_url = '/menu/bruschetta-tomato.webp' WHERE name_en = 'Bruschetta Tomato' AND category = 'starters';
UPDATE products SET image_url = '/menu/mozzarella-filled-potato-balls.webp' WHERE name_en = 'Mozzarella-Filled Potato Balls' AND category = 'starters';
UPDATE products SET image_url = '/menu/bruschetta-olive-dry-tomato.webp' WHERE name_en = 'Bruschetta Olive & Dry Tomato' AND category = 'starters';
UPDATE products SET image_url = '/menu/cold-cuts-cheese-platter.webp' WHERE name_en = 'Cold Cuts & Cheese Platter (2 Person)' AND category = 'starters';
UPDATE products SET image_url = '/menu/caprese-starters.webp' WHERE name_en = 'Caprese' AND category = 'starters';
UPDATE products SET image_url = '/menu/bruschetta-parma-ham.webp' WHERE name_en = 'Bruschetta Parma Ham' AND category = 'starters';

-- PASTA
UPDATE products SET image_url = '/menu/penne-arrabbiata.webp' WHERE name_en = 'Penne Arrabbiata' AND category = 'pasta';
UPDATE products SET image_url = '/menu/penne-amatriciana.webp' WHERE name_en = 'Penne Amatriciana' AND category = 'pasta';
UPDATE products SET image_url = '/menu/pasta-pesto.webp' WHERE name_en = 'Pasta Pesto' AND category = 'pasta';
UPDATE products SET image_url = '/menu/pasta-clams.webp' WHERE name_en = 'Pasta Clams' AND category = 'pasta';
UPDATE products SET image_url = '/menu/spaghetti-carbonara.webp' WHERE name_en = 'Spaghetti Carbonara' AND category = 'pasta';
UPDATE products SET image_url = '/menu/pasta-bolognese.webp' WHERE name_en = 'Pasta Bolognese' AND category = 'pasta';
UPDATE products SET image_url = '/menu/tagliatelle-sea-food.webp' WHERE name_en = 'Tagliatelle Sea Food' AND category = 'pasta';

-- FRESH_PASTA
UPDATE products SET image_url = '/menu/tagliatelle.webp' WHERE name_en = 'Tagliatelle' AND category = 'fresh_pasta';
UPDATE products SET image_url = '/menu/tortelli-spinach-ricotta.webp' WHERE name_en = 'Tortelli Spinach-Ricotta' AND category = 'fresh_pasta';
UPDATE products SET image_url = '/menu/cannelloni-spinach-ricotta.webp' WHERE name_en = 'Cannelloni Spinach-Ricotta' AND category = 'fresh_pasta';
UPDATE products SET image_url = '/menu/lasagna.webp' WHERE name_en = 'Lasagna' AND category = 'fresh_pasta';

-- MAIN
UPDATE products SET image_url = '/menu/cotoletta-milanese.webp' WHERE name_en = 'Cotoletta Milanese' AND category = 'main';
UPDATE products SET image_url = '/menu/meatballs-in-tomato-sauce.webp' WHERE name_en = 'Meatballs in Tomato Sauce' AND category = 'main';
UPDATE products SET image_url = '/menu/italian-sausage.webp' WHERE name_en = 'Italian Sausage' AND category = 'main';
UPDATE products SET image_url = '/menu/beef-tagliata.webp' WHERE name_en = 'Beef Tagliata' AND category = 'main';
UPDATE products SET image_url = '/menu/saute-sea-food.webp' WHERE name_en = 'Sauté Sea Food' AND category = 'main';

-- SALADS
UPDATE products SET image_url = '/menu/beetroot-salad.webp' WHERE name_en = 'Beetroot Salad' AND category = 'salads';
UPDATE products SET image_url = '/menu/italian-salad.webp' WHERE name_en = 'Italian Salad' AND category = 'salads';
UPDATE products SET image_url = '/menu/parma-ham-melon.webp' WHERE name_en = 'Parma Ham & Melon' AND category = 'salads';

-- CLASSIC_PIZZA
UPDATE products SET image_url = '/menu/bugs-bunny.webp' WHERE name_en = 'Bugs Bunny' AND category = 'classic_pizza';
UPDATE products SET image_url = '/menu/siciliana.webp' WHERE name_en = 'Siciliana' AND category = 'classic_pizza';

-- SPECIAL_PIZZA
UPDATE products SET image_url = '/menu/avocado-pizza.webp' WHERE name_en = 'Avocado' AND category = 'special_pizza';
UPDATE products SET image_url = '/menu/carbonara-pizza.webp' WHERE name_en = 'Carbonara' AND category = 'special_pizza';
UPDATE products SET image_url = '/menu/speciale.webp' WHERE name_en = 'Speciale' AND category = 'special_pizza';
UPDATE products SET image_url = '/menu/marlon-brando.webp' WHERE name_en = 'Marlon Brando' AND category = 'special_pizza';
UPDATE products SET image_url = '/menu/reggiana.webp' WHERE name_en = 'Reggiana' AND category = 'special_pizza';

-- DESSERT
UPDATE products SET image_url = '/menu/fruit-salad.webp' WHERE name_en = 'Fruit Salad' AND category = 'dessert';
UPDATE products SET image_url = '/menu/tiramisu.webp' WHERE name_en = 'Tiramisù' AND category = 'dessert';

-- BEERS
UPDATE products SET image_url = '/menu/chang-62cl.webp' WHERE name_en = 'Chang 62cl' AND category = 'beers';

-- COFFEE
UPDATE products SET image_url = '/menu/espresso.webp' WHERE name_en = 'Espresso' AND category = 'coffee';

-- ============================================================================
-- 2026-07-05 Menu tweaks (Angela + Andreas)
-- ============================================================================
-- Dried pasta: customer chooses the shape (spaghetti / fusilli / penne), same price.
UPDATE products SET price_variant = '{"spaghetti":159,"fusilli":159,"penne":159}' WHERE name_en = 'Penne Arrabbiata'  AND category = 'pasta';
UPDATE products SET price_variant = '{"spaghetti":189,"fusilli":189,"penne":189}' WHERE name_en = 'Penne Amatriciana' AND category = 'pasta';
UPDATE products SET price_variant = '{"spaghetti":189,"fusilli":189,"penne":189}' WHERE name_en = 'Pasta Pesto'       AND category = 'pasta';
UPDATE products SET price_variant = '{"spaghetti":199,"fusilli":199,"penne":199}' WHERE name_en = 'Pasta Clams'       AND category = 'pasta';
UPDATE products SET price_variant = '{"spaghetti":199,"fusilli":199,"penne":199}' WHERE name_en = 'Spaghetti Carbonara' AND category = 'pasta';
UPDATE products SET price_variant = '{"spaghetti":199,"fusilli":199,"penne":199}' WHERE name_en = 'Pasta Bolognese'   AND category = 'pasta';

-- Vegan option (+20฿) on selected dishes.
UPDATE products SET price_variant = '{"vegan":259}' WHERE name_en = 'Cannelloni Spinach-Ricotta' AND category = 'fresh_pasta';
UPDATE products SET price_variant = '{"vegan":279}' WHERE name_en = 'Lasagna'                     AND category = 'fresh_pasta';
UPDATE products SET price_variant = '{"vegan":250}' WHERE name_en = 'Meatballs in Tomato Sauce'   AND category = 'main';
