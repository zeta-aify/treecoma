// Usage: node scripts/validate-menu-seed.mjs
import { readFileSync } from "node:fs";

const sql = readFileSync(
  new URL("../supabase/migrations/2026-07-04-menu-refresh.sql", import.meta.url),
  "utf8",
);

// Expected item count per category (from the PDF). Adjust if the family adds/removes.
// NOTE: `main` adjusted from the brief's 4 to 5 -- the brief's own resolution for the
// ambiguous "Sauté Sea Food" dish (339 baht) is to place it in `main`, which raises
// main's true count from 4 to 5. `sides` stays at 5 (Green salad, French fries,
// Baked potatoes, Grilled vegetable, Sautéed spinach) since Sauté Sea Food is not there.
const EXPECTED = {
  bakery: 4, starters: 7, pasta: 7, fresh_pasta: 5, main: 5, salads: 3,
  sides: 5, classic_pizza: 10, special_pizza: 11, calzoni: 4, panini: 7,
  dessert: 6, drinks: 8, beers: 4, coffee: 6, liquori: 2,
};

// Match `, '<category>', <price>` pairs directly across the whole SQL, without
// trying to reconstruct row boundaries (which is fragile if names/descriptions
// contain parentheses).
const CATS = "bakery|starters|pasta|fresh_pasta|main|salads|sides|classic_pizza|special_pizza|premium_pizza|calzoni|panini|dessert|drinks|beers|coffee|liquori";
const re = new RegExp(`,\\s*'(${CATS})'\\s*,\\s*(\\d+)`, "g");
const counts = {};
let priceErrors = [];
let m;
while ((m = re.exec(sql)) !== null) {
  const cat = m[1];
  const price = Number(m[2]);
  counts[cat] = (counts[cat] || 0) + 1;
  if (price < 20 || price > 500) priceErrors.push(`${cat}: suspicious price ${price}`);
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
