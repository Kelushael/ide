import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface AgentConfig {
  id: string;
  name: string;
  systemPrompt: string;
  tools: string[];
}

export function useHybridAI(agentConfig: AgentConfig) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelType, setModelType] = useState<'local' | 'ollama'>('ollama');
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to AI execution server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from AI execution server');
      setConnected(false);
    });

    socket.on('agent-response', (data: { content: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.content,
          timestamp: Date.now(),
        },
      ]);
      setIsProcessing(false);
    });

    socket.on('execution-result', (data: { output: string; success: boolean }) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `Execution ${data.success ? 'successful' : 'failed'}:\n${data.output}`,
          timestamp: Date.now(),
        },
      ]);
    });

    socket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `Error: ${error.message}`,
          timestamp: Date.now(),
        },
      ]);
      setIsProcessing(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  async function sendMessage(userMessage: string) {
    if (!socketRef.current || !connected) {
      console.error('Not connected to execution server');
      return;
    }

    const newMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(true);

    const context = {
      messages: [...messages, newMessage],
      agent: agentConfig,
      modelType,
    };

    socketRef.current.emit('agent-request', context);
  }

  async function executeCommand(command: string) {
    if (!socketRef.current || !connected) {
      console.error('Not connected to execution server');
      return;
    }

    socketRef.current.emit('execute-command', { command });
  }

  return {
    messages,
    isProcessing,
    connected,
    modelType,
    setModelType,
    sendMessage,
    executeCommand,
  };
}

export function HybridAIChat({ agentId }: { agentId: string }) {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    id: agentId,
    name: 'Default Agent',
    systemPrompt: 'You are a helpful AI assistant.',
    tools: ['file', 'execute'],
  });

  const [input, setInput] = useState('');
  const {
    messages,
    isProcessing,
    connected,
    modelType,
    setModelType,
    sendMessage,
  } = useHybridAI(agentConfig);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    sendMessage(input);
    setInput('');
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-white">{agentConfig.name}</h2>
            <p className="text-sm text-slate-400">
              {connected ? '🟢 Connected' : '🔴 Disconnected'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setModelType('local')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                modelType === 'local'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              Local (Browser)
            </button>
            <button
              onClick={() => setModelType('ollama')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                modelType === 'ollama'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              Ollama (Server)
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : msg.role === 'system'
                    ? 'bg-slate-700 text-slate-300 font-mono text-sm'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className="text-xs mt-2 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800 border-t border-slate-700 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the agent anything..."
              disabled={!connected || isProcessing}
              className="flex-1 bg-slate-900 text-white rounded-lg px-4 py-3 border border-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!connected || isProcessing || !input.trim()}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
