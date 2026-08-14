# Purelane Shopify Metafield & Metaobject Definitions

To deliver real platform data without hardcoding or requiring third-party apps, the Purelane sections rely on standard and custom Shopify product metafields.

---

## Required Product Metafields

Configure these fields in **Shopify Admin → Settings → Custom data → Products**:

| Namespace & Key | Name | Type | Section Used | Purpose |
|-----------------|------|------|--------------|---------|
| `reviews.rating` | Rating | Rating | `#shop` (Shop grid) | Sourcing per-product aggregate star rating (e.g. `4.8`). |
| `reviews.rating_count` | Rating Count | Integer | `#shop` (Shop grid) | Sourcing per-product review count (e.g. `237`). |
| `purelane.badge_label` | Card Badge Label | Single-line text | `#shop` (Shop grid) | Sourcing editorial product badges like "Best seller", "Top rated", or "New". |

---

## Architectural Rationale & Tradeoffs

### 1. Per-Product Star Ratings (`reviews.rating` & `reviews.rating_count`)
- **Why Metafields?**: Standard Shopify products do not feature a native review schema out of the box. Using standard `reviews.rating` keys allows compatibility with native Shopify search & filter apps as well as major review apps (Judge.me, Okendo, Yotpo).
- **Fallback Behavior**: If a product has no rating metafield set, the star rating line on the `purelane-card` component gracefully hides without leaving empty space.

### 2. Card Pill Badges (`purelane.badge_label`)
- **Why Metafield?**: The prototype displays pill badges on shop cards (e.g., "Best seller", "Top rated", "New"). Sourcing this from a single-line text metafield gives merchants total control per product without modifying Liquid templates.
- **Sold-out Priority**: If a product is sold out (`product.available == false`), the "Sold out" badge automatically overrides the custom badge label.

### 3. Combo & Bundle Prices
- **Why Block Settings Instead of Metafields/Metaobjects?**: Multi-product bundles (e.g. "Kitchen Essentials: 3 items for ₹499") do not map cleanly to single Shopify product variants without creating virtual products or installing a bundle app. Sourcing bundle prices via section block settings provides zero-dependency merchant control.
- **Upgrade Path for Bundle Apps**: If a bundle app (e.g., Shopify Bundles, Bundler) is installed later, edit `sections/purelane-combos.liquid` and `sections/purelane-bundles.liquid` to bind `price` and `compare_price` directly to the bundle product object (`product.price`).
