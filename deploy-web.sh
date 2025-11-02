#!/bin/bash
# Deploy Web Edition to Vercel/Netlify

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         IDE3 Web Edition - Deployment Script              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Build
echo "📦 Building Web Edition..."
npm run build:gui
echo "✓ Build complete"
echo ""

# Choose deployment target
echo "Choose deployment target:"
echo "  1) Vercel (recommended - free, fast)"
echo "  2) Netlify (alternative - free)"
echo "  3) GitHub Pages (free, requires gh-pages branch)"
echo "  4) Just build (manual deployment)"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🚀 Deploying to Vercel..."
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm i -g vercel
    fi
    vercel --prod
    echo ""
    echo "✅ Deployed to Vercel!"
    echo "   Your site is now live!"
    ;;
  2)
    echo ""
    echo "🚀 Deploying to Netlify..."
    if ! command -v netlify &> /dev/null; then
        echo "Installing Netlify CLI..."
        npm i -g netlify-cli
    fi
    netlify deploy --prod --dir=dist
    echo ""
    echo "✅ Deployed to Netlify!"
    echo "   Your site is now live!"
    ;;
  3)
    echo ""
    echo "🚀 Deploying to GitHub Pages..."

    # Check if gh-pages branch exists
    if ! git show-ref --verify --quiet refs/heads/gh-pages; then
        echo "Creating gh-pages branch..."
        git checkout --orphan gh-pages
        git reset --hard
        git commit --allow-empty -m "Initialize gh-pages"
        git checkout main
    fi

    # Deploy
    git subtree push --prefix dist origin gh-pages
    echo ""
    echo "✅ Deployed to GitHub Pages!"
    echo "   Visit: https://YOUR_USERNAME.github.io/YOUR_REPO"
    echo ""
    echo "   Enable GitHub Pages in repo settings:"
    echo "   Settings → Pages → Source: gh-pages branch"
    ;;
  4)
    echo ""
    echo "✅ Build complete!"
    echo ""
    echo "Files are in: dist/"
    echo ""
    echo "Manual deployment options:"
    echo "  - Upload dist/ to any static host"
    echo "  - Use FTP/SFTP to your server"
    echo "  - Deploy to AWS S3 / CloudFront"
    echo "  - Use Cloudflare Pages"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Web Edition is ready!"
echo ""
echo "Users can now:"
echo "  • Visit your URL"
echo "  • Start coding instantly"
echo "  • No installation needed!"
echo ""
echo "Share the link and watch them build! 🚀"
echo ""
