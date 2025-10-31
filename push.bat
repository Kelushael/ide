@echo off
echo.
echo ========================================
echo   Pushing IDE3 to GitHub
echo ========================================
echo.

cd /d %~dp0

echo Step 1: Initializing Git...
git init
git branch -m main
git config user.email "kelushael@github.com"
git config user.name "kelushael"

echo.
echo Step 2: Adding files...
git add -A

echo.
echo Step 3: Creating commit...
git commit -m "Initial commit: IDE3 - Terminal AI Coding Agent"

echo.
echo Step 4: Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/Kelushael/https-github.com-Kelushael-ide3.git

echo.
echo Step 5: Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo   SUCCESS! Repository is live at:
echo   https://github.com/Kelushael/https-github.com-Kelushael-ide3
echo ========================================
echo.
pause
