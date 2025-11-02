/**
 * Interactive Chat Session with Ollama
 * Handles conversation history and context management
 */
export declare class ChatSession {
    private ollama;
    private messages;
    private supabase;
    private sessionId;
    constructor();
    start(): Promise<void>;
    private chatLoop;
    private handleCommand;
    private saveMessage;
}
