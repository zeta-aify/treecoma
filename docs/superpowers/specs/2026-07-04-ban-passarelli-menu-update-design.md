# Ban Passarelli — New Menu Update (Design Spec)

**Date:** 2026-07-04
**Author:** Andreas + Klaud
**Source:** `New menù Ban Passarelli .pdf` (16 pages, A4, ~27 MB, illustrated with real dish photos)

## Goal

Replace the current Ban Passarelli food menu on the website with the new PDF menu.
The result must be **fast, mobile-first, bilingual (EN/TH), searchable**, and — going forward —
**editable by the family** without a developer.

## Decisions (locked with Andreas)

| Question | Decision |
|---|---|
| On-page look | **Direction A** — clean, brand-styled cards grouped by section, with a light editorial touch (hero photo on a few flagship sections). Not a PDF replica. |
| Source of truth | **Supabase** `products` table. The public menu page is rewired to read from Supabase (today it reads a static file); the family edits everything from `/admin/products`. |
| Descriptions | **Full EN + TH** ingredient descriptions per dish, as in the PDF. |
| Photos | **Photo where the PDF has one** (thumbnail on the card) + **one hero image per section**; clean text row otherwise. More photos can be added later. |
| The PDF itself | Kept as an optimized **"Download full menu (PDF)"** button on the menu page. |
| Deployment | No new infra. Push to `main` → Vercel auto-deploys. Supabase already connected. |

## The core architecture problem this fixes

Today there is a split:

- **Public menu page** `web/src/app/[locale]/menu/page.tsx` imports a hardcoded array from
  `web/src/lib/menu-data.ts` (~65 items). This is what guests actually see.
- **Admin panel** `web/src/app/[locale]/admin/products/page.tsx` reads/writes the Supabase
  `products` table.

They are **not connected**. Admin edits never reach the live menu. This spec connects them:
Supabase becomes the single source of truth, and `menu-data.ts` is demoted to a build-time
fallback only (or removed).

## Architecture

```
PDF (source content)
  │  one-time transcription + photo extraction
  ▼
Supabase `products` table  ◄──────────  /admin/products  (family edits: price, availability, text)
  │  server-side read (cached, ISR)
  ▼
/[locale]/menu  (Next.js RSC)  ──renders──►  MenuItemCard  (photo? + EN/TH name + desc + price)
  │
  ├── section hero images + category nav
  └── "Download full menu (PDF)" button
```

### Components / units of work

1. **Data model (Supabase)**
   - `products` table already has every needed column: `name_en/th`, `description_en/th`,
     `category`, `price`, `price_variant` (JSONB), `image_url`, `is_available`, `is_seasonal`,
     `sort_order`. No schema change to columns needed.
   - **Enum change:** add new categories to `product_category`:
     `bakery`, `fresh_pasta`, `salads`, `liquori`. `premium_pizza` is deprecated
     (new PDF has only Classic + Special) — keep the enum value to avoid a destructive migration,
     but no items use it.
   - Migration file: `web/supabase/migrations/2026-07-04-menu-refresh.sql`
     (ALTER TYPE ADD VALUE …) + a full re-seed of Ban Passarelli food products.
   - Verify RLS already allows anon `select` on `products` (admin browser client already does this,
     so it should — confirm during implementation).

2. **Menu data seed** — the bulk of the work
   - Full item-by-item transcription from the PDF: EN name, TH name, EN description, TH description,
     price, `price_variant` where the PDF lists options, `is_seasonal` for seasonal items
     (e.g. Avocado pizza), `image_url` where a photo exists, and `sort_order`.
   - Transcription is done **page-by-page against the PDF** and double-checked (prices are the
     highest-risk field). Category structure and counts in the Appendix below.

3. **Public menu page rewrite** `web/src/app/[locale]/menu/page.tsx`
   - Convert to an async RSC that fetches products from Supabase via
     `@/lib/supabase/server` (server client, anon key), ordered by `category, sort_order`.
   - Filter `is_available = true`. Group by the new category order.
   - **Caching / speed:** enable ISR on the segment (`export const revalidate = 300`) so the page
     is served static/cached and only re-fetches every ~5 min — fast for guests, and family edits
     appear within minutes (or instantly if we also add an on-save `revalidatePath`).
   - Keep `menu-data.ts` as a typed fallback if the DB read returns empty (defensive), or remove it.

4. **`MenuItemCard`** `web/src/components/MenuItemCard.tsx`
   - Extend to render an optional photo thumbnail (Next `<Image>`, WebP, lazy), the EN/TH
     description, veg/vegan badge (`is_seasonal`/dietary can be modeled later), and `price_variant`
     chips. Falls back to a clean text row when `image_url` is null.

5. **Section heroes + nav** (the "touch of B")
   - One hero image per major section (Starters, Pasta, Pizza, …) shown above the section heading.
   - Sticky category nav updated for the new category set.

6. **Image pipeline**
   - Extract ~40 dish photos + section heroes from the PDF (already partly done during
     brainstorming). Optimize to WebP, size-appropriate.
   - Store in `web/public/menu/<slug>.webp` — served by Vercel's CDN, cached, no Supabase Storage
     needed. `products.image_url` holds `/menu/<slug>.webp`.
   - Compress the source PDF (~27 MB → target < 5 MB) for the download button, store in
     `web/public/ban-passarelli-menu.pdf`.

7. **i18n** `web/messages/{en,th,it}.json`
   - Add `menu.categories` keys for `bakery`, `freshPasta`, `salads`, `liquori`.
   - Add strings for the PDF-download button and bakery ordering note
     ("freshly baked daily / frozen / pre-order").

8. **Types** `web/src/lib/types.ts`
   - Add the new categories to `ProductCategory`, `FOOD_CATEGORIES` (in display order), and
     `CATEGORY_KEYS`.

## Category structure (new)

Display order and source section in the PDF:

| # | Category (enum) | PDF section | ~items | Notes |
|---|---|---|---|---|
| 1 | `bakery` | Artisan Bakery | 4 | Pagnotta, Baguette, Rosemary & Cherry-tomato/Potato Focaccia (single + tray prices via `price_variant`) |
| 2 | `starters` | Starters | 7 | incl. new Bruschetta garlic, Bruschetta Parma Ham; Cold cuts platter now 339฿ |
| 3 | `pasta` | Pasta dishes ("choose your pasta") | ~7 | Arrabbiata, Amatriciana, Pesto, Clams, Carbonara, Bolognese, Tagliatelle Sea Food |
| 4 | `fresh_pasta` | Fresh homemade pasta | ~5 | Tagliatelle, Gnocchi, Tortelli, Cannelloni, Lasagna (each with variant prices) |
| 5 | `main` | Main Dishes | ~4 | Cotoletta 220฿, Meatballs, Italian Sausage, **Beef Tagliata 419฿** (new) |
| 6 | `salads` | Refreshing & Light Dishes | 3 | Beetroot salad, Italian salad, Parma Ham & Melon (new section) |
| 7 | `sides` | Side Dishes | 5 | +Grilled vegetable |
| 8 | `classic_pizza` | Classic Pizza | ~10 | renamed/repriced: Bugs Bunny, Napoli, Sausage&onion, Siciliana… |
| 9 | `special_pizza` | Special Pizza | ~12 | absorbs old "premium": Rock, Reggiana, Marlon Brando, 8G, Gitana, Pizman… |
| 10 | `calzoni` | Calzoni | 4 | incl. "choose your calzone" |
| 11 | `panini` | Panini (bread or focaccia) | ~8 | +Avocado, +Sausage |
| 12 | `dessert` | Dessert | ~6 | +Fruit salad, Semi-frozen cake |
| 13 | `drinks` | Drinks | ~8 | +Safflower tea; repriced |
| 14 | `beers` | Beers | 4 | Chang/Leo/Singha/Asahi; repriced |
| 15 | `coffee` | Coffee | 6 | hot/iced via `price_variant`; oat milk +20฿ |
| 16 | `liquori` | Liquori | 2 | Grappa Moscato, Limoncello (new section) |

`cannabis` stays on its own separate page — untouched by this work.

> The exact per-item EN/TH text and prices are transcribed from the PDF into the seed migration
> during implementation and verified page-by-page. Prices changed across nearly every item, so the
> seed — not this table — is the authoritative list, and it is cross-checked against the PDF before commit.

## Non-goals

- No change to cart/checkout/orders logic.
- No change to the cannabis section.
- No new marketing/ads (Thai cannabis ad rules out of scope here).
- Not reproducing the PDF's hand-lettered fonts/brush strokes pixel-perfectly — we evoke the style
  with web-native typography and the real photos.

## Risks / checkpoints

1. **Transcription accuracy** (esp. prices & Thai text) — mitigate by page-by-page verification and
   a final visual diff of the rendered menu vs the PDF before go-live.
2. **RLS** — confirm anon `select` on `products` is allowed (expected, since admin already reads it).
3. **Content approval** — per project rules, external-facing content needs sign-off before it goes
   live. Deploy to a Vercel preview URL first for the family to approve, then promote to production.
4. **Image weight** — enforce WebP + Next/Image; keep total menu page payload reasonable.

## Rollout

1. Migration + seed applied to Supabase.
2. Code (page rewrite, card, types, i18n, images) on a feature branch → Vercel **preview** deploy.
3. Family reviews preview, approves.
4. Merge to `main` → production.
