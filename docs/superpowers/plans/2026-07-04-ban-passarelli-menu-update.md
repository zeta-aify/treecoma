# Ban Passarelli Menu Update — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Ban Passarelli food menu on the website with the new PDF menu, served from Supabase as a fast, bilingual (EN/TH), photo-rich, searchable page that the family can edit from `/admin/products`.

**Architecture:** Supabase `products` becomes the single source of truth. A DB migration adds new category enum values and re-seeds all food products (full EN/TH text, prices, variants, photos). The public menu page (`/[locale]/menu`) is rewired from the static `menu-data.ts` array to a cached (ISR) Supabase read. `MenuItemCard` gains a photo thumbnail; each section gets a hero image and there is a "Download full menu (PDF)" button. Dish photos are extracted from the PDF, optimized to WebP, and served from `web/public/menu/`.

**Tech Stack:** Next.js 16 (App Router, RSC), next-intl, Supabase (`@supabase/ssr`), Tailwind v4, Next/Image. macOS tooling: `pdfimages`, `pdftoppm`, `sips` (all confirmed available).

## Global Constraints

- **No test framework exists** in `web/`. The verify cycle for every task is: `npx tsc --noEmit` (typecheck), `npm run lint`, and `npm run build` as applicable, plus the seed-integrity Node script (Task 3) and a final visual check on a Vercel preview. Do **not** add a test framework.
- **Working directory for all `npm`/`npx` commands is `web/`.**
- All prices are integer THB (no decimals), stored in `products.price` and `products.price_variant` (JSONB).
- Every product needs both `name_en` and `name_th` (NOT NULL). Descriptions (`description_en`, `description_th`) are filled from the PDF where present.
- **Source of truth for content:** the new PDF at `/Users/andreasfranlund/Downloads/New menù Ban Passarelli .pdf`. A plain-text extraction is committed at `docs/superpowers/plans/menu-pdf-text-reference.txt` — use it as the transcription source, but verify prices and Thai strings against the PDF pages (render with `pdftoppm` when in doubt).
- **Approval gate:** external-facing content requires family sign-off. Ship to a Vercel **preview** deploy first (Task 8); only promote to production after approval.
- Commit after every task. Branch: `menu-update` (create off `main`).
- `cannabis` category and page are OUT OF SCOPE — do not touch.

---

## File Structure

- `web/supabase/migrations/2026-07-04-menu-refresh.sql` — **Create.** Enum additions + full product re-seed.
- `web/src/lib/types.ts` — **Modify.** Add `bakery`, `fresh_pasta`, `salads`, `liquori` to `ProductCategory`, `FOOD_CATEGORIES` (display order), `CATEGORY_KEYS`.
- `web/messages/{en,th,it}.json` — **Modify.** New category labels + PDF-download + bakery-note strings.
- `web/src/lib/menu.ts` — **Create.** `getMenuProducts()` server helper (Supabase read + fallback).
- `web/src/app/[locale]/menu/page.tsx` — **Modify.** RSC reading Supabase via helper; ISR; hero images; category nav; PDF button.
- `web/src/components/MenuItemCard.tsx` — **Modify.** Optional photo thumbnail.
- `web/src/lib/menu-data.ts` — **Modify.** Kept only as typed fallback (re-exported by helper); no longer imported by the page.
- `web/public/menu/*.webp` — **Create.** Optimized dish + section-hero photos.
- `web/public/ban-passarelli-menu.pdf` — **Create.** Compressed downloadable menu.
- `web/scripts/validate-menu-seed.mjs` — **Create.** Seed-integrity checker.

---

## Task 1: Category foundation (types + i18n)

Adds the four new categories everywhere the type system and UI enumerate categories, so later tasks compile.

**Files:**
- Modify: `web/src/lib/types.ts`
- Modify: `web/messages/en.json`, `web/messages/th.json`, `web/messages/it.json`

**Interfaces:**
- Produces: `ProductCategory` now includes `"bakery" | "fresh_pasta" | "salads" | "liquori"`. `FOOD_CATEGORIES` array in new display order (see spec table). `CATEGORY_KEYS` maps each to a camelCase i18n key: `bakery→bakery`, `fresh_pasta→freshPasta`, `salads→salads`, `liquori→liquori`.

- [ ] **Step 1: Add categories to the `ProductCategory` union** in `web/src/lib/types.ts` (lines 1-15). Insert `"bakery"` before `"starters"`, `"fresh_pasta"` after `"pasta"`, `"salads"` after `"main"`, and `"liquori"` after `"coffee"`:

```ts
export type ProductCategory =
  | "bakery"
  | "starters"
  | "pasta"
  | "fresh_pasta"
  | "main"
  | "salads"
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
  | "liquori"
  | "cannabis";
```

- [ ] **Step 2: Update `FOOD_CATEGORIES`** (currently lines 89-103) to the new display order (drop `premium_pizza` from display — it is deprecated but kept in the type):

```ts
export const FOOD_CATEGORIES: ProductCategory[] = [
  "bakery",
  "starters",
  "pasta",
  "fresh_pasta",
  "main",
  "salads",
  "sides",
  "classic_pizza",
  "special_pizza",
  "calzoni",
  "panini",
  "dessert",
  "drinks",
  "beers",
  "coffee",
  "liquori",
];
```

- [ ] **Step 3: Update `CATEGORY_KEYS`** (currently lines 149-164) to include all keys (keep `premium_pizza` and `cannabis`):

```ts
export const CATEGORY_KEYS: Record<ProductCategory, string> = {
  bakery: "bakery",
  starters: "starters",
  pasta: "pasta",
  fresh_pasta: "freshPasta",
  main: "main",
  salads: "salads",
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
  liquori: "liquori",
  cannabis: "cannabis",
};
```

- [ ] **Step 4: Add category labels + new strings to each locale.** In `web/messages/en.json`, inside `menu.categories` add:

```json
"bakery": "Artisan Bakery",
"freshPasta": "Fresh Homemade Pasta",
"salads": "Refreshing & Light",
"liquori": "Liquori"
```

and inside `menu` (sibling of `categories`) add:

```json
"downloadPdf": "Download full menu (PDF)",
"bakeryNote": "Freshly baked daily (subject to availability) · Frozen available · Pre-order fresh bread & focaccia for your chosen date"
```

In `web/messages/th.json` add the same keys with Thai values:

```json
"bakery": "เบเกอรี",
"freshPasta": "พาสต้าโฮมเมด",
"salads": "จานเบา ๆ สดชื่น",
"liquori": "เหล้า"
```
```json
"downloadPdf": "ดาวน์โหลดเมนูฉบับเต็ม (PDF)",
"bakeryNote": "อบสดใหม่ทุกวัน (ขึ้นอยู่กับสินค้าแต่ละวัน) · มีสินค้าแช่แข็ง · สั่งจองขนมปังและฟอคคาเซียล่วงหน้าได้"
```

In `web/messages/it.json` add:

```json
"bakery": "Panetteria Artigianale",
"freshPasta": "Pasta Fresca",
"salads": "Piatti Freschi & Leggeri",
"liquori": "Liquori"
```
```json
"downloadPdf": "Scarica il menù completo (PDF)",
"bakeryNote": "Sfornato fresco ogni giorno (secondo disponibilità) · Disponibile surgelato · Prenota pane e focaccia freschi per la data che preferisci"
```

- [ ] **Step 5: Verify** — from `web/`: `npx tsc --noEmit` → Expected: PASS (no errors). Note: `menu-data.ts` and admin still compile because all category values remain valid.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/types.ts web/messages/en.json web/messages/th.json web/messages/it.json
git commit -m "Add bakery, fresh_pasta, salads, liquori menu categories"
```

---

## Task 2: Supabase enum migration

Adds the new enum values to the live database so the seed (Task 3) can insert them. Postgres requires enum additions in their own transaction before use.

**Files:**
- Create: `web/supabase/migrations/2026-07-04-menu-refresh.sql` (this task writes only the enum block; Task 3 appends the seed to a separate section/file)

**Interfaces:**
- Produces: `product_category` enum in Supabase now accepts `bakery`, `fresh_pasta`, `salads`, `liquori`.

- [ ] **Step 1: Create the migration file** `web/supabase/migrations/2026-07-04-menu-refresh.sql` with the enum additions at the top:

```sql
-- 2026-07-04 Menu refresh: new categories + full Ban Passarelli re-seed
-- Run in Supabase SQL Editor (or `supabase db execute`). Enum values must be
-- committed before they can be used by the INSERTs in seed section below.

ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'bakery';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'fresh_pasta';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'salads';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'liquori';

-- (seed section added in Task 3, run as a SEPARATE statement batch after the
--  ALTER TYPE statements above have committed)
```

- [ ] **Step 2: Apply the enum block to Supabase.** This needs elevated DB access (the app has only the anon key). Ask Andreas to run this block in the **Supabase Dashboard → SQL Editor** (project for this site), or, if the Supabase CLI is linked, run it via CLI. Do not proceed to Task 3's apply step until this has committed.

Verification query to run in the SQL editor after applying:
```sql
SELECT unnest(enum_range(NULL::product_category));
```
Expected: the result list includes `bakery`, `fresh_pasta`, `salads`, `liquori`.

- [ ] **Step 3: Commit**

```bash
git add web/supabase/migrations/2026-07-04-menu-refresh.sql
git commit -m "Add Supabase migration: new menu category enum values"
```

---

## Task 3: Full menu seed + integrity validation

Transcribes the entire new menu into the migration's seed section and inserts it into Supabase. This is the largest and highest-risk task — prices and Thai text must match the PDF exactly.

**Files:**
- Modify: `web/supabase/migrations/2026-07-04-menu-refresh.sql` (append seed section)
- Create: `web/scripts/validate-menu-seed.mjs`

**Interfaces:**
- Consumes: enum values from Task 2; `image_url` paths that Task 6 will populate (`/menu/<slug>.webp`). It is fine to seed `image_url = NULL` here and fill photos in Task 6 via UPDATE, OR set the paths now and let Task 6 create the files — this plan sets known photo paths now (see Step 3) and leaves the rest NULL.
- Produces: a fully populated `products` table for all food categories.

- [ ] **Step 1: Transcribe the menu.** Using `docs/superpowers/plans/menu-pdf-text-reference.txt` as the base and the PDF pages for verification, append to the migration file a seed section that first clears existing food products, then inserts the new ones. Structure (pattern — repeat per category, filling every item from the reference file):

```sql
-- ===== SEED (run after ALTER TYPE has committed) =====
BEGIN;

-- Remove existing FOOD products only; leave cannabis untouched.
DELETE FROM products WHERE category <> 'cannabis';

-- sort_order increments within each category in menu order.
-- price_variant JSONB used where the PDF lists options.

-- BAKERY
INSERT INTO products (name_en, name_th, description_en, description_th, category, price, price_variant, is_seasonal, sort_order) VALUES
('Pagnotta 500g', 'พาน็อตต้า 500g', NULL, NULL, 'bakery', 100, NULL, false, 1),
('Baguette 200g', 'บาแก็ต 200g', NULL, NULL, 'bakery', 50, NULL, false, 2),
('Rosemary Focaccia', 'ฟอคคาเซีย โรสแมรี', 'Single piece / tray of 6', 'ชิ้นเดียว / ถาด 6 ชิ้น', 'bakery', 60, '{"tray_6": 300}', false, 3),
('Cherry Tomato or Potato Focaccia', 'ฟอคคาเซีย มะเขือเทศเชอร์รีหรือมันฝรั่ง', 'Single piece / tray of 4', 'ชิ้นเดียว / ถาด 4 ชิ้น', 'bakery', 80, '{"tray_4": 300}', false, 4);

-- STARTERS (verify prices: garlic 49, tomato 69, olive&dry-tomato 99,
--   mozzarella potato balls 99, Parma Ham bruschetta 120, Caprese 150,
--   Cold cuts & cheese platter 2p 339)
-- PASTA ("choose your pasta": spaghetti/fusilli/penne — Arrabbiata 159,
--   Amatriciana 189, Pesto 189, Clams 199, Carbonara 199, Bolognese 199,
--   Tagliatelle Sea Food 269)
-- FRESH_PASTA (Tagliatelle: tomato 219/pesto 229/bolognese 239;
--   Gnocchi: pesto 229/bolognese 239/blue cheese 249;
--   Tortelli spinach-ricotta: butter-salvia 229/bolognese 249;
--   Cannelloni spinach-ricotta 239; Lasagna 259)
-- MAIN (Cotoletta Milanese 220, Meatballs in tomato sauce 230,
--   Italian Sausage 230, Beef Tagliata 419)
-- SALADS (Beetroot salad 180, Italian salad 199, Parma Ham & Melon 220)
-- SIDES (Green salad 40, French fries 50, Baked potatoes 60,
--   Grilled vegetable 70, Sautéed spinach 70)  [Sauté Sea Food 339 -> keep in 'main' or 'sides'? PDF places it as a dish; put in 'main']
-- CLASSIC_PIZZA (Marinara 180, Margherita 200, Bugs Bunny 230, Diavola 240,
--   Napoli 250, Sausage & onion 250, Siciliana 260, Four season 260,
--   Four cheese 260, Sea food 299)  note: "+50 vegan mozzarella / +40 double crust" as a category note, not per-item
-- SPECIAL_PIZZA (Avocado 240 is_seasonal=true, Patbon 240, Hawaiian 240,
--   Carbonara 260, Speciale 279, Rock 299, Gitana 299, Pizman 299,
--   Reggiana 320, Marlon Brando 320, 8G 349)
-- CALZONI (Classic 240, Filled 270, Roger 320, "Choose your calzone" 220)
-- PANINI (Veggie gourmet 140, Avocado 150, Ham & cheese 160, Italian salami 170,
--   Caprese 170, Sausage 180, Parma ham 200)
-- DESSERT (Fruit salad 69, Energy bar 2pcs 89, Chocolate cake 99,
--   Panna cotta 99, Semi frozen cake 120, Tiramisù 120)
-- DRINKS (Mineral water 20, Soda water 20, Coca Cola 30, Schweppes zero lime 35,
--   Lime & honey tea 60, Lavender tea 60, Safflower tea 60, Fresh juice 80)
-- BEERS (Chang 62cl 99, Leo 62cl 110, Singha 62cl 120, Asahi 49cl 130)
-- COFFEE (Espresso 50/60, Americano 55/60, Cappuccino 65/70, Latte 65/70,
--   Chocolate 75/80, Matcha latte 75/80 — hot base price + price_variant {"iced": N}; note oat milk +20)
-- LIQUORI (Grappa Moscato 99, Limoncello 99)

COMMIT;
```

Fill in **every** item as full `INSERT` rows following the BAKERY example, copying EN name, TH name, EN description, TH description verbatim from the reference/PDF. Prices above are the verification checklist — cross-check each against the PDF page before committing.

- [ ] **Step 2: Write the integrity validator** `web/scripts/validate-menu-seed.mjs`. It parses the migration SQL and asserts structural expectations so transcription slips are caught before applying:

```js
// Usage: node scripts/validate-menu-seed.mjs
import { readFileSync } from "node:fs";

const sql = readFileSync(
  new URL("../supabase/migrations/2026-07-04-menu-refresh.sql", import.meta.url),
  "utf8",
);

// Expected item count per category (from the PDF). Adjust if the family adds/removes.
const EXPECTED = {
  bakery: 4, starters: 7, pasta: 7, fresh_pasta: 5, main: 4, salads: 3,
  sides: 5, classic_pizza: 10, special_pizza: 11, calzoni: 4, panini: 7,
  dessert: 6, drinks: 8, beers: 4, coffee: 6, liquori: 2,
};

// Match INSERT ... VALUES rows and count by the category literal in each row.
const rows = sql.match(/\('(?:[^']|'')*'.*?\)/gs) || [];
const counts = {};
let priceErrors = [];
for (const row of rows) {
  const cat = (row.match(/'(bakery|starters|pasta|fresh_pasta|main|salads|sides|classic_pizza|special_pizza|premium_pizza|calzoni|panini|dessert|drinks|beers|coffee|liquori)'/) || [])[1];
  if (!cat) continue;
  counts[cat] = (counts[cat] || 0) + 1;
  // price is the integer right after the category literal
  const m = row.match(new RegExp(`'${cat}',\\s*(\\d+)`));
  if (m) {
    const price = Number(m[1]);
    if (price < 20 || price > 500) priceErrors.push(`${cat}: suspicious price ${price}`);
  }
}

let ok = true;
for (const [cat, want] of Object.entries(EXPECTED)) {
  const got = counts[cat] || 0;
  if (got !== want) { ok = false; console.error(`✗ ${cat}: expected ${want}, got ${got}`); }
  else console.log(`✓ ${cat}: ${got}`);
}
if (priceErrors.length) { ok = false; priceErrors.forEach((e) => console.error("✗ " + e)); }
if (!ok) { console.error("\nSeed validation FAILED"); process.exit(1); }
console.log("\nSeed validation PASSED");
```

- [ ] **Step 3: Run the validator** — from `web/`: `node scripts/validate-menu-seed.mjs`. Expected: all `✓`, then `Seed validation PASSED`. If a count is off, fix the seed (missing/extra row) until it passes.

- [ ] **Step 4: Apply the seed to Supabase.** Ask Andreas to run the SEED section (everything from `BEGIN;` to `COMMIT;`) in the **Supabase SQL Editor**, as a separate run *after* Task 2's `ALTER TYPE` has committed. Verify:
```sql
SELECT category, count(*) FROM products WHERE category <> 'cannabis' GROUP BY category ORDER BY category;
```
Expected: counts match the `EXPECTED` map above.

- [ ] **Step 5: Commit**

```bash
git add web/supabase/migrations/2026-07-04-menu-refresh.sql web/scripts/validate-menu-seed.mjs
git commit -m "Add full Ban Passarelli menu seed + integrity validator"
```

---

## Task 4: Server-side menu read (Supabase + fallback)

Introduces a single server helper so the page (Task 5) reads from Supabase with a safe fallback, keeping data-access isolated from rendering.

**Files:**
- Create: `web/src/lib/menu.ts`
- Modify: `web/src/lib/menu-data.ts` (no code change needed; it stays as the fallback export)

**Interfaces:**
- Consumes: `createClient` from `@/lib/supabase/server`; `menuData` from `@/lib/menu-data`; `Product` from `@/lib/types`.
- Produces: `export async function getMenuProducts(): Promise<Product[]>` — returns available products ordered by category then sort_order; falls back to `menuData` if the query errors or returns empty.

- [ ] **Step 1: Create `web/src/lib/menu.ts`:**

```ts
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
```

- [ ] **Step 2: Verify** — from `web/`: `npx tsc --noEmit` → Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add web/src/lib/menu.ts
git commit -m "Add getMenuProducts server helper (Supabase read + fallback)"
```

---

## Task 5: Rewire the menu page to Supabase (ISR)

Converts the page from the static array to the cached Supabase read, and adds the category nav + PDF button. Hero images are added in Task 7 (after the images exist).

**Files:**
- Modify: `web/src/app/[locale]/menu/page.tsx`

**Interfaces:**
- Consumes: `getMenuProducts` from `@/lib/menu`; existing `FOOD_CATEGORIES`, `CATEGORY_KEYS`, `MenuItemCard`.
- Produces: server-rendered, ISR-cached menu grouped by `FOOD_CATEGORIES`.

- [ ] **Step 1: Replace the file** `web/src/app/[locale]/menu/page.tsx` with an async RSC that fetches from Supabase. Because `useTranslations` (React hook) cannot run in an async server component, use `getTranslations` from `next-intl/server`:

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getMenuProducts } from "@/lib/menu";
import { FOOD_CATEGORIES, CATEGORY_KEYS } from "@/lib/types";
import type { ProductCategory, Product } from "@/lib/types";
import MenuItemCard from "@/components/MenuItemCard";

// ISR: cache the page, re-fetch products at most every 5 minutes.
export const revalidate = 300;

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("menu");
  const products = await getMenuProducts();

  const grouped = FOOD_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = products.filter((p) => p.category === cat);
      return acc;
    },
    {} as Record<ProductCategory, Product[]>,
  );

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl sm:text-5xl text-forest mb-3">
            {t("title")}
          </h1>
          <p className="text-charcoal-light">{t("subtitle")}</p>
          <a
            href="/ban-passarelli-menu.pdf"
            className="inline-block mt-5 text-sm px-4 py-2 rounded-full border border-forest text-forest hover:bg-forest hover:text-white transition-colors"
          >
            {t("downloadPdf")}
          </a>
        </div>

        <nav className="flex flex-wrap justify-center gap-2 mb-10 sticky top-0 bg-cream/90 backdrop-blur py-3 z-10">
          {FOOD_CATEGORIES.filter((cat) => grouped[cat]?.length).map((cat) => (
            <a
              key={cat}
              href={`#${cat}`}
              className="text-sm px-3 py-1.5 rounded-full bg-cream-dark text-charcoal-light hover:bg-forest hover:text-white transition-colors"
            >
              {t(`categories.${CATEGORY_KEYS[cat]}`)}
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {FOOD_CATEGORIES.map((cat) => {
            const items = grouped[cat];
            if (!items?.length) return null;
            return (
              <section key={cat} id={cat} className="scroll-mt-20">
                <h2 className="font-heading text-2xl text-forest mb-4 pb-2 border-b-2 border-terracotta/30">
                  {t(`categories.${CATEGORY_KEYS[cat]}`)}
                </h2>
                {cat === "bakery" && (
                  <p className="text-xs text-charcoal-light mb-3">{t("bakeryNote")}</p>
                )}
                <div>
                  {items.map((product) => (
                    <MenuItemCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build** — from `web/`: `npx tsc --noEmit` then `npm run build`. Expected: both PASS. (Build will read Supabase using env vars from `.env.local`; if the DB isn't reachable at build time the fallback returns `menuData`, so the build still succeeds.)

- [ ] **Step 3: Visual check** — from `web/`: `npm run dev`, open `http://localhost:3000/en/menu` and `http://localhost:3000/th/menu`. Expected: all seeded categories render with EN/TH names, descriptions, prices, variant chips; category nav jumps to sections; "Download full menu (PDF)" button shows (link 404s until Task 6 — that's fine).

- [ ] **Step 4: Commit**

```bash
git add "web/src/app/[locale]/menu/page.tsx"
git commit -m "Rewire menu page to read from Supabase with ISR"
```

---

## Task 6: Image pipeline (dish photos, section heroes, PDF download)

Extracts and optimizes photos from the PDF and produces the compressed downloadable PDF. Populates `image_url` for the dishes that have photos.

**Files:**
- Create: `web/public/menu/*.webp`
- Create: `web/public/ban-passarelli-menu.pdf`
- Modify: `web/supabase/migrations/2026-07-04-menu-refresh.sql` (append `UPDATE` statements setting `image_url` for photographed dishes)

**Interfaces:**
- Consumes: the source PDF at `/Users/andreasfranlund/Downloads/New menù Ban Passarelli .pdf`.
- Produces: WebP files under `/menu/`, referenced by `products.image_url` as `/menu/<slug>.webp`; section-hero files named `/menu/hero-<category>.webp`.

- [ ] **Step 1: Extract embedded photos** to a scratch dir:

```bash
cd /tmp && rm -rf bp-imgs && mkdir bp-imgs
pdfimages -j "/Users/andreasfranlund/Downloads/New menù Ban Passarelli .pdf" bp-imgs/x
```

- [ ] **Step 2: Identify real dish photos** (ignore the repeated parchment background and small badges). Inspect candidates by size; dish photos are typically 300–500 px wide JPEGs. Select the clearest photo per dish that has one, and at least one strong photo per major section for heroes.

- [ ] **Step 3: Optimize to WebP** into `web/public/menu/` using `sips` (macOS). For each chosen file, resize and convert. Dish thumbnails ~600px, hero images ~1200px wide:

```bash
mkdir -p web/public/menu
# dish thumbnail example:
sips -Z 600 -s format webp /tmp/bp-imgs/x-020.jpg --out web/public/menu/penne-bolognese.webp
# hero example:
sips -Z 1200 -s format webp /tmp/bp-imgs/x-022.jpg --out web/public/menu/hero-pasta.webp
```
Name each file after the dish slug (kebab-case of the EN name) or `hero-<category>.webp`. Keep each dish thumb under ~80 KB and heroes under ~200 KB (re-run with a smaller `-Z` if larger).

- [ ] **Step 4: Compress the downloadable PDF** to `web/public/ban-passarelli-menu.pdf` (target < 5 MB). If Ghostscript is available:

```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
  -dNOPAUSE -dQUIET -dBATCH \
  -sOutputFile=web/public/ban-passarelli-menu.pdf \
  "/Users/andreasfranlund/Downloads/New menù Ban Passarelli .pdf"
ls -la web/public/ban-passarelli-menu.pdf
```
If `gs` is not installed, install via `brew install ghostscript`, or as a fallback render pages to images and re-assemble; if neither is practical, copy the original and note the size for follow-up:
```bash
cp "/Users/andreasfranlund/Downloads/New menù Ban Passarelli .pdf" web/public/ban-passarelli-menu.pdf
```

- [ ] **Step 5: Append `image_url` updates** to the migration file so re-running the seed keeps photos in sync. One `UPDATE` per photographed dish, matched by `name_en`:

```sql
-- Photo assignments (paths served from web/public/menu/)
UPDATE products SET image_url = '/menu/penne-bolognese.webp' WHERE name_en = 'Penne Bolognese' AND category = 'pasta';
-- ...repeat for each dish that has a photo file...
```
Ask Andreas to run these `UPDATE`s in the Supabase SQL Editor (same elevated access as Task 3).

- [ ] **Step 6: Verify** — the files exist and are reasonably sized:
```bash
ls -la web/public/menu/ && ls -la web/public/ban-passarelli-menu.pdf
```
Expected: WebP files present, each dish < ~80 KB, heroes < ~200 KB; PDF present (< 5 MB ideally).

- [ ] **Step 7: Commit**

```bash
git add web/public/menu web/public/ban-passarelli-menu.pdf web/supabase/migrations/2026-07-04-menu-refresh.sql
git commit -m "Add optimized menu photos, section heroes, and downloadable PDF"
```

---

## Task 7: Photo rendering (card thumbnails + section heroes)

Wires the images into the UI: a thumbnail on cards that have a photo, and a hero image atop each section that has one.

**Files:**
- Modify: `web/src/components/MenuItemCard.tsx`
- Modify: `web/src/app/[locale]/menu/page.tsx`

**Interfaces:**
- Consumes: `product.image_url` (string | null); hero files `/menu/hero-<category>.webp`.
- Produces: card renders an optimized thumbnail when `image_url` is set; each section optionally renders a hero.

- [ ] **Step 1: Add a thumbnail to `MenuItemCard`.** Import `Image` from `next/image` and render it before the text block when `product.image_url` is present. Insert at the top of the returned `<div className="flex items-center ...">`:

```tsx
import Image from "next/image";
// ...
{product.image_url && (
  <Image
    src={product.image_url}
    alt={name}
    width={56}
    height={56}
    className="w-14 h-14 rounded-lg object-cover shrink-0"
  />
)}
```
(Place this as the first child inside the outer flex container, before the `flex-1` text div.)

- [ ] **Step 2: Add optional section heroes in the page.** In `web/src/app/[locale]/menu/page.tsx`, define the set of categories that have a hero file and render an `Image` above the `<h2>` inside each `<section>`. Near the top of the file add:

```tsx
import Image from "next/image";

const HERO_CATEGORIES = new Set<ProductCategory>([
  "starters", "pasta", "classic_pizza", "special_pizza",
]);
```
Then inside the `<section>` render, before the `<h2>`:

```tsx
{HERO_CATEGORIES.has(cat) && (
  <div className="relative w-full h-40 sm:h-52 rounded-xl overflow-hidden mb-4">
    <Image
      src={`/menu/hero-${cat}.webp`}
      alt=""
      fill
      sizes="(max-width: 768px) 100vw, 768px"
      className="object-cover"
    />
  </div>
)}
```
Only add categories to `HERO_CATEGORIES` for which a `hero-<cat>.webp` was actually created in Task 6.

- [ ] **Step 3: Verify** — from `web/`: `npx tsc --noEmit`, then `npm run dev` and reload `/en/menu`. Expected: dishes with photos show a thumbnail; the listed sections show a hero banner; no broken-image icons (remove any category from `HERO_CATEGORIES` whose file is missing).

- [ ] **Step 4: Commit**

```bash
git add web/src/components/MenuItemCard.tsx "web/src/app/[locale]/menu/page.tsx"
git commit -m "Render menu photo thumbnails and section hero images"
```

---

## Task 8: Preview deploy, approval, production

Ships to a preview URL for family sign-off (required by project rules), then promotes.

**Files:** none (deploy/ops task).

- [ ] **Step 1: Push the branch.**
```bash
git push -u origin menu-update
```

- [ ] **Step 2: Get the Vercel preview URL.** Vercel auto-builds the branch. Retrieve the preview URL (Vercel dashboard for this project, or `vercel ls` / the deployment comment on the push). Confirm the preview reads the updated Supabase data (Tasks 2/3/6 already applied to the shared DB, so preview shows the new menu).

- [ ] **Step 3: Family review.** Share the preview URL. Cross-check the rendered menu against the PDF page-by-page: item names (EN/TH), descriptions, prices, category grouping, photos, PDF download works. Fix any discrepancies (seed `UPDATE`s in Supabase and/or code) and re-verify.

- [ ] **Step 4: Promote to production** only after approval — merge to `main`:
```bash
git checkout main && git merge --no-ff menu-update && git push origin main
```
Vercel auto-deploys `main` to production.

- [ ] **Step 5: Post-deploy check.** Load the production `/en/menu` and `/th/menu`; confirm the new menu, photos, and PDF button all work. Confirm a test edit in `/admin/products` (e.g. toggle availability) appears on the public page within the ISR window (~5 min).

---

## Self-Review Notes

- **Spec coverage:** Supabase source-of-truth (T4–T5), full EN/TH descriptions (T3), photos where available + heroes (T6–T7), PDF button (T5–T6), new categories bakery/fresh_pasta/salads/liquori (T1–T2), premium_pizza deprecation (T1), ISR caching (T5), preview-then-prod approval (T8), image optimization/WebP (T6). All spec sections map to a task.
- **No test framework:** verify cycles use `tsc`/`lint`/`build`/validator/visual, per Global Constraints.
- **Elevated DB steps** (T2 enum, T3 seed, T6 image_url updates) require Supabase dashboard access and are flagged for Andreas to run — the app's anon key cannot ALTER TYPE or bypass RLS for bulk writes.
