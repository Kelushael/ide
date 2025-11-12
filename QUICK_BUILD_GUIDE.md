# Quick Build Guide - Chat to Code

## Just Run `ide3` and Start Building

No commands to remember. No file editors needed. Just describe what you want and watch it happen.

### 1. Install Globally

```bash
npm install
npm run build
npm link
```

### 2. Start Chatting

```bash
ide3
```

That's it! Now you're in a terminal chat that can build anything.

---

## What You Can Say

### "Create a..."
- "Create a simple Express server with a /hello endpoint"
- "Create a React todo component"
- "Create a Python script that reads CSV files"

### "Build a..."
- "Build a landing page with gradient background"
- "Build a REST API with user authentication"
- "Build a CLI tool that converts JSON to CSV"

### "Make a..."
- "Make a calculator app with HTML/CSS/JS"
- "Make a Discord bot that replies to messages"
- "Make a web scraper for product prices"

---

## How It Works

### The AI Responds With Actions

When you ask for something, the AI responds with:

**1. File Creation**
```
FILE_WRITE: src/app.js
```javascript
console.log('Hello World');
```
```

**2. Command Execution**
```bash
npm install express
npm start
```

**3. Multiple Files at Once**
```
FILE_WRITE: index.html
FILE_WRITE: style.css
FILE_WRITE: script.js
```

### Everything Executes Automatically

- Files are created instantly
- Packages are installed
- Code is executed
- Builds are run
- Results are shown

**No confirmations. No manual steps. Just results.**

---

## Examples

### Example 1: Express API in 10 Seconds

```
You: Create an Express API with /users endpoint

AI: [Creates package.json, server.js, installs dependencies, starts server]

✓ All done in one response
```

### Example 2: Full Web App

```
You: Build a weather app that shows current temperature

AI: [Creates HTML, CSS, JS files with API integration]

📝 Creating files...
✓ Created: index.html
✓ Created: style.css
✓ Created: app.js
```

### Example 3: Multi-File Project

```
You: Create a TypeScript project with tests

AI: [Creates tsconfig, src/, tests/, package.json, installs deps, runs build]

✓ Project scaffolded and built
```

---

## Built-in Commands

While chatting, you can use:

| Command | What It Does |
|---------|--------------|
| `/ls` | List files in current directory |
| `/pwd` | Show where you are |
| `/cat file.js` | Read a file |
| `/clear` | Clear chat history |
| `/help` | Show all commands |

---

## Real-World Use Cases

### Prototyping
"Create a prototype dashboard with charts"

### Learning
"Show me how to use async/await in JavaScript"

### Quick Scripts
"Write a script that renames all .txt files to .md"

### API Integrations
"Connect to the GitHub API and fetch my repos"

### Database Setup
"Set up a SQLite database with users table"

### Full Applications
"Build a note-taking app with local storage"

---

## Advanced: With MCP Tools

For even more power, enable MCP:

```bash
ide3 --mcp
```

This adds:
- Git operations
- Docker commands
- System information
- Advanced file operations

---

## Tips for Best Results

1. **Be Specific**: "Create an Express server on port 3000" is better than "make a server"

2. **Ask for Complete Features**: "Build a login form with validation" tells the AI everything you need

3. **Request Tests**: "Include tests for this function" ensures quality

4. **Ask for Dependencies**: "Use Tailwind CSS for styling" specifies your stack

5. **Build Incrementally**: Start simple, then ask to "add feature X"

---

## What Makes This Different?

### Traditional Coding
1. Open editor
2. Create files manually
3. Write code
4. Save files
5. Run terminal commands
6. Check results
7. Repeat

### With IDE3
1. Describe what you want
2. Watch it happen

That's it.

---

## No Ollama? No Problem!

The system is designed to work with any LLM:
- OpenAI GPT-4
- Anthropic Claude
- Local Ollama models
- Any compatible API

Just configure your preferred provider.

---

## Get Started Now

```bash
ide3
```

Type: "Create a simple web server"

And watch the magic happen.

---

**You're now building at the speed of thought.**
