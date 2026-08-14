# Shopify Dev Store Seeding & Metafield Guide

This guide provides step-by-step instructions for seeding a Shopify development store to test the Purelane sections under realistic merchant conditions, including real product data, discount pricing, and edge cases.

---

## 1. Product Catalog Seeding (8 Core Products)

In **Shopify Admin → Products**, create 8 products using the names and configurations below:

| # | Product Title | Type / Category | Price | Compare-At Price | Inventory | Special Testing Edge Case |
|---|---|---|---|---|---|---|
| 1 | **Foaming Kitchen Cleaner** | Kitchen | ₹200 | ₹299 | 50 | Standard product (33% off discount math test) |
| 2 | **Tap Cleaner & Limescale Remover** | Bathroom | ₹200 | ₹299 | 50 | Standard product |
| 3 | **Non-Toxic Laundry Detergent** | Laundry | ₹250 | ₹349 | **0** *(Continue selling unchecked)* | **Edge Case 1: Sold-Out Product** |
| 4 | **Organic Dishwash Liquid Gel** | Kitchen | ₹180 | ₹249 | 35 | **Edge Case 2: No Product Image** *(Leave image area blank)* |
| 5 | **Natural Herbal Floor Cleaner with Pure Neem & Lemongrass Essential Oils** | Home | ₹220 | ₹299 | 40 | **Edge Case 3: Deliberately Very Long Title** (Tests 2-line CSS text clamping) |
| 6 | **Non-Toxic Toilet Cleaner** | Bathroom | ₹190 | ₹270 | 60 | Standard product |
| 7 | **Gentle Hydrating Liquid Handwash** | Skin | ₹170 | ₹220 | 45 | Standard product |
| 8 | **Washing Machine Cleaner & Descaler Tablets** | Laundry | ₹200 | ₹299 | 30 | Standard product |

---

## 2. Collection Creation

In **Shopify Admin → Products → Collections**:
1. Click **Create collection**.
2. Title: `Purelane Bestsellers`.
3. Collection type: **Manual**.
4. Add all 8 products above to this collection.
5. In **Shopify Theme Editor → Shop Grid Section**, select `Purelane Bestsellers` in the collection picker.

---

## 3. Product Metafield Definitions Setup

In **Shopify Admin → Settings → Custom data → Products**, create the following 3 metafield definitions:

### Metafield 1: Star Rating
- **Name**: Star Rating
- **Namespace and key**: `reviews.rating`
- **Select type**: **Rating**
- **Purpose**: Populates star rating on shop grid cards (e.g. `4.8`).

### Metafield 2: Review Count
- **Name**: Review Count
- **Namespace and key**: `reviews.rating_count`
- **Select type**: **Integer**
- **Purpose**: Populates review count text on shop grid cards (e.g. `237`).

### Metafield 3: Card Badge Label
- **Name**: Card Badge Label
- **Namespace and key**: `purelane.badge_label`
- **Select type**: **Single line text**
- **Purpose**: Sources custom pill badges on shop grid cards (e.g. "Best seller", "Top rated", "New").

---

## 4. Seeding Sample Metafield Values on Products

Open the following products in **Shopify Admin → Products** and scroll down to the **Metafields** section:

1. **Foaming Kitchen Cleaner**:
   - `reviews.rating`: `4.8`
   - `reviews.rating_count`: `254`
   - `purelane.badge_label`: `Best seller`
2. **Tap Cleaner & Limescale Remover**:
   - `reviews.rating`: `4.8`
   - `reviews.rating_count`: `237`
   - `purelane.badge_label`: `Best seller`
3. **Washing Machine Cleaner & Descaler Tablets**:
   - `reviews.rating`: `4.8`
   - `reviews.rating_count`: `183`
   - `purelane.badge_label`: `New`
