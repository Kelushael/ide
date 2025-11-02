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
\n\
# Start Ollama in background\n\
ollama serve &\n\
OLLAMA_PID=$!\n\
sleep 5\n\
\n\
# Pull the uncensored model (only on first run)\n\
if [ ! -f /root/.ollama/models/dolphin-coder ]; then\n\
  echo "📥 Downloading Dolphin-Coder-7B (uncensored, no safety filters)..."\n\
  ollama pull dolphin-mistral:7b-v2.6\n\
  echo "✅ Model downloaded!"\n\
fi\n\
\n\
# Start MCP server in background\n\
cd /app/mcp-server\n\
python3 server.py &\n\
MCP_PID=$!\n\
\n\
echo ""\n\
echo "✅ IDE3 is ready!"\n\
echo ""\n\
echo "Available commands:"\n\
echo "  node /app/dist-cli/index.js chat    - Start AI chat"\n\
echo "  node /app/dist-cli/index.js exec    - Execute code"\n\
echo "  node /app/dist-cli/index.js gui     - Launch web GUI"\n\
echo ""\n\
echo "Press Ctrl+C to stop"\n\
echo ""\n\
\n\
# Wait for interrupt\n\
wait $OLLAMA_PID $MCP_PID\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 11434 8080 3000

# Start everything
CMD ["/app/start.sh"]
