# Build prompt — Purelane homepage → Shopify Dawn sections

## Context
I'm converting a static HTML prototype (`purelane-homepage.html`) into production
Shopify sections built on a clean, unmodified Dawn theme install. This is a design
prototype, not production code — it was never written with Shopify in mind.

The design in the file is the spec. Reproduce the visual output exactly, at every
width from 375px up: layout, spacing, type, colour, and interaction/animation
behaviour. This is a build, not a redesign — do not restyle or "improve" anything
visually, even if you think you'd design it differently.

Where the underlying HTML/CSS is wrong for *production* (semantics, accessibility,
performance, breakpoint logic, non-unique IDs, dead interactive elements), fix it —
but keep a running list of what you changed and why, since I need to report that.

## Scope — build these five sections only, in this order
1. `section.hero` (`class="hero"`) — includes the 3-slide product rotator
2. `#shop` — product grid, must pull from a real Shopify collection
3. `#combos` — best-selling combos rail
4. `#bundles` — build-your-bundle tiers
5. `#reviews` — auto-scrolling review marquee

Everything else in the file is bonus — do not build it unless the five above are
fully done and verified.

## Hard requirements
- **Merchant-editable**: every heading, price, image, CTA link/label, and repeatable
  card must be a section setting or block setting. Nothing marketing would want to
  change should be hardcoded in Liquid.
- **Real Shopify data**: products, prices, images, and (where possible) reviews come
  from the platform — `product.price`, `product.compare_at_price`,
  `product.featured_image`, collection objects, metafields — not typed into Liquid.
  Where no native field exists (aggregate review rating, "most popular" flags, combo
  savings), tell me the tradeoff and pick a defensible solution (metafield,
  metaobject, or block setting) rather than hardcoding it.
- **Reusable card component**: the hero rotator slides, combo cards, bundle tiers,
  and shop grid cards share near-identical visual structure (image → title →
  price row → CTA). Build one parameterized snippet they all call, not four
  copy-pasted card markups.
- **Survives the theme editor**: no code may assume a section appears only once on
  the page. Scope all JS queries and IDs to `{{ section.id }}` so duplicating,
  reordering, or removing a section/block never breaks another instance or throws
  errors. Adding/removing/reordering blocks must not break layout or animations.
- **Accessible**: real `<img alt="">` (not empty decorative spans faking product
  photos via `aria-label`), visible focus states, sufficient contrast, and respect
  `prefers-reduced-motion` for every animation you touch or add (the prototype
  already does this for its own JS — preserve that pattern, don't strip it).
- **Fast**: lazy-load offscreen images, set explicit width/height to avoid layout
  shift, avoid shipping unused CSS/JS from the prototype's other (bonus) sections.
- **Handle real product edge cases**: sold-out products, products with no image,
  and products with very long titles must not break card layout — I will be
  seeding the dev store with examples of each, so build defensively.

## What to preserve as-is
The scroll-reveal (`IntersectionObserver` + `.rv` classes), the scene-crossfade
background system, and the scroll/parallax JS are already well-built — deterministic,
throttled with `requestAnimationFrame`, and reduced-motion aware. Adapt them to be
instance-safe per section, but don't rewrite their logic from scratch.

## Deliverables from this session
1. `sections/*.liquid` for each of the five sections, with full `{% schema %}`
   blocks (settings + blocks)
2. Any shared snippets (card component, icon partials, etc.)
3. Any metafield/metaobject definitions needed, with a short note on why each
   was necessary and what native field it substitutes for
4. A running changelog of every deviation from the source file's HTML/CSS and the
   production reason for each change
5. A short list of what's still bonus/unbuilt and what you'd tackle next with more time

## Working style
- Go section by section in the order above. Show me the section + schema before
  moving to the next one so I can review and course-correct early.
- Flag anything ambiguous (e.g. how "most popular" combo flags should be sourced)
  rather than silently picking an approach.
- Ask before introducing a third-party app dependency (e.g. a bundles app or
  reviews app) — tell me the options and tradeoffs first.
