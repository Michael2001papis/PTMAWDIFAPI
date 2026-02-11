@echo off
cd /d "%~dp0"
echo דוחף ל-GitHub...
git add .
git commit -m "Update" 2>nul
git push -u origin main
echo.
pause
