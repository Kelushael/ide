#!/bin/bash
# IDE3 - Complete Packaging Script
# Creates a single distributable package with EVERYTHING included

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         IDE3 - AI Coding Agent Packaging System           ║"
echo "║    Building single-executable with embedded Ollama         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Step 1: Build Docker image
echo -e "${CYAN}[1/5] Building Docker image with Ollama + IDE3...${NC}"
docker build -t ide3-ai:latest .
echo -e "${GREEN}✓ Docker image built${NC}"
echo ""

# Step 2: Create distribution directory
echo -e "${CYAN}[2/5] Creating distribution package...${NC}"
mkdir -p dist-package
echo -e "${GREEN}✓ Distribution directory created${NC}"
echo ""

# Step 3: Save Docker image as tar
echo -e "${CYAN}[3/5] Exporting Docker image (this may take a few minutes)...${NC}"
docker save ide3-ai:latest | gzip > dist-package/ide3-ai-image.tar.gz
IMAGE_SIZE=$(du -h dist-package/ide3-ai-image.tar.gz | cut -f1)
echo -e "${GREEN}✓ Docker image exported (${IMAGE_SIZE})${NC}"
echo ""

# Step 4: Create install script
echo -e "${CYAN}[4/5] Creating installation script...${NC}"
cat > dist-package/install.sh << 'INSTALL_SCRIPT'
#!/bin/bash
# IDE3 One-Command Installer

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║              IDE3 AI Coding Agent Installer                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    echo "✅ Docker installed"
else
    echo "✅ Docker found"
fi

# Load Docker image
echo ""
echo "📦 Loading IDE3 image..."
docker load < ide3-ai-image.tar.gz
echo "✅ Image loaded"

# Create helper script
echo ""
echo "🔧 Creating 'ide3' command..."
sudo tee /usr/local/bin/ide3 > /dev/null << 'EOF'
#!/bin/bash
# IDE3 Helper Script

if [ "$1" == "start" ]; then
    docker run -d --name ide3-agent \
        -p 11434:11434 \
        -p 8080:8080 \
        -p 3000:3000 \
        -v $(pwd):/workspace \
        -v ide3-models:/root/.ollama/models \
        ide3-ai:latest
    echo "✅ IDE3 started in background"
    echo "💬 Run: ide3 chat"
elif [ "$1" == "stop" ]; then
    docker stop ide3-agent && docker rm ide3-agent
    echo "✅ IDE3 stopped"
elif [ "$1" == "chat" ]; then
    docker exec -it ide3-agent node /app/dist-cli/index.js chat
elif [ "$1" == "exec" ]; then
    shift
    docker exec -it ide3-agent node /app/dist-cli/index.js exec "$@"
elif [ "$1" == "gui" ]; then
    echo "🌐 Opening GUI at http://localhost:3000"
    xdg-open http://localhost:3000 2>/dev/null || open http://localhost:3000 2>/dev/null || echo "Open your browser to: http://localhost:3000"
elif [ "$1" == "shell" ]; then
    docker exec -it ide3-agent /bin/bash
else
    echo "IDE3 - AI Coding Agent"
    echo ""
    echo "Usage:"
    echo "  ide3 start          Start IDE3 in background"
    echo "  ide3 stop           Stop IDE3"
    echo "  ide3 chat           Start AI chat session"
    echo "  ide3 exec <code>    Execute code"
    echo "  ide3 gui            Open web interface"
    echo "  ide3 shell          Open container shell"
fi
EOF

sudo chmod +x /usr/local/bin/ide3

echo "✅ Command created"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  Installation Complete!                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Quick Start:"
echo "  1. ide3 start      # Start the agent (downloads model on first run ~4GB)"
echo "  2. ide3 chat       # Start chatting with AI"
echo ""
echo "The model (Dolphin-Coder-7B) is UNCENSORED - no safety filters!"
echo ""

INSTALL_SCRIPT

chmod +x dist-package/install.sh
echo -e "${GREEN}✓ Install script created${NC}"
echo ""

# Step 5: Create README
echo -e "${CYAN}[5/5] Creating documentation...${NC}"
cat > dist-package/README.txt << 'README'
╔════════════════════════════════════════════════════════════╗
║                  IDE3 AI Coding Agent                      ║
║           Autonomous Local AI - Zero API Costs             ║
╚════════════════════════════════════════════════════════════╝

📦 WHAT'S INCLUDED:
- Ollama AI server (local LLM inference)
- Dolphin-Coder-7B model (uncensored, no safety filters)
- MCP server with all coding tools
- Terminal CLI interface
- Web GUI dashboard
- Docker runtime environment

💾 SYSTEM REQUIREMENTS:
- 8GB RAM minimum
- 10GB disk space (5GB for app + 5GB for model)
- Docker (will be installed if missing)
- Linux, macOS, or Windows with WSL2

🚀 INSTALLATION:

1. Extract this package to any folder
2. Run the installer:
   ./install.sh

3. Start IDE3:
   ide3 start

4. First run will download the model (~4GB, one-time)
5. Chat with your AI:
   ide3 chat

📝 COMMANDS:

  ide3 start          Start IDE3 in background
  ide3 stop           Stop IDE3
  ide3 chat           Interactive AI chat
  ide3 exec <code>    Execute any code
  ide3 gui            Open web interface
  ide3 shell          Access container shell

🔥 FEATURES:

✓ Fully local - no API keys needed
✓ Uncensored AI - no refusals or safety lectures
✓ Executes code in any language
✓ Manages files, git, docker
✓ Handles massive context (100k+ tokens)
✓ Persistent memory via Supabase
✓ Can build entire projects from descriptions
✓ No internet required after setup

⚡ PERFORMANCE:

- Response time: ~1-3 seconds
- Model size: 4.1GB (quantized)
- RAM usage: ~5GB
- CPU: Any modern x64 processor

🛠️ TROUBLESHOOTING:

Q: Model download stuck?
A: Check internet connection, restart with 'ide3 stop && ide3 start'

Q: Out of memory?
A: Close other apps, or use 'ollama pull dolphin-mistral:7b-v2.6-q4_0' for smaller model

Q: Command not found?
A: Run 'sudo ln -s /usr/local/bin/ide3 /usr/bin/ide3'

📖 MORE INFO:

GitHub: [Your repo URL]
Docs: [Your docs URL]

Built with: Ollama + FastMCP + Node.js + React + Supabase

README

echo -e "${GREEN}✓ Documentation created${NC}"
echo ""

# Create release info
cat > dist-package/RELEASE_INFO.txt << INFO
IDE3 AI Coding Agent
Version: 1.0.0
Build Date: $(date)
Package Size: ${IMAGE_SIZE}

Contents:
- ide3-ai-image.tar.gz    Docker image with everything
- install.sh              One-command installer
- README.txt              Documentation

Model: Dolphin-Mistral-7B-v2.6 (Uncensored)
Model Size: ~4.1GB (downloads on first run)
Total Disk: ~10GB required

INFO

# Final summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  PACKAGING COMPLETE!                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Package created in: dist-package/${NC}"
echo ""
echo "Contents:"
echo "  - ide3-ai-image.tar.gz  (Docker image, ${IMAGE_SIZE})"
echo "  - install.sh            (Installer)"
echo "  - README.txt            (Documentation)"
echo "  - RELEASE_INFO.txt      (Build info)"
echo ""
echo "To distribute:"
echo "  1. Zip the dist-package folder:"
echo "     tar -czf ide3-v1.0.0.tar.gz dist-package/"
echo ""
echo "  2. Upload to GitHub Releases or file host"
echo ""
echo "Users install with:"
echo "  tar -xzf ide3-v1.0.0.tar.gz"
echo "  cd dist-package"
echo "  ./install.sh"
echo ""
echo -e "${CYAN}Model will download automatically on first run (~4GB)${NC}"
echo ""
