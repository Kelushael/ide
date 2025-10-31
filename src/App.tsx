import { useState } from 'react';
import { Terminal, Sparkles, Code2, Zap, FileCode, Github } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-cyan-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              IDE3
            </h1>
          </div>
          <p className="text-2xl text-slate-300 mb-2">Terminal AI Coding Agent</p>
          <p className="text-slate-400">with Dynamic GUI Spawning</p>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 mb-8 justify-center">
            {['overview', 'features', 'quickstart'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <h2 className="text-3xl font-bold mb-4 text-cyan-400">What is IDE3?</h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  IDE3 is a powerful terminal-based AI coding assistant that can dynamically spawn beautiful
                  web-based GUI interfaces when needed. Work primarily in the terminal with an AI agent,
                  but launch rich visual tools for complex tasks like code diffs, file browsing, and project visualization.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Terminal,
                    title: 'Terminal First',
                    desc: 'Powerful CLI with interactive AI chat, code execution, and file operations'
                  },
                  {
                    icon: Sparkles,
                    title: 'AI Powered',
                    desc: 'Works with OpenAI, Anthropic, or local Ollama models for intelligent assistance'
                  },
                  {
                    icon: Code2,
                    title: 'Dynamic GUI',
                    desc: 'Spawn beautiful web interfaces on-demand for visual tasks and complex workflows'
                  }
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-cyan-500 transition-colors">
                    <Icon className="w-10 h-10 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-slate-400">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h2 className="text-3xl font-bold mb-6 text-cyan-400">Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'Execute code in multiple languages (JS, Python, Bash)',
                  'Interactive AI chat for coding assistance',
                  'Visual file browser and code editor',
                  'Real-time WebSocket communication',
                  'Conversation history saved to Supabase',
                  'Multi-LLM support (OpenAI, Anthropic, Ollama)',
                  'AI-assisted file editing with diff viewer',
                  'Project scaffolding from natural language'
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quickstart' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <h2 className="text-3xl font-bold mb-6 text-cyan-400">Quick Start</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                      Install Dependencies
                    </h3>
                    <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-cyan-400">npm install</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                      Build Project
                    </h3>
                    <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-cyan-400">npm run build</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                      Test CLI
                    </h3>
                    <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-cyan-400">node dist-cli/index.js exec "console.log('Hello IDE3!')"</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                      Install Globally (Optional)
                    </h3>
                    <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto border border-slate-700">
                      <code className="text-cyan-400">npm link{'\n'}ide3 --help</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileCode className="w-6 h-6 text-cyan-400" />
                  Example Commands
                </h3>
                <div className="space-y-3">
                  {[
                    'ide3 exec "console.log(\'Hello World\')"',
                    'ide3 exec "print(\'Hello\')" --language python',
                    'ide3 gui',
                    'ide3 chat'
                  ].map((cmd) => (
                    <pre key={cmd} className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                      <code className="text-slate-300">{cmd}</code>
                    </pre>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <a
              href="https://github.com"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-8 py-4 rounded-lg font-medium transition-colors border border-slate-700"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>

        <footer className="mt-20 text-center text-slate-500">
          <p>IDE3 - Terminal AI Coding Agent v1.0.0</p>
          <p className="mt-2">Built with React, TypeScript, Node.js, and Supabase</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
