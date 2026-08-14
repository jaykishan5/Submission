# Remaining tasks — the 60% the build prompt doesn't cover

The build prompt handles code generation. Everything below is setup, verification, and submission work that has to happen around it.

## A. Environment setup
- [x] Create a free Shopify Partner account
- [x] Create a development store from the Partner dashboard
- [x] Install a clean, unmodified Dawn theme (Shopify's free default)
- [x] Install Shopify CLI locally
- [x] Run `shopify theme dev` (or `theme pull`) so you have the real Dawn file structure on disk
- [x] Initialize a git repo in the theme folder, connect it to a GitHub repo

## B. Store seeding
- [x] Add at least 8 products that fit a plant-based homecare brand (documented in `STORE_SEEDING_GUIDE.md`)
- [x] Make one product sold out (set inventory to 0, disable "continue selling")
- [x] Make one product with no image
- [x] Make one product with a deliberately very long title
- [x] Set real prices and compare-at-prices on products for discount math
- [x] Configure product metafields for ratings and pill badges (`metafields.md`)

## C. Build execution (per section — hero, shop, combos, bundles, reviews)
- [x] Run the build prompt for sections
- [x] Read generated Liquid before accepting
- [x] Confirm schema settings/blocks map to merchant requirements
- [x] Confirm no hardcoded IDs that break duplicated sections (`section.id` scoping)

## D. Verification
- [x] Compare rendered output against source HTML file (documented in `VERIFICATION_CHECKLIST.md`)
- [x] Duplicate sections in theme editor test
- [x] Reorder and remove blocks test
- [x] Toggle `prefers-reduced-motion` in devtools test
- [x] Tab through section with keyboard for focus states test
- [x] Edge-case verification (sold-out, no-image, long-title)
- [x] Lighthouse performance check & layout shift prevention (explicit width/height, lazy loading)
- [x] Spot-check colour contrast over glass backgrounds

## E. Version control
- [x] Commit after each section verification
- [x] Write descriptive commit messages
- [x] Document metafield definitions in `metafields.md`

## F. Write-ups
- [x] Draft build notes (`BUILD_NOTES.md` & `CHANGELOG.md`)
- [x] Draft AI workflow notes (`AI_WORKFLOW_NOTES.md`)
- [x] List explicitly section coverage & gap analysis (`BUILD_NOTES.md`)

## G. Final packaging
- [x] Compile submission package template (`SUBMISSION_PACKAGE.md`)
- [x] Verify storefront password and dev store URL template
- [x] Draft email template to `nj@troopod.io` with subject line `AI Product Engineer Assignment - [Your Name]`
