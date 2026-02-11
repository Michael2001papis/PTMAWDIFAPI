@echo off
REM הסרת חיבור ל-GitHub - הפרויקט יישאר מקומי בלבד
git remote remove origin 2>nul
if %errorlevel% equ 0 (
    echo Remote הוסר בהצלחה. הפרויקט כעת מקומי בלבד.
) else (
    echo אין remote מוגדר, או שהפקודה נכשלה.
)
pause
