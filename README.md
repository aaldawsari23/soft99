# Soft99 - متجر قطع غيار الدراجات النارية 🏍️

متجر إلكتروني متخصص في قطع غيار الدراجات النارية، مبني بـ **Next.js 15** و **TypeScript** و **Firebase** و **Tailwind CSS**.

## ✨ المميزات

### واجهة المتجر
- 🏠 **الصفحة الرئيسية**: تصميم جذاب مع عرض للمنتجات المميزة والفئات
- 📦 **صفحة المنتجات**: عرض شامل مع فلاتر Dropdown بسيطة
- 🔍 **بحث ذكي**: Search Modal يفتح بـ Cmd+K مع نتائج فورية
- 📱 **تصميم متجاوب**: يعمل على جميع الأجهزة (موبايل، تابلت، كمبيوتر)
- 🌙 **ثيم داكن**: تصميم احترافي بالألوان الأسود والأحمر
- 🛒 **سلة التسوق**: إضافة وإدارة المنتجات

### لوحة التحكم (Admin Panel)
- 🔐 **تسجيل الدخول**: حماية لوحة التحكم
- 📊 **Dashboard**: إحصائيات سريعة عن المنتجات والفئات
- ➕ **إدارة المنتجات**: نموذج بـ 3 خطوات (أساسي → تفاصيل → صور)
- 📸 **رفع الصور**: رفع مباشر إلى Firebase Storage
- 📁 **إدارة الفئات**: تنظيم المنتجات في فئات
- 🏷️ **إدارة الماركات**: إضافة وإدارة الماركات

## 🚀 التقنيات المستخدمة

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Context
- **Language Support**: عربي (RTL)

## 🛠️ التثبيت والتشغيل

### المتطلبات
- Node.js 18.0 أو أحدث
- npm أو yarn

### خطوات التثبيت

1. **استنساخ المشروع**:
```bash
git clone https://github.com/aaldawsari23/soft99.git
cd soft99
```

2. **تثبيت الحزم**:
```bash
npm install
```

3. **إعداد متغيرات البيئة**:
```bash
cp .env.example .env.local
# ثم أضف بيانات Firebase الخاصة بك
```

4. **تشغيل المشروع**:
```bash
npm run dev
```

5. **فتح المتصفح**:
افتح [http://localhost:3000](http://localhost:3000)

### أوامر أخرى

```bash
# بناء المشروع للإنتاج
npm run build

# تشغيل المشروع في وضع الإنتاج
npm start

# فحص الكود
npm run lint
```

## 🔑 الوصول للوحة التحكم

- الرابط: `/admin`
- تسجيل الدخول عبر Firebase Authentication

## 🔥 Firebase

المشروع مربوط مع Firebase:
- **Firestore**: لتخزين المنتجات والفئات والماركات
- **Storage**: لرفع صور المنتجات
- **Authentication**: لحماية لوحة التحكم

### إعداد Firebase

1. أنشئ مشروع في [Firebase Console](https://console.firebase.google.com/)
2. فعّل Firestore Database
3. فعّل Storage
4. أضف بيانات المشروع في `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📁 هيكل المشروع

```
src/
├── app/                    # صفحات Next.js
│   ├── (public)/          # الصفحات العامة
│   └── admin/             # لوحة التحكم
├── components/            # المكونات
│   ├── admin/            # مكونات الأدمن
│   ├── layout/           # Navbar, Footer
│   ├── products/         # ProductCard, ProductGrid
│   └── ui/               # SearchModal, FilterDropdown
├── contexts/             # React Contexts
├── lib/                  # Firebase + Data Providers
│   └── data-providers/   # Firestore/Local providers
├── types/                # TypeScript types
└── utils/                # Helper functions
```

## 🌐 النشر

### Netlify

1. اربط الريبو مع Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`

### Vercel

1. اربط الريبو مع Vercel
2. سيتم اكتشاف الإعدادات تلقائياً

---

صُنع بـ ❤️ لعشاق الدراجات النارية
