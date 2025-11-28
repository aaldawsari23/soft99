# 📋 خطة التطوير التفصيلية - Soft99bikes

## المرحلة 1: الأمان والاستقرار 🔒
**المدة**: أسبوعين | **الأولوية**: حرجة

### 1.1 إصلاح Firebase Security
- [ ] **firestore.rules** - تحديث القواعد:
  ```javascript
  // إضافة التحقق من Admin role
  function isAdmin() {
    return request.auth != null && 
           request.auth.token.admin == true;
  }
  
  match /products/{productId} {
    allow read: if true;
    allow write: if isAdmin();
  }
  ```

- [ ] **إعداد Custom Claims**:
  ```typescript
  // إنشاء Cloud Function لإضافة admin claim
  // functions/src/setAdminClaim.ts
  ```

- [ ] **storage.rules** - تحديث قواعد التخزين

### 1.2 Environment Variables
- [ ] إنشاء `.env.example` محدث بدون قيم حقيقية
- [ ] نقل `FIREBASE_*` keys للـ server-side فقط حيث ممكن
- [ ] إعداد Environment Variables في Netlify/Vercel
- [ ] إضافة `.env*.local` للـ `.gitignore`

### 1.3 Input Validation
- [ ] تثبيت Zod: `npm install zod`
- [ ] إنشاء schemas:
  ```
  src/lib/validations/
  ├── product.ts
  ├── category.ts
  ├── brand.ts
  └── index.ts
  ```
- [ ] تطبيق validation في forms
- [ ] تطبيق validation في API/Firebase operations

### 1.4 Error Handling الموحد
- [ ] إنشاء `src/lib/errors.ts`:
  ```typescript
  export class AppError extends Error {
    constructor(
      message: string,
      public code: string,
      public statusCode: number = 500
    ) {
      super(message);
    }
  }
  ```
- [ ] توحيد error messages بالعربية
- [ ] إضافة error logging (Sentry اختياري)

---

## المرحلة 2: تحسين الأداء ⚡
**المدة**: أسبوعين | **الأولوية**: عالية

### 2.1 Data Fetching Optimization
- [ ] تثبيت React Query: `npm install @tanstack/react-query`
- [ ] إنشاء hooks:
  ```
  src/hooks/
  ├── useProducts.ts
  ├── useCategories.ts
  ├── useBrands.ts
  └── useProduct.ts
  ```
- [ ] تطبيق caching و stale-while-revalidate

### 2.2 Image Optimization
- [ ] تفعيل Next.js Image Optimization (إزالة `unoptimized: true`)
- [ ] إعداد image domains في `next.config.js`
- [ ] تحويل الصور لـ WebP
- [ ] إنشاء image placeholder component

### 2.3 Code Splitting
- [ ] Dynamic imports للمكونات الكبيرة:
  ```typescript
  const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
    loading: () => <DashboardSkeleton />
  });
  ```
- [ ] تحليل bundle: `npm run build:analyze`
- [ ] إزالة unused dependencies

### 2.4 Database Optimization
- [ ] إنشاء Firestore indexes:
  ```
  firestore.indexes.json
  ```
- [ ] تحسين queries (limit, pagination)
- [ ] إضافة composite indexes للفلاتر المركبة

---

## المرحلة 3: تجربة المستخدم 🎨
**المدة**: أسبوعين | **الأولوية**: متوسطة

### 3.1 Loading States
- [ ] توحيد Skeleton components:
  ```
  src/components/ui/skeletons/
  ├── ProductCardSkeleton.tsx
  ├── ProductGridSkeleton.tsx
  ├── TableSkeleton.tsx
  └── FormSkeleton.tsx
  ```
- [ ] إضافة Suspense boundaries
- [ ] Optimistic updates للعمليات السريعة

### 3.2 Error States
- [ ] تحسين ErrorBoundary component
- [ ] إنشاء error pages:
  - [ ] 404 محسّن
  - [ ] 500 page
  - [ ] Offline page
- [ ] Toast notifications متسقة

### 3.3 Accessibility (a11y)
- [ ] إضافة ARIA labels لجميع العناصر التفاعلية
- [ ] Keyboard navigation للـ:
  - [ ] Navigation menu
  - [ ] Product cards
  - [ ] Forms
  - [ ] Modals
- [ ] Focus management
- [ ] Screen reader testing

### 3.4 PWA Features
- [ ] إنشاء Service Worker
- [ ] تحسين `manifest.ts`
- [ ] Add to home screen prompt
- [ ] Offline basic support

---

## المرحلة 4: الميزات الجديدة 🚀
**المدة**: 4 أسابيع | **الأولوية**: متوسطة

### 4.1 نظام الطلبات
- [ ] إنشاء Order types في `src/types/`
- [ ] Firestore collection للطلبات
- [ ] صفحة checkout:
  ```
  src/app/(public)/checkout/
  ├── page.tsx
  └── components/
      ├── CheckoutForm.tsx
      ├── OrderSummary.tsx
      └── PaymentSection.tsx
  ```
- [ ] صفحة تأكيد الطلب
- [ ] إشعارات WhatsApp/Email

### 4.2 لوحة تحكم الطلبات (Admin)
- [ ] قائمة الطلبات مع الفلاتر
- [ ] تفاصيل الطلب
- [ ] تغيير حالة الطلب
- [ ] طباعة الفاتورة

### 4.3 بوابة الدفع (اختياري)
- [ ] دراسة Moyasar/Tap
- [ ] Integration مع checkout
- [ ] Webhook handling
- [ ] Payment confirmation

### 4.4 التقارير والإحصائيات
- [ ] Dashboard charts محسّنة
- [ ] تقارير المبيعات
- [ ] تنبيهات المخزون
- [ ] Export to Excel/PDF

---

## المرحلة 5: الجودة والاختبارات 🧪
**المدة**: مستمر | **الأولوية**: عالية

### 5.1 Unit Tests
- [ ] تغطية 80% للـ utils
- [ ] تغطية 70% للـ hooks
- [ ] تغطية 60% للـ components

### 5.2 Integration Tests
- [ ] Checkout flow
- [ ] Admin CRUD operations
- [ ] Filter & Search

### 5.3 E2E Tests (Playwright/Cypress)
- [ ] User journey: Browse → Add to Cart → Checkout
- [ ] Admin journey: Login → Add Product → Publish

### 5.4 Performance Testing
- [ ] Lighthouse scores > 90
- [ ] Core Web Vitals monitoring
- [ ] Load testing (اختياري)

---

## 📊 مؤشرات النجاح (KPIs)

| المؤشر | الحالي | الهدف |
|--------|--------|-------|
| Lighthouse Performance | ~70 | >90 |
| Lighthouse Accessibility | ~80 | >95 |
| Test Coverage | ~25% | >70% |
| Build Time | ~2min | <1min |
| First Contentful Paint | ~2s | <1s |
| Time to Interactive | ~4s | <2s |

---

## 🛠️ الأدوات المقترحة

### للتطوير:
- **Zod** - Validation
- **React Query** - Data fetching
- **Playwright** - E2E testing
- **Sentry** - Error tracking

### للـ CI/CD:
- **GitHub Actions** - Automated testing
- **Vercel/Netlify** - Deployment
- **Dependabot** - Security updates

---

## 📝 ملاحظات للمطورين

1. **قبل البدء في أي مهمة**: اقرأ `CLAUDE_RULES.md`
2. **عند الانتهاء من مهمة**: حدّث هذا الملف بـ [x]
3. **عند مواجهة مشكلة**: أضفها في قسم "المشاكل المعلقة" أدناه
4. **Code Review**: كل PR يجب أن يمر على الـ checklist

---

## 🚧 المشاكل المعلقة

<!-- أضف المشاكل التي تحتاج مناقشة هنا -->

1. [ ] قرار: هل نستخدم Moyasar أو Tap للدفع؟
2. [ ] قرار: هل نحتاج multi-language الآن أم لاحقاً؟
3. [ ] مشكلة: ...

---

**آخر تحديث**: 2025-01-XX
**المسؤول**: [اسم المطور]
