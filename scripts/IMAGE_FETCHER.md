# Image fetcher script

Use `scripts/imageFetcher.mjs` to collect ثلاث روابط مباشرة (أو أقل إذا لم تتوفر) لكل منتج بناءً على الاسم/الوصف في CSV.

## المتطلبات
- Node.js 18+ (يتضمن `fetch`).
- أحد مفاتيح البحث التالية:
  - `SERPAPI_API_KEY` (للبحث عبر SerpApi Google Images – الخيار الأكثر موثوقية).
  - أو `BING_IMAGE_SEARCH_KEY` (لبحث Bing Image Search كخيار بديل أو احتياطي).

> يمكن ضبط `IMAGE_PROVIDER=serpapi,bing` لتحديد أولوية المحركات. يتم تجنب روابط Amazon و المواقع المتشددة تلقائياً.

## التشغيل
```bash
# قراءة من sample_products.csv وكتابة النتائج إلى image_urls.json
node scripts/imageFetcher.mjs

# تحديد ملف الإدخال والإخراج وحد أقصى للروابط
IMAGE_LIMIT=3 IMAGE_PROVIDER=serpapi,bing \
SERPAPI_API_KEY=xxxx BING_IMAGE_SEARCH_KEY=yyyy \
node scripts/imageFetcher.mjs data/products.csv output/image_urls.json
```

يتم حفظ النتائج بصيغة JSON تحتوي على الحقول الأصلية من الـCSV بالإضافة إلى مصفوفة `images`.
