/**
 * Multi-Provider AI System
 * Sovereign by default (Ollama), with optional cloud enhancement (Claude)
 */
import { Ollama } from 'ollama';
import Anthropic from '@anthropic-ai/sdk';
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
/**
 * Load configuration from ~/.ide3-config.json
 */
export declare function loadConfig(): Promise<AIConfig>;
/**
 * Save configuration
 */
export declare function saveConfig(config: AIConfig): Promise<void>;
/**
 * Detect available Ollama models
 */
export declare function detectOllamaModels(host?: string): Promise<string[]>;
/**
 * Get best available Ollama model
 */
export declare function getBestOllamaModel(host?: string): Promise<string | null>;
/**
 * Initialize AI provider based on configuration and availability
 */
export declare function initializeProvider(): Promise<AIProvider>;
/**
 * Chat with Ollama
 */
export declare function chatWithOllama(provider: AIProvider, messages: ChatMessage[]): Promise<string>;
/**
 * Stream chat with Ollama
 */
export declare function streamChatWithOllama(provider: AIProvider, messages: ChatMessage[]): AsyncGenerator<string>;
/**
 * Chat with Claude
 */
export declare function chatWithClaude(provider: AIProvider, messages: ChatMessage[], tools?: any[]): Promise<any>;
/**
 * Get mode label for display
 */
export declare function getModeLabel(provider: AIProvider): string;
