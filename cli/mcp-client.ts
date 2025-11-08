/**
 * MCP Client - Interface to Python MCP Server
 * Provides tool calling capabilities for chat session
 */

import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export interface MCPTool {
  name: string;
  description: string;
  parameters: any;
}

export interface MCPToolCall {
  tool: string;
  arguments: Record<string, any>;
}

export interface MCPToolResult {
  success: boolean;
  result: string;
  error?: string;
}

export class MCPClient extends EventEmitter {
  private process: ChildProcess | null = null;
  private isRunning = false;
  private responseHandlers = new Map<string, (result: any) => void>();
  private requestId = 0;

  constructor(private pythonPath: string = 'python3', private serverPath?: string) {
    super();
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    const path = await import('path');
    const { fileURLToPath } = await import('url');

    // Resolve server path
    if (!this.serverPath) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      this.serverPath = path.resolve(__dirname, '..', 'mcp-server', 'server.py');
    }

    return new Promise((resolve, reject) => {
      this.process = spawn(this.pythonPath, [this.serverPath!], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let startupBuffer = '';

      const onData = (data: Buffer) => {
        startupBuffer += data.toString();
        if (startupBuffer.includes('MCP Server starting')) {
          this.isRunning = true;
          this.process!.stdout!.off('data', onData);
          this.setupMessageHandling();
          resolve();
        }
      };

      this.process.stdout!.on('data', onData);

      this.process.on('error', (error) => {
        this.isRunning = false;
        reject(error);
      });

      this.process.on('exit', () => {
        this.isRunning = false;
        this.emit('exit');
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.isRunning) {
          reject(new Error('MCP server failed to start'));
        }
      }, 10000);
    });
  }

  private setupMessageHandling(): void {
    if (!this.process || !this.process.stdout) return;

    let buffer = '';

    this.process.stdout.on('data', (data: Buffer) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() && line.startsWith('{')) {
          try {
            const message = JSON.parse(line);
            this.handleMessage(message);
          } catch (e) {
            // Not JSON, ignore
          }
        }
      }
    });
  }

  private handleMessage(message: any): void {
    if (message.id && this.responseHandlers.has(message.id)) {
      const handler = this.responseHandlers.get(message.id)!;
      this.responseHandlers.delete(message.id);
      handler(message);
    }
  }

  async callTool(toolName: string, args: Record<string, any>): Promise<MCPToolResult> {
    if (!this.isRunning || !this.process) {
      throw new Error('MCP server not running');
    }

    const id = `req_${this.requestId++}`;
    const request = {
      jsonrpc: '2.0',
      id,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
      },
    };

    return new Promise((resolve, reject) => {
      this.responseHandlers.set(id, (response) => {
        if (response.error) {
          resolve({
            success: false,
            result: '',
            error: response.error.message || 'Unknown error',
          });
        } else {
          resolve({
            success: true,
            result: response.result || '',
          });
        }
      });

      this.process!.stdin!.write(JSON.stringify(request) + '\n');

      // Timeout after 5 minutes
      setTimeout(() => {
        if (this.responseHandlers.has(id)) {
          this.responseHandlers.delete(id);
          resolve({
            success: false,
            result: '',
            error: 'Tool call timeout',
          });
        }
      }, 300000);
    });
  }

  async listTools(): Promise<MCPTool[]> {
    // Hardcoded for now - could query dynamically
    return [
      { name: 'read_file', description: 'Read file contents', parameters: {} },
      { name: 'write_file', description: 'Write content to file', parameters: {} },
      { name: 'list_directory', description: 'List directory contents', parameters: {} },
      { name: 'search_files', description: 'Search for text in files', parameters: {} },
      { name: 'delete_path', description: 'Delete file or directory', parameters: {} },
      { name: 'run_bash', description: 'Execute bash command', parameters: {} },
      { name: 'run_python', description: 'Execute Python code', parameters: {} },
      { name: 'run_node', description: 'Execute Node.js code', parameters: {} },
      { name: 'git_status', description: 'Get git repository status', parameters: {} },
      { name: 'git_commit', description: 'Create git commit', parameters: {} },
      { name: 'git_diff', description: 'Show git diff', parameters: {} },
      { name: 'docker_run', description: 'Run Docker container', parameters: {} },
      { name: 'docker_ps', description: 'List Docker containers', parameters: {} },
      { name: 'docker_exec', description: 'Execute command in container', parameters: {} },
      { name: 'get_system_info', description: 'Get system information', parameters: {} },
    ];
  }

  async stop(): Promise<void> {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.isRunning = false;
    }
  }

  getStatus(): boolean {
    return this.isRunning;
  }
}
