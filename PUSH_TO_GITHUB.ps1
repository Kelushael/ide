# ============================================
# IDE3 - GitHub Push Script (PowerShell)
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IDE3 - Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Navigate to project directory
Write-Host "Step 1: Navigating to project directory..." -ForegroundColor Yellow
Set-Location "C:\tmp\cc-agent\59521215\project"
Write-Host "✓ Done" -ForegroundColor Green
Write-Host ""

# Step 2: Initialize Git (if needed)
Write-Host "Step 2: Checking Git repository..." -ForegroundColor Yellow
if (-Not (Test-Path ".git")) {
    git init
    git branch -m main
    git config user.email "kelushael@github.com"
    git config user.name "kelushael"
    Write-Host "✓ Git initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git already initialized" -ForegroundColor Green
}
Write-Host ""

# Step 3: Add all files
Write-Host "Step 3: Adding all files to Git..." -ForegroundColor Yellow
git add -A
Write-Host "✓ Files added" -ForegroundColor Green
Write-Host ""

# Step 4: Commit
Write-Host "Step 4: Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit: IDE3 - Terminal AI Coding Agent"
Write-Host "✓ Commit created" -ForegroundColor Green
Write-Host ""

# Step 5: Add remote
Write-Host "Step 5: Adding GitHub remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/Kelushael/https-github.com-Kelushael-ide3.git
Write-Host "✓ Remote added" -ForegroundColor Green
Write-Host ""

# Step 6: Push to GitHub
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted for GitHub credentials..." -ForegroundColor Cyan
git push -u origin main
Write-Host "✓ Pushed to GitHub!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository is live at:" -ForegroundColor Cyan
Write-Host "https://github.com/Kelushael/https-github.com-Kelushael-ide3" -ForegroundColor White
Write-Host ""
