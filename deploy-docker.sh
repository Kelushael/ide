#!/bin/bash
# Package and Deploy Docker Edition

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        IDE3 Docker Edition - Packaging Script             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Build
echo "📦 Packaging Docker Edition..."
echo ""

# Run build-package script
./build-package.sh

# Create distribution archive
echo ""
echo "📁 Creating distribution archive..."
cd dist-package
tar -czf ../ide3-v1.0.0.tar.gz .
cd ..
echo "✓ Created: ide3-v1.0.0.tar.gz"

# Get file size
SIZE=$(du -h ide3-v1.0.0.tar.gz | cut -f1)
echo "✓ Package size: $SIZE"
echo ""

# Choose distribution method
echo "Choose distribution method:"
echo "  1) GitHub Release (recommended)"
echo "  2) Docker Hub (for Docker pull)"
echo "  3) Direct download (your server)"
echo "  4) Just package (manual distribution)"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "📤 GitHub Release Instructions:"
    echo ""
    echo "1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/releases/new"
    echo "2. Tag version: v1.0.0"
    echo "3. Release title: IDE3 v1.0.0"
    echo "4. Upload: ide3-v1.0.0.tar.gz"
    echo "5. Add description:"
    echo ""
    cat << 'DESC'
# IDE3 v1.0.0 - Autonomous Local AI Coding Assistant

## Features
- Zero API costs (runs locally)
- 8GB RAM compatible
- Uncensored AI (Dolphin-Coder-7B)
- Complete coding tools (file/bash/git/docker)
- Handles 100k+ token context

## Installation
```bash
# Download and extract
tar -xzf ide3-v1.0.0.tar.gz
cd dist-package

# Install (one command)
./install.sh

# Start using
ide3 start    # Downloads model (~4GB, first time only)
ide3 chat     # Start coding!
```

## Requirements
- 8GB RAM minimum
- 10GB disk space
- Docker (auto-installed if missing)

## What's New
- Initial release
- Full MCP server
- Ollama integration
- Supabase storage
DESC
    echo ""
    echo "6. Publish release"
    echo ""
    echo "Users will download via:"
    echo "  wget https://github.com/YOUR_USER/YOUR_REPO/releases/download/v1.0.0/ide3-v1.0.0.tar.gz"
    ;;
  2)
    echo ""
    echo "🐳 Docker Hub Instructions:"
    echo ""
    echo "1. Build and tag image:"
    echo "   docker build -t YOUR_USERNAME/ide3:latest ."
    echo "   docker tag YOUR_USERNAME/ide3:latest YOUR_USERNAME/ide3:v1.0.0"
    echo ""
    echo "2. Login and push:"
    echo "   docker login"
    echo "   docker push YOUR_USERNAME/ide3:latest"
    echo "   docker push YOUR_USERNAME/ide3:v1.0.0"
    echo ""
    echo "Users will install via:"
    echo "   docker pull YOUR_USERNAME/ide3:latest"
    echo "   docker run -d -p 11434:11434 YOUR_USERNAME/ide3:latest"
    ;;
  3)
    echo ""
    echo "📤 Upload ide3-v1.0.0.tar.gz to your server"
    echo ""
    echo "Example commands:"
    echo "  scp ide3-v1.0.0.tar.gz user@yourserver.com:/var/www/downloads/"
    echo ""
    echo "Or upload via:"
    echo "  - FTP/SFTP"
    echo "  - AWS S3"
    echo "  - Google Cloud Storage"
    echo "  - Dropbox/Google Drive"
    echo ""
    echo "Share download link:"
    echo "  https://yourserver.com/downloads/ide3-v1.0.0.tar.gz"
    ;;
  4)
    echo ""
    echo "✅ Package ready: ide3-v1.0.0.tar.gz"
    echo ""
    echo "Distribute via:"
    echo "  - Email"
    echo "  - USB drive"
    echo "  - Network share"
    echo "  - BitTorrent"
    echo "  - Any file sharing service"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 Docker Edition is packaged!"
echo ""
echo "File: ide3-v1.0.0.tar.gz ($SIZE)"
echo ""
echo "Users install with:"
echo "  tar -xzf ide3-v1.0.0.tar.gz"
echo "  cd dist-package && ./install.sh"
echo "  ide3 start && ide3 chat"
echo ""
echo "Full power, zero costs, pure autonomy! 🔥"
echo ""
