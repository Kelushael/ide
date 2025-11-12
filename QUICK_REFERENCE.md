# IDE3 Quick Reference

## Installation (Choose One)

```bash
# One-liner
git clone <repo> && cd ide3 && npm install && npm run build && npm link

# Or step by step
npm install
npm run build
npm link
```

## Launch

```bash
ide3
```

That's it!

## What You Can Say

### Build Complete Apps
- "Create a todo list app with HTML, CSS, and JavaScript"
- "Build an Express API with authentication"
- "Make a React dashboard with charts"

### Create Files
- "Create a TypeScript config file"
- "Write a Python script that fetches weather data"
- "Make a package.json for a Node project"

### Execute Code
- "Install Express and create a simple server"
- "Run npm install"
- "Test this function"

### Read Files
- "Show me the package.json"
- "What's in the src directory?"
- "Read the README"

## Visual Indicators

| Indicator | Meaning |
|-----------|---------|
| `⠋ Thinking…` | AI is processing |
| `▸ Creating files…` | Writing files |
| `⠋ Creating file.js…` | Progress on specific file |
| `✓ Created file.js` | File created successfully |
| `▸ Executing commands…` | Running commands |
| `⠋ Running bash…` | Command in progress |
| `✓ Executed bash` | Command completed |
| `✗ Failed` | Something went wrong |

## Slash Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/ls` | List files in current dir |
| `/ls src/` | List files in specific dir |
| `/pwd` | Show current directory |
| `/cat file.js` | Display file contents |
| `/clear` | Clear conversation history |
| `/history` | Show conversation history |

## CLI Commands

```bash
ide3                    # Start AI chat (default)
ide3 chat               # Start AI chat explicitly
ide3 chat --no-write    # Chat without auto-execution
ide3 chat --mcp         # Chat with MCP tools
ide3 exec "code"        # Execute code directly
ide3 gui                # Launch web dashboard
ide3 --help             # Show all commands
ide3 --version          # Show version
```

## Exit

- Press `Ctrl+C` or type `exit` or `/exit`

## Tips

✅ **Be specific**: "Create an Express server on port 3000" beats "make a server"

✅ **Request complete features**: "Build a login form with validation" tells the AI everything

✅ **Ask for tests**: "Include tests for this" ensures quality

✅ **Specify your stack**: "Use React with TypeScript and Tailwind"

✅ **Build incrementally**: Start simple, then "add feature X"

## File Operations

The AI responds with:
```
FILE_WRITE: src/app.js
```javascript
console.log('Hello');
```
```

This automatically:
1. Creates `src/` directory if needed
2. Writes `app.js` with contents
3. Shows progress spinner
4. Confirms creation

## Code Execution

The AI includes:
```bash
npm install express
```

This automatically:
1. Detects the code block
2. Shows execution spinner
3. Runs the command
4. Captures and displays output

## Example Session

```bash
$ ide3

> create a simple Express server

⠋ Thinking…

▸ Creating files…
✓ Created package.json
✓ Created server.js

▸ Executing commands…
✓ Executed bash
────────────────────────
added 57 packages
────────────────────────

✓ All actions completed

> start the server

⠋ Running bash…
Server running on port 3000
```

## Troubleshooting

### "command not found"
```bash
source ~/.bashrc  # or ~/.zshrc
```

### "Ollama not available"
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
```

### Permission errors
```bash
sudo npm link
```

### Uninstall
```bash
npm unlink -g ide3
```

## That's All You Need!

Just run `ide3` and start describing what you want to build. 🚀
