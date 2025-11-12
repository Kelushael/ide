# IDE3 - Terminal AI Coding Agent

A powerful terminal-based AI coding assistant that can dynamically spawn beautiful web-based GUI interfaces when needed. Work primarily in the terminal with an AI agent, but launch rich visual tools for complex tasks.

![IDE3 Banner](https://via.placeholder.com/1200x400/0f172a/06b6d4?text=IDE3+-+Terminal+AI+Coding+Agent)

## Features

- **Terminal-First Workflow**: Interactive CLI with AI-powered coding assistance
- **Dynamic GUI Spawning**: Launch vibrant web-based interfaces for visual tasks
- **Multi-LLM Support**: Works with OpenAI, Anthropic, Ollama, and local models
- **Code Execution**: Run code in multiple languages directly from the terminal
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

### Execute Code

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

### AI Chat (Coming Soon)

```bash
ide3 chat
# Interactive AI-powered coding assistant
```

## Commands

| Command | Description |
|---------|-------------|
| `ide3 exec <code>` | Execute code in JS, Python, or Bash |
| `ide3 gui` | Launch web dashboard |
| `ide3 chat` | Start AI chat session |
| `ide3 edit <file>` | AI-assisted file editing |
| `ide3 create <desc>` | Generate projects from descriptions |

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

### Calculate Sum
```bash
ide3 exec "const sum = [1,2,3,4,5].reduce((a,b) => a+b, 0); console.log(sum)"
# Output: 15
```

### Python Math
```bash
ide3 exec "import math; print(f'Pi = {math.pi:.2f}')" --language python
# Output: Pi = 3.14
```

### System Info
```bash
ide3 exec "uname -a" --language bash
```

## Roadmap

- [x] CLI framework and command structure
- [x] Code execution engine
- [x] Beautiful web GUI
- [x] Supabase integration
- [ ] Full AI chat implementation
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
