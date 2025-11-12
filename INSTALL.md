# IDE3 Installation Guide

## Quick Install (Global CLI)

Install IDE3 globally to use it anywhere with just the `ide3` command:

```bash
# Clone or download the project
git clone https://github.com/yourusername/ide3.git
cd ide3

# Install dependencies
npm install

# Build the project
npm run build

# Install globally
npm link

# Or if publishing to npm:
npm install -g ide3
```

## Usage

After installation, just type `ide3` from any directory:

```bash
ide3
```

That's it! You'll see the Claude Code-style interface and can start building immediately.

## What You'll See

```
╭─── IDE3 v1.0.0 ───────────────────────────────────╮
│  Welcome back User!         │ Tips for started    │
│                            │ Run /help           │
│    ▗▄▄▄▖▗▄▄▄ ▗▄▄▄▄▖▗▖  ▗▖   │                     │
│      █  █   █  █   █ █    │ Type your request   │
│      █  █   █  █▄▄▄▀ ▀▀▀▖  │                     │
│    ▗▄█▄▖▀▄▄▄▀▗▄█▄▄▖▀▄▄▄▀    │                     │
│                            │                     │
│  Model: Ollama / Local AI  │ Recent activity     │
│  Path:  /your/project      │ No activity         │
╰────────────────────────────────────────────────────╯
────────────────────────────────────────────────────
> Try "create a simple todo app"
────────────────────────────────────────────────────
  ? for shortcuts              Write mode: ON

>
```

## Requirements

- Node.js 18+
- npm or yarn
- Ollama (for local AI) - optional, can use other providers

## Optional: Setup Ollama

For local AI capabilities:

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama2

# Start Ollama server
ollama serve
```

Then run `ide3` and it will connect automatically.

## Features Out of the Box

✅ **Instant Launch** - Just type `ide3`
✅ **Claude Code Interface** - Professional, polished UX
✅ **Write Mode** - Automatically executes file operations
✅ **Thinking Indicators** - Animated spinners during processing
✅ **File Creation** - Creates files and directories automatically
✅ **Code Execution** - Runs bash, JavaScript, and Python
✅ **Project Building** - Scaffold complete projects via chat

## Commands

```bash
ide3                    # Default: AI chat with write mode
ide3 chat               # AI chat session
ide3 chat --no-write    # Chat without auto-execution
ide3 exec "<code>"      # Execute code directly
ide3 gui                # Launch web dashboard
ide3 --help             # Show all commands
```

## Example Usage

```bash
$ ide3

> create a simple Express server on port 3000

⠋ Thinking…

▸ Creating files…
⠋ Creating package.json…
✓ Created package.json
⠋ Creating server.js…
✓ Created server.js

▸ Executing commands…
⠋ Running bash…
✓ Executed bash
────────────────────────────────────
added 57 packages in 3s
────────────────────────────────────

✓ All actions completed

>
```

## Troubleshooting

### "ide3: command not found"

After `npm link`, restart your terminal or run:
```bash
source ~/.bashrc  # or ~/.zshrc
```

### "Ollama not available"

Either:
1. Install and start Ollama: `ollama serve`
2. Configure another AI provider in `.env`
3. Use direct commands like `ide3 exec`

### Permission Issues

If you get permission errors:
```bash
sudo npm link
# or
npm link --force
```

## Uninstall

```bash
npm unlink -g ide3
# or
npm uninstall -g ide3
```

## Update

```bash
cd ide3
git pull
npm install
npm run build
npm link
```

## Publishing to npm

To publish for others to install via `npm install -g ide3`:

```bash
# Login to npm
npm login

# Publish
npm publish
```

Then anyone can install with:
```bash
npm install -g ide3
ide3
```

## Windows Users

On Windows, use:
```powershell
npm install
npm run build
npm link

# Then just:
ide3
```

## That's It!

You're ready to build projects at the speed of thought with IDE3! 🚀
