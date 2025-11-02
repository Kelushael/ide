/**
 * WebContainer-based IDE - Runs in Browser!
 * Alternative to Docker: Zero installation, instant start
 */

import { useEffect, useState, useRef } from 'react';
import { Terminal, Play, Download, Upload, Folder, File } from 'lucide-react';

declare global {
  interface Window {
    WebContainer: any;
  }
}

interface FileTree {
  [key: string]: {
    file?: { contents: string };
    directory?: FileTree;
  };
}

export default function WebContainerIDE() {
  const [container, setContainer] = useState<any>(null);
  const [terminal, setTerminal] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [files, setFiles] = useState<FileTree>({});
  const [loading, setLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initWebContainer();
  }, []);

  const initWebContainer = async () => {
    try {
      addTerminalLine('🚀 Initializing WebContainer...');

      // Load WebContainer SDK
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@webcontainer/api@latest/dist/index.js';
      script.type = 'module';
      document.head.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });

      addTerminalLine('✓ WebContainer SDK loaded');

      // Boot WebContainer
      const containerInstance = await window.WebContainer.boot();
      setContainer(containerInstance);

      addTerminalLine('✓ WebContainer booted');
      addTerminalLine('✓ Ready! Type commands or ask AI for help.');
      addTerminalLine('');

      setLoading(false);

      // Set up terminal output listener
      containerInstance.on('server-ready', (port: number, url: string) => {
        addTerminalLine(`🌐 Server ready at ${url}`);
      });

    } catch (error: any) {
      addTerminalLine(`✗ Error: ${error.message}`);
      addTerminalLine('');
      addTerminalLine('💡 WebContainer not supported in this browser.');
      addTerminalLine('   Use Chrome, Edge, or Safari.');
      setLoading(false);
    }
  };

  const addTerminalLine = (line: string) => {
    setTerminal(prev => [...prev, line]);
    setTimeout(() => {
      terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
    }, 0);
  };

  const runCommand = async (command: string) => {
    if (!container) {
      addTerminalLine('✗ WebContainer not ready');
      return;
    }

    addTerminalLine(`$ ${command}`);

    try {
      const process = await container.spawn('sh', ['-c', command]);

      process.output.pipeTo(new WritableStream({
        write(data) {
          addTerminalLine(data);
        }
      }));

      const exitCode = await process.exit;
      if (exitCode !== 0) {
        addTerminalLine(`✗ Command failed (exit ${exitCode})`);
      }
    } catch (error: any) {
      addTerminalLine(`✗ Error: ${error.message}`);
    }

    addTerminalLine('');
  };

  const createFile = async (path: string, content: string) => {
    if (!container) return;

    try {
      await container.fs.writeFile(path, content);
      addTerminalLine(`✓ Created ${path}`);

      // Update file tree
      setFiles(prev => ({
        ...prev,
        [path]: { file: { contents: content } }
      }));
    } catch (error: any) {
      addTerminalLine(`✗ Error creating file: ${error.message}`);
    }
  };

  const readFile = async (path: string) => {
    if (!container) return;

    try {
      const content = await container.fs.readFile(path, 'utf-8');
      setCurrentFile(path);
      setFileContent(content);
      addTerminalLine(`✓ Opened ${path}`);
    } catch (error: any) {
      addTerminalLine(`✗ Error reading file: ${error.message}`);
    }
  };

  const askAI = async () => {
    if (!userInput.trim()) return;

    addTerminalLine(`You: ${userInput}`);
    setAiResponse('Thinking...');

    // For now, simulate AI response
    // In production, this would call your Ollama endpoint or use transformers.js
    setTimeout(() => {
      const mockResponse = `I understand you want to: "${userInput}"\n\nHere's what I'll do:\n1. Create the necessary files\n2. Install dependencies\n3. Run the project\n\nLet me execute that now...`;

      setAiResponse(mockResponse);
      addTerminalLine(`AI: ${mockResponse}`);
      addTerminalLine('');

      // Example: Create a simple file based on request
      if (userInput.toLowerCase().includes('hello world')) {
        createFile('index.js', 'console.log("Hello World!");');
        setTimeout(() => runCommand('node index.js'), 500);
      }
    }, 1000);

    setUserInput('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">IDE3 Web Edition</h1>
            <p className="text-sm text-gray-400">
              Browser-based AI coding assistant - No installation required
            </p>
          </div>
          <div className="flex gap-2">
            {loading ? (
              <div className="text-yellow-400">⏳ Loading...</div>
            ) : (
              <div className="text-green-400">✓ Ready</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Tree */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-auto">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold">
            <Folder className="w-4 h-4" />
            <span>Files</span>
          </div>

          {Object.keys(files).length === 0 ? (
            <div className="text-sm text-gray-500">No files yet</div>
          ) : (
            <div className="space-y-1">
              {Object.keys(files).map(path => (
                <button
                  key={path}
                  onClick={() => readFile(path)}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-sm w-full hover:bg-gray-700 ${
                    currentFile === path ? 'bg-gray-700' : ''
                  }`}
                >
                  <File className="w-3 h-3" />
                  <span>{path}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* AI Chat Section */}
          <div className="h-48 bg-gray-850 border-b border-gray-700 p-4 flex flex-col">
            <div className="text-sm font-semibold mb-2">💬 AI Assistant</div>

            {aiResponse && (
              <div className="flex-1 overflow-auto mb-2 p-3 bg-gray-900 rounded text-sm">
                {aiResponse}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askAI()}
                placeholder="Ask AI to build something..."
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-sm"
                disabled={loading}
              />
              <button
                onClick={askAI}
                disabled={loading || !userInput.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>

          {/* Editor/Terminal Split */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col border-r border-gray-700">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 text-sm">
                {currentFile || 'No file selected'}
              </div>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="flex-1 p-4 bg-gray-900 font-mono text-sm resize-none focus:outline-none"
                placeholder="Select a file or create a new one..."
                spellCheck={false}
              />
            </div>

            {/* Terminal */}
            <div className="w-1/2 flex flex-col bg-black">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center gap-2 text-sm">
                <Terminal className="w-4 h-4" />
                <span>Terminal</span>
              </div>
              <div
                ref={terminalRef}
                className="flex-1 p-4 font-mono text-sm overflow-auto"
              >
                {terminal.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 p-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter command..."
                  className="flex-1 px-3 py-1 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      runCommand(input.value);
                      input.value = '';
                    }
                  }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-2 text-xs text-gray-400 flex justify-between">
        <div>WebContainer Edition • No Installation Required</div>
        <div className="flex gap-4">
          <span>Files: {Object.keys(files).length}</span>
          <span>Terminal Lines: {terminal.length}</span>
        </div>
      </div>
    </div>
  );
}
