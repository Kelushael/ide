#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "  IDE3 - Push to GitHub"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

# Get GitHub username
echo "📝 Enter your GitHub username:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Username required"
    exit 1
fi

echo ""
echo "🔧 Setting up remote..."

# Remove old remote if exists
git remote remove origin 2>/dev/null

# Add new remote
git remote add origin "https://github.com/$GITHUB_USERNAME/ide3.git"

echo "✓ Remote added: https://github.com/$GITHUB_USERNAME/ide3.git"
echo ""

# Rename branch to main
echo "🔧 Renaming branch to main..."
git branch -M main
echo "✓ Branch renamed"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  ✓ SUCCESS!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "🎉 Your code is now on GitHub!"
    echo ""
    echo "📍 View it at:"
    echo "   https://github.com/$GITHUB_USERNAME/ide3"
    echo ""
    echo "📦 Next steps:"
    echo "   1. npm login"
    echo "   2. npm publish"
    echo "   3. Share on social media!"
    echo ""
else
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  ❌ PUSH FAILED"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "Common issues:"
    echo "  1. Repository doesn't exist on GitHub"
    echo "     Create it at: https://github.com/new"
    echo ""
    echo "  2. Authentication failed"
    echo "     Set up a Personal Access Token:"
    echo "     https://github.com/settings/tokens"
    echo ""
    echo "  3. Permission denied"
    echo "     Check repository ownership and permissions"
    echo ""
fi
