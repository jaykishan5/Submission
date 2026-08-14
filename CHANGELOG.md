# Purelane Homepage → Shopify Dawn Conversion Changelog

This document tracks every structural, semantic, accessibility, and architectural deviation made while converting `purelane-homepage.html` into 5 modular, production-ready Shopify sections for Dawn.

---

## Shared Assets

### 1. `assets/purelane.css`
- **Merged duplicate `:root` palettes into V2 light palette**: Prototype contained two `:root` blocks (dark and light V2) stacked in raw CSS. Merged into a single, deterministic set of CSS tokens based on the default light theme.
- **Prefixed CSS variables (`--pl-*`)**: Renamed tokens like `--brand`, `--accent`, `--surface` to `--pl-brand`, `--pl-accent`, etc. Prevents variable collision with Dawn's global CSS variables.
- **Scraped global resets (`html`, `body`)**: Removed resets targeting global elements (`body { background: ... }`, `*{margin:0}`) so the sections do not break parent Dawn layout or theme settings.
- **Added line clamping**: Added 2-line WebKit line clamping (`-webkit-line-clamp: 2`) to product card titles to gracefully handle long product titles without ruining container height.

### 2. `assets/purelane-sections.js`
- **Instance-scoped initialization**: Prototype used hardcoded global element IDs (`#hstage`, `#heroProd`, `#rot`). JS functions were converted into instance-aware methods (`PL.initHero(sid)`, `PL.initRot(sid)`) that scope DOM queries to `section.id`.
- **Throttled scroll handling**: Kept `requestAnimationFrame` throttled scroll listener for parallax and background scene crossfading, while ensuring safe execution when `.pl-scenes` is missing.
- **Reduced motion support**: Preserved `prefers-reduced-motion` checks across all interactive components (rotator auto-play, parallax, drop-shadow animations).

---

## 5 Target Sections

### 1. `sections/purelane-hero.liquid` (Hero + Rotator)
- **`<span role="img">` to `<img>`**: Replaced fake image spans with real Liquid `<img>` tags referencing `product.featured_image | image_url`. Included proper `alt`, `width`, `height`, and `loading` attributes to ensure zero CLS and strong accessibility.
- **Scoped IDs**: Scoped `#hstage`, `#hdots`, and `#heroProd` to `{{ section.id }}` so duplicating the Hero section in the theme editor does not throw JS errors.
- **Flexible multi-product pricing**: Added override settings for `price_display`, `compare_price_display`, and `savings_label` per slide block. This allows merchants to display multi-product combo prices (e.g., "Any 3 for ₹499") while still pulling image assets directly from Shopify products.

### 2. `sections/purelane-shop.liquid` (Bestsellers Grid)
- **Dynamic Collection Loop**: Replaced 4 hardcoded static HTML cards with Liquid `for product in collection.products limit: section.settings.products_to_show`.
- **Reusable Card Snippet**: Converted product card markup into `snippets/purelane-card.liquid`.
- **Metafield Integration**: Sourced star ratings and review counts from `product.metafields.reviews.rating` and `product.metafields.reviews.rating_count`.
- **Defensive Edge Case Handling**:
  - *Sold out*: Sourced from `product.available`. Replaces CTA with a disabled "Sold out" button and adds a "Sold out" pill badge.
  - *Missing image*: Falls back to a branded gradient placeholder div matching `.pl-card__shot--empty`.
  - *Empty collection*: Renders 4 ghost cards in theme editor with instructional text if no collection is assigned.

### 3. `sections/purelane-combos.liquid` (Best-Selling Combos Rail)
- **Theme Blocks for Combo Cards**: Converted static rail items into repeatable `combo` blocks. Sourced product thumbnails dynamically from `block.settings.product_1` through `product_4`.
- **Block-level Combo Pricing**: Bundle prices (e.g. ₹499 for 3 products) are defined in block settings because multi-product bundles do not map to a single native Shopify product price without a bundle app.
- **Optional Flag Badges**: "Most popular" / "Best value" badges are controlled via optional block settings. Leaving the text blank automatically hides the badge.

### 4. `sections/purelane-bundles.liquid` (Build-Your-Bundle Tiers)
- **Dynamic Tier Blocks**: Converted 3 static tiers into customizable `tier` blocks (up to 3 max).
- **Product Preview Row (`tierpix`)**: Sourced preview images dynamically from selected `product_1` through `product_5` picker fields in the block.
- **Configurable Benefits Checklist**: Sourced tier benefits from text settings (`benefit_1` to `benefit_3`). Blank benefits are hidden automatically.
- **Highlighting**: Added a `highlight` boolean to apply `.pl-tier--best` gold border styling to the recommended tier.

### 5. `sections/purelane-reviews.liquid` (Auto-Scrolling Review Marquee)
- **Liquid Double-Pass Loop**: Replaced 10 hardcoded duplicate HTML review articles with a Liquid loop rendered twice (`for pass in (1..2)`). Ensures the CSS `-50%` marquee animation loops seamlessly regardless of how many blocks the merchant adds or removes.
- **Star Rating Helper**: Sourced star rating (3 to 5) from block select settings and rendered matching `★` characters with accessible `aria-label` tags.
- **CSS-only Animation**: Retained pure CSS marquee animation with hover-pause (`:hover`) and `prefers-reduced-motion` pause support. Zero JS overhead.

---

## Summary of Production Enhancements
1. **Accessibility**: Visible focus outlines (`:focus-visible`), real `<img>` tags with alt text, aria labels on review stars and tab buttons.
2. **Performance**: Lazy loading for offscreen product images, explicit `width`/`height` attributes to eliminate layout shift, pure CSS animations for reviews and combo scroll.
3. **Merchant Autonomy**: 100% of copy, headings, prices, images, badges, and links can be configured in the Shopify Theme Editor.
