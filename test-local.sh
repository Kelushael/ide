#!/bin/bash
# Quick test script to verify IDE3 build

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║              IDE3 Local Test Suite                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Check if files exist
echo -e "${YELLOW}[1/6] Checking project files...${NC}"
files=(
    "Dockerfile"
    "build-package.sh"
    "cli/index.ts"
    "cli/ollama-client.ts"
    "cli/chat-session.ts"
    "mcp-server/server.py"
    "mcp-server/requirements.txt"
    "dist-cli/index.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file missing!"
        exit 1
    fi
done
echo ""

# Test 2: Check build outputs
echo -e "${YELLOW}[2/6] Checking build artifacts...${NC}"
if [ -d "dist-cli" ]; then
    echo -e "  ${GREEN}✓${NC} CLI built"
else
    echo -e "  ${RED}✗${NC} CLI not built (run: npm run build)"
    exit 1
fi

if [ -d "dist" ]; then
    echo -e "  ${GREEN}✓${NC} GUI built"
else
    echo -e "  ${RED}✗${NC} GUI not built (run: npm run build)"
    exit 1
fi
echo ""

# Test 3: Test CLI help
echo -e "${YELLOW}[3/6] Testing CLI...${NC}"
if node dist-cli/index.js --help > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} CLI runs"
else
    echo -e "  ${RED}✗${NC} CLI failed"
    exit 1
fi
echo ""

# Test 4: Test CLI exec
echo -e "${YELLOW}[4/6] Testing code execution...${NC}"
output=$(node dist-cli/index.js exec "console.log('test')" 2>&1)
if echo "$output" | grep -q "test"; then
    echo -e "  ${GREEN}✓${NC} Code execution works"
else
    echo -e "  ${RED}✗${NC} Code execution failed"
    exit 1
fi
echo ""

# Test 5: Check Python dependencies
echo -e "${YELLOW}[5/6] Checking Python setup...${NC}"
if python3 --version > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Python3 available"
else
    echo -e "  ${YELLOW}⚠${NC}  Python3 not found (needed for MCP server)"
fi
echo ""

# Test 6: Check Docker
echo -e "${YELLOW}[6/6] Checking Docker...${NC}"
if command -v docker > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Docker available"
    if docker ps > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Docker daemon running"
    else
        echo -e "  ${YELLOW}⚠${NC}  Docker daemon not running"
    fi
else
    echo -e "  ${YELLOW}⚠${NC}  Docker not installed (needed for packaging)"
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    TEST RESULTS                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ All core tests passed!${NC}"
echo ""
echo "You can now:"
echo "  1. Test locally:"
echo "     node dist-cli/index.js exec \"console.log('Hello')\""
echo ""
echo "  2. Build Docker image:"
echo "     docker build -t ide3-ai ."
echo ""
echo "  3. Create distributable package:"
echo "     ./build-package.sh"
echo ""
echo "  4. Test full system:"
echo "     docker run -d --name ide3-test ide3-ai:latest"
echo "     docker exec -it ide3-test node /app/dist-cli/index.js --help"
echo "     docker stop ide3-test && docker rm ide3-test"
echo ""
