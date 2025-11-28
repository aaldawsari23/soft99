# SoftNinetyNine - Developer Notes

## Product Data Architecture

### Data Source Location

**Primary data file:**
```
/public/data/products.json
```

This JSON file is the **single source of truth** for all catalog products (300 items, SKU 1001-1300).

**Original source:**
```
/public/Images/items.txt
```

CSV format with columns: `sku,brand,arabicCategory,supplierCode,name_ar,variant`

Example:
```
1001,Motul,زيوت,104091,زيت موتول 7100 10W40,1L
```

---

## Product Schema

Each product in `products.json` follows this structure:

```typescript
{
  "id": "1001",                    // Product ID (same as SKU)
  "sku": "1001",                   // SKU for image mapping (1001-1300)
  "name": "زيت موتول 7100 10W40",  // Arabic product name
  "name_en": "...",                // English name (optional)
  "description": "1L - زيوت",      // Description
  "price": 0,                      // Price (currently 0, can be updated)
  "currency": "ريال",              // Currency
  "image_url": "/Images/1001.jpg", // Local image path
  "remoteImageUrl": null,          // External image URL (optional)
  "category_id": "c1",             // Category ID (c1-c16)
  "brand_id": "b13",               // Brand ID (b13-b55)
  "type": "part",                  // Product type
  "stock_quantity": 10,            // Stock quantity
  "is_featured": false,            // Featured flag
  "is_available": true,            // Availability
  "status": "published",           // Publication status
  "specifications": {
    "model": "104091",             // Supplier/manufacturer code
    "specification": "1L"          // Variant/specification
  },
  "created_at": "2025-01-15T00:00:00Z",
  "updated_at": "2025-01-15T00:00:00Z"
}
```

### Important: SKU ↔ Image Alignment

**The `sku` field MUST match the image filename:**

- SKU `"1001"` → Image `/public/Images/1001.png`
- SKU `"1002"` → Image `/public/Images/1002.png`
- etc.

**Do NOT replace SKU with supplier codes!**

The supplier/manufacturer code (e.g., `104091`) is stored separately in:
```json
"specifications": {
  "model": "104091"  // Supplier code here
}
```

---

## Image Resolution Priority

Images are resolved in this order (implemented in `src/utils/imageHelper.ts`):

```
1. remoteImageUrl  → External URL (if provided)
2. image_url       → Custom local path (if provided)
3. /Images/${sku}.png → Default convention (SKU-based)
4. /images/placeholder.png → Fallback (if all fail)
```

### Example Image Paths

**Default (most common):**
```json
{
  "sku": "1001",
  "image_url": "/Images/1001.jpg"
}
```
→ Resolves to `/public/Images/1001.jpg`

**Remote image (future use):**
```json
{
  "sku": "1001",
  "remoteImageUrl": "https://cdn.example.com/products/1001.jpg"
}
```
→ Uses external URL

**Fallback:**
```json
{
  "sku": "9999",
  "image_url": null
}
```
→ Tries `/Images/9999.png` → Falls back to `/images/placeholder.png`

---

## How to Add/Edit Products Safely

### Option 1: Edit JSON Directly

1. Open `/public/data/products.json`
2. Add/modify product objects following the schema above
3. **Important:** Keep `sku` field aligned with image filenames
4. Validate JSON syntax (use a JSON validator)
5. Rebuild the application: `npm run build`

### Option 2: Regenerate from items.txt

If you have updated `items.txt`, regenerate `products.json`:

1. Update `/public/Images/items.txt` with new products
2. Run conversion script (to be created) or manually convert
3. Ensure SKU column (first column) matches image filenames

### Adding New Products Checklist

- [ ] Add product image to `/public/Images/{SKU}.png`
- [ ] Add product entry to `products.json` with matching `sku`
- [ ] Set appropriate `category_id` (c1-c16)
- [ ] Set appropriate `brand_id` (b13-b55)
- [ ] Set `type` to `"part"` (current products are all parts)
- [ ] Put supplier code in `specifications.model`, NOT in `sku`
- [ ] Set `status` to `"published"` to make it visible
- [ ] Validate JSON syntax
- [ ] Test: `npm run build`

---

## Category & Brand Reference

### Categories (c1-c16)

Located in `src/data/products.ts`:

| ID  | Arabic    | English       | Type |
|-----|-----------|---------------|------|
| c1  | زيوت      | Oils          | part |
| c2  | فلاتر     | Filters       | part |
| c3  | إشعال     | Ignition      | part |
| c4  | بطاريات   | Batteries     | part |
| c5  | إطارات    | Tires         | part |
| c6  | فرامل     | Brakes        | part |
| c7  | نقل الحركة | Drivetrain   | part |
| c8  | سوائل     | Fluids        | part |
| c9  | عناية     | Care          | part |
| c10 | محرك      | Engine        | part |
| c11 | كهرباء    | Electrical    | part |
| c12 | عوادم     | Exhaust       | part |
| c13 | إكسسوارات | Accessories   | part |
| c14 | قطع متفرقة | Misc Parts   | part |
| c15 | ملابس     | Gear          | gear |
| c16 | عدد       | Tools         | part |

### Brands (b13-b55)

34 brands available (Motul, Castrol, Michelin, etc.)

See `src/data/products.ts` for complete list.

---

## Current Architecture Status

### ✅ Completed (Phase 1-2)

- **Single data source:** `products.json` only
- **Unified navigation:** Responsive for all devices
- **Simplified filters:** Search + Category + Brand (3 filters)
- **Smart image handling:** Priority-based resolution with fallback
- **Reusable components:** `LazyProductImage` for all products
- **Clean code:** -285 lines removed, 5x better maintainability

### 📌 Future (Phase 3 - Not Yet Implemented)

**When real bikes/accessories data is available:**

1. **Extend product types:**
   - Add actual bikes with `type: "bike"`
   - Add accessories with `type: "gear"`
   - Keep current parts as `type: "part"`

2. **Add main category filter:**
   - Category chips: **All | Bikes | Parts | Accessories**
   - Replaces current type-based navigation

3. **Add bike-specific filters:**
   - Bike condition: **New | Used**
   - Only shown when "Bikes" category selected

4. **New fields for bikes:**
   ```json
   {
     "type": "bike",
     "bikeCondition": "new" | "used",
     // ... other bike-specific fields
   }
   ```

**Until then:** All products remain `type: "part"` with current filter system.

---

## Code References

### Key Files

- **Data source:** `/public/data/products.json` (176 KB)
- **Data loader:** `src/data/products.ts` (64 lines)
- **Image helper:** `src/utils/imageHelper.ts` (34 lines)
- **Image component:** `src/components/ui/LazyProductImage.tsx` (31 lines)
- **Product card:** `src/components/products/ProductCard.tsx` (60 lines)
- **Catalog filters:** `src/components/CatalogContent.tsx` (121 lines)

### Helper Functions

```typescript
// Get product image with priority resolution
import { getProductImageSrc, getFallbackImageSrc } from '@/utils/imageHelper';

const imageSrc = getProductImageSrc(product);
// Returns: remoteImageUrl || image_url || `/images/${sku}.png`

const fallback = getFallbackImageSrc();
// Returns: '/images/placeholder.png'
```

### Using LazyProductImage Component

```tsx
import { LazyProductImage } from '@/components/ui/LazyProductImage';

<LazyProductImage
  product={product}
  alt="Product description"
/>
```

**Features:**
- Automatic lazy loading
- Error handling with fallback
- Next.js Image optimization
- Hover effects

---

## Troubleshooting

### Images not showing?

1. **Check SKU alignment:** Ensure `sku` in JSON matches image filename
2. **Check file exists:** Verify `/public/Images/{SKU}.png` exists
3. **Check path case:** Images folder uses capital `I` → `/public/Images/`
4. **Fallback active?** Check browser console for image load errors

### Products not appearing in catalog?

1. **Check status field:** Must be `"status": "published"`
2. **Check category_id:** Must match valid category (c1-c16)
3. **Check brand_id:** Must match valid brand (b13-b55)
4. **Rebuild:** Run `npm run build` after JSON changes

### JSON syntax errors?

1. Use a JSON validator (VS Code has built-in validation)
2. Common mistakes:
   - Missing commas between objects
   - Trailing commas (not allowed in JSON)
   - Unescaped quotes in strings
   - Missing brackets/braces

---

## Maintenance Guidelines

### When adding products:

1. ✅ Always add image file first
2. ✅ Keep SKU = image filename
3. ✅ Use supplier code in `specifications.model`
4. ✅ Validate JSON before committing
5. ✅ Test build before deployment

### When updating architecture:

1. ✅ Keep `products.json` as single source of truth
2. ✅ Don't hardcode products in TypeScript
3. ✅ Maintain SKU ↔ image filename alignment
4. ✅ Update this document if schema changes
5. ✅ Test all filters after major changes

---

## Performance Notes

- **Bundle size:** JSON loaded at build time (no runtime overhead)
- **Image loading:** Lazy loading enabled (loads on scroll)
- **Filter performance:** Uses `useMemo` for efficient re-filtering
- **Current catalog:** 300 products, ~125 KB bundle size
- **Scalability:** Architecture supports 1000+ products without code changes

---

**Last Updated:** January 2025
**Architecture Version:** 2.0 (JSON + Smart Images)
