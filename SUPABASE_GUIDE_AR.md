# 🚀 دليل ربط التطبيق بـ Supabase

## 📋 المحتويات
1. [نظرة عامة](#نظرة-عامة)
2. [الخطوات](#الخطوات)
3. [تشغيل Migration](#تشغيل-migration)
4. [التحقق من نجاح العملية](#التحقق-من-نجاح-العملية)
5. [الملاحظات المهمة](#الملاحظات-المهمة)

---

## 🎯 نظرة عامة

هذا الدليل يساعدك على نقل بيانات تطبيق حجز المواعيد الطبية من ملف JSON إلى قاعدة بيانات Supabase مع الحفاظ على جميع البيانات الحالية.

**ما تم إنشاؤه:**
- ✅ `supabase-schema.sql` - ملف SQL لإنشاء قاعدة البيانات
- ✅ `lib/supabase.ts` - ملف الاتصال بـ Supabase
- ✅ `lib/db.ts` - الدوال للتعامل مع قاعدة البيانات
- ✅ `scripts/migrate-to-supabase.mjs` - سكريبت نقل البيانات
- ✅ `.env.local.example` - ملف مثال للمتغيرات البيئية

---

## 📝 الخطوات

### الخطوة 1️⃣: إنشاء حساب في Supabase

1. افتح [https://supabase.com](https://supabase.com)
2. اضغط على **"Start your project"**
3. سجل دخول باستخدام GitHub أو البريد الإلكتروني
4. اضغط **"New Project"**
5. املأ البيانات:
   - **Name:** `clinic-appointments` (أو أي اسم تريده)
   - **Database Password:** اختر كلمة سر قوية واحفظها! ⚠️
   - **Region:** اختر أقرب منطقة لك (مثل: Europe Central أو Middle East)
   - **Pricing Plan:** Free (مجاني)
6. اضغط **"Create new project"**
7. انتظر 2-3 دقائق حتى يتم إنشاء المشروع

---

### الخطوة 2️⃣: الحصول على مفاتيح API

بعد إنشاء المشروع:

1. اذهب إلى **Settings** (الإعدادات) من القائمة الجانبية
2. اضغط على **API** من القائمة الفرعية
3. ستجد:
   - **Project URL** (مثل: `https://xxxxx.supabase.co`)
   - **anon/public key** (مفتاح طويل)
4. **انسخهم واحفظهم!** سنحتاجهم في الخطوة التالية

---

### الخطوة 3️⃣: إنشاء ملف .env.local

1. انسخ ملف `.env.local.example` واسمه `.env.local`:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

2. افتح ملف `.env.local` وضع المفاتيح:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc.........
\`\`\`

⚠️ **مهم جداً:** استبدل القيم بالمفاتيح الحقيقية من مشروعك!

---

### الخطوة 4️⃣: إنشاء قاعدة البيانات

1. افتح مشروعك في Supabase
2. من القائمة الجانبية، اضغط على **SQL Editor**
3. اضغط **"New Query"**
4. افتح ملف `supabase-schema.sql` من مشروعك
5. انسخ **كل المحتوى** والصقه في SQL Editor
6. اضغط **"Run"** أو اضغط `Ctrl + Enter`
7. انتظر حتى يظهر ✅ **"Success. No rows returned"**

الآن تم إنشاء جميع الجداول! يمكنك التحقق من القائمة الجانبية في **Table Editor**.

---

### الخطوة 5️⃣: نقل البيانات من JSON إلى Supabase

الآن سننقل جميع بياناتك الحالية:

\`\`\`bash
# تحميل المتغيرات البيئية وتشغيل Migration
node --experimental-modules scripts/migrate-to-supabase.mjs
\`\`\`

إذا لم يعمل، جرب:

\`\`\`bash
# الطريقة البديلة
node --loader dotenv/config scripts/migrate-to-supabase.mjs
\`\`\`

**ملاحظة:** قد تحتاج لتثبيت `dotenv`:
\`\`\`bash
npm install dotenv
\`\`\`

---

## ✅ التحقق من نجاح العملية

بعد تشغيل Migration، ستظهر لك رسالة مثل:

\`\`\`
✅ Migration completed successfully!

📋 Summary:
   - Users: 2
   - Patients: 15
   - Doctors: 8
   - Appointments: 45
   - Services: 3
   - Blogs: 10
   - News: 5
   - Contacts: 20
   - Site Settings: 2
\`\`\`

### تحقق من البيانات في Supabase:

1. افتح مشروعك في Supabase
2. اذهب إلى **Table Editor**
3. افتح كل جدول وتأكد من وجود البيانات:
   - `doctors` - يجب أن ترى الأطباء
   - `patients` - قائمة المرضى
   - `appointments` - المواعيد
   - `services` - الخدمات
   - `blogs` - المقالات
   - إلخ...

---

## 🔄 الخطوة التالية: تحديث التطبيق

الآن التطبيق جاهز تقريباً! البيانات موجودة في Supabase، ولكن يجب تحديث ملفات API لاستخدام `lib/db.ts` بدلاً من `lib/cms.ts`.

### ما يجب تحديثه:

سأحتاج لتحديث الملفات التالية:
- `app/api/public/appointments/route.ts`
- `app/api/public/doctors/[slug]/appointments/route.ts`
- `app/api/public/contact/route.ts`
- `app/api/public/projects/[slug]/interest/route.ts`
- جميع صفحات Dashboard
- صفحات الموقع التي تقرأ البيانات

**هل تريد أن أقوم بتحديث هذه الملفات الآن؟** 🤔

---

## 📌 الملاحظات المهمة

### ✅ مميزات الـ Migration:

1. **لا فقدان للبيانات:** جميع بياناتك محفوظة في `data/cms.json` ولن تحذف
2. **نسخة احتياطية:** ملف JSON الأصلي سيبقى كنسخة احتياطية
3. **Database Schema:** تم إنشاء indexes للأداء الأفضل
4. **Security:** تم إعداد Row Level Security (RLS) policies

### ⚠️ تحذيرات:

1. **لا تشغل Migration مرتين!** سيحاول إدخال نفس البيانات مرة أخرى وقد يفشل
2. **احفظ مفاتيح Supabase في مكان آمن** ولا تشاركها مع أحد
3. **لا تضف `.env.local` إلى Git** (الملف موجود في `.gitignore`)

### 🔐 الأمان:

- كلمات السر في الـ Database مخزنة كنص عادي (plain text)
- **يُنصح بشدة:** استخدام Supabase Auth بدلاً من تخزين كلمات السر
- يمكننا تحسين الأمان لاحقاً باستخدام bcrypt أو Supabase Auth

---

## 🆘 المشاكل الشائعة

### المشكلة: "Missing Supabase environment variables"
**الحل:** تأكد من إنشاء ملف `.env.local` بالمفاتيح الصحيحة

### المشكلة: "duplicate key value violates unique constraint"
**الحل:** تم تشغيل Migration مرتين. احذف البيانات من Supabase واعد المحاولة

### المشكلة: "Failed to connect to Supabase"
**الحل:** تحقق من صحة الـ URL والـ API key في `.env.local`

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من ملف `.env.local`
2. تحقق من SQL Editor في Supabase إذا كانت الجداول موجودة
3. اعرض console logs في Terminal

---

## 🎉 تهانينا!

الآن تطبيقك متصل بـ Supabase! 🚀

**الخطوات التالية:**
- ✅ تحديث ملفات API لاستخدام `lib/db.ts`
- ✅ تحديث صفحات Dashboard
- ✅ تحديث صفحات الموقع
- 🔒 تحسين الأمان باستخدام Supabase Auth (اختياري)
- 📸 إضافة Supabase Storage للصور (اختياري)

**هل أنت مستعد للخطوة التالية؟** 💪
