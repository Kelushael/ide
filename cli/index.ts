#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('ide3')
  .description('Terminal AI coding agent with write mode - executes immediately upon intent')
  .version('1.0.0');

program
  .command('exec <code>')
  .description('Execute code with AI assistance')
  .option('-l, --language <lang>', 'Programming language', 'javascript')
  .action(async (code: string, options: { language?: string }) => {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    const language = options.language || 'javascript';
    console.log(chalk.cyan.bold('\n⚡ Code Executor\n'));
    console.log(chalk.gray(`Language: ${language}`));
    console.log(chalk.gray(`Code: ${code}\n`));

    try {
      let command: string;
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          command = `node -e "${code.replace(/"/g, '\\"')}"`;
          break;
        case 'python':
        case 'py':
          command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
          break;
        case 'bash':
        case 'sh':
          command = code;
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      const { stdout, stderr } = await execAsync(command);
      console.log(chalk.green('✔ Execution complete\n'));
      if (stdout) {
        console.log(chalk.white('📤 Output:'));
        console.log(stdout);
      }
      if (stderr) {
        console.log(chalk.yellow('\n⚠️  Warnings:'));
        console.log(stderr);
      }
    } catch (error: any) {
      console.log(chalk.red('✖ Execution failed\n'));
      console.error(chalk.red('❌ Error:'), error.stderr || error.message);
      process.exit(1);
    }
  });

program
  .command('gui')
  .description('Launch GUI dashboard in browser')
  .option('-p, --port <port>', 'Port for GUI server', '3000')
  .action(async (options: { port?: string }) => {
    const { spawn } = await import('child_process');
    const open = (await import('open')).default;
    const path = await import('path');
    const { fileURLToPath } = await import('url');

    const port = options.port || '3000';
    const serverPort = '3001';

    console.log(chalk.cyan.bold('\n🚀 IDE3 GUI Launcher\n'));
    console.log(chalk.gray('Starting hybrid server...'));

    // Get the project root directory
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const projectRoot = path.resolve(__dirname, '..');

    // Start the hybrid server in background
    const serverPath = path.join(projectRoot, 'dist-server', 'hybrid-server.js');
    const server = spawn('node', [serverPath], {
      detached: true,
      stdio: 'ignore',
      env: { ...process.env, PORT: serverPort }
    });

    server.unref();

    // Give server a moment to start
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(chalk.green(`✓ Hybrid server started on port ${serverPort}`));
    console.log(chalk.gray(`Opening browser to http://localhost:${port}...\n`));

    // Open browser
    try {
      await open(`http://localhost:${port}`);
      console.log(chalk.cyan.bold('🖥️  IDE3 GUI launched at ') + chalk.white(`http://localhost:${port}`));
      console.log(chalk.gray('   Backend WebSocket running on port ') + chalk.white(serverPort));
      console.log(chalk.gray('\n   Press Ctrl+C to stop the GUI server\n'));

      // Keep process alive
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\n\n👋 Shutting down IDE3 GUI...\n'));
        process.exit(0);
      });

      // Keep alive
      await new Promise(() => {});
    } catch (error: any) {
      console.log(chalk.yellow('⚠️  Could not auto-open browser'));
      console.log(chalk.cyan('   Manually open: ') + chalk.white(`http://localhost:${port}`));
      console.log(chalk.gray('   Backend running on port ') + chalk.white(serverPort) + '\n');
    }
  });

program
  .command('chat')
  .description('Start interactive AI chat session (default mode with write enabled)')
  .option('--mcp', 'Enable MCP tools integration')
  .option('--no-write', 'Disable automatic code execution')
  .action(async (options: { mcp?: boolean; write?: boolean }) => {
    const { ChatSession } = await import('./chat-session.js');
    const writeMode = options.write !== false;
    const session = new ChatSession(options.mcp, writeMode);
    await session.start();
  });

program
  .command('mcp')
  .description('Start MCP server with unrestricted tools')
  .action(async () => {
    const { MCPClient } = await import('./mcp-client.js');

    console.log(chalk.cyan.bold('\n🔧 IDE3 MCP Server\n'));
    console.log(chalk.gray('Starting MCP server with all tools...\n'));

    const client = new MCPClient();

    try {
      await client.start();
      console.log(chalk.green('✓ MCP server started'));

      const tools = await client.listTools();
      console.log(chalk.cyan(`\n📦 Available tools: ${tools.length}\n`));

      for (const tool of tools) {
        console.log(chalk.gray(`  • ${tool.name.padEnd(20)} - ${tool.description}`));
      }

      console.log(chalk.cyan('\n🔥 Uncensored mode: ACTIVE'));
      console.log(chalk.gray('   NO restrictions • NO confirmations • Pure execution'));
      console.log(chalk.gray('\n   Press Ctrl+C to stop\n'));

      // Keep alive
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n\n👋 Shutting down MCP server...\n'));
        await client.stop();
        process.exit(0);
      });

      await new Promise(() => {});
    } catch (error: any) {
      console.log(chalk.red('✗ Failed to start MCP server'));
      console.error(chalk.red('Error:'), error.message);
      console.log(chalk.yellow('\nMake sure Python 3 is installed:'));
      console.log(chalk.gray('  python3 --version\n'));
      process.exit(1);
    }
  });

// Parse args
const args = process.argv.slice(2);

// If no command provided or just flags, start sovereign chat in write mode
if (args.length === 0 || (args.length > 0 && args[0].startsWith('-'))) {
  // Default to sovereign chat with write mode enabled
  (async () => {
    const { SovereignChatSession } = await import('./sovereign-chat.js');
    const writeMode = !args.includes('--no-write');
    const session = new SovereignChatSession(writeMode);
    await session.start();
  })();
} else {
  program.parse(process.argv);
}
