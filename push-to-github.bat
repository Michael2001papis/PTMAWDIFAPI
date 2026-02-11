@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   העלאת הפרויקט ל-GitHub
echo ========================================
echo.

REM בדיקה אם יש remote
git remote get-url origin 2>nul
if %errorlevel% neq 0 (
    echo מוסיף חיבור ל-GitHub...
    git remote add origin https://github.com/Michael2001papis/PTMAWDIFAPI.git
) else (
    echo Remote כבר מוגדר.
)

echo.
echo מוסיף קבצים...
git add .

echo.
echo יוצר commit...
git commit -m "Initial commit - Task Manager app" 2>nul
if %errorlevel% neq 0 (
    echo אין שינויים חדשים או commit כבר קיים.
)

echo.
echo דוחף ל-GitHub...
git branch -M main
git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ========================================
    echo   ההעלאה הושלמה בהצלחה!
    echo   רענן את הדף: https://github.com/Michael2001papis/PTMAWDIFAPI
    echo ========================================
) else (
    echo ========================================
    echo   ההעלאה נכשלה.
    echo   ודא ש:
    echo   1. החיבור לאינטרנט פעיל
    echo   2. אתה מחובר ל-GitHub: git config --global user.name
    echo   3. ההרשאות לריפוזיטורי תקינות
    echo ========================================
)

echo.
pause
