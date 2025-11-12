# IDE3 Chat Examples - Build Like Claude Code

Just run `ide3` and describe what you want to build. The AI will create files, install dependencies, and execute commands automatically.

## Example 1: Build a Simple Express API

```
You: Create a simple Express API with a /hello endpoint

AI: I'll create an Express API for you.

FILE_WRITE: package.json
```json
{
  "name": "simple-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

FILE_WRITE: index.js
```javascript
import express from 'express';

const app = express();
const port = 3000;

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

```bash
npm install
```

📝 Creating/updating files...

✓ Created: package.json
✓ Created: index.js

⚡ Executing commands...

Executing bash:
────────────────────────────────────────────────────────────
✓ Output:
added 57 packages
────────────────────────────────────────────────────────────

✓ All actions completed
```

## Example 2: Build a React Component

```
You: Create a React button component with hover effects

AI: I'll create a React button component with Tailwind CSS.

FILE_WRITE: Button.jsx
```jsx
import React from 'react';

export default function Button({ children, onClick, variant = 'primary' }) {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200';
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
```

FILE_WRITE: App.jsx
```jsx
import React from 'react';
import Button from './Button';

export default function App() {
  return (
    <div className="p-8 space-x-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}
```

📝 Creating/updating files...

✓ Created: Button.jsx
✓ Created: App.jsx

✓ All actions completed
```

## Example 3: Build a Python Script

```
You: Create a Python script that fetches weather data from an API

AI: I'll create a Python weather script using requests.

FILE_WRITE: weather.py
```python
import requests
import json

def get_weather(city):
    # Free weather API (no key needed)
    url = f"https://wttr.in/{city}?format=j1"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        current = data['current_condition'][0]
        print(f"\nWeather in {city}:")
        print(f"Temperature: {current['temp_C']}°C")
        print(f"Condition: {current['weatherDesc'][0]['value']}")
        print(f"Humidity: {current['humidity']}%")
        print(f"Wind Speed: {current['windspeedKmph']} km/h")

    except Exception as e:
        print(f"Error fetching weather: {e}")

if __name__ == "__main__":
    get_weather("London")
```

```bash
python3 weather.py
```

📝 Creating/updating files...

✓ Created: weather.py

⚡ Executing commands...

Executing bash:
────────────────────────────────────────────────────────────
✓ Output:
Weather in London:
Temperature: 12°C
Condition: Partly cloudy
Humidity: 76%
Wind Speed: 15 km/h
────────────────────────────────────────────────────────────

✓ All actions completed
```

## Example 4: Build a Complete Project

```
You: Build a todo list app with HTML, CSS, and JavaScript

AI: I'll create a complete todo list application.

FILE_WRITE: index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>My Todo List</h1>
        <div class="input-group">
            <input type="text" id="todoInput" placeholder="Add a new task...">
            <button onclick="addTodo()">Add</button>
        </div>
        <ul id="todoList"></ul>
    </div>
    <script src="app.js"></script>
</body>
</html>
```

FILE_WRITE: style.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    width: 90%;
    max-width: 500px;
}

h1 {
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 1.5rem;
}

input {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

button {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
}

button:hover {
    background: #764ba2;
}

#todoList {
    list-style: none;
}

.todo-item {
    background: #f8f9fa;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s;
}

.todo-item:hover {
    transform: translateX(5px);
}

.todo-item.completed {
    opacity: 0.6;
    text-decoration: line-through;
}

.delete-btn {
    background: #e74c3c;
    padding: 6px 12px;
    font-size: 14px;
}

.delete-btn:hover {
    background: #c0392b;
}
```

FILE_WRITE: app.js
```javascript
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span onclick="toggleTodo(${index})" style="cursor: pointer; flex: 1;">
                ${todo.text}
            </span>
            <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
        `;
        list.appendChild(li);
    });
}

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text) {
        todos.push({ text, completed: false });
        saveTodos();
        input.value = '';
        renderTodos();
    }
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

document.getElementById('todoInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

renderTodos();
```

📝 Creating/updating files...

✓ Created: index.html
✓ Created: style.css
✓ Created: app.js

✓ All actions completed
```

## Available Commands

While chatting, you can use these commands:

- `/ls` - List files in current directory
- `/ls <dir>` - List files in specific directory
- `/pwd` - Show current working directory
- `/cat <file>` - Display file contents
- `/clear` - Clear conversation history
- `/history` - Show conversation history
- `/help` - Show all commands

## How It Works

1. **File Creation**: AI responds with `FILE_WRITE: path/to/file` followed by code block
2. **Code Execution**: AI responds with code blocks (bash, js, python) that execute immediately
3. **File Reading**: AI can request `FILE_READ: path/to/file` to see file contents
4. **No Confirmations**: Everything executes automatically in write mode

## Tips

- Be specific about what you want to build
- Ask for multiple files at once
- Request installations and builds in the same prompt
- The AI has full file system access in the current directory
- All commands run from your current working directory
