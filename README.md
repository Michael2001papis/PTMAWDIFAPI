# 📋 Task Manager – אפליקציית ניהול משימות

אפליקציית ניהול משימות אישיות עם תמיכה ב-localStorage ויבוא נתונים מ-API חיצוני.

---

## 📦 התקנה והפעלה

### שלב 1: פתיחת הפרויקט
פתחו את תיקיית הפרויקט בטרמינל (Terminal / Command Prompt / PowerShell):

```bash
cd "נתיב_לתיקיית_הפרויקט"
```

### שלב 2: התקנת התלויות
הרצת הפקודה הבאה להורדת כל החבילות הנדרשות:

```bash
npm i
```

> ⏱️ ההתקנה עשויה לקחת כמה שניות. בסיום תופיע הודעת הצלחה.

### שלב 3: בניית הפרויקט
בניית האפליקציה לתיקיית `dist`:

```bash
npm run build
```

### שלב 4: צפייה באפליקציה

**אפשרות א׳ – פתיחת הקובץ:**
- היכנסו לתיקייה `dist` שנוצרה
- פתחו את הקובץ `index.html` בדפדפן (לחיצה כפולה / גרירה לדפדפן)

**אפשרות ב׳ – שרת מקומי (מומלץ):**
```bash
npm run preview
```

לאחר ההרצה, האפליקציה תיפתח בכתובת (בדרך כלל):
```
http://localhost:4173
```

---

## 🛠️ מצב פיתוח (Development)

לפיתוח עם טעינה אוטומטית ורענון בעת שינויים:

```bash
npm run dev
```

האפליקציה תיפתח בכתובת:
```
http://localhost:5173
```

---

## 📁 מבנה הפרויקט

```
PTMAWDIFAPI/
├── index.html      # דף HTML ראשי – מבנה הדף
├── style.css       # עיצוב – צבעים, פריסה, אנימציות
├── script.js       # לוגיקה – JavaScript
├── package.json    # הגדרות הפרויקט ו־npm
├── vite.config.js  # הגדרות בניית Vite
├── .gitignore      # קבצים להתעלמות (node_modules, dist)
└── README.md       # קובץ זה
```

### לאחר בנייה (`npm run build`):

```
dist/
├── index.html      # דף מאוחד
├── script-[hash].js
└── style-[hash].css
```

---

## ✨ יכולות האפליקציה

| פעולה | תיאור |
|-------|-------|
| **הוספת משימה** | הזנת תיאור + תאריך יעד (אופציונלי) |
| **סימון השלמה** | לחיצה על "הושלם" / "בטל השלמה" |
| **מחיקת משימה** | לחיצה על "מחק" |
| **סינון** | הכל / פעילות / הושלמו |
| **מיון** | מיון לפי תאריך יעד |
| **שמירה** | שמירה אוטומטית ב-localStorage |
| **יבוא מ-API** | טעינת 5 משימות ראשוניות מ-JSONPlaceholder |

---

## 🚀 שימוש באפליקציה

1. **הוספת משימה:**  
   הזינו תיאור בשדה הטקסט, בחרו תאריך (אופציונלי) ולחצו "הוסף משימה".  
   ניתן גם ללחוץ Enter בשדה הטקסט.

2. **סינון משימות:**  
   השתמשו בכפתורים "הכל", "פעילות" או "הושלמו" להצגת סוג המשימות הרצוי.

3. **מיון:**  
   לחיצה על "מיין לפי תאריך יעד" תסדיר את המשימות לפי המועד.

4. **יבוא משימות:**  
   בטעינה הראשונה, 5 משימות התחלתיות נטענות אוטומטית מ-API.

---

## 🔧 דרישות מערכת

- **Node.js** – גרסה 14 ומעלה ([הורדה](https://nodejs.org/))
- **npm** – מגיע עם Node.js
- **דפדפן** – Chrome, Firefox, Safari, Edge (ותאימות לדפדפנים ישנים יותר)

---

## 📌 פקודות npm זמינות

| פקודה | תיאור |
|-------|-------|
| `npm i` | התקנת תלויות |
| `npm run build` | בניית הפרויקט לתיקיית `dist` |
| `npm run dev` | הרצת שרת פיתוח עם טעינה אוטומטית |
| `npm run preview` | צפייה בגרסה שנבנתה (`dist`) |

---

## 🧩 טכנולוגיות

- **HTML5** – מבנה סמנטי
- **CSS3** – Flexbox, Transitions, Responsive Design
- **JavaScript (ES5+)** – תאימות לדפדפנים שונים
- **localStorage** – אחסון נתונים בצד הלקוח
- **Fetch API / XMLHttpRequest** – טעינת נתונים מ-API
- **Vite** – כלי בנייה

---

## 🔗 הגדרת Git (Remote)

אם מופיעה האזהרה *"Your repository has no remotes configured to push to"* – יש לחבר את הפרויקט לריפוזיטורי מרוחק (GitHub, GitLab וכו׳).

### שלב 1: יצירת ריפוזיטורי
1. היכנסו ל-[GitHub](https://github.com) ונווטו ל־**New repository**
2. קבעו שם (למשל: `task-manager`), בחרו Public
3. **אל תסמנו** "Add a README" – הפרויקט כבר קיים
4. לחצו **Create repository**

### שלב 2: חיבור ה-Remote
בטרמינל, מתוך תיקיית הפרויקט:

```bash
git remote add origin https://github.com/שם_המשתמש/שם_הריפוזיטורי.git
```

החליפו `שם_המשתמש` ו-`שם_הריפוזיטורי` בנתונים שלכם (למשל: `https://github.com/johndoe/task-manager.git`).

### שלב 3: דחיפה (Push) – **חשוב!**
יש לבצע דחיפה כדי שהריפוזיטורי ב-GitHub לא יהיה ריק. שגיאות כמו *"repository does not contain the requested branch"* או *"ensure the repository is not empty"* מופיעות כשעדיין לא דחפתם קוד:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

> ⚠️ **אם הריפוזיטורי ריק** – שירותים כמו Vercel, Netlify או GitHub Pages לא ימצאו ענף. הרצת הפקודות למעלה פותרת את הבעיה.

---

## ❓ פתרון בעיות

### "The repository does not contain the requested branch" / "ensure the repository is not empty"

**סיבה:** הריפוזיטורי ב-GitHub ריק – אין עדיין קומיטים או ענף `main`.

**פתרון:** הרצה בטרמינל מתוך תיקיית הפרויקט:

```bash
# בדיקה שיש remote
git remote -v

# אם חסר – הוסיפו (החליפו בכתובת שלכם):
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# יצירת קומיט ראשון ודחיפה
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

לאחר הדחיפה הריפוזיטורי לא יהיה ריק והשגיאה תיפתר.

---

## 📄 רישיון

פרויקט לימודי – ניהול משימות אישיות © 2026
