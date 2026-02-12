-- Treecoma x Ban Passarelli — Database Schema

-- Product categories
CREATE TYPE product_category AS ENUM (
  'starters',
  'pasta',
  'main',
  'sides',
  'classic_pizza',
  'special_pizza',
  'premium_pizza',
  'calzoni',
  'panini',
  'dessert',
  'drinks',
  'beers',
  'coffee',
  'cannabis'
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description_en TEXT,
  description_th TEXT,
  category product_category NOT NULL,
  price INTEGER NOT NULL, -- in THB (satang not needed)
  price_variant JSONB, -- e.g. {"hot": 60, "iced": 65} or {"with_ragu": 169}
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_seasonal BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cannabis inquiries
CREATE TABLE cannabis_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  product_id UUID REFERENCES products(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Customers
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  order_type TEXT NOT NULL CHECK (order_type IN ('pickup', 'delivery')),
  delivery_address TEXT,
  notes TEXT,
  total INTEGER NOT NULL, -- in THB
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) NOT NULL,
  name_snapshot TEXT NOT NULL, -- frozen product name at time of order
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  variant TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_cannabis_inquiries_status ON cannabis_inquiries(status);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cannabis_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

-- Public insert for cannabis inquiries (anyone can submit)
CREATE POLICY "Anyone can submit cannabis inquiries"
  ON cannabis_inquiries FOR INSERT WITH CHECK (true);

-- Authenticated admin can do everything
CREATE POLICY "Admin full access on products"
  ON products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on cannabis_inquiries"
  ON cannabis_inquiries FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on customers"
  ON customers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on orders"
  ON orders FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access on order_items"
  ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- Public can create customers and orders (for checkout)
CREATE POLICY "Public can create customers"
  ON customers FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create orders"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can create order items"
  ON order_items FOR INSERT WITH CHECK (true);

-- Public can read their own order by order number (via function)
CREATE POLICY "Public can view orders"
  ON orders FOR SELECT USING (true);

CREATE POLICY "Public can view order items"
  ON order_items FOR SELECT USING (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
