-- 2026-07-04 Menu refresh: new categories + full Ban Passarelli re-seed
-- Run in Supabase SQL Editor (or `supabase db execute`). Enum values must be
-- committed before they can be used by the INSERTs in seed section below.

ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'bakery';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'fresh_pasta';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'salads';
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'liquori';

-- (seed section added in Task 3, run as a SEPARATE statement batch after the
--  ALTER TYPE statements above have committed)
