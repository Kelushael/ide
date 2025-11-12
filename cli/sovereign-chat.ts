/**
 * Sovereign-First Chat Session
 * Ollama by default, Claude optional
 */

import chalk from 'chalk';
import ora from 'ora';
import * as readline from 'readline';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import {
  initializeProvider,
  chatWithOllama,
  streamChatWithOllama,
  chatWithClaude,
  getModeLabel,
  loadConfig,
  saveConfig,
  AIProvider,
  ChatMessage,
  AIConfig
} from './ai-provider.js';
import { checkDirectoryTrust, listTrustedDirs, untrustCurrentDir } from './trust-system.js';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

const IDE3_LOGO = `
    ▗▄▄▄▖▗▄▄▄ ▗▄▄▄▄▖▗▖  ▗▖
      █  █   █  █   █ █
      █  █   █  █▄▄▄▀ ▀▀▀▖
    ▗▄█▄▖▀▄▄▄▀▗▄█▄▄▖▀▄▄▄▀
`;

const SYSTEM_PROMPT = `You are an advanced AI coding assistant with full file system access.

When the user asks you to build something:

1. Create files using: FILE_WRITE: path/to/file.ext
\`\`\`language
file contents here
\`\`\`

2. Read files using: FILE_READ: path/to/file.ext

3. Execute commands using code blocks:
\`\`\`bash
npm install
\`\`\`

Take action immediately - NO confirmations needed. Create all necessary files, install dependencies, run builds and tests.

Format for file operations:
FILE_WRITE: src/app.js
\`\`\`javascript
console.log('Hello');
\`\`\`

FILE_READ: package.json

Be direct, concise, and action-oriented. Execute immediately.`;

export class SovereignChatSession {
  private provider!: AIProvider;
  private messages: ChatMessage[];
  private supabase: any;
  private sessionId: string;
  private writeMode: boolean;

  constructor(writeMode: boolean = true) {
    this.messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    this.sessionId = Date.now().toString();
    this.writeMode = writeMode;

    // Initialize Supabase (optional)
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  private displayWelcomeScreen() {
    const username = process.env.USER || process.env.USERNAME || 'User';
    const cwd = process.cwd();
    const projectName = cwd.split('/').pop() || cwd.split('\\').pop() || 'project';
    const modeLabel = getModeLabel(this.provider);

    const logo = IDE3_LOGO;
    const border = '─'.repeat(120);

    console.clear();
    console.log('\n' + chalk.cyan('╭─── IDE3 v1.0.0 ') + chalk.cyan(border.slice(0, 103)) + chalk.cyan('╮'));

    // Left panel - Welcome
    console.log(chalk.cyan('│') + chalk.white('  Welcome back ') + chalk.cyan(username) + '!'.padEnd(55) + chalk.cyan('│') + ' Commands & Tips'.padEnd(63) + chalk.cyan('│'));
    console.log(chalk.cyan('│') + ' '.repeat(60) + chalk.cyan('│') + chalk.gray(' /config - Switch AI provider mode').padEnd(64) + chalk.cyan('│'));

    // Logo section
    logo.split('\n').forEach((line, i) => {
      let tipLine = '';
      if (i === 1) tipLine = chalk.gray(' /help - Show all commands');
      else if (i === 2) tipLine = chalk.gray(' /trust - Manage trusted directories');
      else if (i === 3) tipLine = chalk.gray(' Launched in ') + chalk.white(projectName);

      console.log(chalk.cyan('│') + chalk.cyan(line).padEnd(60) + chalk.cyan('│') + tipLine.padEnd(64) + chalk.cyan('│'));
    });

    console.log(chalk.cyan('│') + ' '.repeat(60) + chalk.cyan('│') + chalk.gray(' ').padEnd(64) + chalk.cyan('│'));
    console.log(chalk.cyan('│') + chalk.gray('  Model: ') + chalk.white(this.provider.model).padEnd(53) + chalk.cyan('│') + chalk.cyan('─'.repeat(64)) + chalk.cyan('│'));
    console.log(chalk.cyan('│') + chalk.gray('  Mode:  ') + chalk.green(modeLabel + ' ').padEnd(53) + chalk.cyan('│') + chalk.white(' Current Status').padEnd(64) + chalk.cyan('│'));
    console.log(chalk.cyan('│') + chalk.gray('  Path:  ') + chalk.white(cwd.length > 47 ? '...' + cwd.slice(-44) : cwd).padEnd(60) + chalk.cyan('│') + chalk.gray(' Write mode: ') + (this.writeMode ? chalk.green('ON') : chalk.yellow('OFF')).padEnd(51) + chalk.cyan('│'));
    console.log(chalk.cyan('│') + ' '.repeat(60) + chalk.cyan('│') + chalk.gray(` Provider: ${this.provider.type}`).padEnd(64) + chalk.cyan('│'));

    console.log(chalk.cyan('╰') + chalk.cyan(border) + chalk.cyan('╯'));
    console.log(border);
    console.log(chalk.gray('> ') + chalk.gray('Try "create a simple todo app with HTML and JavaScript"'));
    console.log(border);
    console.log(chalk.gray('  ? for shortcuts') + ' '.repeat(88) + chalk.gray('Write mode: ') + (this.writeMode ? chalk.green('ON') : chalk.yellow('OFF')));
    console.log();
  }

  async start() {
    // Check trust first
    if (!await checkDirectoryTrust()) {
      process.exit(0);
    }

    // Initialize AI provider
    this.provider = await initializeProvider();

    this.displayWelcomeScreen();

    await this.chatLoop();
  }

  private async chatLoop() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan('> ')
    });

    rl.prompt();

    rl.on('line', async (line: string) => {
      const trimmed = line.trim();

      if (!trimmed) {
        rl.prompt();
        return;
      }

      // Handle commands
      if (trimmed.startsWith('/')) {
        await this.handleCommand(trimmed);
        rl.prompt();
        return;
      }

      // Add user message
      this.messages.push({ role: 'user', content: trimmed });

      // Save to Supabase
      await this.saveMessage({ role: 'user', content: trimmed });

      // Get AI response with thinking indicator
      const thinkingFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
      let thinkingIndex = 0;
      const thinkingInterval = setInterval(() => {
        process.stdout.write(`\r${chalk.blue(thinkingFrames[thinkingIndex])} ${chalk.gray('Thinking…')}`);
        thinkingIndex = (thinkingIndex + 1) % thinkingFrames.length;
      }, 80);

      let fullResponse = '';

      try {
        if (this.provider.type === 'ollama') {
          // Stream from Ollama
          for await (const chunk of streamChatWithOllama(this.provider, this.messages)) {
            clearInterval(thinkingInterval);
            process.stdout.write('\r' + ' '.repeat(50) + '\r');
            process.stdout.write(chalk.white(chunk));
            fullResponse += chunk;
          }
        } else {
          // Claude API (non-streaming for now)
          const response = await chatWithClaude(this.provider, this.messages);
          clearInterval(thinkingInterval);
          process.stdout.write('\r' + ' '.repeat(50) + '\r');

          for (const block of response.content) {
            if (block.type === 'text') {
              process.stdout.write(chalk.white(block.text));
              fullResponse += block.text;
            }
          }
        }

        clearInterval(thinkingInterval);
        process.stdout.write('\r' + ' '.repeat(50) + '\r');
        console.log('\n');

        // Add assistant message
        this.messages.push({ role: 'assistant', content: fullResponse });

        // Save to Supabase
        await this.saveMessage({ role: 'assistant', content: fullResponse });

        // Execute write mode actions
        if (this.writeMode) {
          await this.detectAndExecute(fullResponse);
        }

      } catch (error: any) {
        clearInterval(thinkingInterval);
        console.log(chalk.red(`\n✗ Error: ${error.message}\n`));
      }

      rl.prompt();
    });

    rl.on('close', () => {
      console.log(chalk.cyan('\n👋 Goodbye!\n'));
      process.exit(0);
    });
  }

  private async handleCommand(cmd: string) {
    const parts = cmd.slice(1).split(' ');
    const command = parts[0];

    switch (command) {
      case 'config':
        await this.showConfig();
        break;

      case 'mode':
        await this.switchMode(parts[1]);
        break;

      case 'trust':
        await this.handleTrustCommand(parts[1]);
        break;

      case 'clear':
        this.messages = [{ role: 'system', content: SYSTEM_PROMPT }];
        console.log(chalk.green('✓ Conversation cleared\n'));
        break;

      case 'help':
        this.showHelp();
        break;

      case 'exit':
        console.log(chalk.cyan('\n👋 Goodbye!\n'));
        process.exit(0);

      default:
        console.log(chalk.red(`✗ Unknown command: ${command}\n`));
        console.log(chalk.gray('  Type /help for available commands\n'));
    }
  }

  private async showConfig() {
    const config = await loadConfig();
    console.log(chalk.cyan('\n📋 Current Configuration:\n'));
    console.log(chalk.gray('  Mode:     ') + chalk.white(config.mode));
    console.log(chalk.gray('  Provider: ') + chalk.white(this.provider.type));
    console.log(chalk.gray('  Model:    ') + chalk.white(this.provider.model));
    console.log(chalk.gray('\nSwitch modes with: /mode ollama | claude | hybrid\n'));
  }

  private async switchMode(newMode?: string) {
    if (!newMode || !['ollama', 'claude', 'hybrid'].includes(newMode)) {
      console.log(chalk.yellow('\nUsage: /mode ollama | claude | hybrid\n'));
      return;
    }

    const config = await loadConfig();
    config.mode = newMode as AIConfig['mode'];
    await saveConfig(config);

    console.log(chalk.green(`\n✓ Mode switched to: ${newMode}`));
    console.log(chalk.gray('  Restart IDE3 for changes to take effect\n'));
  }

  private async handleTrustCommand(action?: string) {
    if (!action) {
      const dirs = await listTrustedDirs();
      console.log(chalk.cyan('\n🔐 Trusted Directories:\n'));
      dirs.forEach(dir => console.log(chalk.gray('  • ') + chalk.white(dir)));
      console.log(chalk.gray('\nActions: /trust list | untrust\n'));
      return;
    }

    if (action === 'list') {
      const dirs = await listTrustedDirs();
      console.log(chalk.cyan('\n🔐 Trusted Directories:\n'));
      dirs.forEach(dir => console.log(chalk.gray('  • ') + chalk.white(dir)));
      console.log();
    } else if (action === 'untrust') {
      await untrustCurrentDir();
    }
  }

  private showHelp() {
    console.log(chalk.cyan('\n📖 IDE3 Commands:\n'));
    console.log(chalk.white('  /config') + chalk.gray('       - Show current configuration'));
    console.log(chalk.white('  /mode <type>') + chalk.gray('  - Switch AI provider mode'));
    console.log(chalk.white('  /trust') + chalk.gray('        - Manage trusted directories'));
    console.log(chalk.white('  /clear') + chalk.gray('        - Clear conversation history'));
    console.log(chalk.white('  /help') + chalk.gray('         - Show this help'));
    console.log(chalk.white('  /exit') + chalk.gray('         - Exit IDE3\n'));
  }

  private async detectAndExecute(response: string) {
    // Same implementation as before
    let hasActions = false;

    // Detect FILE_WRITE operations
    const fileWriteRegex = /FILE_WRITE:\s*(.+?)\n```(\w+)?\n([\s\S]*?)```/g;
    const fileWrites = [...response.matchAll(fileWriteRegex)];

    if (fileWrites.length > 0) {
      hasActions = true;
      console.log(chalk.cyan('\n▸ Creating files…\n'));

      for (const match of fileWrites) {
        const filePath = match[1].trim();
        const content = match[3].trim();

        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let frameIndex = 0;
        const progressInterval = setInterval(() => {
          process.stdout.write(`\r${chalk.blue(frames[frameIndex])} ${chalk.gray(`Creating ${filePath}…`)}`);
          frameIndex = (frameIndex + 1) % frames.length;
        }, 80);

        try {
          const dir = path.dirname(filePath);
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(filePath, content, 'utf-8');

          clearInterval(progressInterval);
          process.stdout.write('\r' + ' '.repeat(100) + '\r');
          console.log(chalk.green(`✓ Created ${filePath}`));
        } catch (error: any) {
          clearInterval(progressInterval);
          process.stdout.write('\r' + ' '.repeat(100) + '\r');
          console.log(chalk.red(`✗ Failed to write ${filePath}: ${error.message}`));
        }
      }
      console.log();
    }

    // Detect code blocks for execution
    const codeBlockRegex = /(?<!FILE_WRITE:\s*.+?\n)```(\w+)?\n([\s\S]*?)```/g;
    const matches = [...response.matchAll(codeBlockRegex)];

    if (matches.length > 0) {
      hasActions = true;
      console.log(chalk.cyan('\n▸ Executing commands…\n'));

      for (const match of matches) {
        const language = match[1] || 'bash';
        const code = match[2].trim();

        if (!code) continue;

        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let frameIndex = 0;
        const execInterval = setInterval(() => {
          process.stdout.write(`\r${chalk.blue(frames[frameIndex])} ${chalk.gray(`Running ${language}…`)}`);
          frameIndex = (frameIndex + 1) % frames.length;
        }, 80);

        try {
          let command: string;
          switch (language.toLowerCase()) {
            case 'javascript':
            case 'js':
            case 'node':
              command = `node -e ${JSON.stringify(code)}`;
              break;
            case 'python':
            case 'py':
              command = `python3 -c ${JSON.stringify(code)}`;
              break;
            case 'bash':
            case 'sh':
            case 'shell':
              command = code;
              break;
            default:
              clearInterval(execInterval);
              process.stdout.write('\r' + ' '.repeat(100) + '\r');
              console.log(chalk.yellow(`⊘ Skipped: ${language}\n`));
              continue;
          }

          const { stdout, stderr } = await execAsync(command, {
            timeout: 60000,
            cwd: process.cwd()
          });

          clearInterval(execInterval);
          process.stdout.write('\r' + ' '.repeat(100) + '\r');

          if (stdout) {
            console.log(chalk.green(`✓ Executed ${language}`));
            console.log(chalk.gray('─'.repeat(80)));
            console.log(stdout.trim());
            console.log(chalk.gray('─'.repeat(80)));
          } else {
            console.log(chalk.green(`✓ Executed ${language} (no output)`));
          }

          if (stderr) {
            console.log(chalk.yellow('⚠️  Stderr:'));
            console.log(stderr);
          }
        } catch (error: any) {
          clearInterval(execInterval);
          process.stdout.write('\r' + ' '.repeat(100) + '\r');
          console.log(chalk.red(`✗ Failed to execute ${language}`));
          console.log(chalk.red(error.stderr || error.message));
        }
      }
      console.log();
    }

    if (hasActions) {
      console.log(chalk.green('✓ All actions completed\n'));
    }
  }

  private async saveMessage(message: ChatMessage) {
    if (!this.supabase) return;

    try {
      await this.supabase.from('conversations').insert({
        session_id: this.sessionId,
        role: message.role,
        content: message.content,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      // Silent fail - Supabase optional
    }
  }
}
