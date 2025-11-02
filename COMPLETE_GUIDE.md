# IDE3 - Complete Packaging & Usage Guide

## 🎯 What You Get

A **single distributable package** containing:
- ✅ Ollama AI server (embedded)
- ✅ Dolphin-Coder-7B model (uncensored, downloads on first run)
- ✅ MCP server with ALL coding tools
- ✅ Terminal CLI with streaming AI chat
- ✅ React web GUI
- ✅ Supabase for persistent storage
- ✅ **NO API keys needed**
- ✅ **NO safety filters**
- ✅ **Runs on 8GB RAM**

## 📦 Build the Package

### Step 1: Build Everything

```bash
# From project root
./build-package.sh
```

This creates `dist-package/` containing:
- `ide3-ai-image.tar.gz` (~2GB Docker image)
- `install.sh` (one-command installer)
- `README.txt` (user documentation)
- `RELEASE_INFO.txt` (build details)

### Step 2: Create Distribution Archive

```bash
# Package everything into single archive
tar -czf ide3-v1.0.0.tar.gz dist-package/

# OR create a zip for Windows users
zip -r ide3-v1.0.0.zip dist-package/
```

### Step 3: Distribute

Upload `ide3-v1.0.0.tar.gz` to:
- GitHub Releases
- Google Drive / Dropbox
- Your website
- Direct file sharing

## 🚀 User Installation (How Your Users Install)

### One-Command Install

```bash
# Download and extract
wget https://your-site.com/ide3-v1.0.0.tar.gz
tar -xzf ide3-v1.0.0.tar.gz
cd dist-package

# Install (requires Docker)
./install.sh

# Start IDE3
ide3 start

# First run downloads model (~4GB, takes 5-10 minutes)
# Wait for "✅ Model downloaded!"

# Start chatting
ide3 chat
```

## 💻 Usage

### Interactive AI Chat

```bash
ide3 chat
```

Features:
- Streaming responses (see AI think in real-time)
- Massive context support (100k+ tokens)
- Conversation history saved to Supabase
- Multi-line input support
- Zero safety filters

Commands within chat:
- `/clear` - Clear conversation
- `/history` - Show message history
- `/save [file]` - Save conversation to JSON
- `/load <file>` - Load conversation from JSON
- `/help` - Show help

### Execute Code

```bash
# JavaScript
ide3 exec "console.log('Hello World')"

# Python
ide3 exec "print('Hello')" --language python

# Bash
ide3 exec "ls -la" --language bash
```

### Open Web GUI

```bash
ide3 gui
# Opens http://localhost:3000
```

### Access Container Shell

```bash
ide3 shell
# Direct access to container for debugging
```

## 🔧 How It Works

### Architecture

```
┌─────────────────────────────────────────────┐
│           Docker Container                  │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Ollama  │  │   MCP    │  │   CLI    │ │
│  │  Server  │←─┤  Server  │←─┤ Interface│ │
│  └──────────┘  └──────────┘  └──────────┘ │
│       ↑             ↑              ↑        │
│       │             │              │        │
│  [Model:4GB]   [Tools:All]   [Chat:UI]     │
└───────┼─────────────┼──────────────┼────────┘
        │             │              │
        └─────────────┴──────────────┘
                      ↓
               ┌──────────────┐
               │   Supabase   │
               │  (Persistent)│
               └──────────────┘
```

### What Happens on First Run

1. Container starts → Ollama launches
2. Checks for model → Not found
3. Downloads Dolphin-Coder-7B (~4GB)
4. Model loads into memory (~5GB RAM)
5. MCP server starts with all tools
6. CLI ready for commands
7. You start chatting!

### Memory Usage

- System: ~1GB
- Docker: ~500MB
- Ollama: ~200MB
- Model: ~4.5GB (in RAM when active)
- **Total: ~6.2GB** (fits in 8GB!)

## 🛠️ MCP Tools Available

The AI has access to:

### File Operations
- `read_file(path)` - Read any file
- `write_file(path, content)` - Write to file
- `list_directory(path)` - List directory
- `search_files(pattern, path)` - Search codebase
- `delete_path(path)` - Delete file/folder

### Command Execution
- `run_bash(command)` - Execute shell command
- `run_python(code)` - Run Python code
- `run_node(code)` - Run JavaScript/Node

### Git Operations
- `git_status(path)` - Check repo status
- `git_commit(message)` - Create commit
- `git_diff(path)` - Show changes

### Docker Operations
- `docker_run(image)` - Launch container
- `docker_ps()` - List containers
- `docker_exec(container, cmd)` - Run in container

### System Info
- `get_system_info()` - CPU, RAM, disk usage

**NO restrictions. NO confirmations. Just execution.**

## 🔥 Uncensored Model

Dolphin-Coder-7B is **fully abliterated**:
- ❌ No safety filters
- ❌ No refusals ("I can't help with that")
- ❌ No lectures or warnings
- ✅ Just executes what you ask
- ✅ Handles any coding task
- ✅ No moral judgments

## 📊 System Requirements

### Minimum
- 8GB RAM
- 4-core CPU (any modern x64)
- 10GB disk space
- Docker installed

### Recommended
- 16GB RAM (for larger projects)
- 8-core CPU (faster inference)
- 20GB disk space (multiple models)
- SSD (faster model loading)

## 🐛 Troubleshooting

### Model won't download
```bash
# Check internet
ping ollama.com

# Manual download
ide3 shell
ollama pull dolphin-mistral:7b-v2.6
```

### Out of memory
```bash
# Use smaller quantization
ide3 shell
ollama pull dolphin-mistral:7b-v2.6-q4_0

# Or free up RAM
docker system prune -a
```

### Port conflicts
```bash
# Change ports
docker run -d --name ide3-agent \
  -p 11435:11434 \
  -p 8081:8080 \
  -p 3001:3000 \
  ide3-ai:latest
```

### Container won't start
```bash
# Check logs
docker logs ide3-agent

# Restart fresh
ide3 stop
docker system prune -f
ide3 start
```

## 🚢 Advanced: Custom Deployment

### Deploy to Remote Server

```bash
# On build machine
docker save ide3-ai:latest | gzip | ssh user@server docker load

# On server
docker run -d -p 11434:11434 ide3-ai:latest
```

### Use Different Model

```bash
# Edit Dockerfile, change this line:
ollama pull dolphin-mistral:7b-v2.6

# To any other model:
ollama pull deepseek-coder:6.7b
ollama pull qwen2.5-coder:7b
ollama pull codellama:7b
```

### Add More Tools

Edit `mcp-server/server.py` and add:

```python
@mcp.tool()
def my_custom_tool(param: str) -> str:
    """Your custom tool description"""
    # Your logic here
    return "result"
```

Rebuild with `./build-package.sh`

## 📈 Roadmap

- [ ] Electron desktop app (double-click to run)
- [ ] VSCode extension integration
- [ ] Multi-model support (switch on the fly)
- [ ] Voice input/output
- [ ] Browser extension for web scraping
- [ ] Auto-update mechanism

## 🤝 Contributing

This is YOUR tool. Modify it, extend it, break it, fix it!

Key files:
- `cli/` - CLI interface and chat
- `mcp-server/` - All the tools
- `Dockerfile` - Container setup
- `build-package.sh` - Packaging script

## 📄 License

MIT - Do whatever you want with it!

## 🌟 Summary

You now have a **completely self-contained, offline AI coding assistant** that:

1. ✅ Costs $0 to run (no API fees)
2. ✅ Works offline (after model download)
3. ✅ Has NO restrictions or safety filters
4. ✅ Fits in 8GB RAM
5. ✅ Handles massive context
6. ✅ Builds entire projects
7. ✅ Distributes as single package
8. ✅ Installs with one command

**Run the build script and start distributing!**
