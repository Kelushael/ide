# IDE3 Setup Guide

## Quick Setup (3 Minutes)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ide3
npm install
```

### 2. Build

```bash
npm run build
```

This builds both the GUI and CLI into `dist/` and `dist-cli/` directories.

### 3. Test

```bash
# Test CLI
node dist-cli/index.js exec "console.log('Hello IDE3!')"

# Test help
node dist-cli/index.js --help

# Test Python
node dist-cli/index.js exec "print('Hello from Python!')" --language python
```

### 4. Install Globally (Optional)

```bash
npm link
ide3 --help
ide3 exec "console.log('Now globally available!')"
```

## What You Get

### CLI Commands

- `ide3 exec <code>` - Execute JS, Python, or Bash code
- `ide3 gui` - Launch web dashboard (coming soon)
- `ide3 chat` - AI-powered chat (coming soon)

### Web GUI

Open `dist/index.html` in your browser or run a local server:

```bash
npx serve dist
```

The GUI shows:
- Project overview
- Feature list
- Quick start guide
- Example commands

## Project Structure

```
ide3/
├── cli/                    # CLI source (TypeScript)
│   └── index.ts           # Main CLI entry point
├── src/                   # GUI source (React + TypeScript)
│   ├── App.tsx           # Main React app
│   └── ...
├── dist/                  # Built GUI (HTML/CSS/JS)
├── dist-cli/              # Built CLI (Node.js)
│   └── index.js          # Executable CLI
├── package.json          # Dependencies & scripts
├── tsconfig.cli.json     # CLI TypeScript config
└── README.md             # Full documentation
```

## Development

### Watch Mode

```bash
# Watch GUI (React dev server)
npm run dev

# Watch CLI (auto-rebuild on changes)
npm run dev:cli
```

### Build Individual Parts

```bash
# Build GUI only
npm run build:gui

# Build CLI only
npm run build:cli
```

## Examples

### JavaScript
```bash
ide3 exec "const sum = [1,2,3,4,5].reduce((a,b) => a+b); console.log('Sum:', sum)"
```

### Python
```bash
ide3 exec "import math; print(f'Pi is {math.pi:.2f}')" --language python
```

### Bash
```bash
ide3 exec "echo 'Current directory:' && pwd" --language bash
```

## Features Coming Soon

- **AI Chat**: Interactive AI coding assistant
- **GUI Server**: Full web dashboard with file browser
- **File Editing**: AI-assisted code editing
- **Project Creation**: Generate projects from descriptions

## Troubleshooting

### Command not found after `npm link`

```bash
# Re-run npm link
npm unlink -g
npm link
```

### TypeScript errors

```bash
# Clean and rebuild
rm -rf dist dist-cli
npm run build
```

### Permission denied on Linux/Mac

```bash
chmod +x dist-cli/index.js
```

## Next Steps

1. Explore the GUI by opening `dist/index.html`
2. Try all example commands
3. Read `README.md` for full documentation
4. Configure AI providers (OpenAI/Anthropic/Ollama) when ready

## Support

- Check `README.md` for detailed docs
- Open issues on GitHub for bugs
- Contribute via Pull Requests

---

Ready to code with AI! 🚀
