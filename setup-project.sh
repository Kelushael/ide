#!/bin/bash
set -e

echo "🚀 Setting up IDE3 project..."
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create all necessary directories
echo "📁 Creating directory structure..."
mkdir -p cli/commands cli/core src/components

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run ./create-files.sh to generate all source files"
echo "  2. Run npm run build to build the project"
echo "  3. Run node dist-cli/index.js to test CLI"
