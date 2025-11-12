# IDE3 Sovereign Mode Guide

## What is Sovereign Mode?

**Sovereign Mode** means IDE3 runs 100% locally with **zero external API calls**. Your code, your data, your machine. No cloud, no tracking, no limits.

---

## Quick Setup

### 1. Install Ollama

```bash
# MacOS/Linux
curl https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

### 2. Pull a Model

```bash
# Recommended: WizardLM (best for coding)
ollama pull wizardlm2:7b

# Alternative: Vicuna (good balance)
ollama pull vicuna:7b

# Alternative: CodeLlama (specialized for code)
ollama pull codellama:13b
```

### 3. Install IDE3

```bash
cd ide3
npm install
npm run build
npm link
```

### 4. Launch

```bash
ide3
```

That's it! You're running 100% sovereign.

---

##  What You Get

### Sovereign by Default
- **No external API calls**
- **No data leaves your machine**
- **No API keys required**
- **No rate limits**
- **No costs**
- **Full privacy**

### Trust System
First time in a directory, IDE3 asks permission:
```
⚠️  Do you trust the files in this folder?

   /your/project

   ❯ 1. Yes, I trust this folder (proceed)
     2. No, exit for now
```

Once trusted, IDE3 remembers.

### Multi-Provider Support
IDE3 detects available providers automatically:

1. **Ollama** (preferred) - Sovereign mode
2. **Claude API** (fallback) - Cloud mode
3. **Hybrid** (optional) - Ollama + Claude tools

---

## Configuration

### Check Current Mode

```bash
ide3

> /config

📋 Current Configuration:

  Mode:     ollama
  Provider: ollama
  Model:    vicuna:7b

Switch modes with: /mode ollama | claude | hybrid
```

### Switch Modes

```bash
# In IDE3 chat:
> /mode ollama    # 100% local (sovereign)
> /mode claude    # Cloud API
> /mode hybrid    # Local AI + Cloud tools
```

Or edit `~/.ide3-config.json`:

```json
{
  "mode": "ollama",
  "ollamaHost": "http://localhost:11434"
}
```

---

## Models Comparison

### WizardLM2:7B (Recommended)
- **Best for**: General coding, projects
- **RAM**: ~8GB
- **Speed**: Fast
- **Quality**: Excellent
```bash
ollama pull wizardlm2:7b
```

### Vicuna:7B
- **Best for**: Balanced performance
- **RAM**: ~8GB
- **Speed**: Fast
- **Quality**: Very good
```bash
ollama pull vicuna:7b
```

### CodeLlama:13B
- **Best for**: Complex code
- **RAM**: ~16GB
- **Speed**: Moderate
- **Quality**: Excellent for code
```bash
ollama pull codellama:13b
```

### Llama2:7B
- **Best for**: Low resource machines
- **RAM**: ~6GB
- **Speed**: Very fast
- **Quality**: Good
```bash
ollama pull llama2:7b
```

---

## Trust Management

### List Trusted Directories
```bash
> /trust

🔐 Trusted Directories:

  • /home/user/projects/app1
  • /home/user/projects/app2
```

### Untrust Current Directory
```bash
> /trust untrust

⊘ Removed trust for: /current/directory
```

### Trust File Location
```
~/.ide3-trusted-dirs.json
```

Delete this file to reset all trust.

---

## Privacy & Security

### What IDE3 Can Do
✅ Read files in current directory
✅ Write files in current directory
✅ Execute commands (npm, git, etc.)
✅ Install packages
✅ Run builds and tests

### What IDE3 Cannot Do
❌ Access files outside current directory (unless you `cd`)
❌ Send data to external servers (sovereign mode)
❌ Execute with sudo/elevated privileges
❌ Modify system files
❌ Access network (except Ollama localhost)

### Trust System Protection
- Must explicitly trust each directory
- Trust is per-directory, not global
- Can revoke trust anytime
- No automatic trust escalation

---

## Cloud Mode (Optional)

If you want to use Claude API instead:

### 1. Get API Key
```bash
# Get key from https://console.anthropic.com
export ANTHROPIC_API_KEY=sk-...
```

### 2. Switch Mode
```bash
ide3
> /mode claude
✓ Mode switched to: claude
  Restart IDE3 for changes to take effect
```

### 3. Restart
```bash
exit
ide3
```

---

## Hybrid Mode (Advanced)

Use local AI with cloud-powered tools:

### 1. Configure
```json
{
  "mode": "hybrid",
  "ollamaHost": "http://localhost:11434",
  "anthropicApiKey": "sk-..."
}
```

### 2. Restart IDE3
```bash
ide3
```

You get:
- Local AI for responses (privacy)
- Cloud tools when needed (power)

---

## Troubleshooting

### "Ollama not found"

**Solution:**
```bash
# Check if Ollama is running
ollama list

# If not installed:
curl https://ollama.ai/install.sh | sh

# Pull a model:
ollama pull vicuna:7b
```

### "No model available"

**Solution:**
```bash
# List available models
ollama list

# If empty, pull one:
ollama pull vicuna:7b
```

### Slow performance

**Solutions:**
1. Use a smaller model: `ollama pull llama2:7b`
2. Close other apps to free RAM
3. Check system resources: `htop` or Activity Monitor

### High RAM usage

**Solution:**
Use smaller models:
```bash
ollama pull vicuna:7b    # 8GB RAM
ollama pull llama2:7b    # 6GB RAM
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `/config` | Show current configuration |
| `/mode <type>` | Switch AI provider mode |
| `/trust` | Manage trusted directories |
| `/trust untrust` | Remove trust for current dir |
| `/clear` | Clear conversation history |
| `/help` | Show all commands |
| `/exit` | Exit IDE3 |

---

## Why Sovereign?

### Privacy
- Your code never leaves your machine
- No tracking, no telemetry
- No data mining
- Complete control

### Cost
- No API fees
- No rate limits
- Unlimited usage
- Free forever

### Speed
- No network latency
- No API quotas
- Instant responses
- Works offline

### Reliability
- No service outages
- No API changes
- No deprecations
- You're in control

---

## Comparison

| Feature | Sovereign (Ollama) | Cloud (Claude API) |
|---------|-------------------|-------------------|
| **Privacy** | 100% local | Data sent to Anthropic |
| **Cost** | Free | Pay per token |
| **Speed** | Depends on hardware | Depends on network |
| **Limits** | None | API rate limits |
| **Offline** | ✅ Yes | ❌ No |
| **Setup** | Install Ollama | Get API key |
| **Quality** | Very good | Excellent |

---

## Best Practices

### 1. Start Sovereign
Begin with Ollama for privacy and cost.

### 2. Use Cloud Selectively
Switch to Claude only for complex tasks.

### 3. Trust Sparingly
Only trust directories you own and understand.

### 4. Model Selection
- **Quick tasks**: llama2:7b
- **Most projects**: vicuna:7b or wizardlm2:7b
- **Complex code**: codellama:13b

### 5. Keep Models Updated
```bash
ollama pull vicuna:7b  # Re-pull to update
```

---

## Get Started

```bash
# 1. Install Ollama
curl https://ollama.ai/install.sh | sh

# 2. Pull model
ollama pull vicuna:7b

# 3. Install IDE3
cd ide3 && npm install && npm run build && npm link

# 4. Launch
ide3

# 5. Start building!
> create a todo app with React
```

**Welcome to sovereign development!** 🔒🚀
