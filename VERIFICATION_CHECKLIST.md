# Purelane Quality Assurance & Verification Testing Suite

This verification checklist covers responsive testing, theme editor stability, accessibility compliance, performance audits, and product edge-case testing for the 5 Purelane Shopify sections.

---

## 1. Responsive Viewport Testing

Open both `purelane-homepage.html` and the Shopify Dev Store side-by-side in browser DevTools and compare visual output at each target breakpoint:

- [ ] **Mobile Small (375px)**:
  - Hero heading font size scales cleanly (`clamp(48px, 8.6vw, 112px)`).
  - Mobile badge strip (`.pl-badgestrip`) displays properly; desktop badge sidebar is hidden.
  - Shop grid cards collapse to 2 columns (`repeat(2, 1fr)`).
  - Combo rail scrolls horizontally with touch swipe indicator.
  - Review marquee card width scales down to 250px.
- [ ] **Mobile Large / Tablet (768px)**:
  - Shop grid cards render cleanly in 2 columns.
  - Bundle tier cards collapse gracefully to single-column stack.
- [ ] **Laptop (1024px)**:
  - Desktop badge sidebar (`.pl-badges`) displays on right side of Hero.
  - Bundle tiers expand to 3-column grid (`repeat(3, 1fr)`).
  - Mouse movement triggers subtle parallax effect on Hero stage.
- [ ] **Desktop Wide (1440px)**:
  - Max container width (`1180px`) centers correctly with proper side padding (`18px`).
  - Shop grid renders in 4 columns (`repeat(4, 1fr)`).

---

## 2. Theme Editor & Section Duplication Tests

- [ ] **Duplication Test**:
  - Add two instances of **Purelane — Hero** to the page in Theme Editor.
  - Verify slide dot controls on Hero Instance 1 do not affect Hero Instance 2.
  - Verify `#pl-prod-{{ section.id }}` ambient shadow animations operate independently.
- [ ] **Block Reordering & Removal Test**:
  - In **Purelane — Combos**, reorder combo blocks. Verify layout does not break.
  - Remove all blocks from **Purelane — Reviews**. Verify graceful empty fallback message is displayed.
  - Add 10 review blocks. Verify seamless `-50%` infinite marquee animation continues smoothly without flickering.
- [ ] **Settings Live Preview Test**:
  - Change heading text, primary CTA button labels, and accent word in Theme Editor. Verify live preview updates instantly without page reload errors.

---

## 3. Product Edge Case Verification

- [ ] **Edge Case 1: Sold-Out Product (`Non-Toxic Laundry Detergent`)**:
  - Sourced in Shop Grid: CTA button displays as disabled `"Sold out"`. "Sold out" grey pill badge replaces custom badge.
  - Sourced in Combo Stack: Tray displays product thumbnail normally; price row reflects sold-out status defensively.
- [ ] **Edge Case 2: Product With No Image (`Organic Dishwash Liquid Gel`)**:
  - Sourced in Shop Grid: Card shot renders branded gradient placeholder (`.pl-card__shot--empty`) instead of broken `<img>` icon.
  - Sourced in Combo Stack: Renders dashed tile placeholder with leaf icon (`.pl-sit-tile`).
- [ ] **Edge Case 3: Product With Very Long Title (`Natural Herbal Floor Cleaner...`)**:
  - Sourced in Shop Grid: Title is clamped cleanly to 2 lines (`-webkit-line-clamp: 2`). Card height stays uniform across grid row.

---

## 4. Accessibility & Motion Compliance

- [ ] **Keyboard Navigation (`Tab` key testing)**:
  - Tab through Hero CTAs, slide control dots, Shop card links, Combo buttons, and Bundle CTAs.
  - Verify focus ring (`outline: 2px solid #4f7d10; outline-offset: 3px`) is clearly visible on every interactive element.
- [ ] **Screen Reader Semantics**:
  - Product images use real `<img alt="...">` tags with alt text from `product.title`.
  - Review star ratings use accessible `aria-label` tags (e.g. `aria-label="5 out of 5 stars"`).
  - Decorative icons use `aria-hidden="true"`.
- [ ] **Reduced Motion (`prefers-reduced-motion: reduce`)**:
  - Enable reduced motion in browser settings / DevTools (`Emulate CSS media feature prefers-reduced-motion: reduce`).
  - Verify Hero slide auto-play stops.
  - Verify Review marquee animation stops cleanly.
  - Verify scroll-reveal elements (`.pl-rv`) become immediately visible with zero blur/opacity transitions.

---

## 5. Performance & Contrast Checks

- [ ] **Lighthouse Performance Audit**:
  - Run Lighthouse audit on desktop and mobile.
  - Verify Cumulative Layout Shift (CLS) is `< 0.1` (ensured by explicit `width` and `height` attributes on all images).
  - Verify `loading="lazy"` is applied to offscreen images.
- [ ] **Color Contrast Check**:
  - Verify text contrast over glass backgrounds (`.pl-glass` and `.pl-glass-2`) satisfies WCAG AA contrast ratio (4.5:1 for body text, 3:1 for large headings).
