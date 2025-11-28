# 🔒 دليل الأمان - Soft99bikes Security Guide

## نظرة عامة

تم تحسين أمان المشروع في **المرحلة 1** من خطة التطوير. هذا الملف يوضح التحسينات الأمنية وكيفية استخدامها.

---

## 1. Firebase Security Rules

### Firestore Rules

تم تحديث قواعد Firestore لتطلب صلاحيات Admin للعمليات الكتابية:

```javascript
function isAdmin() {
  return request.auth != null &&
         request.auth.token.admin == true;
}
```

**القواعد الحالية:**
- ✅ **القراءة**: مفتوحة للجميع (products, categories, brands)
- 🔒 **الكتابة**: Admin فقط (create, update, delete)
- 🔒 **Orders**: المستخدمون يقرؤون طلباتهم فقط، Admin يقرأ الكل
- 🔒 **Users**: كل مستخدم يقرأ/يعدل بياناته فقط، Admin يقرأ الكل
- 🔒 **Settings**: Admin فقط

### Storage Rules

تم تحديث قواعد Firebase Storage:

```javascript
// Products images
match /products/{allPaths=**} {
  allow read: if true;
  allow write: if isAdmin();
}
```

**المجلدات:**
- `/products/` - صور المنتجات (Admin فقط)
- `/brands/` - لوجوهات الماركات (Admin فقط)
- `/categories/` - صور الفئات (Admin فقط)
- `/public/` - ملفات عامة (القراءة للجميع، الكتابة Admin)
- `/temp/{userId}/` - رفع مؤقت (المستخدم المسجل فقط)

---

## 2. Admin Custom Claims

### إعداد Admin Role

لإضافة admin role لمستخدم، استخدم Firebase Admin SDK:

```typescript
// في Cloud Function أو Admin script
import { auth } from 'firebase-admin';

async function setAdminClaim(uid: string) {
  await auth().setCustomUserClaims(uid, { admin: true });
}
```

### التحقق من Admin في Frontend

```typescript
import { auth } from '@/lib/firebase';
import { getIdTokenResult } from 'firebase/auth';

async function checkIfAdmin() {
  const user = auth.currentUser;
  if (!user) return false;

  const tokenResult = await getIdTokenResult(user);
  return !!tokenResult.claims.admin;
}
```

---

## 3. Input Validation مع Zod

### استخدام Schemas

جميع schemas موجودة في `src/lib/validations/`:

```typescript
import {
  validateProduct,
  safeValidateProduct
} from '@/lib/validations';

// Validation عادي (يرمي خطأ)
try {
  const validData = validateProduct(formData);
  // استخدم validData
} catch (error) {
  console.error('Validation failed:', error);
}

// Safe validation (يرجع نتيجة)
const result = safeValidateProduct(formData);
if (result.success) {
  const validData = result.data;
} else {
  console.error('Errors:', result.error);
}
```

### Schemas المتاحة

```typescript
// Products
import {
  createProductSchema,
  updateProductSchema,
  validateProduct,
  safeValidateProduct
} from '@/lib/validations/product';

// Categories
import {
  createCategorySchema,
  updateCategorySchema,
  validateCategory
} from '@/lib/validations/category';

// Brands
import {
  createBrandSchema,
  updateBrandSchema,
  validateBrand
} from '@/lib/validations/brand';
```

### مثال: Form Validation

```typescript
'use client';

import { useState } from 'react';
import { safeValidateProduct } from '@/lib/validations';
import { toast } from 'react-hot-toast';

export default function ProductForm() {
  const [formData, setFormData] = useState({...});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const result = safeValidateProduct(formData);

    if (!result.success) {
      // عرض الأخطاء
      const errors = result.error.issues.map(i => i.message);
      toast.error(errors.join('\n'));
      return;
    }

    // المتابعة بالبيانات الصحيحة
    const validData = result.data;
    // ...
  };
}
```

---

## 4. Unified Error Handling

### استخدام Custom Errors

```typescript
import {
  AppError,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
  DatabaseError,
  getErrorMessage,
  logError
} from '@/lib/errors';

// رمي خطأ مخصص
throw new ValidationError('البريد الإلكتروني غير صحيح');
throw new NotFoundError('المنتج غير موجود');
throw new AuthorizationError('يجب أن تكون Admin');

// استخراج رسالة الخطأ
try {
  // some operation
} catch (error) {
  const message = getErrorMessage(error);
  toast.error(message);
  logError(error, 'ProductForm');
}
```

### معالجة Zod Errors

```typescript
import { handleZodError } from '@/lib/errors';
import { ZodError } from 'zod';

try {
  const data = someSchema.parse(input);
} catch (error) {
  if (error instanceof ZodError) {
    const validationError = handleZodError(error);
    toast.error(validationError.message);
  }
}
```

### Async Error Wrapper

```typescript
import { asyncErrorWrapper } from '@/lib/errors';

// لف الدوال غير المتزامنة
const saveProduct = asyncErrorWrapper(
  async (data: Product) => {
    // code here
  },
  'saveProduct' // context
);
```

---

## 5. Data Provider Pattern

### استخدام Data Provider

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getDataProvider } from '@/lib/data-providers';
import { Product } from '@/types';
import { getErrorMessage } from '@/lib/errors';
import { toast } from 'react-hot-toast';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const provider = getDataProvider();
        const data = await provider.getProducts();
        setProducts(data);
      } catch (error) {
        const message = getErrorMessage(error);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (/* JSX */);
}
```

---

## 6. Environment Variables

### ملف .env.local

**⚠️ مهم جداً:**
- لا تشارك `.env.local` أبداً
- لا ترفعه على Git (موجود في `.gitignore`)
- استخدم `.env.example` كمرجع

### المتغيرات المطلوبة

```bash
# Firebase (مطلوب)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Data Provider
DATA_PROVIDER=firestore
NEXT_PUBLIC_DATA_PROVIDER=firestore
```

### Deployment على Netlify/Vercel

أضف جميع المتغيرات في:
- **Netlify**: Site settings > Environment variables
- **Vercel**: Project settings > Environment Variables

---

## 7. Checklist للمطورين

عند إضافة ميزة جديدة:

- [ ] استخدم Data Provider (لا تستورد Firebase مباشرة)
- [ ] أنشئ Zod Schema للتحقق من البيانات
- [ ] استخدم Custom Errors من `@/lib/errors`
- [ ] أضف معالجة أخطاء في try/catch
- [ ] استخدم `getErrorMessage()` لعرض الأخطاء للمستخدم
- [ ] تحقق من Admin role في العمليات الحساسة
- [ ] اختبر Security Rules قبل Deploy
- [ ] لا تكشف معلومات حساسة في رسائل الأخطاء

---

## 8. الخطوات التالية

### تفعيل Admin Custom Claims

1. إنشاء Firebase Cloud Function:

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setAdminRole = functions.https.onCall(async (data, context) => {
  // التحقق من أن المستخدم الحالي هو admin
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can set admin roles'
    );
  }

  const { uid } = data;
  await admin.auth().setCustomUserClaims(uid, { admin: true });

  return { success: true };
});
```

2. Deploy Functions:

```bash
firebase deploy --only functions
```

3. تفعيل أول Admin يدوياً من Firebase Console أو Admin SDK

---

## 9. الموارد

- [Firebase Security Rules Docs](https://firebase.google.com/docs/rules)
- [Zod Documentation](https://zod.dev)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**آخر تحديث**: المرحلة 1 - الأمان والاستقرار
**التاريخ**: 2025-11-28
