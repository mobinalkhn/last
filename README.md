<<<<<<< HEAD
# Expo React Native MVP App

## Features
- ورود کاربر و ثبت فاکتور خرید از سوپرمارکت (اسکن تصویر)
- استخراج اقلام فاکتور با Google Vision API
- دریافت اطلاعات هر قلم از OpenFoodFacts.org
- نمایش ویژگی‌های هر قلم به کاربر
- رابط کاربری مدرن و قوی با استفاده از `react-native-paper` و `react-native-elements`

## راه‌اندازی پروژه
1. نصب وابستگی‌ها:
   ```sh
   npm install
   ```
2. اجرای پروژه:
   ```sh
   npx expo start
   ```

## تنظیمات API
- کلید Google Vision API را در فایل `.env` قرار دهید:
  ```env
  GOOGLE_VISION_API_KEY=AIzaSyCSOHiqFDsz1DesPEN_n2NYjMY4xVXYNfc
  ```

## توسعه
- برای توسعه UI از کتابخانه‌های محبوب مانند `react-native-paper` و `react-native-elements` استفاده کنید.
- برای اسکن تصویر از `expo-image-picker` و ارسال به Google Vision API استفاده می‌شود.
- برای ارتباط با OpenFoodFacts.org از axios استفاده کنید:
  ```js
  axios.get('https://world.openfoodfacts.org/api/v0/product/[barcode].json')
  ```

## Git
- پروژه آماده commit و push به مخزن گیت است.

---

> این پروژه یک MVP است و قابلیت توسعه بیشتر دارد.

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
# last
for shopping
>>>>>>> a066038f162692cd7f31594972a3c9699e9f7133
