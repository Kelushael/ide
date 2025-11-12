# IDE3 - Terminal AI Coding Agent

A powerful terminal-based AI coding assistant that can dynamically spawn beautiful web-based GUI interfaces when needed. Work primarily in the terminal with an AI agent, but launch rich visual tools for complex tasks.

![IDE3 Banner](https://via.placeholder.com/1200x400/0f172a/06b6d4?text=IDE3+-+Terminal+AI+Coding+Agent)

## Features

- **Write Mode by Default**: Just like Claude Code - automatically executes code upon detecting intent
- **Terminal-First Workflow**: Interactive CLI with AI-powered coding assistance
- **Dynamic GUI Spawning**: Launch vibrant web-based interfaces for visual tasks
- **Multi-LLM Support**: Works with OpenAI, Anthropic, Ollama, and local models
- **Automatic Code Execution**: Detects and runs JavaScript, Python, and Bash code blocks instantly
- **Global CLI Access**: Install once, use anywhere with `ide3` command
- **File Management**: AI-assisted file editing with visual diff viewer
- **Project Creation**: Scaffold entire projects from natural language descriptions
- **Conversation History**: All chats saved to Supabase for cross-device access
- **WebSocket Communication**: Real-time sync between CLI and GUI

## Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ide3

# Install dependencies
npm install

# Build the project
npm run build

# Test it
node dist-cli/index.js exec "console.log('Hello IDE3!')"
```

### Install Globally

```bash
# Option 1: Development (uses symlink)
npm link

# Option 2: Production (creates package)
npm pack
npm install -g ./ide3-1.0.0.tgz

# Add to PATH (if needed)
export PATH="$(npm config get prefix)/bin:$PATH"

# Test installation
ide3 --help
```

## Usage

### Default: AI Chat with Write Mode

Just run `ide3` and start chatting! The AI will automatically execute code when it detects intent.

```bash
ide3
# Launches AI chat in write mode - executes immediately upon intent
```

**Write Mode Features:**
- **File Operations**: Create, read, and modify files automatically
- **Code Execution**: Runs JavaScript, Python, and Bash code immediately
- **Project Building**: Scaffold entire projects from descriptions
- **Dependency Installation**: Automatically installs packages when needed
- **No Confirmations**: Everything executes immediately
- **Full File System Access**: Create directories, write files, run builds
- Disable with: `ide3 chat --no-write`

**Build Anything via Chat:**
```bash
$ ide3

You: Create a todo list app with HTML, CSS, and JavaScript

AI: [Creates index.html, style.css, app.js automatically]

📝 Creating/updating files...
✓ Created: index.html
✓ Created: style.css
✓ Created: app.js
✓ All actions completed
```

See [CHAT_EXAMPLES.md](./CHAT_EXAMPLES.md) for more examples.

### Execute Code Directly

```bash
# JavaScript
ide3 exec "console.log('Hello World')"

# Python
ide3 exec "print('Hello World')" --language python

# Bash
ide3 exec "ls -la" --language bash
```

### Launch GUI Dashboard

```bash
ide3 gui
# Opens beautiful web interface at http://localhost:3000
```

### AI Chat (Explicit)

```bash
ide3 chat                # Chat with write mode enabled (default)
ide3 chat --no-write     # Chat without automatic execution
ide3 chat --mcp          # Chat with MCP tools integration
```

## Commands

| Command | Description |
|---------|-------------|
| `ide3` | Start AI chat with write mode (default) |
| `ide3 chat` | Start AI chat session with write mode |
| `ide3 chat --no-write` | Chat without automatic execution |
| `ide3 chat --mcp` | Chat with MCP tools integration |
| `ide3 exec <code>` | Execute code in JS, Python, or Bash |
| `ide3 gui` | Launch web dashboard |
| `ide3 mcp` | Start MCP server with unrestricted tools |

## Project Structure

```
ide3/
├── cli/                    # CLI source code
│   ├── index.ts           # Main entry point
│   ├── commands/          # Command implementations
│   └── core/              # Core functionality
├── src/                   # React GUI source
│   ├── App.tsx           # Main GUI app
│   └── components/        # UI components
├── dist/                  # Built GUI assets
├── dist-cli/              # Built CLI code
└── package.json
```

## Technology Stack

- **CLI**: Node.js, TypeScript, Commander.js, Chalk, Inquirer
- **GUI**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Express, Socket.io, Supabase
- **AI**: OpenAI, Anthropic, Ollama support

## Development

```bash
# Watch mode for GUI
npm run dev

# Watch mode for CLI
npm run dev:cli

# Build everything
npm run build

# Build GUI only
npm run build:gui

# Build CLI only
npm run build:cli
```

## Configuration

Create `~/.ide3/config.json`:

```json
{
  "provider": "openai",
  "model": "gpt-4",
  "apiKey": "your-api-key-here",
  "theme": "dark"
}
```

### Supported Providers

- **OpenAI**: gpt-4, gpt-3.5-turbo
- **Anthropic**: claude-3-opus, claude-3-sonnet
- **Ollama**: Any local model (llama2, mistral, etc.)

## Examples

### Write Mode in Action

```bash
# Just run ide3 and chat naturally
ide3

You: Create a function that calculates fibonacci numbers

AI: Here's a fibonacci function:

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10));
\```

⚡ Detected executable code - running immediately...

Executing javascript:
────────────────────────────────────────────────────────────
✓ Output:
55
────────────────────────────────────────────────────────────
```

### Direct Code Execution

```bash
# Calculate Sum
ide3 exec "const sum = [1,2,3,4,5].reduce((a,b) => a+b, 0); console.log(sum)"
# Output: 15

# Python Math
ide3 exec "import math; print(f'Pi = {math.pi:.2f}')" --language python
# Output: Pi = 3.14

# System Info
ide3 exec "uname -a" --language bash
```

## Roadmap

- [x] CLI framework and command structure
- [x] Code execution engine
- [x] Beautiful web GUI
- [x] Supabase integration
- [x] Full AI chat implementation
- [x] Write mode with automatic execution
- [x] Global CLI installation
- [ ] Monaco code editor
- [ ] Git integration
- [ ] Multi-file refactoring
- [ ] Test generation
- [ ] VS Code extension

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, Node.js, and Supabase
