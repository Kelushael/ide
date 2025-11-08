# IDE3 - All-in-one AI Coding Agent
# Contains: Ollama + MCP Server + CLI + Model (downloaded on first run)
FROM ubuntu:22.04

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    python3 \
    python3-pip \
    nodejs \
    npm \
    ca-certificates \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.js ./

# Install Node dependencies
RUN npm install

# Copy source code
COPY cli/ ./cli/
COPY src/ ./src/
COPY server/ ./server/
COPY index.html ./
COPY .env ./

# Build the application
RUN npm run build

# Copy MCP server
COPY mcp-server/ ./mcp-server/

# Install Python dependencies for MCP server
RUN pip3 install --no-cache-dir -r ./mcp-server/requirements.txt

# Create model directory
RUN mkdir -p /root/.ollama/models

# Create startup script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "🚀 Starting IDE3 AI Coding Agent..."\n\
echo ""\n\
\n\
# Start Ollama in background\n\
echo "📡 Starting Ollama server..."\n\
ollama serve &\n\
OLLAMA_PID=$!\n\
sleep 5\n\
\n\
# Pull the uncensored model (only on first run)\n\
if ! ollama list | grep -q "dolphin-mistral"; then\n\
  echo "📥 Downloading Dolphin-Mistral-7B (uncensored, no safety filters)..."\n\
  echo "   This will take a few minutes (~4GB)..."\n\
  ollama pull dolphin-mistral:7b-v2.6\n\
  echo "✅ Model downloaded!"\n\
else\n\
  echo "✓ Model already available"\n\
fi\n\
echo ""\n\
\n\
# Start hybrid server in background\n\
echo "🔌 Starting hybrid WebSocket server..."\n\
cd /app\n\
node /app/dist-server/hybrid-server.js &\n\
SERVER_PID=$!\n\
sleep 2\n\
echo "✓ Hybrid server running on port 3001"\n\
echo ""\n\
\n\
echo "✅ IDE3 is ready!"\n\
echo ""\n\
echo "Available commands:"\n\
echo "  node /app/dist-cli/index.js chat       - Start AI chat"\n\
echo "  node /app/dist-cli/index.js chat --mcp - Start AI chat with MCP tools"\n\
echo "  node /app/dist-cli/index.js exec       - Execute code"\n\
echo "  node /app/dist-cli/index.js gui        - Launch web GUI"\n\
echo "  node /app/dist-cli/index.js mcp        - Start MCP server"\n\
echo ""\n\
echo "Or create alias:"\n\
echo "  alias ide3=\"node /app/dist-cli/index.js\""\n\
echo "  ide3 chat"\n\
echo ""\n\
echo "Press Ctrl+C to stop"\n\
echo ""\n\
\n\
# Wait for interrupt\n\
wait $OLLAMA_PID $SERVER_PID\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 11434 3000 3001

# Set environment for GUI server
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Start everything
CMD ["/app/start.sh"]
