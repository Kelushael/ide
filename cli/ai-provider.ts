/**
 * Multi-Provider AI System
 * Sovereign by default (Ollama), with optional cloud enhancement (Claude)
 */

import { Ollama } from 'ollama';
import Anthropic from '@anthropic-ai/sdk';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

// Preferred Ollama models (in order of preference)
const PREFERRED_MODELS = [
  'wizardlm2:7b',
  'vicuna:13b',
  'vicuna:7b',
  'codellama:13b',
  'llama2:13b',
  'llama2:7b'
];

export interface AIConfig {
  mode: 'ollama' | 'claude' | 'hybrid';
  ollamaHost?: string;
  anthropicApiKey?: string;
  preferredModel?: string;
}

export interface AIProvider {
  type: 'ollama' | 'claude';
  model: string;
  ollama?: Ollama;
  claude?: Anthropic;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const CONFIG_FILE = path.join(os.homedir(), '.ide3-config.json');

/**
 * Load configuration from ~/.ide3-config.json
 */
export async function loadConfig(): Promise<AIConfig> {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Default: Sovereign mode with Ollama
    return {
      mode: 'ollama',
      ollamaHost: 'http://localhost:11434'
    };
  }
}

/**
 * Save configuration
 */
export async function saveConfig(config: AIConfig): Promise<void> {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * Detect available Ollama models
 */
export async function detectOllamaModels(host: string = 'http://localhost:11434'): Promise<string[]> {
  try {
    const ollama = new Ollama({ host });
    const response = await ollama.list();
    return response.models.map((m: any) => m.name);
  } catch {
    return [];
  }
}

/**
 * Get best available Ollama model
 */
export async function getBestOllamaModel(host: string = 'http://localhost:11434'): Promise<string | null> {
  const available = await detectOllamaModels(host);

  if (available.length === 0) return null;

  // Try preferred models first
  for (const preferred of PREFERRED_MODELS) {
    const found = available.find(m =>
      m.toLowerCase().includes(preferred.split(':')[0].toLowerCase())
    );
    if (found) return found;
  }

  // Fallback to any available model
  return available[0];
}

/**
 * Initialize AI provider based on configuration and availability
 */
export async function initializeProvider(): Promise<AIProvider> {
  const config = await loadConfig();

  // Try Ollama first (sovereign mode - preferred)
  const ollamaHost = config.ollamaHost || 'http://localhost:11434';
  const ollamaModel = await getBestOllamaModel(ollamaHost);

  if (config.mode === 'ollama' || config.mode === 'hybrid') {
    if (ollamaModel) {
      console.log(chalk.green(`✓ Sovereign Mode: ${ollamaModel}`));
      console.log(chalk.gray('  100% local, no external API calls'));
      console.log(chalk.gray('  Run /config to switch to Claude API\n'));

      return {
        type: 'ollama',
        model: ollamaModel,
        ollama: new Ollama({ host: ollamaHost })
      };
    }

    // Ollama not available
    console.log(chalk.yellow('⚠ Ollama not found'));
    console.log(chalk.gray('  Install: curl https://ollama.ai/install.sh | sh'));
    console.log(chalk.gray('  Then run: ollama pull vicuna:7b'));

    // Fall through to Claude if in hybrid mode
    if (config.mode === 'hybrid') {
      console.log(chalk.gray('  Falling back to Claude API...\n'));
    }
  }

  // Try Claude API
  const apiKey = config.anthropicApiKey || process.env.ANTHROPIC_API_KEY;

  if (config.mode === 'claude' || (config.mode === 'hybrid' && !ollamaModel)) {
    if (apiKey) {
      console.log(chalk.yellow('⚠ Cloud Mode: Anthropic Claude API'));
      console.log(chalk.gray('  External API calls - consider installing Ollama for privacy\n'));

      return {
        type: 'claude',
        model: 'claude-sonnet-4-20250514',
        claude: new Anthropic({ apiKey })
      };
    }
  }

  // No provider available
  console.error(chalk.red('✗ No AI provider available'));
  console.log(chalk.yellow('\nOptions:'));
  console.log(chalk.gray('  1. Install Ollama for local/sovereign operation'));
  console.log(chalk.gray('     curl https://ollama.ai/install.sh | sh'));
  console.log(chalk.gray('     ollama pull vicuna:7b'));
  console.log(chalk.gray('  2. Set ANTHROPIC_API_KEY for Claude API'));
  console.log(chalk.gray('     export ANTHROPIC_API_KEY=sk-...\n'));

  process.exit(1);
}

/**
 * Chat with Ollama
 */
export async function chatWithOllama(
  provider: AIProvider,
  messages: ChatMessage[]
): Promise<string> {
  if (!provider.ollama) throw new Error('Ollama not initialized');

  const response = await provider.ollama.chat({
    model: provider.model,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: false
  });

  return response.message.content;
}

/**
 * Stream chat with Ollama
 */
export async function* streamChatWithOllama(
  provider: AIProvider,
  messages: ChatMessage[]
): AsyncGenerator<string> {
  if (!provider.ollama) throw new Error('Ollama not initialized');

  const stream = await provider.ollama.chat({
    model: provider.model,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: true
  });

  for await (const chunk of stream) {
    if (chunk.message.content) {
      yield chunk.message.content;
    }
  }
}

/**
 * Chat with Claude
 */
export async function chatWithClaude(
  provider: AIProvider,
  messages: ChatMessage[],
  tools?: any[]
): Promise<any> {
  if (!provider.claude) throw new Error('Claude not initialized');

  // Separate system message
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content
  }));

  return await provider.claude.messages.create({
    model: provider.model,
    max_tokens: 8000,
    system: systemMessage?.content,
    messages: conversationMessages,
    tools: tools || []
  });
}

/**
 * Get mode label for display
 */
export function getModeLabel(provider: AIProvider): string {
  return provider.type === 'ollama' ? 'Sovereign' : 'Cloud';
}
