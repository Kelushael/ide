import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { io, Socket } from 'socket.io-client';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  system_prompt: string;
  tools: string[];
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export default function AgentRunner({ agentSlug }: { agentSlug: string }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    loadAgent();
    setupSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [agentSlug]);

  async function loadAgent() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('slug', agentSlug)
      .eq('is_public', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading agent:', error);
    } else if (data) {
      setAgent(data);
      setMessages([
        {
          role: 'system',
          content: `Agent "${data.name}" loaded. Available tools: ${data.tools.join(', ')}`,
          timestamp: Date.now(),
        },
      ]);
    }
  }

  function setupSocket() {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to agent execution server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    newSocket.on('agent-response', (data: { content: string }) => {
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

    newSocket.on('execution-result', (data: { output: string; success: boolean }) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `${data.success ? '✓' : '✗'} Execution:\n${data.output}`,
          timestamp: Date.now(),
        },
      ]);
    });

    newSocket.on('error', (error: { message: string }) => {
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

    setSocket(newSocket);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isProcessing || !agent || !socket || !connected) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    const context = {
      messages: [...messages, userMessage],
      agent: {
        id: agent.id,
        name: agent.name,
        systemPrompt: agent.system_prompt,
        tools: agent.tools,
      },
      modelType: 'ollama',
    };

    socket.emit('agent-request', context);

    await supabase.from('agent_executions').insert({
      agent_id: agent.id,
      user_id: 'anonymous',
      session_id: socket.id || 'unknown',
      tokens_used: input.length,
      success: true,
    });
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <p className="text-sm text-slate-400">{agent.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? 'bg-green-400' : 'bg-red-400'
                }`}
              ></div>
              <span className="text-sm text-slate-400">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {agent.tools.map((tool, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
              >
                {tool}
              </span>
            ))}
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
                  {agent.name} is thinking...
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
              placeholder={`Ask ${agent.name} anything...`}
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
