# 📋 ScanMarket Project Summary

## 🎯 پروژه چیه؟

**ScanMarket** یک اپلیکیشن هوشمند برای اسکن فاکتورهای سوپرمارکت هست که با React Native و Expo ساخته شده و هم رو موبایل و هم رو وب کار میکنه.

## ✨ قابلیت‌های اصلی

### 📱 اپلیکیشن موبایل (Android/iOS)
- **اسکن فاکتور**: عکس گرفتن از فاکتور یا انتخاب از گالری
- **تشخیص متن**: استخراج متن از تصویر با OCR.space API
- **تحلیل محصولات**: دریافت اطلاعات محصولات از OpenFoodFacts API
- **طراحی زیبا**: استفاده از Material Design با React Native Paper

### 🌐 وب اپلیکیشن
- **دسترسی دوربین**: استفاده مستقیم از دوربین مرورگر
- **طراحی ریسپانسیو**: کار کردن روی دسکتاپ و موبایل
- **Progressive Web App**: قابلیت نصب به عنوان اپ
- **کراس پلتفرم**: یک کدبیس برای موبایل و وب

## 🛠️ تکنولوژی‌های استفاده شده

### Frontend
- **React Native**: فریمورک کراس‌پلتفرم
- **Expo SDK ~54.0.10**: پلتفرم توسعه و ابزارها
- **React Native Paper**: کامپوننت‌های Material Design
- **Expo Router**: سیستم ناوبری مبتنی بر فایل
- **TypeScript**: توسعه امن با تایپ‌ها

### APIs & Services
- **OCR.space API**: تشخیص نوری کاراکتر
- **OpenFoodFacts API**: پایگاه داده اطلاعات محصولات
- **Expo Camera**: قابلیت دوربین
- **Expo Image Picker**: انتخاب تصویر

### Build & Deployment
- **Metro Bundler**: JavaScript bundler
- **EAS Build**: سرویس کلودی ساخت اپلیکیشن
- **GitHub Pages**: میزبانی وب
- **Netlify**: میزبانی جایگزین وب

## 📁 ساختار پروژه

```
├── app/                    # صفحات Expo Router
│   ├── index.tsx          # صفحه اصلی اسکنر
│   ├── modal.tsx          # صفحه مودال
│   └── (tabs)/            # ناوبری تب
├── components/            # کامپوننت‌های قابل استفاده مجدد
│   ├── ReceiptScanner.tsx # کامپوننت اصلی اسکنر
│   ├── ProductDetails.tsx # نمایش اطلاعات محصولات
│   └── ui/                # کامپوننت‌های UI
├── assets/               # تصاویر و آیکون‌ها
├── constants/            # ثابت‌ها و تم‌ها
├── hooks/                # React hooks سفارشی
├── scripts/              # اسکریپت‌های ساخت
├── app.json              # تنظیمات Expo
├── package.json          # وابستگی‌ها و اسکریپت‌ها
├── metro.config.js       # تنظیمات Metro bundler
├── netlify.toml          # تنظیمات deploy Netlify
└── README.md             # مستندات پروژه
```

## 🔧 کارهایی که انجام دادیم

### 1. 📱 توسعه اپلیکیشن
- **ساخت UI**: طراحی کامل با Material Design
- **پیاده‌سازی OCR**: اتصال به OCR.space API برای تشخیص متن
- **کامپوننت اسکنر**: ساخت ReceiptScanner با قابلیت‌های پیشرفته
- **مدیریت حالت**: استفاده از React hooks برای مدیریت state
- **Platform-specific code**: کد مخصوص هر پلتفرم (موبایل/وب)

### 2. 🌐 توسعه وب
- **دسترسی دوربین**: پیاده‌سازی دسترسی دوربین برای مرورگرها
- **Responsive Design**: طراحی ریسپانسیو برای اندازه‌های مختلف
- **Build Configuration**: تنظیمات بیلد برای وب
- **Path Fixing**: حل مشکلات مسیر فایل‌های CSS و JS

### 3. 🚀 Deploy و میزبانی
- **GitHub Pages**: تنظیم deploy خودکار
- **Netlify Support**: پشتیبانی از Netlify
- **Build Scripts**: اسکریپت‌های بیلد و deploy
- **Asset Optimization**: بهینه‌سازی فایل‌های استاتیک

### 4. 📝 مستندات و کامنت‌ها
- **JSDoc Comments**: کامنت‌های کامل برای تمام فانکشن‌ها
- **Code Documentation**: توضیح هر بخش از کد
- **README کامل**: مستندات جامع پروژه
- **Persian Comments**: کامنت‌های فارسی برای بهتر فهمیدن

### 5. 🔧 تنظیمات و Config
- **Metro Config**: تنظیمات bundler
- **EAS Config**: تنظیمات بیلد موبایل
- **TypeScript Config**: تنظیمات TypeScript
- **ESLint Config**: تنظیمات کیفیت کد

## 📱 فرآیند اسکن فاکتور

1. **انتخاب تصویر**: کاربر عکس می‌گیره یا از گالری انتخاب می‌کنه
2. **پردازش OCR**: تصویر به OCR.space API فرستاده میشه
3. **استخراج متن**: متن از تصویر استخراج میشه
4. **تجزیه متن**: متن تجزیه میشه و اسم محصولات شناسایی میشه
5. **جستجوی محصول**: محصولات تو OpenFoodFacts جستجو میشن
6. **نمایش نتایج**: اطلاعات محصولات با عکس و جزئیات نمایش داده میشه

## 🌐 لینک‌های مفید

### پروژه روی GitHub
- **Repository**: https://github.com/mobinalkhn/last
- **Web Version**: https://mobinalkhn.github.io/last

### APIs استفاده شده
- **OCR.space**: تشخیص نوری کاراکتر
- **OpenFoodFacts**: پایگاه داده محصولات غذایی

### فایل‌های Deploy
- `scanmarket-FINAL-FIXED.zip`: آخرین نسخه برای آپلود رو هاست
- `dist/`: پوشه بیلد شده وب
- فایل‌های ZIP مختلف برای deploy

## 🎨 طراحی UI/UX

### سیستم طراحی
- **Material Design 3**: زبان طراحی مدرن گوگل
- **رنگ‌بندی**: بنفش اصلی با رنگ‌های مکمل
- **تایپوگرافی**: فونت Roboto
- **آیکون‌ها**: Material Design icons

### دسترسی‌پذیری
- **Screen Reader**: پشتیبانی از صفحه‌خوان
- **High Contrast**: کنتراست بالا برای رنگ‌ها
- **Touch Targets**: اهداف لمس حداقل 44px
- **Keyboard Navigation**: پشتیبانی کامل از کیبورد

## 🔒 امنیت و حریم خصوصی

### مدیریت داده
- **عدم ذخیره**: تصاویر فقط در مموری پردازش میشن
- **امنیت API**: اتصالات امن HTTPS
- **حریم خصوصی**: عدم جمع‌آوری اطلاعات شخصی
- **Open Source**: شفافیت کامل

## 🚀 دستورات مهم

### Development
```bash
# شروع development server
npm start

# اجرا روی اندروید
npm run android

# اجرا روی وب
npm run web
```

### Build & Deploy
```bash
# بیلد برای وب
npm run build:web

# Deploy به GitHub Pages
npm run deploy:gh

# بیلد APK اندروید
npx eas build --platform android --profile preview
```

## 📊 آمارها

- **خطوط کد**: ~2000+ خط
- **کامپوننت‌ها**: 5+ کامپوننت اصلی
- **صفحات**: 4+ صفحه مختلف
- **Dependencies**: 20+ پکیج
- **پلتفرم‌ها**: Android, iOS, Web
- **زبان‌ها**: TypeScript, JavaScript
- **API ها**: 2 سرویس خارجی

## ✅ چک‌لیست کامل

- [x] ✅ ساخت UI کامل
- [x] ✅ پیاده‌سازی OCR
- [x] ✅ دسترسی دوربین (موبایل + وب)
- [x] ✅ نمایش اطلاعات محصولات
- [x] ✅ Responsive Design
- [x] ✅ Deploy وب
- [x] ✅ بیلد موبایل
- [x] ✅ مستندات کامل
- [x] ✅ کامنت‌گذاری کد
- [x] ✅ تست عملکرد
- [x] ✅ بهینه‌سازی سرعت
- [x] ✅ حل مشکلات deploy

---

**🎉 پروژه ScanMarket کاملاً آماده و قابل استفاده است!**

**📧 سازنده**: mobinalkhn  
**📅 تاریخ**: مهر ۱۴۰۴  
**💜 ساخته شده با عشق با React Native & Expo**