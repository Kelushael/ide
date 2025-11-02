"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const child_process_1 = require("child_process");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
async function callOllama(prompt, systemPrompt) {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'qwen2.5-coder:3b',
            prompt: `${systemPrompt}\n\nUser: ${prompt}`,
            stream: false,
        }),
    });
    const data = await response.json();
    return data.response;
}
function executeCommand(command) {
    return new Promise((resolve) => {
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        const child = (0, child_process_1.spawn)(cmd, args, {
            shell: true,
            cwd: process.cwd(),
        });
        let output = '';
        let errorOutput = '';
        child.stdout.on('data', (data) => {
            output += data.toString();
        });
        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        child.on('close', (code) => {
            resolve({
                output: output || errorOutput,
                success: code === 0,
            });
        });
        child.on('error', (error) => {
            resolve({
                output: error.message,
                success: false,
            });
        });
    });
}
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('agent-request', async (context) => {
        try {
            const lastMessage = context.messages[context.messages.length - 1];
            const userPrompt = lastMessage.content;
            let response;
            if (context.modelType === 'ollama') {
                response = await callOllama(userPrompt, context.agent.systemPrompt);
            }
            else {
                response = 'Local browser AI not yet implemented. Please use Ollama mode.';
            }
            socket.emit('agent-response', { content: response });
            if (response.includes('```') && context.agent.tools.includes('execute')) {
                const codeMatch = response.match(/```(?:bash|sh)?\n([\s\S]*?)```/);
                if (codeMatch) {
                    const command = codeMatch[1].trim();
                    console.log('Executing command:', command);
                    const result = await executeCommand(command);
                    socket.emit('execution-result', result);
                }
            }
        }
        catch (error) {
            console.error('Error processing request:', error);
            socket.emit('error', { message: error.message });
        }
    });
    socket.on('execute-command', async ({ command }) => {
        try {
            console.log('Direct command execution:', command);
            const result = await executeCommand(command);
            socket.emit('execution-result', result);
        }
        catch (error) {
            console.error('Error executing command:', error);
            socket.emit('error', { message: error.message });
        }
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Hybrid AI Server running on port ${PORT}`);
    console.log('Features:');
    console.log('  - WebSocket bridge for browser ↔ backend');
    console.log('  - Ollama integration for local models');
    console.log('  - Real command execution');
    console.log('  - Agent marketplace support');
    console.log('\nThe unstealable architecture is live! 🎯');
});
