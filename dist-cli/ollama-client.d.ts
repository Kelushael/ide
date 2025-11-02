/**
 * Ollama Client - Local LLM Integration
 * Handles streaming responses from Ollama
 */
export interface OllamaMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
export interface OllamaResponse {
    model: string;
    created_at: string;
    message: OllamaMessage;
    done: boolean;
}
export declare class OllamaClient {
    private baseUrl;
    private model;
    constructor(baseUrl?: string, model?: string);
    chatStream(messages: OllamaMessage[]): AsyncGenerator<string>;
    chat(messages: OllamaMessage[]): Promise<string>;
    isAvailable(): Promise<boolean>;
    listModels(): Promise<string[]>;
}
